import { clearErrorMessage, errorMessage } from "./errorHandling.js";

//todo: make sure functions use correct frequency_translation_dictionary object
/* let frequency_translation_dictionary = {
    currentTextTokensCount: {},
    allSavedWords: {}

    sample entry:
    word: string,
    count: integer,
    translation: string,
    hiragana_reading: string,
    category: string

}; */

export async function analyzeText(text, countFrequencyButton, downloadCurrentTranslationButton) {
    if (text === '') {
        throw new Error('No text to analyze');
    }

    if(countFrequencyButton.classList.contains('error')){
        clearErrorMessage('Return Words and Frequency', countFrequencyButton);
    };

    if(downloadCurrentTranslationButton.classList.contains('error')){
        clearErrorMessage('Download Current Translation', downloadCurrentTranslationButton);
    }

    const segmenter = new TinySegmenter();
    const words = segmenter.segment(text);

    //regex to remove english letters, numbers, newlines, spaces, and parentheses
    const regex = /^[a-zA-Z0-9\t\n\r\s]+$/g;

    //regex to remove special characters
    const symbolRegex = /[\u0021-\u002F\u003A-\u0040\u3000-\u303F\uFF08\uFF01-\uFF3F]+/;

    const removeSingleHiragana = /^[\u3040-\u309F]{1}$/;
    const katakanaRegex = /[\u30A0-\u30FF]/;
; 
    const filteredWords = words.filter(word => !word.match(regex) && !word.match(symbolRegex) && !word.match(katakanaRegex) && !word.match(removeSingleHiragana));    
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

export function saveCurrentTokenCountToDictionary(currentTextTokensCount, allSavedWords) {
  let tempAllSavedWords = allSavedWords;
    Object.entries(currentTextTokensCount).forEach(([word]) => {
        if (!allSavedWords[word]) {
            allSavedWords[word] = currentTextTokensCount[word];
        } else {
            allSavedWords[word].count = parseInt(currentTextTokensCount[word].count || 0) + parseInt(allSavedWords[word].count || 0);
        }
    });

    return tempAllSavedWords;
}

export function saveSingleTranslationInputToDictionary(word, translation, allSavedWords) { 
    if (!allSavedWords[word]) {
        allSavedWords[word] = { count: 1, translation: translation, category: '名詞'};
    } else {
        allSavedWords[word].count = parseInt(allSavedWords[word].count || 0) + 1;
        allSavedWords[word].translation = translation;
    }

    return allSavedWords;
}

export function saveSingleCategoryInputToDictionary(word, category, allSavedWords) {  
    if (!allSavedWords[word]) {
        allSavedWords[word] = { count: 1, translation: '', category: category};
    } else {
        allSavedWords[word].category = category;
    }

    return allSavedWords;
}

export function handleSingleCountInputToDictionary(word, count, allSavedWords) {
    if (!allSavedWords[word]) {
        allSavedWords[word] = { count: count, translation: '', category: '名詞'};
    } else {
        allSavedWords[word].count = count;
    }

    return allSavedWords;
}

export function handleSingleHiraganaReadingInputToDictionary(word, hiragana_reading, allSavedWords) {
    if (!allSavedWords[word]) {
        allSavedWords[word] = { count: 1, translation: '', hiragana_reading: hiragana_reading, category: '名詞'};
    } else {
        allSavedWords[word].hiragana_reading = hiragana_reading;
    }

    return allSavedWords;
}

//this will get tokens from the current text, check if in the dictionary and return current text tokens
export function handleCurrentTokenDictionary(wordTokenFrequencyCount, allSavedWords) {
    const tempCurrentTextTokens = {};
    Object.entries(wordTokenFrequencyCount).forEach(([word, count]) => {
        if (!allSavedWords[word]) {
          tempCurrentTextTokens[word] = { count: count, translation: '', hiragana_reading: '', category: '名詞'};
        } else {
          tempCurrentTextTokens[word] = { count: count, translation: allSavedWords[word]?.translation, hiragana_reading: allSavedWords[word]?.hiragana_reading, category: allSavedWords[word]?.category};
        }
    });
    return tempCurrentTextTokens;
}

export function loadLocalStorage() {
  let loadedAllSavedWords = {};
  if (localStorage.getItem('dictionary_data')) {
    loadedAllSavedWords = JSON.parse(localStorage.getItem('dictionary_data'));
  }
  return loadedAllSavedWords;
}

//
export function loadDictionaryFromCSV(file) {
  const reader = new FileReader(file);
  let frequency_translation_dictionary = {};
  console.log(reader.readAsText(file));

  const rows = text.split('\n');
  rows.forEach(row => {
      const [word, count, translation, hiragana_reading, category] = row.split(',');
      frequency_translation_dictionary[word] = ({ count: count, translation: translation, hiragana_reading: hiragana_reading, category: category});
  });
  return frequency_translation_dictionary;
}

export function loadDictionaryFromJSON() {
  const reader = new FileReader();
  reader.onload = function(e) {
      const text = e.target.result;
      const data = JSON.parse(text);
      frequency_translation_dictionary = data;
  };
}

export function downloadFullDictionary(allSavedWords) {
    const blob = new Blob([JSON.stringify(allSavedWords, null, "\t")], { type: 'text/plain' });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frequency_translation_dictionary.txt`;
    a.click();
}
  
export function saveToCSV(allSavedWords) {
    const header = 'Word,Count,Translation,Hiragana Reading,Category\n';
    const csv = Object.entries(allSavedWords).map(([word, data]) => {
        return `${word},${data.count},${data.translation},${data.hiragana_reading},${data.category}`;
    }).join('\n');
  
    const blob = new Blob([header, csv], { type: 'text/csv' });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frequency_translation_dictionary.csv`;
    a.click();
}

export function handleDownloadCurrentTranslation(wordTokenFrequencyCount){
  console.log(wordTokenFrequencyCount);
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
}

export function handleFrequencyDictionaryUpload(file){
    //this file decision can be put in the loader
    if (file.name.endsWith('.csv')) {
        loadDictionaryFromCSV(file);
    } else if (file.name.endsWith('.json')) {
        loadDictionaryFromJSON(file);
    } else {
        console.log('Invalid file type');
        return;
    }
}

export function saveToLocalStorage(allSavedWords) {
  const allSavedWordsString = JSON.stringify(allSavedWords);
  localStorage.setItem('dictionary_data', allSavedWordsString);
}