import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:5000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Something went wrong');
        return;
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      // Update state to include new image URL and text while preserving previous images
      setImages(prevImages => [...prevImages, { imageUrl, text }]);
      setText(''); // Clear input field after submission
    } catch (error) {
      setError('Failed to generate image');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Generator</h1>
      </header>

      <div className="generate-space">
        <div className="welcome-sub-heading">
          <h3>Generate Images from Text</h3>
          <p>Enter a prompt and click Go to generate an image</p>
        </div>
        {error && <p className='error-info' style={{ color: 'red' }}>{error}</p>}
          {images.length > 0 && (
            <div>
              {images.map((image, index) => (
                <div key={index} className="image-container">
                  <div className="prompt">
                    <div className="text">
                      <p>{image.text}</p>
                    </div>
                  
                    <div className="image">
                      <img src={image.imageUrl} alt={`Generated ${index}`} className="generated-image" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

        <div className="prompt-form">
          <form onSubmit={handleSubmit}>
            <label>
              <input
                type="text"
                value={text}
                placeholder='Enter a prompt'
                onChange={(e) => setText(e.target.value)}
              />
            </label>
            <button type="submit">Go</button>
          </form>
        </div>
        
    </div>
  );
}

export default App;
