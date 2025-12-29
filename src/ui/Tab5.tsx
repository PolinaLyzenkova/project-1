/**
 * Tab 5 Component - Estonian Dative Trainer
 * 
 * Practice: sündinud + dative pronouns (mulle/sulle/talle jne), 
 * frequency words, lähedal/kõrval.
 */

import React, { useState, useEffect, useRef } from 'react';

interface TrainerItem {
  id: string;
  type: 'dative' | 'phrase';
  prompt: string;
  en: string;
  correct: string[];
  short?: string;
  displayEst?: string;
  meta?: string;
  group?: string;
}

const dativeItems: TrainerItem[] = [
  {
    id: "mina-mulle",
    type: "dative",
    prompt: "Mina → ____ (to/for me)",
    en: "to me / for me",
    correct: ["mulle", "minule"],
    short: "mulle",
    meta: "Pronoun: Mina → Mulle / Minule"
  },
  {
    id: "sina-sulle",
    type: "dative",
    prompt: "Sina → ____ (to/for you)",
    en: "to you / for you",
    correct: ["sulle", "sinule"],
    short: "sulle",
    meta: "Pronoun: Sina → Sulle / Sinule"
  },
  {
    id: "tema-talle",
    type: "dative",
    prompt: "Tema → ____ (to/for him/her)",
    en: "to him / to her",
    correct: ["talle", "temale"],
    short: "talle",
    meta: "Pronoun: Tema → Talle / Temale"
  },
  {
    id: "meie-meile",
    type: "dative",
    prompt: "Meie → ____ (to/for us)",
    en: "to us / for us",
    correct: ["meile"],
    short: "meile",
    meta: "Pronoun: Meie → Meile"
  },
  {
    id: "teie-teile",
    type: "dative",
    prompt: "Teie → ____ (to/for you, plural/formal)",
    en: "to you (plural/formal)",
    correct: ["teile"],
    short: "teile",
    meta: "Pronoun: Teie → Teile"
  },
  {
    id: "nemad-neile",
    type: "dative",
    prompt: "Nemad → ____ (to/for them)",
    en: "to them / for them",
    correct: ["neile", "nendele"],
    short: "neile",
    meta: "Pronoun: Nemad → Neile / Nendele"
  },
  {
    id: "kes-kellele",
    type: "dative",
    prompt: "Kes? → ____? (to whom?)",
    en: "to whom?",
    correct: ["kellele"],
    short: "kellele",
    meta: "Question word: Kes? → Kellele?"
  }
];

const phraseItems: TrainerItem[] = [
  {
    id: "syndinud-1992",
    type: "phrase",
    prompt: "Type full sentence: I was born in 1992.",
    en: "I was born in 1992.",
    correct: ["ma olen sündinud aastal 1992"],
    displayEst: "Ma olen sündinud aastal 1992.",
    meta: "sündinud aastal + year"
  },
  {
    id: "selver-kodu-korval",
    type: "phrase",
    prompt: "Type: Selver is next to my home.",
    en: "Selver is next to my home.",
    correct: ["selver on minu kodu kõrval"],
    displayEst: "Selver on minu kodu kõrval.",
    meta: "kõrval = next to"
  },
  {
    id: "lahedal",
    type: "phrase",
    prompt: "Translate: The shop is near me.",
    en: "The shop is near me.",
    correct: ["pood on mulle lähedal"],
    displayEst: "Pood on mulle lähedal.",
    meta: "lähedal = near/close (to somebody)"
  },
  {
    id: "ei-kai-tihti-kinos",
    type: "phrase",
    prompt: "Type: I don't go to the cinema often.",
    en: "I don't go to the cinema often.",
    correct: ["ma ei käi tihti kinos", "ma ei käi sageli kinos"],
    displayEst: "Ma ei käi tihti kinos.",
    meta: "tihti = often; negation + käima"
  },
  {
    id: "natuke",
    type: "phrase",
    prompt: "Use 'natuke' (a little) with Estonian: I speak a little Estonian.",
    en: "I speak a little Estonian.",
    correct: ["ma räägin natuke eesti keelt", "ma räägin eesti keelt natuke"],
    displayEst: "Ma räägin natuke eesti keelt.",
    meta: "natuke = a little"
  },
  {
    id: "monikord",
    type: "phrase",
    prompt: "Use 'mõnikord' (sometimes): Sometimes I go to the cinema.",
    en: "Sometimes I go to the cinema.",
    correct: [
      "ma käin mõnikord kinos",
      "mõnikord ma käin kinos"
    ],
    displayEst: "Ma käin mõnikord kinos.",
    meta: "mõnikord = sometimes"
  }
];

