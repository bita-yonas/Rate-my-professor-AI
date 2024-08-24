// app/api/chat/route.js

import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Function to extract URLs from a text
function extractUrls(text) {
  const urlRegex = /https:\/\/www\.ratemyprofessors\.com\/professor\/\d+/g;
  return text.match(urlRegex) || [];
}

// Function to replace URLs in the text with professor data
function replaceUrlsInText(text, urls, processed_data) {
  for (let i = 0; i < urls.length; i++) {
    text = text.replace(
      urls[i], 
      `${processed_data[i].id} with ${processed_data[i].metadata["rating"]} star rating in ${processed_data[i].metadata["department"]}`
    );
  }
  return text;
}

// Function to scrape a webpage for professor data
async function scrapeWebpage(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const name = $('div.NameTitle__Name-dowf0z-0 span').first().text().trim();
    const lastName = $('div.NameTitle__LastNameWrapper-dowf0z-2').first().text().trim();
    const fullName = `${name} ${lastName}`;

    const ratingText = $('div.RatingValue__Numerator-qw8sqy-2.liyUjw').text().trim();
    const comments = $('div.Comments__StyledComments-dzzyvm-0').text().trim();
    const departmentName = $('a.TeacherDepartment__StyledDepartmentLink-fl79e8-0').text().trim();

    return {
      name: fullName,
      rating: ratingText,
      review: comments,
      department: departmentName,
    };
  } catch (error) {
    console.error(`Failed to retrieve the webpage. Error: ${error}`);
    return null;
  }
}

// Function to upsert processed professor data to Pinecone and replace URLs in the text
async function upsertPC(text, client, index) {
  const urls = extractUrls(text);
  const processed_data = [];

  for (const url of urls) {
    const data = await scrapeWebpage(url);
    if (!data) continue;

    try {
      const response = await client.embeddings.create({
        input: data.review,
        model: "text-embedding-ada-002"
      });

      const embedding = response.data[0].embedding;
      processed_data.push({
        values: embedding,
        id: data.name,
        metadata: {
          rating: data.rating,
          review: data.review,
          department: data.department,
        }
      });
    } catch (error) {
      console.error(`Failed to create embedding. Error: ${error}`);
    }
  }

  try {
    await index.upsert(processed_data);
    return replaceUrlsInText(text, urls, processed_data);
  } catch (error) {
    console.error(`Failed to upsert vectors. Error: ${error}`);
    return null;
  }
}

// System prompt definition
const systemPrompt = `
You are AI RateProfs, an intelligent assistant designed to help students find the best professors according to their specific queries. You utilize a Retrieval-Augmented Generation (RAG) model to provide the top 3 professors that best match the student’s needs. Each time a student asks about a professor, subject, or course, you will:

1. Analyze the student’s query to understand their preferences, such as the subject, teaching style, rating, or other specific criteria.
2. Use the RAG model to retrieve relevant information from a database of professor reviews, ratings, and course details.
3. Generate a concise and informative response, presenting the top 3 professors that align with the student’s query.

For each professor provided, format the response as follows:
• Professor’s name
• Subject they teach
• Average rating (out of 5 stars)
• A brief summary of why they are recommended, including any relevant strengths or student feedback.

Ensure that each detail is presented on a new line for clarity and visual appeal. Your goal is to ensure that students can make informed decisions about their course choices based on real student experiences and ratings. Be accurate, concise, and helpful in every response.
`;

// POST function
export async function POST(req) {
  const data = await req.json();

  // Initialize Pinecone and OpenAI
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.index('rag').namespace('ns1');
  const openai = new OpenAI();

  // Process the user’s query
  let text = data[data.length - 1].content;
  if (extractUrls(text).length > 0) {
    text = await upsertPC(text, openai, index);
  }

  const embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
    encoding_format: 'float',
  });

  // Query Pinecone
  const results = await index.query({
    topK: 5,
    includeMetadata: true,
    vector: embedding.data[0].embedding,
  });

  // Format the results
  let resultString = '';
  results.matches.forEach((match) => {
    resultString += `
    Returned Results:
    Professor: ${match.id}
    Review: ${match.metadata.review}
    Subject: ${match.metadata.department}
    Stars: ${match.metadata.rating}
    \n\n`;
  });

  // Prepare the OpenAI request
  const lastMessage = data[data.length - 1];
  const lastMessageContent = lastMessage.content + resultString;
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

  // Send request to OpenAI
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      ...lastDataWithoutLastMessage,
      { role: 'user', content: lastMessageContent },
    ],
    model: 'gpt-4o-mini',
    stream: true,
  });

  // Set up streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
