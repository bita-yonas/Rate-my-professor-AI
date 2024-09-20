# AI Rate My Professor Web App

Welcome to the **AI Rate My Professor** web app, a tool designed to help students easily search and find information about professors using artificial intelligence and web scraping technologies. This project uses AI to scrape data from Rate My Professor and other sources to provide detailed insights on professors across various institutions.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Overview
The **AI Rate My Professor Web App** allows users to submit links to professor pages on Rate My Professor, and automatically scrapes data from those pages using web scraping techniques. The app leverages AI to generate useful insights and organizes the data in a searchable format using Pinecone for fast retrieval.

The app is designed to assist students in making more informed decisions when selecting courses or professors by aggregating and analyzing publicly available data.


## Features
- Submit links to Rate My Professor pages
- Automatically scrape and store professor data
- Search and filter professor data
- AI-based recommendations and analysis
- Pinecone integration for fast data retrieval
- RAG (Retrieval Augmented Generation) AI model for enhanced data processing

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **AI/ML**: Pinecone, Cheerio for web scraping, Puppeteer for browser automation
- **Database**: Pinecone (vector database for fast search)
- **Deployment**: Vercel
- **Other Tools**: Langchain, RAG for AI data processing, OpenAI for text generation
