import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameProgress } from '../context/GameProgressContext'
import './HangmanGame.css'

// Change this to update the word/phrase for the hangman game.
const SOLUTION_STRING = 'BONDEBRIDGE'

const GAME_ID = 4
const MAX_WRONG_GUESSES = 6
const KEYBOARD_ROWS = ['ABCDEFGHIJKLM', 'NOPQRSTUVWXYZ', 'ÆØÅ']

function HangmanGame() {
  const navigate = useNavigate()
  const { completeGame } = useGameProgress()
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())

  const solutionLetters = useMemo(
    () => SOLUTION_STRING.split('').map((char) => char.toUpperCase()),
    [],
  )
  const uniqueLetters = useMemo(
    () => new Set(solutionLetters.filter((char) => /[A-ZÆØÅ]/.test(char))),
    [solutionLetters],
  )

  const wrongGuesses = useMemo(
    () => [...guessedLetters].filter((letter) => !uniqueLetters.has(letter)),
    [guessedLetters, uniqueLetters],
  )
  const isLost = wrongGuesses.length >= MAX_WRONG_GUESSES
  const isWon = [...uniqueLetters].every((letter) => guessedLetters.has(letter))

  const guessLetter = useCallback(
    (letter: string) => {
      if (isWon || isLost) return
      setGuessedLetters((prev) => {
        if (prev.has(letter)) return prev
        return new Set(prev).add(letter)
      })
    },
    [isWon, isLost],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const letter = event.key.toUpperCase()
      if (/^[A-ZÆØÅ]$/.test(letter)) {
        guessLetter(letter)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [guessLetter])

  useEffect(() => {
    if (isWon) completeGame(GAME_ID)
  }, [isWon, completeGame])

  const resetGame = () => {
    setGuessedLetters(new Set())
  }

  return (
    <div className="hangman-page">
      <h1 className="hangman-page__title">Øvelse 4: Hangman</h1>
      <p className="hangman-page__subtitle">Gjett bokstavene før det går galt!</p>

      <div className="hangman-area">
        <svg className="hangman-drawing" viewBox="0 0 200 220" aria-hidden="true">
          <line x1="10" y1="210" x2="150" y2="210" className="hangman-line" />
          <line x1="40" y1="210" x2="40" y2="10" className="hangman-line" />
          <line x1="40" y1="10" x2="120" y2="10" className="hangman-line" />
          <line x1="120" y1="10" x2="120" y2="35" className="hangman-line" />

          {wrongGuesses.length > 0 && <circle cx="120" cy="55" r="20" className="hangman-part" />}
          {wrongGuesses.length > 1 && <line x1="120" y1="75" x2="120" y2="130" className="hangman-part" />}
          {wrongGuesses.length > 2 && <line x1="120" y1="90" x2="95" y2="115" className="hangman-part" />}
          {wrongGuesses.length > 3 && <line x1="120" y1="90" x2="145" y2="115" className="hangman-part" />}
          {wrongGuesses.length > 4 && <line x1="120" y1="130" x2="100" y2="165" className="hangman-part" />}
          {wrongGuesses.length > 5 && <line x1="120" y1="130" x2="140" y2="165" className="hangman-part" />}
        </svg>

        <div className="hangman-word">
          {solutionLetters.map((letter, index) => {
            const isLetter = /[A-ZÆØÅ]/.test(letter)
            const isRevealed = !isLetter || guessedLetters.has(letter)
            return (
              <span key={index} className="hangman-slot">
                <span className="hangman-slot__letter">{isRevealed ? letter : ''}</span>
              </span>
            )
          })}
        </div>

        <div className="hangman-keyboard">
          {KEYBOARD_ROWS.map((row) => (
            <div key={row} className="hangman-keyboard__row">
              {row.split('').map((letter) => {
                const isGuessed = guessedLetters.has(letter)
                const isCorrect = isGuessed && uniqueLetters.has(letter)
                const isWrong = isGuessed && !uniqueLetters.has(letter)
                return (
                  <button
                    key={letter}
                    type="button"
                    className={`hangman-key${isCorrect ? ' hangman-key--correct' : ''}${isWrong ? ' hangman-key--wrong' : ''}`}
                    disabled={isGuessed || isWon || isLost}
                    onClick={() => guessLetter(letter)}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <p className="hangman-lives">
          Feil: {wrongGuesses.length} / {MAX_WRONG_GUESSES}
        </p>

        {isLost && (
          <div className="hangman-overlay">
            <p className="hangman-overlay__text">Å nei! Prøv igjen 🙈</p>
            <button className="hangman-overlay__button" onClick={resetGame}>
              Prøv igjen
            </button>
          </div>
        )}

        {isWon && (
          <div className="hangman-overlay hangman-overlay--win">
            <p className="hangman-overlay__text">Riktig! 🎉</p>
            <button className="hangman-overlay__button" onClick={() => navigate('/spill/5')}>
              Neste øvelse
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HangmanGame
