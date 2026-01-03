/**
 * Tab 4 Component - Estonian Lesson 5 Words & Phrases Trainer
 * 
 * Practice frequency, time, location, quantity words + common question words 
 * (kus, mis, kes, kellele, kui, jne)
 */

import React, { useState, useEffect, useRef } from 'react';

interface LessonItem {
  et: string;
  en: string;
  cat: string;
}

const lessonItems: LessonItem[] = [
  { et: "palju", en: "a lot / much", cat: "quantity" },
  { et: "natuke", en: "a little / a bit", cat: "quantity" },
  { et: "praegu", en: "now / right now", cat: "time" },
  { et: "hetkel", en: "at the moment", cat: "time" },
  { et: "siis", en: "then", cat: "time" },
  { et: "ma arvan, et", en: "I think that / I believe that", cat: "phrase" },
  { et: "ma usun", en: "I believe", cat: "verb phrase" },
  { et: "mõnikord", en: "sometimes", cat: "frequency" },
  { et: "alati", en: "always", cat: "frequency" },
  { et: "tihti", en: "often", cat: "frequency" },
  { et: "korda", en: "times (occurrence count)", cat: "quantity" },
  { et: "peal", en: "on / on top of", cat: "location" },
  { et: "all", en: "under / beneath", cat: "location" },
  { et: "koos", en: "together", cat: "togetherness" },
  { et: "pärast tundi", en: "after an hour", cat: "time" },
  { et: "see on tõsi", en: "that is true", cat: "phrase" },
  { et: "kus", en: "where (location)", cat: "question" },
  { et: "mis", en: "what", cat: "question" },
  { et: "kes", en: "who", cat: "question" },
  { et: "kellele", en: "to whom / for whom", cat: "question" },
  { et: "kui", en: "how / if / when", cat: "question" },
  { et: "millal", en: "when (time)", cat: "question" },
  { et: "mitmendal", en: "which number / on which (ordinal)", cat: "question" },
  { et: "miks", en: "why", cat: "question" },
  { et: "mitu", en: "how many", cat: "question" },
  { et: "kust", en: "from where", cat: "question" },
  { et: "kas", en: "whether / is it? (yes/no question)", cat: "question" },
  { et: "hetkel praegu", en: "right now at the moment", cat: "time" },
  { et: "kordavalt", en: "repeatedly / time and again", cat: "frequency" },
  { et: "jätkuvalt", en: "continuously / still", cat: "frequency" }
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

export const Tab4: React.FC = () => {
  const [mode, setMode] = useState<'et-en' | 'en-et' | 'typing'>('et-en');
  const [order, setOrder] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState('Press Enter or "Check" to verify.');
  const [showEnglish, setShowEnglish] = useState(true);
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
      setFeedback('Press Enter or "Check" to verify.');
      
      if (mode === 'typing' && typingInputRef.current) {
        typingInputRef.current.focus();
      }
    }
  }, [idx, mode]);

  const checkAnswer = () => {
    if (mode !== 'typing') {
      // For card modes, just show the answer
      return;
    }

    if (!currentItem || !answer.trim()) {
      setIsCorrect(null);
      setFeedback('Type something first.');
      return;
    }

    const user = normalise(answer);
    const target = normalise(currentItem.et);
    const correct = user === target;

    setIsCorrect(correct);

    if (correct) {
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      setFeedback('Correct! ✓');
    } else {
      setStreak(0);
      setFeedback(`Not quite. Correct: "${currentItem.et}"`);
    }
  };

  const showAnswer = () => {
    if (!currentItem) return;
    if (mode === 'typing') {
      setAnswer(currentItem.et);
      setIsCorrect(true);
      setFeedback(`Answer: "${currentItem.et}"`);
    }
  };

  const nextCard = () => {
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
    if (mode === 'et-en') return 'Mode: Cards (Estonian → English)';
    if (mode === 'en-et') return 'Mode: Cards (English → Estonian)';
    return 'Mode: Typing (English → type Estonian)';
  };

  const getHint = () => {
    if (!currentItem || !showHint || mode !== 'typing') return '';
    const firstChar = currentItem.et.trim().charAt(0);
    return `Hint: starts with "${firstChar}…"`;
  };

  const statText = `Item ${idx + 1} / ${lessonItems.length} · Correct: ${correctCount} · Streak: ${streak}`;

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#fcfcf9',
      minHeight: '100vh',
      padding: 0,
      margin: 0
    }}>
      <style>{`
        .lesson5-header {
          background: linear-gradient(135deg, #21808d, #2996a1);
          color: white;
          padding: 16px 20px 14px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
        }
        .lesson5-header h1 {
          margin: 0;
          font-size: 1.4rem;
          letter-spacing: -0.02em;
        }
        .lesson5-header p {
          margin: 4px 0 0;
          font-size: 0.85rem;
          opacity: 0.9;
        }
        .lesson5-main {
          max-width: 900px;
          margin: 16px auto 32px;
          padding: 0 16px;
        }
        .lesson5-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .lesson5-tab-btn {
          border-radius: 9999px;
          border: 1px solid rgba(94, 82, 64, 0.2);
          padding: 6px 14px;
          font-size: 0.8rem;
          background: #fffcfd;
          color: #62706f;
          cursor: pointer;
        }
        .lesson5-tab-btn.active {
          background: #21808d;
          color: white;
          border-color: transparent;
        }
        .lesson5-card {
          background: #fffcfd;
          border-radius: 12px;
          border: 1px solid rgba(94, 82, 64, 0.12);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          padding: 16px;
          margin-bottom: 16px;
        }
        .lesson5-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .lesson5-chip {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 0.7rem;
          background: rgba(33, 128, 141, 0.12);
          color: #21808d;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .lesson5-stat {
          font-size: 0.75rem;
          color: #62706f;
        }
        .lesson5-est-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #13343b;
          margin: 6px 0 4px;
        }
        .lesson5-en-text {
          font-size: 0.85rem;
          color: #62706f;
          margin-top: 2px;
        }
        .lesson5-input-row {
          margin-top: 10px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        @media (min-width: 640px) {
          .lesson5-input-row {
            grid-template-columns: 1.4fr 1fr;
          }
        }
        .lesson5-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #62706f;
          margin-bottom: 2px;
        }
        .lesson5-input {
          width: 100%;
          padding: 7px 10px;
          border-radius: 8px;
          border: 1px solid rgba(94, 82, 64, 0.2);
          font-size: 0.9rem;
          background: #fffcfd;
          color: #13343b;
        }
        .lesson5-input:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(33, 128, 141, 0.4);
          border-color: #21808d;
        }
        .lesson5-input.correct {
          border-color: #21808d;
          background: rgba(33, 128, 141, 0.08);
        }
        .lesson5-input.wrong {
          border-color: #c0152f;
          background: rgba(192, 21, 47, 0.08);
        }
        .lesson5-hint-line {
          font-size: 0.78rem;
          color: #62706f;
          margin-top: 4px;
        }
        .lesson5-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .lesson5-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 9999px;
          border: none;
          padding: 7px 14px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .lesson5-btn-primary {
          background: #21808d;
          color: white;
        }
        .lesson5-btn-primary:hover {
          background: #1d7480;
        }
        .lesson5-btn-secondary {
          background: rgba(94, 82, 64, 0.12);
          color: #13343b;
        }
        .lesson5-btn-ghost {
          background: transparent;
          color: #62706f;
        }
        .lesson5-options-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
          font-size: 0.78rem;
          color: #62706f;
        }
        .lesson5-options-row label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .lesson5-options-row input[type="checkbox"] {
          accent-color: #21808d;
        }
        .lesson5-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
          font-size: 0.75rem;
        }
        .lesson5-pill {
          padding: 2px 8px;
          border-radius: 9999px;
          background: rgba(94, 82, 64, 0.09);
          color: #62706f;
        }
        .lesson5-subtle {
          font-size: 0.78rem;
          color: #62706f;
          margin-top: 8px;
        }
      `}</style>

      <header className="lesson5-header">
        <h1>Estonian Lesson 5 – Adverbs & Question Words</h1>
        <p>Practice frequency, time, location, quantity words + common question words (kus, mis, kes, kellele, kui, jne)</p>
      </header>

      <main className="lesson5-main">
        <div className="lesson5-tabs">
          <button 
            className={`lesson5-tab-btn ${mode === 'et-en' ? 'active' : ''}`}
            onClick={() => setMode('et-en')}
          >
            Cards: ET → EN
          </button>
          <button 
            className={`lesson5-tab-btn ${mode === 'en-et' ? 'active' : ''}`}
            onClick={() => setMode('en-et')}
          >
            Cards: EN → ET
          </button>
          <button 
            className={`lesson5-tab-btn ${mode === 'typing' ? 'active' : ''}`}
            onClick={() => setMode('typing')}
          >
            Typing quiz
          </button>
        </div>

        <section className="lesson5-card">
          <div className="lesson5-card-header">
            <div>
              <div className="lesson5-chip">Adverbs & Questions</div>
            </div>
            <div className="lesson5-stat">{statText}</div>
          </div>

          {currentItem && (
            <>
              <div>
                <div className="lesson5-est-text">
                  {mode === 'et-en' ? currentItem.et : mode === 'en-et' ? currentItem.en : currentItem.en}
                </div>
                {showEnglish && mode !== 'typing' && (
                  <div className="lesson5-en-text">
                    {mode === 'et-en' ? currentItem.en : currentItem.et}
                  </div>
                )}
              </div>

              {mode === 'typing' && (
                <div className="lesson5-input-row">
                  <div>
                    <div className="lesson5-label">Type the Estonian word</div>
                    <input
                      ref={typingInputRef}
                      className={`lesson5-input ${isCorrect === true ? 'correct' : isCorrect === false ? 'wrong' : ''}`}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoComplete="off"
                    />
                    {showHint && getHint() && (
                      <div className="lesson5-hint-line" style={{ marginTop: '4px' }}>
                        {getHint()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="lesson5-label">Reference</div>
                    <div className={`lesson5-hint-line ${isCorrect === true ? 'correct' : isCorrect === false ? 'wrong' : ''}`}>
                      {feedback}
                    </div>
                  </div>
                </div>
              )}

              <div className="lesson5-options-row">
                <label>
                  <input 
                    type="checkbox" 
                    checked={showEnglish}
                    onChange={(e) => setShowEnglish(e.target.checked)}
                  />
                  Show English
                </label>
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

              <div className="lesson5-controls">
                <button className="lesson5-btn lesson5-btn-primary" onClick={checkAnswer}>
                  Check
                </button>
                <button className="lesson5-btn lesson5-btn-secondary" onClick={nextCard}>
                  Next
                </button>
                <button className="lesson5-btn lesson5-btn-ghost" onClick={showAnswer}>
                  Show answer
                </button>
                <button className="lesson5-btn lesson5-btn-ghost" onClick={pickOrder}>
                  Shuffle
                </button>
              </div>

              <div className="lesson5-pill-row">
                <span className="lesson5-pill">{getModeLabel()}</span>
              </div>

              <div className="lesson5-subtle">
                Tip: These are everyday words you'll use constantly with Maria. Focus on pronunciation too!
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};
