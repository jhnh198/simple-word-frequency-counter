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

let text = `追いつけない君はいつでも
この場所から何を見てた
手に入れれば失うものたち数えて
涙も隠していたね
真っ直ぐすぎるその瞳は
この世界を斜めに見ていた

夢は君が一人描くんじゃなく
見えない風が届けてくれる
高く遠く飛べる気がしたら
繋ぐこの手離さずにいて

言葉だけじゃ伝わらないよ
この胸にある真実たち
手に入れても消せはしない虚しさを
笑顔で隠しているの
いつの間にか近づきすぎた
あの頃のように歌は聞こえない

愛しき君よ今どこにいるの
色も意味もなくした世界
高く遠く飛べるはずなのに
見えない空に翼ちぎれる

夢は君が一人描くんじゃなく
見えない風が届けてくれる
高く遠く飛べる気がしたら
繋ぐこの手離さずにいて

(夢は君が見えない風が)

I know your blues.
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