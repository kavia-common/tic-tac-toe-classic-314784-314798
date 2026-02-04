import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

const PLAYER_X = 'X';
const PLAYER_O = 'O';

const WIN_LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
function App() {
  /** Main entrypoint for the Tic Tac Toe UI. Renders the game board, status, and controls. */
  const [theme, setTheme] = useState('light');
  const [board, setBoard] = useState(() => Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const gameResult = useMemo(() => {
    // Determine if there is a winner
    for (const [a, b, c] of WIN_LINES) {
      const v = board[a];
      if (v && v === board[b] && v === board[c]) {
        return { status: 'win', winner: v, line: [a, b, c] };
      }
    }

    // Determine if draw
    const isDraw = board.every((cell) => cell !== null);
    if (isDraw) return { status: 'draw', winner: null, line: null };

    return { status: 'playing', winner: null, line: null };
  }, [board]);

  const statusText = useMemo(() => {
    if (gameResult.status === 'win') return `Winner: ${gameResult.winner}`;
    if (gameResult.status === 'draw') return 'It’s a draw!';
    return `Turn: ${currentPlayer}`;
  }, [currentPlayer, gameResult.status, gameResult.winner]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark modes. */
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleCellClick = (index) => {
    /** Handle a move on the board at a given index. */
    if (gameResult.status !== 'playing') return;
    if (board[index] !== null) return;

    setBoard((prev) => {
      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });

    setCurrentPlayer((prev) => (prev === PLAYER_X ? PLAYER_O : PLAYER_X));
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    /** Reset the game state to start a new game. */
    setBoard(Array(9).fill(null));
    setCurrentPlayer(PLAYER_X);
  };

  return (
    <div className="App">
      <main className="ttt-page" aria-label="Tic Tac Toe">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <section className="ttt-card" aria-label="Game container">
          <header className="ttt-header">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <p className="ttt-subtitle">Local two-player classic on a 3×3 grid</p>
          </header>

          <div
            className={[
              'ttt-status',
              gameResult.status === 'win' ? 'is-win' : '',
              gameResult.status === 'draw' ? 'is-draw' : '',
            ].join(' ')}
            role="status"
            aria-live="polite"
          >
            <span className="ttt-status-label">{statusText}</span>
          </div>

          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {board.map((value, idx) => {
              const isWinningCell = Array.isArray(gameResult.line) && gameResult.line.includes(idx);
              const isDisabled = value !== null || gameResult.status !== 'playing';

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    'ttt-cell',
                    value === PLAYER_X ? 'is-x' : '',
                    value === PLAYER_O ? 'is-o' : '',
                    isWinningCell ? 'is-winning' : '',
                  ].join(' ')}
                  onClick={() => handleCellClick(idx)}
                  disabled={isDisabled}
                  role="gridcell"
                  aria-label={`Cell ${idx + 1}${value ? `, ${value}` : ''}`}
                >
                  <span className="ttt-mark" aria-hidden="true">
                    {value || ''}
                  </span>
                </button>
              );
            })}
          </div>

          <footer className="ttt-controls" aria-label="Game controls">
            <button type="button" className="ttt-btn ttt-btn-primary" onClick={handleRestart}>
              Restart
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
