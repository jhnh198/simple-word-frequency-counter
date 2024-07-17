//this will handle the output in word Frequency Table. It gets what is in the current text, and updates the frequency dictionary
/*
sample entry
    word: string,
    count: integer,
    translation: string,
    category: string
*/

//this is the main dictionary
let frequency_translation_dictionary = {
    currentTextTokensCount: {},
    allSavedWords: {}
};

export async function analyzeText() {
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

//todo: break this up
export function saveToLocalStorage() {
    const tempFrequencyDictionary = {};
    Object.entries(wordTokenFrequencyCount).forEach(([word]) => {
        const input = document.getElementById(word); 
        const category = document.getElementById(`${word}-category`);  

        tempFrequencyDictionary.push({ count: count, translation: input?.value, category: category.value});
    });

    Object.entries(wordTokenFrequencyCount).forEach(([word]) => {
        if (!frequency_translation_dictionary[word]) {
            frequency_translation_dictionary[word] = { count: wordTokenFrequencyCount[word].count, translation: wordTokenFrequencyCount[word]?.translation, category: wordTokenFrequencyCount[word].category};
        } else {
            frequency_translation_dictionary[word].count = parseInt(wordTokenFrequencyCount[word].count || 0) + parseInt(frequency_translation_dictionary[word].count || 0) ;
            frequency_translation_dictionary[word].translation = wordTokenFrequencyCount[word]?.translation;
            frequency_translation_dictionary[word].category = wordTokenFrequencyCount[word].category;
        }
    });
    localStorage.setItem('dictionary_data', JSON.stringify(frequency_translation_dictionary)); // Save to local storage
    console.log('Saved to Local Storage');
}

export function loadLocalStorage() {
    const jsonData = localStorage.getItem('dictionary_data');
    if (jsonData) {
        frequency_translation_dictionary[allSavedWords] = JSON.parse(jsonData);
    }

    buildCategoryTable(frequency_translation_dictionary[allSavedWords]);
}

export function loadDictionaryFromCSV(file) {
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

export function loadDictionaryFromJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const data = JSON.parse(text);
        frequency_translation_dictionary = data;
    };
    reader.readAsText(file);
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