import { clearErrorMessage, errorMessage } from "./errorHandling.js";

//this is the main dictionary. when script.js loaded it comes from loadLocalStorage
/* let frequency_translation_dictionary = {
    currentTextTokensCount: {},
    allSavedWords: {}

    sample entry
    word: string,
    count: integer,
    translation: string,
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

    //todo: this can be optimized by combining all regex into one
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

//todo: break this up
export function saveCurrentTokensToDictionary(currentTextTokensCount, allSavedWords) {
    const tempFrequencyDictionary = {};
    Object.entries(currentTextTokensCount).forEach(([word, count]) => {
        const input = document.getElementById(word); 
        const category = document.getElementById(`${word}-category`);  

        tempFrequencyDictionary[word] = { count: count, translation: input?.value, category: category.value};
    });

    Object.entries(tempFrequencyDictionary).forEach((word) => {
        if (!allSavedWords.word) {
            allSavedWords.word = { count: tempFrequencyDictionary.word.count, translation: tempFrequencyDictionary[word]?.translation, category: tempFrequencyDictionary[word].category};
        } else {
            allSavedWords.word.count = parseInt(tempFrequencyDictionary[word].count || 0) + parseInt(tempFrequencyDictionary[word].count || 0) ;
            allSavedWords.word.translation = tempFrequencyDictionary[word]?.translation;
            allSavedWords.word.category = tempFrequencyDictionary[word].category;
        }
    });
    //localStorage.setItem('dictionary_data', JSON.stringify(frequency_translation_dictionary)); // Save to local storage
    console.log('Saved to Local Storage');
    return allSavedWords;
}

export function saveToLocalStorage(){

}

export function loadLocalStorage() {
    const jsonData = localStorage.getItem('dictionary_data');
    let frequency_translation_dictionary = {
        currentTextTokensCount: {},
        allSavedWords: {}
    };
    if (jsonData) {
        frequency_translation_dictionary.allSavedWords = JSON.parse(jsonData);
    }
    return frequency_translation_dictionary;
}

export function loadDictionaryFromCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n');
        rows.forEach(row => {
            const [word, count, translation, category] = row.split(',');
            frequency_translation_dictionary[allSavedWords][word] = { count: count, translation: translation, category: category};
        });
    };
    reader.readAsText(file);
}

export function loadDictionaryFromJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const data = JSON.parse(text);
        frequency_translation_dictionary = data;
    };
    reader.readAsText(file);
}

export function downloadFullDictionary() {
    const blob = new Blob([JSON.stringify(frequency_translation_dictionary[allSavedWords], null, "\t")], { type: 'text/plain' });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frequency_translation_dictionary.txt`;
    a.click();
}
  
export function saveToCSV() {
    const header = 'Word,Count,Translation,Category\n';
    const csv = Object.entries(frequency_translation_dictionary[allSavedWords]).map(([word, data]) => {
        return `${word},${data.count},${data.translation},${data.category}`;
    }).join('\n');
  
    const blob = new Blob([header, csv], { type: 'text/csv' });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frequency_translation_dictionary.csv`;
    a.click();
}

export function handleDownloadCurrentTranslation(wordTokenFrequencyCount){
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

export function handleFrequencyDictionaryUpload(e){
    let file = document.getElementById('frequency-dictionary-upload').files[0];

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