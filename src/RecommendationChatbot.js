import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


function RecommendationChatbot() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  // ... Other state and functions
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitles) => {
    setCurrentTitle(uniqueTitles)
    setMessage(null)
    setValue("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getMessages();
    }
  };


  const getMessages =  async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    };
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      // console.log(data)
      const newMessage = data.choices[0].message.content; // Get the message content from the API response
      setMessage(newMessage);

      const newChat = {
        title: currentTitle || value,
        role: "user",
        content: value,
      };

      const newBotMessage = {
        title: currentTitle || value,
        role: "bot",
        content: newMessage,
      };

      setPreviousChats((prevChats) => [...prevChats, newChat, newBotMessage]);

      // Clear the input field
      setValue("");
    } catch(error) {
      console.error(error);
    }
  }

  // Instead of using recommendationsData, use recommendations
const handleGetRecommendations = async (topic) => {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: topic,
            key: 'AIzaSyBtFcUIxgFTAptAVs7DI2ozkJG57zo94Rw',
            type: 'video',
            maxResults: 5,
          }
        }
      );
      
      const recommendations = response.data.items;
      setRecommendations(recommendations); // Update the recommendations state
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };
  

  useEffect(() => {
    console.log(currentTitle, value, message)
    if(!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if(currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats, 
          {
            title: currentTitle,
            role: "user",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }]
      ))
    }
  }, [message, currentTitle])

  console.log(previousChats)

  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChats => previousChats.title)))


  return (

      <div className="app">
      {/* <------- new chat  ------> */}
      <section className="side-bar">
        <button className='newchat' onClick={createNewChat}>+ New Chat </button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitles,index) => <li key={index} onClick={() => handleClick(uniqueTitles)}>{uniqueTitles}</li>)}
        </ul>
        <nav>
          <p>Youtube video recommender</p>
        </nav>
      </section>

       {/* <------- youtube recommendations ------> */}


      <section className="main">
        <ul className="feed">
            <div >
          <input className='inputbox'
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a topic for recommendations"
          />
          <button className='getrec' onClick={() => handleGetRecommendations(value)}>Get Recommendations</button>
          <ul>
            {recommendations.map(video => (
              <li key={video.id.videoId}>
                <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                <p>{video.snippet.title}</p>
              </li>
            ))}
          </ul>
        </div>
    </ul>
      </section>

      {/* <----- Chat section -----> */}

      <section className="chat-main">
        {!currentTitle && <h1>Chat Bot</h1>}
        {/* Inside your JSX */}
        <ul className="feed">
      {currentChat?.map((chatMessage, index) => (
        <li key={index} className={`message-container ${chatMessage.role === "user" ? "user-message-container" : ""}`}>
          <p className={`chat-bubble ${chatMessage.role === "user" ? "user-bubble" : "chatbot-bubble"}`}>
            {chatMessage.content}
          </p>
        </li>
      ))}
    </ul>
    <div className="bottom-section">
      <div className="input-container">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyPress} // Call handleKeyPress on key press
          placeholder='Send a message ...'
        />
        <div
          id="submit"
          onClick={getMessages}
        >
          <i className="fa-regular fa-paper-plane"></i>
        </div>
      </div>
        </div>
      </section>  
         
    </div>

  );
}

export default RecommendationChatbot;
