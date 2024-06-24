 //todo: add a button to open a file and display the words and counts
//todo: add onhover to display the translation of the word
//todo: add onhover to highlight the word in the text
//todo: use save as prompt to put the file in the desired location

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

document.getElementById('hidePreviousTranslationsCheckbox').addEventListener('change', () => {
    if (document.getElementById('hidePreviousTranslationsCheckbox').checked) {
        document.querySelectorAll('input').forEach(container => {
            container.value = '';
            console.log(wordsFrequency)
        })
        console.log(wordsFrequency)
    } else {
        Object.entries(wordsFrequency).forEach(([word]) => {
            const input = document.getElementById(word);
            input.value = frequency_translation_dictionary[word]?.translation || '';
        });
        console.log(wordsFrequency)
    }
});

document.getElementById('countFrequencyButton').addEventListener('click', async () => {
    wordsFrequency = await analyzeText();

    for (const word in wordsFrequency) {
        const count = wordsFrequency[word];
        outputPre.append(createInputFieldContainer(word, count, frequency_translation_dictionary[word]?.translation));
    }
});

//todo: add dropdown to select the category of the word
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

//todo: save category of the word in the saved file
//formatting is not working as intended
document.getElementById(`downloadCurrentTranslationButton`).addEventListener('click', () => {
    let title = document.getElementById('title').value || 'translation.txt';
    let originalText = document.getElementById('inputText').value;
    
    let translatedText = document.getElementById('free-translation-text-area').value || '';

    let output = {
        title: title,
        originalText: originalText,
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

