import { CATEGORY_LIST } from './text_content/category_list.js';
import { grammar_guide } from './text_content/grammar_guide.js';
import { analyzeText } from './frequency_dictionary_data_handling.js';
import { clearErrorMessage, errorMessage } from './errorHandling.js';

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

//functions
export function createInputFieldContainer(word, translation) {
  const input = document.createElement('input');
  input.type = 'text';
  input.class = 'translation';
  input.id = word;
  input.value = translation || '';
  return input;
}

//todo: make general function to build table for both word frequency and category table
//build category table sorts by category then inserts words into the table
//build word frequency uses a different table that is editable. We want to be able to edit both
export async function buildWordFrequencyTable(dictionary) {
    let dictionaryTabContent = document.getElementById('dictionary-tab-content');
    dictionaryTabContent.innerHTML = '';

    const table = document.createElement('table');
    table.id = 'dictionary-table';
    table.classList.add('dictionary-table');
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
        //todo: save to local storage relies on table elements. it's understandable it would, however, it's not good for readability
        // a better way is to save only changed elements then update word frequency with those values
        if(dictionary !== null && Object.keys(dictionary).length > 0) {
            saveToLocalStorage();   
    }
        if(document.getElementById('countFrequencyButton').classList.contains('error')) {
            clearErrorMessage('', this.id);
        }
    } catch (error) {
        errorMessage('No Text to Analyze', 'countFrequencyButton');
    }

    const body = table.createTBody();
    Object.entries(dictionary).forEach(([word]) => {
        const row = body.insertRow();
        const wordCell = row.insertCell();
        wordCell.textContent = word;
        const countCell = row.insertCell();

        //todo: this is wonky. It isn't clear that wordFrequency of word is a number
        countCell.textContent = dictionary[word];
        const translationCell = row.insertCell();
        translationCell.appendChild(createInputFieldContainer(word, dictionary[word]?.translation));
        const categoryCell = row.insertCell();
        categoryCell.appendChild(createDropdown(word));
    });
    dictionaryTabContent.appendChild(table);

}

export function createDropdown(word) {
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

export function handleHidePreviousTranslations(hidePreviousTranslationsCheckbox, wordTokenFrequencyCount) {
    if (hidePreviousTranslationsCheckbox.checked) {
        document.querySelectorAll('input').forEach(container => {
            container.value = '';
        })
    } else {
        Object.entries(wordTokenFrequencyCount).forEach(([word]) => {
            const input = document.getElementById(word);
            input.value = frequency_translation_dictionary[word]?.translation || '';
        });
    }
}