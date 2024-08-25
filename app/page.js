"use client";
import { Button, TextField, Box, Stack, Typography, AppBar, Toolbar,handleAboutOpen,Dialog,aboutOpen, handleAboutClose, DialogTitle,DialogContent,DialogActions } from "@mui/material";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the Rate My Professor support assistant. How can I help you today?",
    },
  ]);

  const [message, setMessage] = useState('');
  const chatContainer = useRef(null);

  const sendMessage = async () => {
    const userMessage = { role: 'user', content: message };

    setMessages((messages) => [
      ...messages,
      userMessage,
      { role: 'assistant', content: '' }
    ]);

    setMessage('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, userMessage]),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    reader.read().then(function processText({ done, value }) {
      if (done) {
        return result;
      }
      const text = decoder.decode(value || new Uint8Array(), { stream: true });
      result += text;
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1];
        let otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          { ...lastMessage, content: lastMessage.content + text }
        ];
      });

      return reader.read().then(processText);
    });
  };

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGetStarted = () => {
    setShowChat(true);
  };

  return (
    <Box 
      width="100vw" 
      height="100vh"
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      flexDirection="column"
      sx={{
        backgroundImage: 'url("/pp.jpg")',  // Path to your background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: "white",
      }}
    >
      {!showChat ? (
       // Landing Page
<>
  <AppBar position="static" sx={{ bgcolor: "transparent", boxShadow: "none", top: 0, position: 'absolute' }}>
    <Toolbar>
      <Typography variant="h6" color="#a3bffa" sx={{ flexGrow: 1 }}>
        AI RateProfs
      </Typography>
      <Button color="inherit" sx={{ color: '#a3bffa' }} onClick={handleAboutOpen}>About</Button>
    </Toolbar>
  </AppBar>

  <Box
    textAlign="center"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    height="100vh"
    sx={{ mt: '-20vh' }}  // Moves the content 20% up from the center
  >
    <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1, color: "#ffffff" }}>
      Welcome to <span style={{ color: "#ffffff" }}>AI RateProfs</span>
    </Typography>
    <Typography variant="h6" sx={{ mb: 4, color: "#d1d5db" }}>
      Effortlessly find and evaluate professors with the power of AI. Accurate and comprehensive professor ratings at your fingertips.
    </Typography>
    <Box display="flex" justifyContent="center" alignItems="center">
      <Button
        variant="contained"
        sx={{
          bgcolor: '#a3bffa',  // Light Purple/Blue
          color: 'black',
          borderRadius: '8px',
          padding: '10px 24px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            bgcolor: '#7b93d1',
          }
        }}
        onClick={handleGetStarted}
      >
        Get Started
      </Button>
      <Button
        variant="outlined"
        sx={{
          color: '#a3bffa',  // Match Outline to the Button Color
          borderColor: '#a3bffa',
          borderRadius: '8px',
          padding: '10px 24px',
          marginLeft: '12px',
          '&:hover': {
            borderColor: '#7b93d1',
          }
        }}
      >
        Learn More
      </Button>
    </Box>

    {/* About Dialog */}
    <Dialog open={aboutOpen} onClose={handleAboutClose}>
      <DialogTitle>About AI RateProfs</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          AI RateProfs is a platform designed to help students effortlessly find and evaluate professors using the power of AI. Our system gathers accurate and comprehensive ratings, allowing users to make informed decisions about their education.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Developed by Bitania Yonas.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAboutClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
       {/* School Logos in Canon, Spark, Quora, HubSpot, Amazon, Facebook Area */}
<Box sx={{ 
  position: 'absolute',  // Positioning the container absolutely
  bottom: '70px',  // Move the logos 70px up from the bottom of the screen
  width: '100%',  // Ensure the logos span the full width of the screen
  overflow: 'hidden', // Hide overflow to create the sliding effect
}}>
  <Box 
    sx={{
      display: 'flex',
      whiteSpace: 'nowrap', // Prevent wrapping
      animation: 'marquee 30s linear infinite', // Adjust the duration for a smoother loop
      animationTimingFunction: 'linear',  // Ensure continuous motion with no pauses
    }}
  >
    <Box sx={{ display: 'flex' }}>
      <img src="/harvardlog.png" alt="School 1" style={{ height: '90px', marginRight: '60px' }} />  {/* Increased spacing */}
      <img src="/stanfordlog2.png" alt="School 2" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/Yalelog.png" alt="School 3" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/MITlog2.png" alt="School 4" style={{ height: '70px', marginRight: '60px' }} />
      <img src="/pre2log.png" alt="School 5" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/comblog.png" alt="School 6" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/chilog.png" alt="School 7" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/duke.png" alt="School 8" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/mui.png" alt="School 9" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/nyu.png" alt="School 10" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/ucla.png" alt="School 11" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/jhn.png" alt="School 12" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/con.png" alt="School 13" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/pen.png" alt="School 14" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/brw.png" alt="School 15" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/va.png" alt="School 16" style={{ height: '90px', marginRight: '60px' }} />
    </Box>
    <Box sx={{ display: 'flex' }}>
      <img src="/harvardlog.png" alt="School 1" style={{ height: '90px', marginRight: '60px' }} />  {/* Increased spacing */}
      <img src="/stanfordlog2.png" alt="School 2" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/Yalelog.png" alt="School 3" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/MITlog2.png" alt="School 4" style={{ height: '70px', marginRight: '60px' }} />
      <img src="/pre2log.png" alt="School 5" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/comblog.png" alt="School 6" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/chilog.png" alt="School 7" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/canonlog.png" alt="School 8" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/sparklog.png" alt="School 9" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/quoralog.png" alt="School 10" style={{ height: '90px', marginRight: '60px' }} />
      <img src="/hubspotlog.png" alt="School 11" style={{ height: '90px', marginRight: '60px' }} /> 
    </Box>
  </Box>
