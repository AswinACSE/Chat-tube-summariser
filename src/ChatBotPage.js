import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';


function RecommendationChatbot() {
  const [recommendationValue, setRecommendationValue] = useState("");
  const [chatValue, setChatValue] = useState("");
  const [message, setMessage] = useState("");
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  

  const createNewChat = () => {
    setMessage(null)
    setChatValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitles) => {
    setCurrentTitle(uniqueTitles)
    setMessage(null)
    setChatValue("")
    
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (chatValue.toLowerCase() === "hi") {
        addMessageToChat(chatValue, "user");
        setChatValue("");
      } else {
        const submitButton = document.getElementById("submit");
        submitButton.classList.add("rotate-animation");
        getMessages();
      }
    }
  };

  const addMessageToChat = (content, role) => {
    const newChatMessage = {
      title: currentTitle || recommendationValue,
      role: role,
      content: content,
    };
    setPreviousChats(prevChats => [...prevChats, newChatMessage]);
  };

  const getMessages = async () => {
    setIsBotTyping(true);
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: chatValue
      }),
      headers: {
        "Content-Type": "application/json"
      }
    };
    try {
      const response = await fetch('http://localhost:8050/completions', options)
      const data = await response.json()
      const newMessage = data.choices[0].message.content;
      setMessage(newMessage);

      const newChat = {
        title: currentTitle || recommendationValue,
        role: "user",
        content: chatValue,
      };

      const newBotMessage = {
        title: currentTitle || recommendationValue,
        role: "bot",
        content: newMessage,
      };

      setPreviousChats((prevChats) => [...prevChats, newChat, newBotMessage]);
      setChatValue("");
    } catch(error) {
      console.error(error);
    } finally {
      setIsBotTyping(false);
    }
  }


  const handleGetRecommendations = async (topic) => {
    if (topic.trim() !== '') {
      try {
        const response = await axios.get(
          'https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              q: `Recommend only study related video on ${topic} with most viewed and most liked criteria for 10mins`,
              key: '[youtube api key]',
              type: 'video',
              maxResults: 3,
            }
          }
        );
        
        const recommendations = response.data.items;
        setRecommendations(recommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    } else {
      console.log('Please enter a topic before getting recommendations.');
    }
  };


  useEffect(() => {
    // Retrieve chat history from local storage when the component mounts
    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) {
      const parsedChatHistory = JSON.parse(localStorage.getItem("chatHistory"));
      setPreviousChats(parsedChatHistory);
    }
  }, []);

  useEffect(() => {
    // Update local storage whenever previousChats changes
    localStorage.setItem("chatHistory", JSON.stringify(previousChats));
  }, [previousChats]);

   
  

  useEffect(() => {
    if(!currentTitle && chatValue && message) {
      setCurrentTitle(recommendationValue)
    }
    if(currentTitle && chatValue && message) {
      setPreviousChats(prevChats => (
        [...prevChats, 
          {
            title: currentTitle,
            role: "user",
            content: chatValue
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }]
      ))
    }
  }, [message, currentTitle, chatValue, recommendationValue]);

  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChats => previousChats.title)))

  return (
    <div className="app">
    <div className={`app ${isDarkMode ? "dark-mode" : ""}`}>
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <button onClick={() => setIsDarkMode(prevMode => !prevMode)}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <ul className="history">
          {uniqueTitles?.map((title, index) => (
            <li key={index} onClick={() => handleClick(title)}>
              {title}<i class="fa-solid fa-arrow-right"></i>
            </li>
          ))}
        </ul>
        <nav>
        </nav>
      </section>

      <section className="main">
        <div className='rec-box'>
          <input
            className="inputbox"
            type="text"
            value={recommendationValue}
            onChange={(e) => setRecommendationValue(e.target.value)}
            placeholder="Enter a topic for recommendations"
            required
          />
          <button className="getrec" onClick={() => handleGetRecommendations(recommendationValue)} disabled={recommendationValue.trim() === ''}>
            Get Recommendations
          </button>
          <div className='video'>
             <ul className="video-list-container">
            {recommendations.map((video) => (
              <li key={video.id.videoId}>
                <iframe
                  width="600"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.id.videoId}`}
                  title={video.snippet.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                <p>{video.snippet.title}</p>
              </li>
            ))}
          </ul>
         </div>
        </div>
        </section>

      <section className="chat-main">
       
        <ul className="feed">
          
          {currentChat?.map((chatMessage, index) => (
            
            <li
              key={index}
              className={`message-container ${chatMessage.role === "user" ? "user-message-container" : ""}`}
              >
                
                <p className={`chat-bubble ${chatMessage.role === "user" ? "user-bubble" : "chatbot-bubble"}`} >
                  {chatMessage.content}
                  
                </p>
                
              </li>
              
            ))}
          </ul>
          
          <div className="bottom-section">
            <div className="input-container">
              <input className='send'
                value={chatValue}
                onChange={(e) => setChatValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Send a message ..."
              />
              <div
      id="submit"
      className={isBotTyping ? "active rotate" : ""}
      onClick={handleKeyPress}
    >
      <i className="fa-regular fa-paper-plane"></i>
    </div>
           
              </div>
              {isBotTyping && <div className="bot-typing-indicator">Bot is typing...</div>}
            </div>
        </section>

      </div>
    </div>
    );
  }
  
  export default RecommendationChatbot;