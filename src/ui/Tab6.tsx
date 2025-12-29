/**
 * Tab 6 Component - Estonian Lesson 4 Cards & Quiz
 * 
 * Practice new words and phrases: üles ärkama, meeldib/meeldis, viimased, 
 * eelmine/järgmine, "anna mulle pastakas", jne.
 */

import React, { useState, useEffect, useRef } from 'react';

interface FlashcardItem {
  id: string;
  estonian: string;
  english: string;
  category: string;
  tags?: string[];
}

const lessonItems: FlashcardItem[] = [
  {
    id: "ules-arkama",
    estonian: "Üles ärkama",
    english: "to wake up",
    category: "Verbs",
    tags: ["verb", "daily"]
  },
  {
    id: "mulle-meeldib",
    estonian: "Mulle meeldib",
    english: "I like",
    category: "Phrases",
    tags: ["phrase", "dative"]
  },
  {
    id: "mulle-meeldis",
    estonian: "Mulle meeldis",
    english: "I liked",
    category: "Phrases",
    tags: ["phrase", "dative", "past"]
  },
  {
    id: "viimane",
    estonian: "Viimane",
    english: "last",
    category: "Adjectives",
    tags: ["adjective"]
  },
  {
    id: "viimased",
    estonian: "Viimased",
    english: "the last (plural)",
    category: "Adjectives",
    tags: ["adjective", "plural"]
  },
  {
    id: "esimene-viimane",
    estonian: "Esimene ja viimane",
    english: "first and last",
    category: "Phrases",
    tags: ["phrase"]
  },
  {
    id: "eelmine",
    estonian: "Eelmine",
    english: "previous",
    category: "Adjectives",
    tags: ["adjective"]
  },
  {
    id: "jargmine",
    estonian: "Järgmine",
    english: "next",
    category: "Adjectives",
    tags: ["adjective"]
  },
  {
    id: "anna-mulle-pastakas",
    estonian: "Anna mulle pastakas",
    english: "Give me the pen",
    category: "Phrases",
    tags: ["phrase", "imperative", "dative"]
  },
  {
    id: "eelmisel-kuul",
    estonian: "Eelmisel kuul ma käisin Soomes",
    english: "Last month I went to Finland",
    category: "Sentences",
    tags: ["sentence", "past"]
  }
];

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function normalise(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

export const Tab6: React.FC = () => {
  const [mode, setMode] = useState<'cards-et-en' | 'cards-en-et' | 'typing'>('cards-et-en');
  const [order, setOrder] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState('Press Enter or "Check" to verify.');
  const [showBack, setShowBack] = useState(false);
  const [autoNext, setAutoNext] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const typingInputRef = useRef<HTMLInputElement>(null);

  const pickOrder = () => {
    const newOrder = shuffle([...Array(lessonItems.length).keys()]);
    setOrder(newOrder);
    setIdx(0);
  };

  useEffect(() => {
    pickOrder();
    setCorrectCount(0);
    setStreak(0);
    setShowBack(false);
    setAnswer('');
    setIsCorrect(null);
  }, [mode]);

  const currentItem = order.length > 0 && idx < order.length 
    ? lessonItems[order[idx]] 
    : null;

  useEffect(() => {
    if (currentItem) {
      setAnswer('');
      setIsCorrect(null);
      setShowBack(false);
      setFeedback(mode === 'typing' ? 'Press Enter or "Check" to verify.' : '');
      
      if (mode === 'typing' && typingInputRef.current) {
        typingInputRef.current.focus();
      }
    }
  }, [idx, mode]);

  const checkAnswer = () => {
    if (!currentItem || mode === 'cards-et-en' || mode === 'cards-en-et') {
      // For card modes, just show the back
      setShowBack(true);
      return;
    }

    if (!answer.trim()) {
      setIsCorrect(null);
      setFeedback('Please enter an answer.');
      return;
    }

    const user = normalise(answer);
    const correct = mode === 'typing' 
      ? normalise(currentItem.estonian) === user
      : normalise(currentItem.english) === user;

    setIsCorrect(correct);

    if (correct) {
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      setFeedback('Correct! ✓');
      
      if (autoNext) {
        setTimeout(() => {
          nextItem();
        }, 800);
      }
    } else {
      setStreak(0);
      setFeedback(`Incorrect. Correct answer: ${currentItem.estonian}`);
    }
  };

  const showAnswer = () => {
    if (!currentItem) return;
    if (mode === 'typing') {
      setAnswer(currentItem.estonian);
      setIsCorrect(true);
      setFeedback('Correct answer shown.');
    } else {
      setShowBack(true);
    }
  };

  const nextItem = () => {
    if (idx + 1 >= lessonItems.length) {
      pickOrder();
    } else {
      setIdx(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      checkAnswer();
    }
  };

  const getModeLabel = () => {
    if (mode === 'cards-et-en') return 'Mode: Cards (Estonian → English)';
    if (mode === 'cards-en-et') return 'Mode: Cards (English → Estonian)';
    return 'Mode: Typing quiz';
  };

  const getHint = () => {
    if (!currentItem || !showHint) return '';
    const text = mode === 'typing' ? currentItem.estonian : currentItem.english;
    const firstChar = text.trim().charAt(0);
    return `Hint: starts with "${firstChar}…"`;
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'radial-gradient(circle at top, #e8f1ff 0, #f3f6fb 48%, #edf1f8 100%)',
      minHeight: '100vh',
      padding: 0,
      margin: 0
    }}>
      <style>{`
        .lesson4-header {
          padding: 16px 18px 14px;
          background: linear-gradient(135deg, #0052b4, #33a3ff);
          color: white;
          box-shadow: 0 10px 22px rgba(15, 35, 95, 0.16);
        }
        .lesson4-header h1 {
          margin: 0;
          font-size: 1.35rem;
          letter-spacing: -0.02em;
        }
        .lesson4-header p {
          margin: 4px 0 0;
          font-size: 0.85rem;
          opacity: 0.9;
        }
        .lesson4-main {
          max-width: 960px;
          margin: 18px auto 32px;
          padding: 0 14px;
        }
        .lesson4-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr);
          gap: 14px;
        }
        @media (min-width: 720px) {
          .lesson4-layout {
            grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          }
        }
        .lesson4-panel {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid rgba(15, 35, 95, 0.16);
          box-shadow: 0 1px 3px rgba(15, 35, 95, 0.1);
          padding: 14px 14px 12px;
        }
        .lesson4-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }
        .lesson4-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 2px 10px;
          border-radius: 999px;
          background: #e6f0ff;
          color: #00337a;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .lesson4-mode-pill {
          padding: 2px 10px;
          border-radius: 999px;
          background: rgba(16, 34, 53, 0.04);
          font-size: 0.75rem;
          color: #5b6b8c;
        }
        .lesson4-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 2px 0 8px;
        }
        .lesson4-tab-btn {
          border-radius: 999px;
          border: 1px solid rgba(15, 35, 95, 0.16);
          background: #f8f9fd;
          color: #5b6b8c;
          font-size: 0.8rem;
          padding: 5px 12px;
          cursor: pointer;
        }
        .lesson4-tab-btn.active {
          background: #0052b4;
          border-color: #0052b4;
          color: #ffffff;
          font-weight: 600;
        }
        .lesson4-flashcard {
          padding: 10px 10px 12px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ffffff, #f1f4ff);
          border: 1px solid rgba(15, 35, 95, 0.08);
        }
        .lesson4-flash-top {
          font-size: 0.75rem;
          color: #5b6b8c;
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }
        .lesson4-flash-front {
          font-size: 1.15rem;
          font-weight: 650;
          color: #102235;
          margin: 4px 0;
        }
        .lesson4-flash-back {
          font-size: 0.93rem;
          color: #5b6b8c;
          margin-top: 4px;
        }
        .lesson4-flash-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
          font-size: 0.7rem;
          color: #5b6b8c;
        }
        .lesson4-tag {
          padding: 1px 7px;
          border-radius: 999px;
          background: rgba(15, 35, 95, 0.06);
        }
        .lesson4-controls-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .lesson4-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 999px;
          border: none;
          padding: 7px 14px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.06s ease;
        }
        .lesson4-btn:active {
          transform: translateY(1px);
        }
        .lesson4-btn-primary {
          background: #0052b4;
          color: #ffffff;
          box-shadow: 0 6px 16px rgba(0, 82, 180, 0.35);
        }
        .lesson4-btn-primary:hover {
          background: #00439a;
        }
        .lesson4-btn-secondary {
          background: #ffffff;
          border: 1px solid rgba(15, 35, 95, 0.16);
          color: #102235;
        }
        .lesson4-btn-ghost {
          background: transparent;
          color: #5b6b8c;
        }
        .lesson4-options-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
          font-size: 0.78rem;
          color: #5b6b8c;
        }
        .lesson4-options-row label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .lesson4-options-row input[type="checkbox"] {
          accent-color: #0052b4;
        }
        .lesson4-input-area {
          margin-top: 10px;
        }
        .lesson4-input-label {
          font-size: 0.76rem;
          color: #5b6b8c;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 3px;
        }
        .lesson4-input-text {
          width: 100%;
          padding: 7px 9px;
          border-radius: 10px;
          border: 1px solid rgba(15, 35, 95, 0.16);
          font-size: 0.9rem;
          background: #ffffff;
          color: #102235;
        }
        .lesson4-input-text:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 82, 180, 0.2);
          border-color: #0052b4;
        }
        .lesson4-input-text.correct {
          border-color: #1aa35c;
          background: #f1fbf5;
        }
        .lesson4-input-text.wrong {
          border-color: #e03131;
          background: #fff5f5;
        }
        .lesson4-feedback {
          margin-top: 5px;
          font-size: 0.8rem;
          color: #5b6b8c;
        }
        .lesson4-feedback.good {
          color: #1aa35c;
        }
        .lesson4-feedback.bad {
          color: #e03131;
        }
        .lesson4-stats-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
          font-size: 0.75rem;
        }
        .lesson4-stat-pill {
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(15, 35, 95, 0.04);
          color: #5b6b8c;
        }
        .lesson4-stat-pill strong {
          color: #102235;
        }
        .lesson4-secondary-title {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 6px;
          color: #5b6b8c;
        }
        .lesson4-list {
          font-size: 0.82rem;
          color: #5b6b8c;
          line-height: 1.5;
          padding-left: 18px;
          margin: 0;
        }
        .lesson4-list li {
          margin-bottom: 2px;
        }
      `}</style>

      <header className="lesson4-header">
        <h1>Estonian Lesson 4 – Cards & Quiz</h1>
        <p>Practice new words and phrases: üles ärkama, meeldib/meeldis, viimased, eelmine/järgmine, "anna mulle pastakas", jne.</p>
      </header>

      <main className="lesson4-main">
        <div className="lesson4-layout">
          <section className="lesson4-panel">
            <div className="lesson4-panel-header">
              <div className="lesson4-badge">Flashcards & Quiz</div>
              <div className="lesson4-mode-pill">{getModeLabel()}</div>
            </div>

            <div className="lesson4-tabs">
              <button 
                className={`lesson4-tab-btn ${mode === 'cards-et-en' ? 'active' : ''}`}
                onClick={() => setMode('cards-et-en')}
              >
                Cards: ET → EN
              </button>
              <button 
                className={`lesson4-tab-btn ${mode === 'cards-en-et' ? 'active' : ''}`}
                onClick={() => setMode('cards-en-et')}
              >
                Cards: EN → ET
              </button>
              <button 
                className={`lesson4-tab-btn ${mode === 'typing' ? 'active' : ''}`}
                onClick={() => setMode('typing')}
              >
                Typing quiz
              </button>
            </div>

            {currentItem && (
              <>
                {mode !== 'typing' && (
                  <div className="lesson4-flashcard">
                    <div className="lesson4-flash-top">
                      <span>Card {idx + 1} / {lessonItems.length}</span>
                      <span>{currentItem.category}</span>
                    </div>
                    <div className="lesson4-flash-front">
                      {mode === 'cards-et-en' ? currentItem.estonian : currentItem.english}
                    </div>
                    {(showBack || mode === 'cards-et-en') && (
                      <div className="lesson4-flash-back">
                        {mode === 'cards-et-en' ? currentItem.english : currentItem.estonian}
                      </div>
                    )}
                    {currentItem.tags && currentItem.tags.length > 0 && (
                      <div className="lesson4-flash-tags">
                        {currentItem.tags.map((tag, i) => (
                          <span key={i} className="lesson4-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {mode === 'typing' && (
                  <div className="lesson4-input-area">
                    <div className="lesson4-input-label">
                      Type the Estonian phrase
                    </div>
                    <div className="lesson4-flash-front" style={{ marginBottom: '8px' }}>
                      {currentItem.english}
                    </div>
                    <input
                      ref={typingInputRef}
                      className={`lesson4-input-text ${isCorrect === true ? 'correct' : isCorrect === false ? 'wrong' : ''}`}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoComplete="off"
                    />
                    {showHint && getHint() && (
                      <div className="lesson4-feedback" style={{ marginTop: '4px' }}>
                        {getHint()}
                      </div>
                    )}
                    <div className={`lesson4-feedback ${isCorrect === true ? 'good' : isCorrect === false ? 'bad' : ''}`}>
                      {feedback}
                    </div>
                  </div>
                )}

                <div className="lesson4-controls-row">
                  <button className="lesson4-btn lesson4-btn-primary" onClick={checkAnswer}>
                    {mode === 'typing' ? 'Check' : showBack ? 'Next' : 'Show'}
                  </button>
                  <button className="lesson4-btn lesson4-btn-secondary" onClick={nextItem}>
                    Next
                  </button>
                  <button className="lesson4-btn lesson4-btn-ghost" onClick={showAnswer}>
                    Show answer
                  </button>
                  <button className="lesson4-btn lesson4-btn-ghost" onClick={pickOrder}>
                    Shuffle
                  </button>
                </div>

                <div className="lesson4-options-row">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={autoNext}
                      onChange={(e) => setAutoNext(e.target.checked)}
                    />
                    Auto-next on correct
                  </label>
                  {mode !== 'typing' && (
                    <label>
                      <input 
                        type="checkbox" 
                        checked={!showBack}
                        onChange={(e) => setShowBack(!e.target.checked)}
                      />
                      Hide back side (cards)
                    </label>
                  )}
                  {mode === 'typing' && (
                    <label>
                      <input 
                        type="checkbox" 
                        checked={showHint}
                        onChange={(e) => setShowHint(e.target.checked)}
                      />
                      Show first-letter hint (typing)
                    </label>
                  )}
                </div>

                <div className="lesson4-stats-row">
                  <span className="lesson4-stat-pill">
                    <strong>Correct:</strong> {correctCount}
                  </span>
                  <span className="lesson4-stat-pill">
                    <strong>Streak:</strong> {streak}
                  </span>
                </div>
              </>
            )}
          </section>

          <aside className="lesson4-panel">
            <div className="lesson4-secondary-title">All lesson items (this app covers these):</div>
            <ul className="lesson4-list">
              {lessonItems.map((item) => (
                <li key={item.id}>
                  <strong>{item.estonian}</strong> – {item.english}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
};
