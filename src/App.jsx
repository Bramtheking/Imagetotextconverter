import React, { useState } from 'react'; 
import Tesseract from 'tesseract.js';
import './App.css';

const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleTheme = () => setDarkTheme(!darkTheme);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setError('File size should be less than 5MB');
        return;
      }
      setError('');
      setImage(URL.createObjectURL(file));
      setText('');
    }
  };

  const handleConvert = async () => {
    if (image) {
      setLoading(true);
      setProgress(0);
      try {
        const result = await Tesseract.recognize(image, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(parseInt(m.progress * 100));
            }
          },
        });
        setText(result.data.text);
      } catch (err) {
        setError('Error processing image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setImage(null);
    setText('');
    setError('');
    setProgress(0);
  };

  return (
    <div className={`app-container ${darkTheme ? 'dark' : 'light'}`}>
      <nav className="navbar">
        <h1>OCR Converter</h1>
        <div className="nav-links">
          <button onClick={toggleTheme} className="theme-toggle">
            {darkTheme ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </nav>
      
      <header className="header">
        <h1>Image to Text Converter</h1>
        <p>Transform your images into editable text with AI-powered OCR</p>
      </header>

      <main className="main-content">
        <section className="how-it-works">
          <h2>How It Works</h2>
          <p>1. Upload an image containing text.</p>
          <p>2. Press "Convert to Text" to start the OCR process.</p>
          <p>3. Once completed, you can copy or download the text.</p>
        </section>

        <div className="converter-card">
          <div className="upload-section">
            <input
              type="file"
              onChange={handleImageUpload}
              id="file-upload"
              className="file-input"
              accept="image/*"
            />
            <label htmlFor="file-upload" className="upload-label">
              <div className="upload-icon">📁</div>
              <span>{image ? 'Change Image' : 'Upload Image'}</span>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview" />
              <button onClick={handleClear} className="clear-button">×</button>
            </div>
          )}

          {loading && (
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <button
            className={`convert-button ${loading ? 'loading' : ''}`}
            onClick={handleConvert}
            disabled={!image || loading}
          >
            {loading ? 'Processing...' : 'Convert to Text'}
          </button>

          {text && (
            <div className="output-section">
              <textarea
                readOnly
                value={text}
                className="output-textarea"
              />
              <div className="button-group">
                <button
                  onClick={() => navigator.clipboard.writeText(text)}
                  className="action-button"
                >
                  Copy Text
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([text], { type: 'text/plain' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'extracted_text.txt';
                    link.click();
                  }}
                  className="action-button"
                >
                  Download
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="features-grid">
          {[
            { title: 'Fast Processing', description: 'Get your text extracted within seconds using advanced OCR technology', icon: '⚡' },
            { title: 'Multiple Formats', description: 'Support for various image formats including PNG, JPEG, and GIF', icon: '🖼️' },
            { title: 'Easy Export', description: 'Copy or download your extracted text with a single click', icon: '💾' },
          ].map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <div className="social-links">
          <a href="https://www.linkedin.com/in/bramwel-agina-a88678266/" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
          <a href="https://bramwelagina.my.canva.site/myportofolio" target="_blank" rel="noopener noreferrer" className="social-link">Portfolio</a>
          <a href="https://github.com/Bramtheking" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
        </div>
        <p>Developed by Bramwel Agina © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
