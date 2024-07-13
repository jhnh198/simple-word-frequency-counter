//todo: clean up any unnecessary nested functions
//todo: issue where different files / dictionary source is not consistent with category dictionary

import {grammar_guide} from './grammar_guide.js';
import { CATEGORY_LIST } from './category_list.js';

let wordsFrequency = {};
let dictionaryTabContent = document.getElementById('dictionary-tab-content');

//this is the main dictionary
let frequency_translation_dictionary = {};
loadLocalStorage();

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

        buildCategoryTable(frequency_translation_dictionary);
    });

    document.getElementById('downloadFullTranslationFrequencyDictionaryCSVButton').addEventListener('click', () => {
        saveToCSV();
    });

    document.getElementById(`downloadCurrentTranslationButton`).addEventListener('click', () => {
    if(Object.keys(wordsFrequency).length === 0) {
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
        words: wordsFrequency
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
        saveToLocalStorage();
        buildCategoryTable();
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
            Object.entries(wordsFrequency).forEach(([word]) => {
                const input = document.getElementById(word);
                input.value = frequency_translation_dictionary[word]?.translation || '';
            });
        }
    });

    document.getElementById('countFrequencyButton').addEventListener('click', async () => {
        buildWordFrequencyTable()
    });

    document.getElementById('word-frequency-output-button').addEventListener('click', async () => {
        buildWordFrequencyTable()
    });
    
    document.getElementById('inputText').addEventListener('input', () => {
        if(document.getElementById('countFrequencyButton').classList.contains('error')) {
            clearErrorMessage('Return Words and Frequency', 'countFrequencyButton');
        }
    });

    document.getElementById('frequency-dictionary-button').addEventListener('click', () => {
        buildCategoryTable();
    });

    document.getElementById('grammar-guide-button').addEventListener('click', () => {
        showGrammarGuide();
    });
});

//functions
function createInputFieldContainer(word, translation) {
    const input = document.createElement('input');
    input.type = 'text';
    input.class = 'translation';
    input.id = word;
    input.value = translation || '';
    return input;
}


//todo: make general function to build table for both word frequency and category table
async function buildWordFrequencyTable(dictionary) {
    dictionaryTabContent.innerHTML = '';
    const table = document.createElement('table');
    table.id = 'word-frequency-table';
    table.classList.add('word-frequency-table');
    const header = table.createTHead();
    const headerRow = header.insertRow();
    const wordHeader = document.createElement('th');
    wordHeader.textContent = 'Word';
    headerRow.appendChild(wordHeader);
    const countHeader = document.createElement('th');
    countHeader.textContent = 'Count';
    headerRow.appendChild(countHeader);
    const translationHeader = document.createElement('th');
    translationHeader.textContent = 'Translation';
    headerRow.appendChild(translationHeader);
    const categoryHeader = document.createElement('th');
    categoryHeader.textContent = 'Category';
    headerRow.appendChild(categoryHeader);

    try {
        if(document.getElementById('countFrequencyButton').classList.contains('error'))clearErrorMessage('', this.id);
        wordsFrequency = await analyzeText();
    } catch (error) {
        errorMessage('No Text to Analyze', 'countFrequencyButton');
    }
    if(wordsFrequency){
        //saveToLocalStorage();   
    }

    const body = table.createTBody();
    Object.entries(wordsFrequency).forEach(([word]) => {
        const row = body.insertRow();
        const wordCell = row.insertCell();
        wordCell.textContent = word;
        const countCell = row.insertCell();

        //todo: this is wonky. It isn't clear that wordFrequency of word is a number
        countCell.textContent = wordsFrequency[word];
        const translationCell = row.insertCell();
        translationCell.appendChild(createInputFieldContainer(word, frequency_translation_dictionary[word]?.translation));
        const categoryCell = row.insertCell();
        categoryCell.appendChild(createDropdown(word));
    });
    dictionaryTabContent.appendChild(table);
}

function createDropdown(word) {
    const select = document.createElement('select');
    select.id = `${word}-category`;

    const categories = CATEGORY_LIST;
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
    return select;
}

