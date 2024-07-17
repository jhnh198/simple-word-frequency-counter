import { grammar_guide } from './utils/grammar_guide.js';
import { CATEGORY_LIST } from './utils/category_list.js';
import { translateText } from './utils/translation.js';
import { errorMessage, clearErrorMessage } from './utils/error_message.js';
import { frequency_translation_dictionary, loadLocalStorage } from './utils/frequency_translation_dictionary.js';

loadLocalStorage();
//get token count
//then pass token count and build the dictionary from that
//document output uses token reference, frequency dictionary uses everything that has been added to it 
let wordTokenFrequencyCount = {}; //this should really just get count and pass that to the category dictionary

let dictionaryTabContent = document.getElementById('dictionary-tab-content');

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

//set up event listeners on load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inputText').addEventListener('input', () => {
        if(document.getElementById('countFrequencyButton').classList.contains('error')) {
            clearErrorMessage('Return Words and Frequency', 'countFrequencyButton');
        }
    });

    document.getElementById('translate-button').addEventListener('click', () => {
      const text = document.getElementById('inputText').value;
      translateText(text, "EN");
    });

    document.getElementById('frequency-dictionary-upload').addEventListener('change', (e) => {
        let file = document.getElementById('frequency-dictionary-upload').files[0];

        if (file.name.endsWith('.csv')) {
            loadDictionaryFromCSV(file);
        } else if (file.name.endsWith('.json')) {
            loadDictionaryFromJSON(file);
        } else {
            alert('Invalid file type');
        }

        buildCategoryTable();
    });

    document.getElementById('downloadFullTranslationFrequencyDictionaryCSVButton').addEventListener('click', () => {
        saveToCSV();
    });

    document.getElementById(`downloadCurrentTranslationButton`).addEventListener('click', () => {
    if(Object.keys(wordTokenFrequencyCount).length === 0) {
        errorMessage('No Words to Download', 'downloadCurrentTranslationButton');
        return;
    }
    let title = document.getElementById('title').value || 'translation.txt';
    let originalText = document.getElementById('inputText').value;
    let originalTextArray = originalText.split('\n');
    originalTextArray = originalTextArray.map(line => line.trim());
    
    let translatedText = document.getElementById('free-translation-text-area').value || '';
    let translatedTextArray = translatedText.split('\n');
    translatedTextArray = translatedTextArray.map(line => line.trim());

    let output = {
        title: title,
        originalText: originalTextArray,
        translatedText: translatedText,
        words: wordTokenFrequencyCount
    };
    
    const blob = new Blob([JSON.stringify(output, null, "\t")], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title;
    a.click();
    });

    //this saves current entries to local storage for the frequency translation dictionary
    document.getElementById('saveTranslationLocalButton').addEventListener('click', () => { 
        buildCategoryTable();
        saveToLocalStorage();
    });

    document.getElementById('downloadFullTranslationFrequencyDictionaryButton').addEventListener('click', () => {
        downloadFullDictionary();
    });

    document.getElementById('hidePreviousTranslationsCheckbox').addEventListener('change', () => {
        if (document.getElementById('hidePreviousTranslationsCheckbox').checked) {
            document.querySelectorAll('input').forEach(container => {
                container.value = '';
            })
        } else {
            Object.entries(wordTokenFrequencyCount).forEach(([word]) => {
                const input = document.getElementById(word);
                input.value = frequency_translation_dictionary[word]?.translation || '';
            });
        }
    });

    document.getElementById('countFrequencyButton').addEventListener('click', async () => {
        buildWordFrequencyTable();
    });

    document.getElementById('word-frequency-output-button').addEventListener('click', async () => {
        buildWordFrequencyTable();
    });

    document.getElementById('frequency-dictionary-button').addEventListener('click', () => {
        buildCategoryTable();
    });

    document.getElementById('grammar-guide-button').addEventListener('click', () => {
        showGrammarGuide();
    });
});