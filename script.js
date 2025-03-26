/* import { 
    analyzeText,
    saveCurrentTokenCountToDictionary,
    handleCurrentTokenDictionary,
    downloadCSVFromDictionary,
    downloadJSONFromDictionary,
} from './utils/frequency_dictionary_data_handling.js';

import Dictionary from './dictionary/dictionary.js';

import {
    buildWordFrequencyTable,
} from './utils/ui_utils.js';

import {
  createGrammarGuide
} from './ui_component/grammar_guide_ui.js';

import {
  grammar_guide_data
} from './ui_component/grammar_guide_data.js'; */

//todo: need to add node.js and server to write to dictionary file
//todo: add words to the json file from inputs
//todo: update json with frequency count words

//get main document elements
const titleInput = document.getElementById('title-input');
const freeTranslationTextArea = document.getElementById('free-translation-text-area');
const dictionaryTabContent = document.getElementById('dictionary-tab-content');

let inputText = document.getElementById('input-text');
let text = ``;
inputText.value = text;

//set up event listeners on load
document.addEventListener('DOMContentLoaded', () => {
/*     document.getElementById('word-frequency-output-button').addEventListener('click', async () => {
      buildWordFrequencyTable(frequency_translation_dictionary.currentTextTokensCount, dictionaryTabContent);
    });

    document.getElementById('grammar-guide-button').addEventListener('click', () => {
      dictionaryTabContent.innerHTML = '';
      dictionaryTabContent.appendChild(createGrammarGuide(grammar_guide_data));
    }); */

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

    //todo: complete the event listener for the input field
    document.getElementById('count-frequency-button').addEventListener('click', async (e) => {
        //table.dictionary.processText(inputText.value);
        let wordTokenFrequencyCount = await analyzeText(inputText.value);

        //pass the current text tokens and the dictionary to update the current text tokens

        saveCurrentTokenCountToDictionary(frequency_translation_dictionary.currentTextTokensCount, frequency_translation_dictionary.allSavedWords);
        buildWordFrequencyTable(frequency_translation_dictionary.currentTextTokensCount, dictionaryTabContent);
    });

    document.getElementById('download-json-button').addEventListener('click', () => {
      downloadJSONFromDictionary(frequency_translation_dictionary.allSavedWords, titleInput?.value);
    });

    document.getElementById('frequency-dictionary-button').addEventListener('click', async() => {
      buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
    });

    //todo: when this is uploaded it overwrites the whole dictionary, rather than current
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
          titleInput.value = dictionaryData.title?.value;
          freeTranslationTextArea.value = dictionaryData.freeTranslation;
          inputText.value = dictionaryData.inputText;
        };
      } else {
        const dictionary = {};

        reader.onload = function(e) {
          let text = reader.result;
          text = text.replace(/\\[nrt]/g, ''); // Remove escape characters
          text = text.replace(/\r/g, ''); // Remove carriage return characters
          const rows = text.split(/\n/); // Split by new line characters

          rows.forEach(row => {
            const [word, count, translation, hiragana_reading, category, reading, rendaku] = row.split(',');
            dictionary[word] = { count:count, translation: translation, hiragana_reading: hiragana_reading, category: category, reading: reading, rendaku: rendaku };
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

    //todo: create hover for token words
    document.getElementById('hover-content-button').addEventListener('click', () => {
      const hoverDiv = document.getElementById('hover-div');
      hoverDiv.classList.add('hover-div');

      Object.frequency_translation_dictionary.currentTextTokensCount.entries.forEach(([word, data]) => {
        const span = document.createElement('span');
        span.classList.add('word');
        span.innerText = word;
        span.addEventListener('hover', () => {
          hoverDiv.innerText = `Translation: ${data.translation}\nHiragana Reading: ${data.hiragana_reading}\nCategory: ${data.category}`;
        });
        span.addEventListener('mouseleave', () => {
          hoverDiv.remove();
        });
      });
      });
      //1 get tokens from text if not already done
      // make the table words into hover elements and highlight all instances of the word by adding a class to each span matching the word
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