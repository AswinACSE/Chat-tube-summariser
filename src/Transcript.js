import React, { useState } from 'react';
import axios from 'axios';
// import './Transcript.css'

function Transcript() {
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [transcript,setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    console.log(`${videoUrl}`);
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8050/generate-summary', { videoUrl });
      // console.log(response.data.transcript);
      // console.log(response.data.summary);
      setTranscript(response.data.summary.transcript);
      setSummary(response.data.summary.summary);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setSummary('An error occurred while generating the summary.');
    }
  };

  const handleClear = () => {
    setVideoUrl('');
    setTranscript('');
    setSummary('');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="transcript-page">
    <div className="summary_size">
      <h1>YouTube Video Summary Generator</h1>
      <form className='inputboxing' onSubmit={handleSubmit}>
        <label className='labelname'>
          YouTube Video URL:
        </label >
        <div class="input-container">
          {/* <div class="search-icon">
        <i class="fa-solid fa-magnifying-glass"></i>
          </div> */}
          <input
            type="text"
            class="input-field"
            placeholder='Paste your url here...'
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">Generate Summary</button>
      </form>
      {/* {transcript && (
        <div className="transcript">
          <h2>Transcript</h2>
          <p>{transcript}</p>
        </div>
      )} */}
      {summary && (
        <div className="summary">
          <h2>Generated Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default Transcript;