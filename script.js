//todo: add onhover to display the translation of the word
//todo: add onhover to highlight the word in the text

let wordsFrequency = {};
let outputPre = document.getElementById('output');

let frequency_translation_dictionary = {};
loadLocalStorage();

function loadLocalStorage() {
    const jsonData = localStorage.getItem('dictionary_data');
    if (jsonData) {
        frequency_translation_dictionary = JSON.parse(jsonData);
    }
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
    try {
        if(document.getElementById('countFrequencyButton').classList.contains('error'))clearErrorMessage('', this.id);
        wordsFrequency = await analyzeText();
        
        for (const word in wordsFrequency) {
            const count = wordsFrequency[word];
            outputPre.append(createInputFieldContainer(word, count, frequency_translation_dictionary[word]?.translation));
        }
    } catch (error) {
        errorMessage('No Text to Analyze', 'countFrequencyButton');
    }
});

document.getElementById('inputText').addEventListener('input', () => {
    if(document.getElementById('countFrequencyButton').classList.contains('error')) {
        clearErrorMessage('Return Words and Frequency', 'countFrequencyButton');
    }
});

function createInputFieldContainer(word, count, translation) {
    const div = document.createElement('div');
    div.classList.add('inputFieldContainer');
    const label = document.createElement('label');
    label.textContent = `${word} : ${count} `;
    div.appendChild(label);
    const input = document.createElement('input');
    input.type = 'text';
    input.class = 'translation';
    input.id = word;
    input.value = translation || '';
    div.appendChild(input);
    div.appendChild(createDropdown(word));
    return div;
}

function createDropdown(word) {
    const select = document.createElement('select');
    select.id = `${word}-category`;

    //todo: edit categories based on japanese language
    const categories = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Particle', 'Conjunction', 'Interjection', 'Pronoun', 'Preposition', 'Counter', 'Prefix', 'Suffix', 'Auxiliary Verb', 'Auxiliary Adjective', 'Other'];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
    return select;
}

//todo: add highlight and remove highlight does not work as intended
function addHighlight(word) {
    const text = document.getElementById('inputText').value;
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const newText = text.replace(regex, `<span class="highlight">${word}</span>`);
    document.getElementById('inputText').value = newText;
}

function removeHighlight(word) {
    const text = document.getElementById('inputText').value;
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const newText = text.replace(regex, word);
    document.getElementById('inputText').value = newText;
}

document.getElementById(`downloadCurrentTranslationButton`).addEventListener('click', () => {
    if(Object.keys(wordsFrequency).length === 0) {
        alert('No words to download');
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
    console.log('Data saved to local storage');
    loadFullDictionary();
});

document.getElementById('downloadFullTranslationFrequencyDictionaryButton').addEventListener('click', () => {
    downloadFullDictionary();
});

function downloadFullDictionary() {
    const blob = new Blob([JSON.stringify(frequency_translation_dictionary, null, "\t")], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frequency_translation_dictionary.txt`;
    a.click();
}

document.getElementById('downloadFullTranslationFrequencyDictionaryCSVButton').addEventListener('click', () => {
    saveToCSV();
});

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

function categoryDictionary() {
    let categoryDictionary = {};
    Object.entries(frequency_translation_dictionary).forEach(([word, data]) => {
        if (!categoryDictionary[data.category]) {
            categoryDictionary[data.category] = {};
        }
        categoryDictionary[data.category][word] = data;
    });
    return categoryDictionary;
}

async function analyzeText() {
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
}

const apiKey = 'ENTER YOUR DEEPL API KEY'; // Replace with your actual API key

async function translateText(text, targetLang) {
  const url = 'https://api-free.deepl.com/v2/translate';

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
      console.error('Error translating text:', error);
      document.getElementById('free-translation-text-area').value = 'Translation error';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('translate-button').addEventListener('click', () => {
      const text = document.getElementById('inputText').value;
      translateText(text, "EN");
  });
});

function loadFullDictionary(){
    let frequencyTableBody = document.getElementById('frequency-table-body');
    frequencyTableBody.innerHTML = '';
    Object.entries(frequency_translation_dictionary).forEach(([word, data]) => {
        console.log(word, data);
        let row = frequencyTableBody.insertRow();
        let wordCell = row.insertCell(0);
        let countCell = row.insertCell(1);
        let translationCell = row.insertCell(2);
        let categoryCell = row.insertCell(3);
        wordCell.innerText = word;
        countCell.innerText = data.count;
        translationCell.innerText = data.translation;
        categoryCell.innerText = data.category;

        frequencyTableBody.appendChild(row);
    });
}

document.getElementById('frequency-upload').addEventListener('click', () => {
    const file = document.getElementById('dictionaryFile').files[0];
    if (!file) {
        alert('No file selected');
        return;
    }

    if (file.name.endsWith('.csv')) {
        loadDictionaryFromCSV(file);
    } else if (file.name.endsWith('.json')) {
        loadDictionaryFromJSON(file);
    } else {
        alert('Invalid file type');
    }
});

function loadDictionaryFromCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n');
        rows.forEach(row => {
            const [word, count, translation, category] = row.split(',');
            frequency_translation_dictionary[word] = { count: count, translation: translation, category: category};
        });
        loadFullDictionary();
    };
    reader.readAsText(file);
}

function loadDictionaryFromJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const data = JSON.parse(text);
        frequency_translation_dictionary = data;
        loadFullDictionary();
    };
    reader.readAsText(file);
}

loadFullDictionary();