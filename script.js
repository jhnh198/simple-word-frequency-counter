//import { translateText } from './utils/translation.js';
import { 
    analyzeText,
    handleDownloadCurrentTranslation,
    loadLocalStorage,
    saveCurrentTokenCountToDictionary,
    downloadFullDictionary,
    handleFrequencyDictionaryUpload,
    handleCurrentTokenDictionary,
    saveToCSV,
    saveToLocalStorage,
} from './utils/frequency_dictionary_data_handling.js';

import {
    buildWordFrequencyTable,
    showGrammarGuide,
} from './utils/ui_utils.js';

//get main document elements
const countFrequencyButton = document.getElementById('countFrequencyButton');
const downloadCurrentTranslationButton = document.getElementById('downloadCurrentTranslationButton');
const dictionaryTabContent = document.getElementById('dictionary-tab-content');

let text = `今見た笑顔が 最後の笑顔かもしれない
例えば別の人と 会話をする横顔も尊い一秒
羽よりも命が 軽くなる世界で
君は私の生きる意味 だから 出逢えた
切なさは この胸のAXIA
片道だけの 微熱で翔ける空
すぐ消える 無慈悲な虹になる
悠遠の君が
ダイスキでダイキライ
一人で産まれて 誰もが一人で死にゆく
それでも私達は 独りきりじゃ生きられない
慕い合う周波数
疼く傷口へと 愛しさがしみる
言えないままの一言が 瞳溢れた
涙さえ 明日照らすAXIA
儚い粒子で 繋げてゆく鼓動
陽炎に 浮かぶ夢のように
永遠のフリをした薄情な情熱
時の舟に乗って 眠る日が来ても
たった一人思う光 ずっと絶やさない
もう君を思い出したりしない
だって一度も忘れることないから
切なさは この胸のAXIA
片道だけの 微熱で駆ける空
私から愛を盗む君が 絶望するくらい
報われなくても（遙か遠くても）
ダイスキでダイキライ
ダイスキでダイキライ
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
      console.log(frequency_translation_dictionary);
      saveToLocalStorage(frequency_translation_dictionary.allSavedWords);
    });

    document.getElementById('frequency-dictionary-button').addEventListener('click', async() => {
        buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
    });

    document.getElementById('frequency-dictionary-upload').addEventListener('change', (e) => {
        frequency_translation_dictionary.allSavedWords = handleFrequencyDictionaryUpload(e.target.files[0]);
        buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
    });

    document.getElementById('downloadFullTranslationFrequencyDictionaryCSVButton').addEventListener('click', () => {
        saveToCSV(frequency_translation_dictionary.allSavedWords);
    });

    document.getElementById(`downloadCurrentTranslationButton`).addEventListener('click', () => {
        handleDownloadCurrentTranslation(frequency_translation_dictionary.currentTextTokensCount);
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