 //todo: add a button to open a file and display the words and counts
//todo: add onhover to display the translation of the word
//todo: add onhover to highlight the word in the text
import {frequency_translation_dictionary} from './frequency_translation_dictionary.js';

let wordsFrequency = {};
let outputPre = document.getElementById('output');

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

//todo: add original text and translated text to the saved file
//todo: add title to the saved file for the file name, or use default text
//todo: use save as prompt to put the file in the desired location
//todo: save category of the word in the saved file
document.getElementById('saveWordTranslationsButton').addEventListener('click', () => { 
    Object.entries(wordsFrequency).forEach(([word, count]) => {
        const input = document.getElementById(word);
        const category = document.getElementById(`${word}-category`);
        if (input) {
            wordsFrequency[word] = { count, translation: input.value, category: category.value};
        }
    });

    Object.entries(wordsFrequency).forEach(([word, translation, category]) => {
        if (!frequency_translation_dictionary[word]) {
            frequency_translation_dictionary[word] = { count: 0, translation, category};
        } else {
            frequency_translation_dictionary[word].count += wordsFrequency[word].count;
            frequency_translation_dictionary[word].translation = wordsFrequency[word].translation;
            frequency_translation_dictionary[word].category = wordsFrequency[word].category;
        }
    });

    console.log(frequency_translation_dictionary);

    const blob = new Blob([JSON.stringify(wordsFrequency, null, 2)], { type: 'text/plain' });


    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation_with_word_frequency.txt';
    a.click();
});

document.getElementById('openFileButton').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text/plain';
    input.addEventListener('change', async () => {
        const file = input.files[0];
        const text = await file.text();
        const words = text.split('\n');
        wordsFrequency = {};

        words.forEach(word => {
            if (wordsFrequency[word]) {
                wordsFrequency[word]++;
            } else {
                wordsFrequency[word] = 1;
            }
        });

        let output = '';
        for (const word in wordsFrequency) {
            const count = wordsFrequency[word];
            output += `${word}: ${count}\n`;
        }

        document.getElementById('output').textContent = output;
    });
    input.click();
});

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