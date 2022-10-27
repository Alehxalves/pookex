import "./letter.css";
import "./board.css";

import React, { useContext, useEffect } from "react";

import { AppContext } from "../../App";

const Letter = ({ letterPos, attemptVal }) => {
  const letters = document.getElementsByClassName(`letter${attemptVal}`);
  const {
    board,
    correctWord,
    currAttempt,
    setDisabledLetters,
    setCurrAttempt,
    gameOver,
  } = useContext(AppContext);
  const letter = board[attemptVal][letterPos];

  const correct = correctWord[letterPos] === letter;
  const almost = !correct && letter !== "" && correctWord.includes(letter);

  const letterState =
    currAttempt.attempt > attemptVal &&
    (correct ? "correct" : almost ? "almost" : "error");

  useEffect(() => {
    if (letter !== "" && !correct && !almost) {
      setDisabledLetters((prev) => [...prev, letter]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currAttempt.attempt]);

  const handleClick = () => {
    if (currAttempt.attempt === attemptVal) {
      setCurrAttempt({
        ...currAttempt,
        letterPos: letterPos,
        isButtonClicked: true,
      });
    }
  };

  const NextTypingLetter = () => {
    if (gameOver.gameOver === true) {
      for (let i = 0; i < letters.length; i++) {
        letters[i].style["border-bottom"] = "0";
      }
      return;
    }

    for (let i = 0; i < letters.length; i++) {
      if (
        i === currAttempt.letterPos &&
        board[currAttempt.attempt][currAttempt.letterPos] === "" &&
        currAttempt.attempt === attemptVal
      ) {
        letters[i].style["border-bottom"] = "8px solid #CC3636";
      } else if (
        i === currAttempt.letterPos &&
        board[currAttempt.attempt][currAttempt.letterPos] !== "" &&
        currAttempt.letterPos < correctWord.length &&
        currAttempt.attempt === attemptVal
      ) {
        letters[i].style["border-bottom"] = "8px solid #CC3636";
      } else {
        letters[i].style["border-bottom"] = "0";
      }
    }
  };

  return (
    <button
      className={`letter${attemptVal}`}
      id={letterState}
      onClick={() => handleClick()}
    >
      {letter}
      {NextTypingLetter()}
    </button>
  );
};

export default Letter;