</Box>

<style jsx>{`
  @keyframes marquee {
    0% { transform: translateX(100%); }  /* Start off-screen to the right */
    100% { transform: translateX(-100%); }  /* Move completely to the left */
  }
`}</style>
          </Box>
        </> 
      ) : (
        // Chat Interface
        <>
          {/* Full-width White Header with Left-Aligned Title and Right-Aligned "About" Button */}
          <Box 
            width="100%" 
            bgcolor="#ffffff"  // White top bar
            p={2} 
            display="flex" 
            justifyContent="space-between"  // Title on the left, button on the right
            alignItems="center"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"  // Subtle shadow for the top bar
          >
            <Typography variant="h6" color="#1f2937">Rate My Professor AI</Typography>  {/* Dark gray text */}
            <Button 
              sx={{
                backgroundColor: '#4f46e5',  // SaaS-style primary blue
                color: 'white',
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#4338ca' },  // Slightly darker on hover
              }}
              onClick={() => alert('AI RateProfs is an innovative web app designed to help students make informed decisions by providing AI-generated insights and ratings for professors. By leveraging advanced web scraping techniques and Pinecone’s vector database, the app delivers accurate, up-to-date information with a user-friendly interface. Developed by Bitania Yonas.')}  // Placeholder for the About button
            >
              About
            </Button>
          </Box>

          {/* Floating Chat Bubbles */}
          <Stack 
            direction="column" 
            spacing={2}
            width="100%"
            maxWidth="700px"  // Slightly wider chat area
            flexGrow={1}
            overflow="auto"
            padding="20px"
            ref={chatContainer}
            mt={2}  // Reduced margin to bring chat area up
          >
            {messages.map((message, index) => (
              <Box 
                key={index} 
                display="flex" 
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
                alignItems="center"
                mb={2}
              >
                <Box 
                  bgcolor={
                    message.role === 'assistant' 
                    ? "#111827"  // Dark gray for AI responses
                    : '#e0e0e0'  // Light gray for user's responses
                  }
                  color={message.role === 'assistant' ? 'white' : 'black'}
                  borderRadius="16px"
                  p={3}
                  maxWidth="75%"
                  boxShadow="0px 8px 24px rgba(0, 0, 0, 0.2)"  // Added shadow to chat bubbles
                >
                  <Typography variant="body1">
                    {message.content}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
          {/* Floating Input and Send Button */}
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center" 
            p={2} 
            width="100%" 
            maxWidth="700px"  // Slightly wider chat area
            boxShadow="0px 8px 24px rgba(0, 0, 0, 0.2)"  // Added shadow to input area
            bgcolor="white"  // White background for the input area
            borderRadius="24px"  // Rounded corners for the input area
            sx={{ 
              marginBottom: '16px',  // Adjusted margin to move the entire bar up
              position: 'relative',
              top: '-40px'  // Move the entire input bar 40px up
            }}
          >
            <TextField
              label="Ask Rate My Professor Bot anything.."
              fullWidth
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              sx={{ 
                input: { color: 'black' }, 
                label: { color: '#7c7c7c' }, 
                fieldset: { borderColor: '#c4c4c4' },
                borderRadius: '24px'  // Round the input field corners
              }}
            />
            <Button 
              variant="contained" 
              onClick={sendMessage}
              sx={{ 
                bgcolor: '#4f46e5',  // SaaS-style primary blue
                color: 'white',
                borderRadius: '24px', 
                padding: '10px 24px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',  // Shadow for the send button
                '&:hover': {
                  bgcolor: '#4338ca',  // Slightly darker on hover
                }
              }}
            >
              <Typography variant="body2">Send</Typography>
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}
