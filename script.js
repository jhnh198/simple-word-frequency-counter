//import { translateText } from './utils/translation.js';
import { 
    analyzeText,
    handleDownloadCurrentTranslation,
    loadLocalStorage,
    saveCurrentTokensToDictionary
} from './utils/frequency_dictionary_data_handling.js';

import {
    buildWordFrequencyTable,
} from './utils/ui_utils.js';

import { 
    saveToLocalStorage,
    downloadFullDictionary,
    handleFrequencyDictionaryUpload
} from './utils/frequency_dictionary_data_handling.js';

//todo: check if there is local storage then load or use default
let frequency_translation_dictionary = loadLocalStorage();

let text = `
青い空が雲に隠れ
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

//get main document elements
const countFrequencyButton = document.getElementById('countFrequencyButton');
const downloadCurrentTranslationButton = document.getElementById('downloadCurrentTranslationButton');

//set up event listeners on load
document.addEventListener('DOMContentLoaded', () => {
    //error handling event listeners
    document.getElementById('inputText').addEventListener('input', () => {
        countFrequencyButton.classList.remove('error');
    });

    //ui-utils event listeners
    document.getElementById('word-frequency-output-button').addEventListener('click', async () => {
        buildWordFrequencyTable(frequency_translation_dictionary.currentTextTokensCount);
    });

    document.getElementById('frequency-dictionary-button').addEventListener('click', () => {
        buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords);
    });

    document.getElementById('grammar-guide-button').addEventListener('click', () => {
        showGrammarGuide();
    });

    document.getElementById('hidePreviousTranslationsCheckbox').addEventListener('change', () => {
        handleHidePreviousTranslations(hidePreviousTranslationsCheckbox, wordTokenFrequencyCount)
    });

    //frequency dictionary data handler event listeners
    document.getElementById('countFrequencyButton').addEventListener('click', async () => {
        frequency_translation_dictionary.currentTextTokensCount = await analyzeText(inputText.value, countFrequencyButton, downloadCurrentTranslationButton );

        buildWordFrequencyTable(frequency_translation_dictionary.currentTextTokensCount);
        frequency_translation_dictionary.allSavedWords = saveCurrentTokensToDictionary(frequency_translation_dictionary.currentTextTokensCount, frequency_translation_dictionary.allSavedWords);
    });

    document.getElementById('frequency-dictionary-upload').addEventListener('change', (e) => {
        handleFrequencyDictionaryUpload(e.target.files[0]);

        buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords);
    });

    document.getElementById('downloadFullTranslationFrequencyDictionaryCSVButton').addEventListener('click', () => {
        saveToCSV();
    });

    document.getElementById(`downloadCurrentTranslationButton`).addEventListener('click', () => {
        handleDownloadCurrentTranslation();
    });
    
    //this saves current entries to local storage for the frequency translation dictionary
    document.getElementById('saveTranslationLocalButton').addEventListener('click', () => { 
        console.log(frequency_translation_dictionary.allSavedWords);
        frequency_translation_dictionary.allSavedWords = 
        saveCurrentTokensToDictionary(
            frequency_translation_dictionary.currentTextTokensCount,
            frequency_translation_dictionary.allSavedWords
        );

        console.log(frequency_translation_dictionary.allSavedWords);
        buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords);
    });
    
    document.getElementById('downloadFullTranslationFrequencyDictionaryButton').addEventListener('click', () => {
        downloadFullDictionary();
    });

    //translation event listeners
    document.getElementById('translate-button').addEventListener('click', () => {
        const text = document.getElementById('inputText').value;
        translateText(text, "EN");
    });
});