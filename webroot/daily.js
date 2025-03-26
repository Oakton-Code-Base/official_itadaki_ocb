import handleDevvitMessage, {postWebViewMessage} from './devvittowebview.js';
import AppUtils from './apputils.js';
import switchPage, {reset, end} from './home.js';
/*
    backend of the daily words grabber
*/

//import {JishoUtil} from "../src/util/jishoUtil";

/*
    buttons
*/
const currWord = (
  document.querySelector('#currWord')
);

const skipBtn =  (
    document.querySelector('#skipBtn')
);

// indexLabel = (
//   document.querySelector('#amtLeft')
// );

const textarea = (
  document.querySelector('#textarea-daily')
);

const guess = (
  document.querySelector('#guessBtn')
);

let currIndex = 0;
let guessContent = "";
let words = null;
let wordsArray = null;
let correctlyGuessed = 0;
//wordsArray contains an array of each of the keys(japanese words) of the words Record

async function waitForWords() {
    // Wait until AppUtils.words is initialized
    while (!AppUtils.words) {
        await new Promise(resolve => setTimeout(resolve, 100));  // Wait 100ms and retry
    }

    // Once AppUtils.words is initialized, run the following code
    words = AppUtils.words;
    wordsArray = Object.keys(words);
    currWord.textContent = wordsArray[0];
    update(0);
}

// Call the waitForWords function to initiate the process
waitForWords();

export default words;

/*
    event listeners
*/

function guessed(){
  guessContent = (textarea.value).toLowerCase();

  if(words[wordsArray[currIndex]].includes(guessContent))
  {
    ++correctlyGuessed;
    ++currIndex;
  }

  if(currIndex >= wordsArray.length)
    {
      update(currIndex);
      endGame();
      return;
    }

  currWord.textContent = wordsArray[currIndex];
  update(currIndex);
  console.log(guessContent);
}

function skip(){
  ++currIndex;
  // currWord.value = words[currIndex];
  update(currIndex);
  if(currIndex >= wordsArray.length)
  {
    endGame();
    return;
  }
  currWord.textContent = wordsArray[currIndex];
}

function endGame(){
  switchPage('end');
  end(wordsArray.length, correctlyGuessed);
  return;
}

guess.addEventListener('click', ()=> {
    guessed();
});

textarea.addEventListener('keydown', (event) => {
  if (event.key==="Enter"){
    event.preventDefault();
    guessed();
  }
});

skipBtn.addEventListener('click', ()=> {
    //test();
    skip();
});

function update(currIndex){
  let value = document.getElementById("amtLeft");
  let correct = document.getElementById("amtCorrect");
  let result = (`${currIndex}/${wordsArray.length}`);
  let resultCorrect = (`${correctlyGuessed}/${wordsArray.length}`);

  value.textContent = result;
  correct.textContent = resultCorrect;
  textarea.value = "";
}

// function getWords(){
//   web
// }

/*
    jisho api
*/

/*let dailyWords = new Array(3);

class Daily { //define word
    constructor(english, word) {
        this.english = english;
        this.word = word;
    }

    getWord() {
        return this.word;
    }

    getEnglish() {
        return this.english;
    }
}*/

/*async function testRandomKanji() {
    const randomKanji = "食";

    try {
        const words = await JishoUtil.getWordsContaining(randomKanji);

        console.log('words containing kanji:');
        words.forEach(word => {
            console.log('English def: ${word.getEnglish()}');
            console.log('Japanese Word: ${word.getJapanese()}');
        });
    }
    catch (error) {
        console.log("error in testrandomkanji");
    }

}*/


    // JishoUtil Class
  /* class JishoUtil {
      // Fetch words containing a specific kanji from the Jisho API
      static async getWordsContaining(kanji) {
        const url = `https://jisho.org/api/v1/search/words?keyword=${kanji}`;

        try {
          const response = await fetch(url);
          const data = await response.json();

          // Check if data is returned
          if (data.data && data.data.length > 0) {
            return data.data;
          } else {
            console.log(`No words found containing the kanji "${kanji}"`);
            return [];
          }
        } catch (error) {
          console.error("Error fetching data from Jisho:", error);
          return [];
        }
      }
    }*/

    // Function to test fetching words for a specific kanji
    /*async function testRandomKanji() {
      const randomKanji = "食"; // You can change this to any kanji you want to test

      try {
        //const words = await JishoUtil.getWordsContaining(randomKanji);

        // Log the results to the console for testing
       // console.log(`Words containing "${randomKanji}":`);
        /*words.forEach(word => {
          console.log(`English Definition: ${word.senses.map(sense => sense.english_definitions).join(', ')}`);
          console.log(`Japanese Word: ${word.word || word.japanese[0].reading}`);
        });*/
        /*console.log(`Words containing "${kanji}":`);
        console.log('hi');
        console.log('word: {word}');*/
        /*words.forEach(word => {
          console.log(`English Definition: ${word.senses.map(sense => sense.english_definitions).join(', ')}`);
          console.log(`Japanese Word: ${word.word || word.japanese[0].reading}`);
        });*/
       /* console.log(`Words containing "${kanji}":`);
        console.log('hi');
        console.log('word: {word}');
      } catch (error) {
        console.log("Error in testRandomKanji:", error);
      }
    }*/




