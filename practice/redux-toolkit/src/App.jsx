import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './store/CounterSlice';
import { toggleTheme } from './store/ThemeSlice';

const App = () => {
  const count = useSelector((state) => state.counter.value);
  const theme = useSelector((state) => state.theme.value);
  // useSelector hamare "store" main jo value store kiya hai, wo read karta hai aur usko UI main show karta hai
  const dispatch = useDispatch();
  // with the help of useDispatch() we can use the functions like increment, decrement, incrementByAmount, toggleTheme. hum iss function ko start kar sakte hai.
  const [customVal, setCustomVal] = useState('5');

  return (
    <div className={`app-container ${theme}`}>
      {/* Background blobs for ambient glow */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      <header className="header">
        <div className="logo-section">
          <span className="logo-icon">⚡</span>
          <h2>
            Pulse<span>Counter</span>
          </h2>
        </div>
        <button
          className="theme-toggle-btn"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'dark' ? (
            <>
              <span className="icon">☀️</span> Light Mode
            </>
          ) : (
            <>
              <span className="icon">🌙</span> Dark Mode
            </>
          )}
        </button>
      </header>

      <main className="main-content">
        <div className="dashboard-card">
          <span className="card-badge">Redux Toolkit State</span>

          <div className="counter-display">
            <span className="counter-label">CURRENT COUNT</span>
            <h1 className="counter-number">{count}</h1>
          </div>

          <div className="action-grid">
            <button
              className="action-btn decrement-btn"
              onClick={() => dispatch(decrement())}
              aria-label="Decrement"
            >
              <span className="btn-symbol">−</span> Decrement
            </button>
            <button
              className="action-btn increment-btn"
              onClick={() => dispatch(increment())}
              aria-label="Increment"
            >
              <span className="btn-symbol">+</span> Increment
            </button>
          </div>

          <div className="custom-increment-section">
            <label htmlFor="custom-amount">Increment by custom amount</label>
            <div className="custom-input-wrapper">
              <input
                id="custom-amount"
                type="number"
                value={customVal}
                onChange={(e) => setCustomVal(e.target.value)}
                placeholder="Value"
              />
              <button
                onClick={() =>
                  dispatch(incrementByAmount(Number(customVal) || 0))
                }
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>• Built with React & Redux Toolkit •</p>
      </footer>
    </div>
  );
};

export default App;
