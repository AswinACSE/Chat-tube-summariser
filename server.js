const express = require('express');
const axios = require('axios');
const cors = require('cors');
// const { OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = 8050;
app.use(cors())
const OPENAI_API_KEY = process.env.API_KEY || '[open api key]' ;

app.use(express.json());

//bot 
app.post('/completions', async (req,res) => {
  const options = {
      method: "POST",
      headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{role: "user", content: req.body.message}],
          max_tokens: 100,
      })

  }
  try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', options)
      const data = await response.json()
      res.send(data)
  } catch(error) {
      console.error(error)
  }
})


//Transcript
app.post('/generate-summary', async (req, res) => {
  try {
    const { videoUrl } = req.body;


    const videoId = await getVideoId(videoUrl);
    console.log(videoId);

    const transcript = await getVideoTranscript(videoId);
    console.log(transcript)
    
    const summary = await generateSummary(transcript);

    res.json({ summary });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

async function getVideoId(videoUrl) {
  const videoId = extractVideoIdFromUrl(videoUrl);
  return videoId;
}

function extractVideoIdFromUrl(url) {
  const regex = /[?&]v=([^&#]*)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function getVideoTranscript(videoId) {
  // console.log(videoId);
  const options = {
    method: 'GET',
    url: 'https://youtube-transcriptor.p.rapidapi.com/transcript',
    params: {
      video_id: videoId,
      lang: 'en'
    },
    headers: {
      'X-RapidAPI-Key': '[youtube-transcriptor api key]',
      'X-RapidAPI-Host': 'youtube-transcriptor.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    // console.log(response.data[0].description);
    return response.data[0].description;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch transcript from RapidAPI');
  }
}

async function generateSummary(transcriptData) {
  // const openai = new OpenAIApi({ key: OPENAI_API_KEY });
  // const prompt = Summarize the following transcript:\n${transcript};
  // const summaryResponse = await openai.complete(prompt);
  // const summary = summaryResponse.choices[0].text.trim();
  // return summary;
  const prompt = `Assume you are a teacher and Summarize the following transcript ellaborately without point number and send as single paragraph:\n${transcriptData}`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: prompt,
        max_tokens: 1500, 
        n: 1,           
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    const summary = response.data.choices[0].text.trim();
    // return summary;
    return {
      transcript: transcriptData,
      summary: summary,
    } 
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to generate summary using OpenAI.')
  }
}

// -----email code -----

const nodemailer = require('nodemailer');

app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail'
    auth: {
      user: 'aswinarumugam12@gmail.com',
      pass: '9025267635'
    }
  });

  try {
    const mailOptions = {
      from: 'aswinarumugam12@gmail.com',
      to: 'aswinarumugam12@gmail.com', // Your email address
      subject: `New Feedback from ${name}`,
      text: `${message}\n\nFrom: ${name} <${email}>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

