import "./App.css";
import logo from "./imgs/POOKEX.png";

import Board from "./components/board/Board";
import Keyboard from "./components/keyboard/Keyboard";
import GameOver from "./components/gameStatus/GameOver";

import React, { createContext, useEffect, useState } from "react";
import { CreateBoard, getPokemonImg } from "./Pookex";
import { pokeArr, pokeWord } from "./utils/Pokemon";

export const AppContext = createContext();

function App() {
  const [currAttempt, setCurrAttempt] = useState({
    attempt: 0,
    letterPos: 0,
    isButtonClicked: false,
    temp: 0,
  });
  const [wordSet] = useState(new Set(pokeArr));
  const [correctWord] = useState(pokeWord().toUpperCase());
  const [board, setBoard] = useState(CreateBoard(correctWord));
  const [imgPokemon, setImgPokemon] = useState("");
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  useEffect(() => {
    console.log(correctWord);
    getPokemonImg(correctWord).then((url) => setImgPokemon(url));
  }, [correctWord]);

  const onSelectLetter = (keyVal) => {
    const newBoard = [...board];
    if (currAttempt.isButtonClicked) {
      newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal;
      setBoard(newBoard);
      setCurrAttempt({
        ...currAttempt,
        letterPos: currAttempt.letterPos + 1,
        isButtonClicked: false,
      });
    } else {
      if (currAttempt.letterPos === correctWord.length) return;
      newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal;
      setBoard(newBoard);
      setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1 });
    }
  };

  const onEnter = () => {
    if (board[currAttempt.attempt].includes("")) return;
    let currWord = "";
    for (let i = 0; i < correctWord.length; i++) {
      currWord += board[currAttempt.attempt][i];
    }

    if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
    } else {
      alert("Pokemon Not Found!");
      setCurrAttempt({
        attempt: currAttempt.attempt,
        letterPos: correctWord.length,
      });
    }

    if (currWord === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }

    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
    }
  };

  const onDelete = () => {
    const newBoard = [...board];
    if (currAttempt.isButtonClicked) {
      newBoard[currAttempt.attempt][currAttempt.letterPos] = "";
      setBoard(newBoard);

      setCurrAttempt({
        ...currAttempt,
        letterPos: currAttempt.letterPos,
        isButtonClicked: false,
      });
    }
    if (currAttempt.letterPos === 0) {
      newBoard[currAttempt.attempt][currAttempt.letterPos] = "";
      setBoard(newBoard);
      setCurrAttempt({
        ...currAttempt,
        letterPos: currAttempt.letterPos,
      });
      return;
    } else if (
      currAttempt.letterPos === correctWord.length ||
      board[currAttempt.attempt][currAttempt.letterPos] === ""
    ) {
      newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
      setBoard(newBoard);
      setCurrAttempt({
        ...currAttempt,
        letterPos: currAttempt.letterPos - 1,
      });
    } else {
      newBoard[currAttempt.attempt][currAttempt.letterPos] = "";
      setBoard(newBoard);
      setCurrAttempt({
        ...currAttempt,
        letterPos: currAttempt.letterPos,
      });
    }
  };

  const keyboardArrowRight = () => {
    if (currAttempt.letterPos < correctWord.length - 1) {
      setCurrAttempt({
        ...currAttempt,
        letterPos: currAttempt.letterPos + 1,
      });
    }
  };

  const keyboardArrowLeft = () => {
    if (currAttempt.letterPos > 0) {
      setCurrAttempt({
        ...currAttempt,
        letterPos: currAttempt.letterPos - 1,
      });
    }
  };

  return (
    <div className="app__container">
      <nav>
        <img src={logo} alt="" border="0" style={{ height: "60px" }} />
      </nav>
      <div></div>
      <AppContext.Provider
        value={{
          onSelectLetter,
          onDelete,
          onEnter,
          board,
          setBoard,
          currAttempt,
          setCurrAttempt,
          correctWord,
          setDisabledLetters,
          disabledLetters,
          setGameOver,
          gameOver,
          imgPokemon,
          keyboardArrowRight,
          keyboardArrowLeft,
        }}
      >
        <div className="game">
          {gameOver.gameOver && <GameOver />}
          <Board correctPoke={correctWord} />
          {!gameOver.gameOver && <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
