import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://labs.bible.org/api/';

function App() {
  const [verseData, setVerseData] = useState(null);
  const [inputData, setInputData] = useState({ book: '', chapter: '', verse: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVerse('votd');
  }, []);

  const fetchVerse = async (passage) => {
    setError('');
    try {
      const response = await axios.get(API_BASE_URL, {
        params: { passage, type: 'json' }
      });
      if (response.data && response.data.length > 0) {
        setVerseData(response.data[0]);
      } else {
        setError('No verse found. Please try again.');
      }
    } catch (err) {
      setError('Failed to fetch verse. Please check your connection.');
    }
  };

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { book, chapter, verse } = inputData;
    if (book && chapter && verse) {
      fetchVerse(`${book} ${chapter}:${verse}`);
    } else {
      setError('Please fill in all fields.');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Scripture Finder</h1>
      </header>
      
      <main>
        <section className="verse-card">
          <h2>{verseData ? 'Your Verse' : 'Loading...'}</h2>
          {verseData && (
            <p>
              <strong>{`${verseData.bookname} ${verseData.chapter}:${verseData.verse}`}</strong>
              <br />
              {verseData.text}
            </p>
          )}
          {error && <p className="error-message">{error}</p>}
        </section>

        <section className="controls">
          <button onClick={() => fetchVerse('votd')}>Verse of the Day</button>
          <button onClick={() => fetchVerse('random')}>Random Verse</button>
        </section>

        <form onSubmit={handleSubmit} className="verse-form">
          <input
            type="text"
            name="book"
            placeholder="Book"
            value={inputData.book}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="chapter"
            placeholder="Chapter"
            value={inputData.chapter}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="verse"
            placeholder="Verse"
            value={inputData.verse}
            onChange={handleInputChange}
          />
          <button type="submit">Find Verse</button>
        </form>
      </main>
    </div>
  );
}

export default App;