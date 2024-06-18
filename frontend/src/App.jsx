import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setImage(null);

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
      setImage(imageUrl);
    } catch (error) {
      setError('Failed to generate image');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Generator</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Enter a description:
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <button type="submit">Generate Image</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {image && <img src={image} alt="Generated" />}
      </header>
    </div>
  );
}

export default App;
