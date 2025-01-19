import { 
    analyzeText,
    loadLocalStorage,
    saveCurrentTokenCountToDictionary,
    handleCurrentTokenDictionary,
    saveToLocalStorage,
    downloadCSVFromDictionary,
} from './utils/frequency_dictionary_data_handling.js';

import {
    buildWordFrequencyTable,
    showGrammarGuide,
} from './utils/ui_utils.js';

//get main document elements
const countFrequencyButton = document.getElementById('countFrequencyButton');
const downloadCurrentTranslationButton = document.getElementById('downloadCurrentTranslationButton');
const dictionaryTabContent = document.getElementById('dictionary-tab-content');
const titleTextContent = document.getElementById('title');

let text = `神様に恋をしてた頃は
こんな別れが来るとは思ってなかったよ
もう二度と触れられないなら
せめて最後に　もう一度抱きしめて欲しかったよ

It's long long good-bye...

さよなら　さよなら　何度だって
自分に　無上に　言い聞かせて
手を振るのは優しさだよね？
今　強さが欲しい

貴方に出会い　STAR輝いて　アタシが生まれて
愛すればこそ　iあればこそ
希望のない　奇跡を待って　どうなるの？
涙に滲む　惑星の瞬きは　gone...

忘れない　貴方の温もりも
その優しさも　全て包んでくれた両手も
It's long long good-bye...

さよなら　さよなら　愛しい人
貴方が　いたから　歩いてこれた
ひとりなんかじゃなかったよね？
今　答えが欲しい

燃える様な流星　捕まえて　火を灯して
愛していたい　愛されてたい
冷えたカラダひとつで　世界は　どうなるの？
張り続けてた　虚勢が溶けてく　long for...

どうしてなの？　涙溢れて　止められない

貴方に出逢い　STAR輝いて　アタシが生まれて
愛すればこそ　iあればこそ
希望のない　奇跡を待って　どうなるの？
涙に滲む　惑星の瞬きは　gone...

もし生まれ変わって　また巡り会えるなら
その時もきっと　アタシを見つけ出して
もう二度と離さないで　捕まえてて
ひとりじゃないと　囁いてほしい　planet...
`;

let inputText = document.getElementById('inputText');
inputText.value = text;

let frequency_translation_dictionary = {currentTextTokensCount: {}, allSavedWords: loadLocalStorage()};
if(frequency_translation_dictionary.allSavedWords.entries !== 0) {
  buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
}

//todo: change to ignore count and only update the new word
export function updateInputChangeValue(word, value, component){
  console.log('update input change value');
  if(component === 'translation'){
    frequency_translation_dictionary.currentTextTokensCount[word].translation = value;
  } else if(component === 'hiragana_reading'){
    frequency_translation_dictionary.currentTextTokensCount[word].hiragana_reading = value;
  }
  frequency_translation_dictionary.allSavedWords[word] = frequency_translation_dictionary.currentTextTokensCount[word];
}

export function updateCategoryChangeValue(word, category){
  frequency_translation_dictionary.allSavedWords[word].category = category;  
}

export function addWordToDictionaryFromNewRow(newWord){
  frequency_translation_dictionary.allSavedWords[newWord.word] = newWord;
  buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
}

//set up event listeners on load
document.addEventListener('DOMContentLoaded', () => {
    //error handling event listeners
    document.getElementById('inputText').addEventListener('input', () => {
        countFrequencyButton.classList.remove('error');
    });

    //ui-utils event listeners
    document.getElementById('word-frequency-output-button').addEventListener('click', async () => {
      buildWordFrequencyTable(frequency_translation_dictionary.currentTextTokensCount, dictionaryTabContent);
      makeElementFromToken(frequency_translation_dictionary.currentTextTokensCount);

      //take the input text field, replace all tokens with hoverable spans
      // const text = inputText.value;
      // const tokens = text.split(' ');
      // const newTokens = tokens.map(token => {
      //   const span = document.createElement('span');
      //   span.classList.add('token');
      //   span.innerText = token;
      //   return span;
      // });
    });

    document.getElementById('grammar-guide-button').addEventListener('click', () => {
        showGrammarGuide(dictionaryTabContent);
    });

    document.getElementById('hidePreviousTranslationsCheckbox').addEventListener('change', () => {
        handleHidePreviousTranslations(hidePreviousTranslationsCheckbox, wordTokenFrequencyCount)
    });

    //frequency dictionary data handler event listeners
    document.getElementById('countFrequencyButton').addEventListener('click', async () => {
        let wordTokenFrequencyCount = await analyzeText(inputText.value, countFrequencyButton, downloadCurrentTranslationButton );
        frequency_translation_dictionary.currentTextTokensCount = handleCurrentTokenDictionary(wordTokenFrequencyCount, frequency_translation_dictionary.allSavedWords);
        saveCurrentTokenCountToDictionary(frequency_translation_dictionary.currentTextTokensCount, frequency_translation_dictionary.allSavedWords);
        buildWordFrequencyTable(frequency_translation_dictionary.currentTextTokensCount, dictionaryTabContent);
    });

    //this saves current entries to local storage for the frequency translation dictionary
    document.getElementById('saveTranslationLocalButton').addEventListener('click', async () => { 
      saveToLocalStorage(frequency_translation_dictionary.allSavedWords);
    });

    document.getElementById('frequency-dictionary-button').addEventListener('click', async() => {
        buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
    });

    document.getElementById('frequency-dictionary-upload').addEventListener('change', (e) => {
      const reader = new FileReader();
      reader.readAsText(e.target.files[0]);
      const dictionary = {};

      reader.onload = function(e) {
        const text = reader.result;
        const rows = text.split('\n');

        rows.forEach(row => {
          const [word, count, translation, hiragana_reading, category] = row.split(',');
          dictionary[word] = { count:count, translation: translation, hiragana_reading: hiragana_reading, category: category };
        });
        buildWordFrequencyTable(dictionary, dictionaryTabContent);
      };
      frequency_translation_dictionary.allSavedWords = dictionary;
      frequency_translation_dictionary.currentTextTokensCount = dictionary;
    });

    document.getElementById(`downloadCurrentTranslationButton`).addEventListener('click', () => {
      downloadCSVFromDictionary(frequency_translation_dictionary.currentTextTokensCount, titleTextContent?.value);
    });
    
    document.getElementById('downloadFullTranslationFrequencyDictionaryButton').addEventListener('click', () => {
      downloadCSVFromDictionary(frequency_translation_dictionary.allSavedWords);
    });

    //translation event listeners
    document.getElementById('translate-button').addEventListener('click', () => {
        const text = document.getElementById('inputText').value;
        translateText(text, "EN");
    });
});