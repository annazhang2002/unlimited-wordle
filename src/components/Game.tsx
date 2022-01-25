import Axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "./Button/Button";
import Input from "./Input/Input";
import { MasterContainer, WordBox, TitleText, NavContainer, GridContainer, ReplayContainer } from "./style";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const DATAMUSE_SP_URL = "https://api.datamuse.com/words?sp=";
const DICTIONARY_URL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
const DICTIONARY_KEY_URL = "?key=5c07b145-484a-4d9d-8678-ff785cd59333"
const COLORS = {
  GREEN: "green",
  YELLOW: "yellow",
  WHITE: "white",
};

interface CharacterBlock {
  color: string;
  letter: string;
}

const Game = () => {
  const [goalWord, setGoalWord] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [inputs, setInputs] = useState<CharacterBlock[][]>([]);
  const [showPlayAgain, setShowPlayAgain] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        enterWord();
      }
    })
  }, [])

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

  const enterWord = async () => {
    // if (input.length !== 5 || !/^[a-zA-Z]+$/.test(input)) return;
    if (input.length !== 5) return;
    // event.preventDefault();
    console.log(`SUBMITTED GUESS: ${input}`);

    // const res = await checkWord(input);
    // if (!res) {
    //   setInput("");
    //   return
    // }

    const colorPattern: CharacterBlock[] = [];

    var goalLetterBank = ""
    var inputLetterBank = ""
    // find the green letters
    for (let i = 0; i < 5; i++) {
      const currChar = input.charAt(i);
      colorPattern.push({
        letter: currChar,
        color: COLORS.WHITE,
      });
      if (currChar === goalWord.charAt(i)) {
        colorPattern[i].color = COLORS.GREEN
        inputLetterBank += " "
        goalLetterBank += " "
      } else {
        inputLetterBank += currChar
        goalLetterBank += goalWord.charAt(i)
      }
    }
    console.log(goalLetterBank)
    console.log(inputLetterBank)

    // add yellow letters
    for (let i = 0; i < inputLetterBank.length; i++) {
      const currChar = inputLetterBank.charAt(i);
      const goalWordI = goalLetterBank.indexOf(currChar);
      if (currChar != ' ' && goalWordI !== -1) {
        colorPattern[i].color = COLORS.YELLOW
        goalLetterBank = goalLetterBank.substring(0, goalWordI) + " " + goalLetterBank.substring(goalWordI + 1)
      }
    }
    console.log(colorPattern)

    // compare input to goal
    // for (let i = 0; i < 5; i++) {
    //   const currChar = input.charAt(i);
    //   const color = currChar === goalWord.charAt(i) ? COLORS.GREEN : goalWord.indexOf(currChar) !== -1 ? COLORS.YELLOW : COLORS.WHITE;
    //   colorPattern.push({
    //     letter: currChar,
    //     color,
    //   });
    // }

    if (input === goalWord) {
      setShowPlayAgain(true);
    }

    setInputs([...inputs, colorPattern]);
    setInput("");
    console.log(colorPattern);
  };

  const checkWord = async (word: string): Promise<boolean> => {
    try {
      const res: any = await Axios.get(DICTIONARY_URL + word + DICTIONARY_KEY_URL)
      const isWord = res.data.length > 0 && typeof res.data[0] == 'object';
      !isWord && console.log(`WORD ${word} DOESN'T EXIST`);
      isWord && console.log(`WORD ${word} EXISTS`);
      return isWord;

    } catch (err) {
      console.log(err);
      return false
    }
  };

  // get wordle goal word
  useEffect(() => {
    !showPlayAgain && getGoalWord();
  }, [showPlayAgain]);

  return (
    <MasterContainer>
      <NavContainer>
        <TitleText>WORDLE V2</TitleText>
      </NavContainer>

      <GridContainer>
        {inputs.map((colorPattern: CharacterBlock[], index) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
            key={index}
          >
            {colorPattern.map((letter: CharacterBlock) => (
              <WordBox>
                <div style={{ color: letter.color }}>{letter.letter.toUpperCase()}</div>
              </WordBox>
            ))}
          </div>
        ))}
      </GridContainer>

      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        placeholder="Enter word"
        width="100%"
      />

      <Button
        onClick={() => {
          enterWord();
        }}
      >
        Submit
      </Button>

      {showPlayAgain && (
        <ReplayContainer
          onClick={() => {
            onReset();
          }}
        >
          Play Again
        </ReplayContainer>
      )}
    </MasterContainer>
  );
};

export default Game;
