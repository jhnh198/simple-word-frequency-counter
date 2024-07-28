//import { translateText } from './utils/translation.js';
import { 
    analyzeText,
    handleDownloadCurrentTranslation,
    loadLocalStorage,
    saveCurrentTokensToDictionary,
    downloadFullDictionary,
    handleFrequencyDictionaryUpload,
    handleCurrentTokenDictionary,
    saveToCSV
} from './utils/frequency_dictionary_data_handling.js';

import {
    buildWordFrequencyTable,
    showGrammarGuide,
} from './utils/ui_utils.js';

//get main document elements
const countFrequencyButton = document.getElementById('countFrequencyButton');
const downloadCurrentTranslationButton = document.getElementById('downloadCurrentTranslationButton');
const dictionaryTabContent = document.getElementById('dictionary-tab-content');

let text = `青い空が雲に隠れ
蕾たちが枯れ落ちても
ちいさな泉があるなら
何度でも 始められるわ

怖がらずに呼び続けて
私たちを信じていて
冷たいビルの谷間に
聞こえてる あなたの声が

悲しむだけの涙には
未来を変える力さえないの
けれど あなたの傷ついた心を
軽くしてあげられるなら
For you

遠くから呼び続けて
苦しくても叫んでいて
あなたの声を頼りに
迷わずに そこへ行くから

あきらめずに教えに来て
私たちを信じていて
争うことのすべてが
`;
let inputText = document.getElementById('inputText');
inputText.value = text;

let frequency_translation_dictionary = loadLocalStorage();
if(frequency_translation_dictionary.allSavedWords.entries !== 0) {
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
    });

    document.getElementById('frequency-dictionary-button').addEventListener('click', async() => {
      if(inputText.value === '') {
        countFrequencyButton.classList.add('error');
        return;
      }

      if(frequency_translation_dictionary.allSavedWords === undefined || frequency_translation_dictionary.currentTextTokensCount === undefined) {
        let wordTokenFrequencyCount = await analyzeText(inputText.value, countFrequencyButton, downloadCurrentTranslationButton );
        frequency_translation_dictionary.allSavedWords = handleCurrentTokenDictionary(wordTokenFrequencyCount, frequency_translation_dictionary.allSavedWords);
      }

      console.log(frequency_translation_dictionary.allSavedWords);
      buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
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

        buildWordFrequencyTable(frequency_translation_dictionary.currentTextTokensCount, dictionaryTabContent);
    });

    document.getElementById('frequency-dictionary-upload').addEventListener('change', (e) => {
        handleFrequencyDictionaryUpload(e.target.files[0]);

        buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
    });

    document.getElementById('downloadFullTranslationFrequencyDictionaryCSVButton').addEventListener('click', () => {
        saveToCSV(frequency_translation_dictionary.allSavedWords);
    });

    document.getElementById(`downloadCurrentTranslationButton`).addEventListener('click', () => {
        handleDownloadCurrentTranslation(frequency_translation_dictionary.currentTextTokensCount);
    });
    
    //todo: save translation local runs but does not produce correct output
    //this saves current entries to local storage for the frequency translation dictionary
    document.getElementById('saveTranslationLocalButton').addEventListener('click', () => { 
      if(inputText.value === '') {
        countFrequencyButton.classList.add('error');
        return;
      }
      if (frequency_translation_dictionary.allSavedWords === undefined) {
        frequency_translation_dictionary.currentTextTokensCount = analyzeText(inputText.value, countFrequencyButton, downloadCurrentTranslationButton)
      }

      //todo: better way to handle this without saveCurrentTokensToDictionary
      frequency_translation_dictionary.allSavedWords = 
      saveCurrentTokensToDictionary(
          frequency_translation_dictionary.currentTextTokensCount,
          frequency_translation_dictionary.allSavedWords
      );

      buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
      localStorage.setItem('dictionary_data', JSON.stringify(frequency_translation_dictionary)); // Save to local storage
      console.log('Saved to Local Storage');
    });

    
    document.getElementById('downloadFullTranslationFrequencyDictionaryButton').addEventListener('click', () => {
        downloadFullDictionary(frequency_translation_dictionary.allSavedWords);
    });

    //translation event listeners
    document.getElementById('translate-button').addEventListener('click', () => {
        const text = document.getElementById('inputText').value;
        translateText(text, "EN");
    });
});