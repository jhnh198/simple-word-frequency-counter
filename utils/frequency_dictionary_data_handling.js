import { clearErrorMessage, errorMessage } from "./errorHandling.js";

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

    //todo: remove only the sokuon rather than the token
    const removeHangingSokuon = /[\u3063]{1}$/;
; 
    const filteredWords = words.filter(word => !word.match(regex) && !word.match(symbolRegex) && !word.match(katakanaRegex) && !word.match(removeSingleHiragana) && !word.match(removeHangingSokuon));    
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

export function loadDictionaryFromCSV(file) {
  const reader = new FileReader();
  let frequency_translation_dictionary = {}; 
  reader.onload = function(e) {
    const text = e.target.result;
    const rows = text.split('\n');
    const dictionary = {};
    rows.forEach(row => {
      const [word, count, translation, hiragana_reading, category] = row.split(',');
      dictionary[word] = { count, translation, hiragana_reading, category };
    });
    delete dictionary['word'];
    frequency_translation_dictionary = dictionary;
  };
  reader.readAsText(file);

  return frequency_translation_dictionary;
}

//todo: get remaining output with csv
export function downloadCSVFromDictionary(dictionary, filename = 'translation.csv') {
  const header = 'Word,Count,Translation,Hiragana Reading,Category\n';
  const csv = Object.entries(dictionary).map(([word, data]) => {
    return `${word},${data.count},${data.translation},${data.hiragana_reading},${data.category}`;
  }).join('\n');

  const blob = new Blob([header + csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function saveToLocalStorage(allSavedWords) {
  const allSavedWordsString = JSON.stringify(allSavedWords);
  localStorage.setItem('dictionary_data', allSavedWordsString);
}