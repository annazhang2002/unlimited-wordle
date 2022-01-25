import React, { useState, useEffect } from "react";
import Axios from "axios";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const DATAMUSE_SP_URL = "https://api.datamuse.com/words?sp=";
const DICTIONARY_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const COLORS = {
  GREEN: "green",
  YELLOW: "yellow",
  GRAY: "gray",
};

const Game = () => {
  const [goalWord, setGoalWord] = useState("");
  const [input, setInput] = useState("");
  const [inputs, setInputs] = useState<any[]>([]);
  const [showPlayAgain, setShowPlayAgain] = useState(false);

  const getGoalWord = () => {
    onReset();
    let pattern = "";
    const index = Math.floor(Math.random() * 5);
    const letter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    for (let i = 0; i < 5; i++) {
      pattern += i === index ? letter : "?";
    }

    Axios.get(DATAMUSE_SP_URL + pattern)
      .then((response) => {
        const dataArr = response.data;
        const word = dataArr[Math.floor(Math.random() * dataArr.length)].word;
        console.log(`GOAL WORD: ${word}`);
        setGoalWord(word);
        // !checkWord(word) && setGoalWord(word)
      })
      .catch((err) => console.log(err));
  };

  const onReset = () => {
    setInput("");
    setGoalWord("");
    setInputs([]);
    setShowPlayAgain(false);
  };

  const enterWord = (event: any) => {
    event.preventDefault();
    console.log(`SUBMITTED GUESS: ${input}`);
    const colorPattern: any[] = [];

    // compare input to goal
    for (let i = 0; i < 5; i++) {
      const currChar = input.charAt(i);
      const color = currChar === goalWord.charAt(i) ? COLORS.GREEN : goalWord.indexOf(currChar) !== -1 ? COLORS.YELLOW : COLORS.GRAY;
      colorPattern.push({
        letter: currChar,
        color,
      });
    }

    if (input === goalWord) {
      setShowPlayAgain(true);
    }

    setInputs([...inputs, colorPattern]);
    setInput("");
    console.log(colorPattern);
  };

  const checkWord = (word: string) => {
    Axios.get(DICTIONARY_URL + word)
      .then((response) => {
        const error = response.data.title != null;
        error && console.log(`WORD ${word} DOESN'T EXIST`);
        !error && console.log(`WORD ${word} EXISTS`);
        return error;
      })
      .catch((err) => console.log(err));
  };

  // get wordle goal word
  useEffect(() => {
    !showPlayAgain && getGoalWord();
  }, [showPlayAgain]);

  return (
    <div
      style={{
        backgroundColor: "#282a35",
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "space-between",
        alignContent: "center",
        flexDirection: "column",
      }}
    >
      {inputs.map((colorPattern: any, index) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
          key={index}
        >
          {colorPattern.map((letter: any) => (
            <h2 style={{ color: letter.color }}>{letter.letter}</h2>
          ))}
        </div>
      ))}
      <form onSubmit={enterWord}>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
      </form>
      {showPlayAgain && <button onClick={onReset}>Play Again</button>}
    </div>
  );
};

export default Game;