function saveToLocalStorage() {
    Object.entries(wordsFrequency).forEach(([word, count]) => {
        const input = document.getElementById(word); 
        const category = document.getElementById(`${word}-category`);
        wordsFrequency[word] = { count: count, translation: input.value, category: category.value};
    });

    Object.entries(wordsFrequency).forEach(([word]) => {
        if (!frequency_translation_dictionary[word]) {
            frequency_translation_dictionary[word] = { count: wordsFrequency[word].count, translation: wordsFrequency[word]?.translation, category: wordsFrequency[word].category};
        } else {
            frequency_translation_dictionary[word].count = parseInt(wordsFrequency[word].count || 0) + parseInt(frequency_translation_dictionary[word].count || 0) ;
            frequency_translation_dictionary[word].translation = wordsFrequency[word]?.translation;
            frequency_translation_dictionary[word].category = wordsFrequency[word].category;
        }
    });
    localStorage.setItem('dictionary_data', JSON.stringify(frequency_translation_dictionary)); // Save to local storage
    wordsFrequency = {};
    console.log('Saved to Local Storage');
    console.log(frequency_translation_dictionary);
}

function downloadFullDictionary() {
    const blob = new Blob([JSON.stringify(frequency_translation_dictionary, null, "\t")], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frequency_translation_dictionary.txt`;
    a.click();
}

function saveToCSV() {
    const header = 'Word,Count,Translation,Category\n';
    const csv = Object.entries(frequency_translation_dictionary).map(([word, data]) => {
        return `${word},${data.count},${data.translation},${data.category}`;
    }).join('\n');

    const blob = new Blob([header, csv], { type: 'text/csv' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frequency_translation_dictionary.csv`;
    a.click();
}

function buildCategoryTable() {
    //clears previous table
    dictionaryTabContent.innerHTML = '';

    let categoryTable = document.createElement('table');
    categoryTable.id = 'category-table';
    categoryTable.classList.add('category-table');

    const categoryDictionary = {};
    Object.entries(frequency_translation_dictionary).forEach(([word, data]) => {
        if (categoryDictionary[data.category]) {
            categoryDictionary[data.category].push({ word: word, count: data.count, translation: data.translation, category: data.category});
        } else {
            categoryDictionary[data.category] = [{ word: word, count: data.count, translation: data.translation, category: data.category}];
        }
    });

    Object.entries(categoryDictionary).forEach(([category, words]) => {
        let categoryRow = categoryTable.insertRow();
        let categoryHeader = categoryRow.insertCell(0);
        categoryHeader.innerText = category;

        let bufferRow = categoryTable.insertRow();
        let bufferCell = bufferRow.insertCell(0);
        bufferCell.innerText = '\n';
        categoryTable.appendChild(bufferRow);
        
        words.forEach(word => {
            if (word.category === category){
                let row = categoryTable.insertRow();
                let wordCell = row.insertCell(0);
                let countCell = row.insertCell(1);
                let translationCell = row.insertCell(2);
                wordCell.innerText = word.word;
                countCell.innerText = word.count;
                translationCell.innerText = word.translation;
                categoryTable.appendChild(row);
            }
        });

        categoryTable.appendChild(bufferRow);
    });

    dictionaryTabContent.append(categoryTable);
}

function showGrammarGuide() {
    let grammarGuide = document.createElement('div');
    grammarGuide.innerHTML = '';
    let grammarGuideHeader = document.createElement('h2');
    grammarGuideHeader.innerText = 'Grammar Guide';
    grammarGuide.appendChild(grammarGuideHeader);
    grammarGuide.style.display = 'block';
    grammarGuide.innerText = grammar_guide.text;

    let dictionaryTabContent = document.getElementById('dictionary-tab-content');
    dictionaryTabContent.innerHTML = '';
    dictionaryTabContent.appendChild(grammarGuide);
}

function loadDictionaryFromCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n');
        rows.forEach(row => {
            const [word, count, translation, category] = row.split(',');
            frequency_translation_dictionary[word] = { count: count, translation: translation, category: category};
        });
    };
    reader.readAsText(file);
}

function loadDictionaryFromJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const data = JSON.parse(text);
        frequency_translation_dictionary = data;
    };
    reader.readAsText(file);
}

//add deepL api key to translate text
async function translateText(text, targetLang) {
  const url = 'https://api-free.deepl.com/v2/translate';
  const apiKey = 'ENTER YOUR DEEPL API KEY'; // Replace with your actual API key

  try {
      const response = await axios.post(url, null, {
          params: {
              auth_key: apiKey,
              text: text,
              target_lang: targetLang,
              source_lang: 'JA'
          }
      });
      
      document.getElementById('free-translation-text-area').value = response.data.translations[0].text;
  } catch (error) {
        if(error.response.status === 403) {
            console.error('API Key is Invalid');
            document.getElementById('free-translation-text-area').value = 'API Key is Invalid';
            return;
        } else if(text === '') {
            console.error('No Text to Translate');
            document.getElementById('free-translation-text-area').value = 'No Text to Translate';
            return;
        }
      console.error('Error Translating Text:', error);
      document.getElementById('free-translation-text-area').value = 'Translation error';
  }
}

function loadLocalStorage() {
    const jsonData = localStorage.getItem('dictionary_data');
    if (jsonData) {
        frequency_translation_dictionary = JSON.parse(jsonData);
    }

    buildCategoryTable(frequency_translation_dictionary);
}

function errorMessage(message, componentId){
    let component = document.getElementById(componentId);
    component.classList.add('error');
    component.textContent = message;
}

function clearErrorMessage(message, componentId){
    let component = document.getElementById(componentId);
    component.classList.remove('error');
    component.textContent = message;
}

async function analyzeText() {
    if (document.getElementById('inputText').value === '') {
        throw new Error('No text to analyze');
    }

    if(document.getElementById('countFrequencyButton').classList.contains('error')){
        clearErrorMessage('Return Words and Frequency', 'countFrequencyButton');
    };

    if(document.getElementById('downloadCurrentTranslationButton').classList.contains('error')){
        clearErrorMessage('Download Current Translation', 'downloadCurrentTranslationButton');
    }

    const text = document.getElementById('inputText').value;
    const segmenter = new TinySegmenter();
    const words = segmenter.segment(text);

    //regex to remove english letters, numbers, newlines, spaces, and parentheses
    const regex = /^[a-zA-Z0-9\n\r\s]+$/;

    //hiragana regex removes only single hiragana, which are generally particles
    //this allows multi-hiragana words to be included and depending on the tokenizer, will separate hiragana modifiers from kanji
    //which is ideal since generally hiragana modifiers do the same thing for all root kanji
    const hiraganaRegex = /^[\u3040-\u309F]$/;

    //regex to remove single katakana
    const katakanaRegex = /^[\u30A0-\u30FF]$/;
    //regex to remove symbols and non japanese characters
    const symbolRegex = /^[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\uFF00-\uFFEF\u3000-\u303F]+$/;
    //regex to remove full width parentheses
    const parenthesesRegex = /[\uFF08\uFF09]/;

    const filteredWords = words.filter(word => !regex.test(word) && !hiraganaRegex.test(word) && !katakanaRegex.test(word) && !symbolRegex.test(word) && !parenthesesRegex.test(word));

    const frequency = {};

    filteredWords.forEach(word => {
        if (frequency[word]) {
            frequency[word]++;
        } else {
            frequency[word] = 1;
        }
    });

    return frequency;
};

//todo: remove this
async function countFrequency(){
    //dictionaryTabContent.innerHTML = '';

    try {
        if(document.getElementById('countFrequencyButton').classList.contains('error'))clearErrorMessage('', this.id);
        wordsFrequency = await analyzeText();
        
        for (const word in wordsFrequency) {
            const count = wordsFrequency[word];
            dictionaryTabContent.append(createInputFieldContainer(word, count, frequency_translation_dictionary[word]?.translation));
        }
    } catch (error) {
        errorMessage('No Text to Analyze', 'countFrequencyButton');
    }
    if(wordsFrequency){
        saveToLocalStorage();   
    }
}