const mixedItems: TrainerItem[] = [
  ...dativeItems.map(x => ({ ...x, group: "dative" })),
  ...phraseItems.map(x => ({ ...x, group: "phrase" }))
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

export const Tab5: React.FC = () => {
  const [mode, setMode] = useState<'dative' | 'phrases' | 'mixed'>('dative');
  const [order, setOrder] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [reference, setReference] = useState('Correct answer will show here after you check.');
  const [showEnglish, setShowEnglish] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [allowLong, setAllowLong] = useState(true);
  const answerInputRef = useRef<HTMLInputElement>(null);

  const getCurrentList = (): TrainerItem[] => {
    if (mode === "dative") return dativeItems;
    if (mode === "phrases") return phraseItems;
    return mixedItems;
  };

  const pickOrder = () => {
    const list = getCurrentList();
    const newOrder = shuffle([...Array(list.length).keys()]);
    setOrder(newOrder);
    setIdx(0);
  };

  useEffect(() => {
    pickOrder();
    setCorrectCount(0);
    setStreak(0);
  }, [mode]);

  const currentItem = order.length > 0 && idx < order.length 
    ? getCurrentList()[order[idx]] 
    : null;

  useEffect(() => {
    if (currentItem) {
      setAnswer('');
      setIsCorrect(null);
      setReference('Correct answer will show here after you check.');
      
      if (showHint && currentItem.short) {
        const firstChar = currentItem.short.trim().charAt(0);
        setReference(`Hint: starts with "${firstChar}…"`);
      }
      
      if (answerInputRef.current) {
        answerInputRef.current.focus();
      }
    }
  }, [idx, mode, showHint]);

  const checkAnswer = () => {
    if (!currentItem || !answer.trim()) {
      setIsCorrect(null);
      return;
    }

    const user = normalise(answer);
    let acceptable = currentItem.correct || [];
    
    if (mode === "dative" && !allowLong && currentItem.short) {
      acceptable = [currentItem.short];
    }

    const correct = acceptable.some((form) => normalise(form) === user);
    setIsCorrect(correct);

    if (correct) {
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
    } else {
      setStreak(0);
    }

    const showForm = currentItem.displayEst || acceptable[0] || "";
    setReference(showForm ? `Correct: ${showForm}` : "No reference available.");
  };

  const showAnswer = () => {
    if (!currentItem) return;
    const acceptable = currentItem.correct || [];
    const showForm = currentItem.displayEst || acceptable[0] || "";
    setAnswer(showForm);
    setIsCorrect(true);
    setReference(showForm ? `Correct: ${showForm}` : "No reference.");
  };

  const nextItem = () => {
    const list = getCurrentList();
    if (idx + 1 >= list.length) {
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

  const getChipLabel = () => {
    if (mode === "dative") return "Dative · Forms";
    if (mode === "phrases") return "Phrases · Full sentences";
    return "Mixed · Quiz";
  };

  const getModeLabel = () => {
    if (mode === "dative") return "Mode: Dative forms (mulle/sulle/talle jne)";
    if (mode === "phrases") return "Mode: Phrases (sündinud, natuke, mõnikord, lähedal/kõrval)";
    return "Mode: Mixed quiz (dative + phrases together)";
  };

  const getTip = () => {
    if (mode === "dative") return "Tip: short everyday forms are mulle, sulle, talle, meile, teile, neile.";
    if (mode === "phrases") return "Tip: focus on whole sentence patterns you actually say to Maria.";
    return "Tip: pretend this is a mini-test before your lesson – no stress, just repetition.";
  };

  const list = getCurrentList();
  const statText = `Item ${idx + 1} / ${list.length} · Correct: ${correctCount} · Streak: ${streak}`;

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#fcfcf9',
      minHeight: '100vh',
      padding: 0,
      margin: 0
    }}>
      <style>{`
        .estonian-trainer-header {
          background: linear-gradient(135deg, #21808d, #2996a1);
          color: #fcfcf9;
          padding: 16px 20px 14px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
        }
        .estonian-trainer-header h1 {
          margin: 0;
          font-size: 1.4rem;
          letter-spacing: -0.02em;
        }
        .estonian-trainer-header p {
          margin: 4px 0 0;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
        }
        .estonian-trainer-main {
          max-width: 900px;
          margin: 16px auto 32px;
          padding: 0 16px;
        }
        .estonian-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .estonian-tab-btn {
          border-radius: 9999px;
          border: 1px solid rgba(94, 82, 64, 0.2);
          padding: 6px 14px;
          font-size: 0.8rem;
          background: #fcfcfd;
          color: #62706f;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .estonian-tab-btn.active {
          background: #21808d;
          color: #fcfcf9;
          border-color: transparent;
        }
        .estonian-card {
          background-color: #fcfcfd;
          border-radius: 12px;
          border: 1px solid rgba(94, 82, 64, 0.12);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          padding: 16px 16px 14px;
          margin-bottom: 16px;
        }
        .estonian-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .estonian-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 0.7rem;
          background-color: rgba(33, 128, 141, 0.12);
          color: #21808d;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 550;
        }
        .estonian-stat {
          font-size: 0.75rem;
          color: #62706f;
        }
        .estonian-qa-main {
          margin: 6px 0 4px;
        }
        .estonian-est-text {
          font-size: 1.1rem;
          font-weight: 550;
          color: #13343b;
        }
        .estonian-en-text {
          font-size: 0.85rem;
          color: #62706f;
          margin-top: 2px;
        }
        .estonian-input-row {
          margin-top: 10px;
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 8px;
        }
        @media (min-width: 640px) {
          .estonian-input-row {
            grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          }
        }
        .estonian-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #62706f;
          margin-bottom: 2px;
        }
        .estonian-input {
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(94, 82, 64, 0.2);
          padding: 7px 10px;
          font-size: 0.9rem;
          background-color: #fcfcfd;
          color: #13343b;
        }
        .estonian-input:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(33, 128, 141, 0.4);
          border-color: #21808d;
        }
        .estonian-input.correct {
          border-color: #21808d;
          background-color: rgba(33, 128, 141, 0.08);
        }
        .estonian-input.wrong {
          border-color: #c0152f;
          background-color: rgba(192, 21, 47, 0.08);
        }
        .estonian-hint-line {
          font-size: 0.78rem;
          color: #62706f;
          margin-top: 4px;
        }
        .estonian-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }
        .estonian-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 9999px;
          border: none;
          padding: 7px 14px;
          font-size: 0.85rem;
          font-weight: 550;
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease, transform 0.05s ease;
        }
        .estonian-btn:active {
          transform: translateY(1px);
        }
        .estonian-btn-primary {
          background-color: #21808d;
          color: #fcfcf9;
        }
        .estonian-btn-primary:hover {
          background-color: #1d7480;
        }
        .estonian-btn-secondary {
          background-color: rgba(94, 82, 64, 0.12);
          color: #13343b;
        }
        .estonian-btn-secondary:hover {
          background-color: rgba(94, 82, 64, 0.2);
        }
        .estonian-btn-ghost {
          background-color: transparent;
          color: #62706f;
        }
        .estonian-options-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
          font-size: 0.78rem;
          color: #62706f;
        }
        .estonian-options-row label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .estonian-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
          font-size: 0.75rem;
        }
        .estonian-pill {
          padding: 2px 8px;
          border-radius: 9999px;
          background-color: rgba(94, 82, 64, 0.09);
          color: #62706f;
        }
        .estonian-pill strong {
          color: #13343b;
        }
        .estonian-subtle {
          font-size: 0.78rem;
          color: #62706f;
          margin-top: 8px;
        }
      `}</style>

      <header className="estonian-trainer-header">
        <h1>Estonian Dative & Phrase Trainer</h1>
        <p>Practice: sündinud + dative pronouns (mulle/sulle/talle jne), frequency words, lähedal/kõrval.</p>
      </header>

      <main className="estonian-trainer-main">
        <div className="estonian-tabs">
          <button 
            className={`estonian-tab-btn ${mode === 'dative' ? 'active' : ''}`}
            onClick={() => setMode('dative')}
          >
            Dative forms
          </button>
          <button 
            className={`estonian-tab-btn ${mode === 'phrases' ? 'active' : ''}`}
            onClick={() => setMode('phrases')}
          >
            Phrases
          </button>
          <button 
            className={`estonian-tab-btn ${mode === 'mixed' ? 'active' : ''}`}
            onClick={() => setMode('mixed')}
          >
            Mixed quiz
          </button>
        </div>

        <section className="estonian-card">
          <div className="estonian-card-header">
            <div>
              <div className="estonian-chip">{getChipLabel()}</div>
            </div>
            <div className="estonian-stat">{statText}</div>
          </div>

          {currentItem && (
            <>
              <div className="estonian-qa-main">
                <div className="estonian-est-text">{currentItem.prompt}</div>
                {showEnglish && (
                  <div className="estonian-en-text">{currentItem.en}</div>
                )}
              </div>

              <div className="estonian-input-row">
                <div>
                  <div className="estonian-label">Your answer (Estonian)</div>
                  <input
                    ref={answerInputRef}
                    className={`estonian-input ${isCorrect === true ? 'correct' : isCorrect === false ? 'wrong' : ''}`}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <div className="estonian-label">Reference</div>
                  <div className="estonian-hint-line">{reference}</div>
                </div>
              </div>

              <div className="estonian-options-row">
                <label>
                  <input 
                    type="checkbox" 
                    checked={showEnglish}
                    onChange={(e) => setShowEnglish(e.target.checked)}
                  />
                  Show English meaning
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={showHint}
                    onChange={(e) => setShowHint(e.target.checked)}
                  />
                  Show first-letter hint
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={allowLong}
                    onChange={(e) => setAllowLong(e.target.checked)}
                  />
                  Accept long dative forms (minule, sinule jne)
                </label>
              </div>

              <div className="estonian-controls">
                <button className="estonian-btn estonian-btn-primary" onClick={checkAnswer}>
                  Check
                </button>
                <button className="estonian-btn estonian-btn-secondary" onClick={nextItem}>
                  Next
                </button>
                <button className="estonian-btn estonian-btn-ghost" onClick={showAnswer}>
                  Show answer
                </button>
              </div>

              <div className="estonian-pill-row">
                <span className="estonian-pill">{getModeLabel()}</span>
                {currentItem.meta && (
                  <span className="estonian-pill">{currentItem.meta}</span>
                )}
              </div>

              <div className="estonian-subtle">{getTip()}</div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};
