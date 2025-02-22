import { 
    analyzeText,
    loadLocalStorage,
    saveCurrentTokenCountToDictionary,
    handleCurrentTokenDictionary,
    downloadCSVFromDictionary,
    downloadJSONFromDictionary,
} from './utils/frequency_dictionary_data_handling.js';

import {
    buildWordFrequencyTable,
} from './utils/ui_utils.js';

import {
  createGrammarGuide
} from './ui_component/grammar_guide_ui.js';

import {
  grammar_guide_data
} from './ui_component/grammar_guide_data.js';

//get main document elements
const titleInput = document.getElementById('title-input');
const freeTranslationTextArea = document.getElementById('free-translation-text-area');
const dictionaryTabContent = document.getElementById('dictionary-tab-content');

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

let inputText = document.getElementById('input-text');
inputText.value = text;

let frequency_translation_dictionary = {currentTextTokensCount: {}, allSavedWords: loadLocalStorage()};
if(frequency_translation_dictionary.allSavedWords.entries !== 0) {
  buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
}

//todo: change to ignore count and only update the new word
export function updateInputChangeValue(word, value, component){
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
    document.getElementById('word-frequency-output-button').addEventListener('click', async () => {
      buildWordFrequencyTable(frequency_translation_dictionary.currentTextTokensCount, dictionaryTabContent);
    });

    document.getElementById('grammar-guide-button').addEventListener('click', () => {
      dictionaryTabContent.innerHTML = '';
      dictionaryTabContent.appendChild(createGrammarGuide(grammar_guide_data));
    });

    document.getElementById('hide-previous-translations-checkbox').addEventListener('change', (e) => {
      if (e.target.value === 'on') {
        document.querySelectorAll('input').forEach(container => {
          container.value = '';
        })
        Object.entries(frequency_translation_dictionary.currentTextTokensCount).forEach(([word]) => {
          const input = document.getElementById(word);
          input.value = frequency_translation_dictionary[word]?.translation || '';
        });
      }
    });

    document.getElementById('count-frequency-button').addEventListener('click', async (e) => {
        let wordTokenFrequencyCount = await analyzeText(inputText.value);
        frequency_translation_dictionary.currentTextTokensCount = handleCurrentTokenDictionary(wordTokenFrequencyCount, frequency_translation_dictionary.allSavedWords);
        saveCurrentTokenCountToDictionary(frequency_translation_dictionary.currentTextTokensCount, frequency_translation_dictionary.allSavedWords);
        buildWordFrequencyTable(frequency_translation_dictionary.currentTextTokensCount, dictionaryTabContent);
    });

    document.getElementById('download-json-button').addEventListener('click', () => {
      downloadJSONFromDictionary(frequency_translation_dictionary.allSavedWords, titleInput?.value);
    });

    document.getElementById('frequency-dictionary-button').addEventListener('click', async() => {
      buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
    });

    document.getElementById('frequency-dictionary-upload').addEventListener('change', (e) => {
      const reader = new FileReader();
      const fileType = e.target.files[0].type;
      reader.readAsText(e.target.files[0]);

      //determine function to use based on file type
      if(fileType == 'application/json' || fileType === 'text/json') {
        reader.onload = function(e) {
          const text = reader.result;
          const dictionaryData = JSON.parse(text);
          frequency_translation_dictionary.allSavedWords = dictionaryData.allSavedWords;
          buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
          titleTextContent.value = dictionaryData.title;
          translationInputField.value = dictionaryData.freeTranslation;
          inputText.value = dictionaryData.inputText;
        };
      } else {
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
      }
    });

    document.getElementById(`download-current-translation-button`).addEventListener('click', () => {
      downloadCSVFromDictionary(frequency_translation_dictionary.currentTextTokensCount, titleInput?.value);
    });
    
    document.getElementById('download-full-dictionary-button').addEventListener('click', () => {
      downloadCSVFromDictionary(frequency_translation_dictionary.allSavedWords);
    });

    //translation event listeners
    document.getElementById('translate-button').addEventListener('click', () => {
      translateText(inputText.value, "EN");
    });

    document.getElementById('clear-input-button').addEventListener('click', () => {
      inputText.value = '';
      freeTranslationTextArea.value = '';
      titleInput.value = '';
    });

    document.getElementById('hover-content-button').addEventListener('click', () => {
      //1 get tokens from text if not already done
      // make the table element hoverable and highlight all instances of the word by adding a class to each span matching the word
      //2 replace all tokens with span tags
      //3 add event listeners to each span tag
      //4 create a hover div
      //5 add the hover div to the body
      //6 add event listeners to the hover div
      //7 remove the hover div when mouse leaves
      //8 add the translation to the hover div
      //9 add the hiragana reading to the hover div
      //10 add the category to the hover div
    });
});