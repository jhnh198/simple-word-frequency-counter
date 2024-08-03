//import { translateText } from './utils/translation.js';
import { 
    analyzeText,
    handleDownloadCurrentTranslation,
    loadLocalStorage,
    saveCurrentTokenCountToDictionary,
    saveTranslationInputToDictionary,
    downloadFullDictionary,
    handleFrequencyDictionaryUpload,
    handleCurrentTokenDictionary,
    saveToCSV,
    saveToLocalStorage
} from './utils/frequency_dictionary_data_handling.js';

import {
    buildWordFrequencyTable,
    showGrammarGuide,
} from './utils/ui_utils.js';

//get main document elements
const countFrequencyButton = document.getElementById('countFrequencyButton');
const downloadCurrentTranslationButton = document.getElementById('downloadCurrentTranslationButton');
const dictionaryTabContent = document.getElementById('dictionary-tab-content');

let text = `ラジ： 安藤さん、ちょっといいですか
安藤：はい、何なんですか。
ラジ ：今,商品を片付けています。ごみを捨すてたいんですが、この オレンジの 袋に 入れてもいいですか
安 藤：ああ、それは 燃えないごみの 袋なので、だめです。緑のごみ 袋を 使つかってください。
ラジ：え？燃えないごみ？
安藤：この 会社ではごみの出し方があります。教えてあげますね。生ごみ、紙などのごみは 燃えるごみです。緑のごみ袋に入れてから捨てます。瓶や缶などは燃えないごみです。オレンジの袋に入れます。粗大ごみなら、電話で申し込",んで,ごみを取りに来てもらいます。
ラジ ：粗大ごみ？
安藤：自転車とか、椅子とか
ラジ ：そうなんですね。
安藤：それから、ごみを 出す曜日も違がいますよ。燃えるごみは 火曜日、木曜日、金曜日の 朝に 出だしてくださ。		燃えないごみは 月曜日と 水曜日の 朝です。
ここの紙に 書いてあります。
ラジ ：わかりました。ありがとうございます. すみませんが、ごみを 置く場所を 教えていただけませんか。
安藤：ごみ置き場は このビルの 横です
`;
let inputText = document.getElementById('inputText');
inputText.value = text;

let frequency_translation_dictionary = loadLocalStorage();
if(frequency_translation_dictionary.allSavedWords.entries !== 0) {
  console.log(frequency_translation_dictionary);
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

    //todo: save translation local runs but does not produce correct output. the word count isn't being handled and all saved words is not being updated to build the table
    //this saves current entries to local storage for the frequency translation dictionary
    document.getElementById('saveTranslationLocalButton').addEventListener('click', async () => { 
      //check for input and current translation
      //if current translation, merge with all saved words
      //if no current translation, save all words
    });

    document.getElementById('frequency-dictionary-button').addEventListener('click', async() => {
        buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
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
    
    document.getElementById('downloadFullTranslationFrequencyDictionaryButton').addEventListener('click', () => {
        downloadFullDictionary(frequency_translation_dictionary.allSavedWords);
    });

    //translation event listeners
    document.getElementById('translate-button').addEventListener('click', () => {
        const text = document.getElementById('inputText').value;
        translateText(text, "EN");
    });
});