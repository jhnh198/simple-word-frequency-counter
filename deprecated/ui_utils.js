import { CATEGORY_LIST } from '../utils/text_content/category_list.js';
import { READING_LIST } from '../utils/text_content/reading_list.js';

import { 
  updateCategoryChangeValue,
  updateInputChangeValue,
  addWordToDictionaryFromNewRow,
} from '../script.js';

export function updateSingleInputValue(word, value, component, frequency_translation_dictionary){
  if(component === 'translation'){
    frequency_translation_dictionary.currentTextTokensCount[word].translation = value;
  } else if(component === 'hiragana_reading'){
    frequency_translation_dictionary.currentTextTokensCount[word].hiragana_reading = value;
  }
  frequency_translation_dictionary.allSavedWords[word] = frequency_translation_dictionary.currentTextTokensCount[word];
}

//this is part of the table
export function createInputFieldContainer(word, translation, component, language) {
  const input = document.createElement('input');
  input.type = 'text';
  input.class = component;
  input.id = `${component}-${word}`;
  input.value = translation || '';

  input.setAttribute('lang', language);  

  if (language === 'ja') {
    wanakana.bind(input, /* options */);
  }  

  let typingTimer;
  let doneTypingInterval = 5000;

  function handleTyping() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  }

  function doneTyping() {
    updateInputChangeValue(word, input.value, component);
  }

  input.addEventListener('keyup', handleTyping);

  return input;
}

export async function buildWordFrequencyTable(dictionary, dictionaryTabContent) {
  dictionaryTabContent.innerHTML = '';
  dictionaryTabContent.classList.remove('hidden');

  const table = document.createElement('table');
  table.id = 'dictionary-table';
  table.classList.add('dictionary-table');

  const body = table.createTBody();

  const headerRow = body.insertRow();
  const wordHeaderCell = headerRow.insertCell();
  wordHeaderCell.textContent = 'Word';
  const countHeaderCell = headerRow.insertCell();
  countHeaderCell.textContent = 'Count';
  const translationHeaderCell = headerRow.insertCell();
  translationHeaderCell.textContent = 'Translation';
  const hiragana_readingHeaderCell = headerRow.insertCell();
  hiragana_readingHeaderCell.textContent = 'Hiragana Reading';
  const categoryHeaderCell = headerRow.insertCell();
  categoryHeaderCell.textContent = 'Category'; 
  const readingHeaderCell = headerRow.insertCell();
  readingHeaderCell.textContent = 'Reading';

  Object.entries(dictionary).forEach(([word]) => {
      const row = body.insertRow();
      const wordCell = row.insertCell();
      wordCell.textContent = word;
      const countCell = row.insertCell();
  
      countCell.textContent = dictionary[word].count;
      const translationCell = row.insertCell();

      //todo: set function based on translation or hiragana_reading
      const translationCellInput = createInputFieldContainer(word, dictionary[word]?.translation, 'translation', 'en');
      translationCell.appendChild(translationCellInput);

      const hiraganaReadingCell = row.insertCell();
      const hiraganaReadingInput = createInputFieldContainer(word, dictionary[word]?.hiragana_reading, 'hiragana_reading', 'ja');
      hiraganaReadingCell.appendChild(hiraganaReadingInput);
      
      const categoryCell = row.insertCell();
      categoryCell.appendChild(createCategoryDropdown(word));

      const readingCell = row.insertCell();
      readingCell.appendChild(createReadingDropdown(word));

      //todo: move delete button to the right
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';

      //todo: save the entire dictionary input before deletion to avoid losing input data due to timing
      deleteButton.addEventListener('click', () => {
        delete dictionary[word];
        buildWordFrequencyTable(dictionary, dictionaryTabContent);
      });
      categoryCell.appendChild(deleteButton);
    });
  table.appendChild(createEmptyWordRow(table));
  dictionaryTabContent.appendChild(table);
}

//move to table
export function createCategoryDropdown(word) {
  const select = document.createElement('select');
  select.id = `${word}-category`;

  CATEGORY_LIST.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    updateCategoryChangeValue(word, select.value);
  });
  return select;
}

export function createReadingDropdown(word) {
  const select = document.createElement('select');
  select.id = `${word}-reading`;

  READING_LIST.forEach(reading => {
    const option = document.createElement('option');
    option.value = reading;
    option.textContent = reading;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    updateReadingChangeValue(word, select.value);
  });
  return select;
}

//move to table
export function createEmptyWordRow(table) {
  const div = document.createElement('div');
  div.classList.add('word-row');
  
  const row = table.insertRow();

  const wordCell = row.insertCell();
  const wordInput = document.createElement('input');
  wordCell.appendChild(wordInput);
   
  const countCell = row.insertCell();
  const countInput = document.createElement('input');
  countCell.appendChild(countInput);
  
  const translationCell = row.insertCell();
  const translationInput = document.createElement('input');
  translationCell.appendChild(translationInput);

  const categoryCell = row.insertCell();
  const categoryDropdown = createCategoryDropdown('');
  categoryCell.appendChild(categoryDropdown);

  const addNewWordButton = document.createElement('button');
  const clearWordButton = document.createElement('button');
  addNewWordButton.classList.add('control-button');
  clearWordButton.classList.add('control-button');

  addNewWordButton.textContent = 'Add New Word';
  clearWordButton.textContent = 'Clear Word';

  //todo: move this to css
  addNewWordButton.style.marginTop = '10px';
  clearWordButton.style.marginTop = '10px';
  clearWordButton.style.marginLeft = '10px';

  addNewWordButton.addEventListener('click', () => {
    if(translationInput.value && wordInput.value && countInput.value && categoryDropdown.value) {
      let newWord = {
        word: wordInput.value,
        translation: translationInput.value,
        count: countInput.value,
        category: categoryDropdown.value,
        hiragana_reading: '',
        reading: '音読み',
        rendaku: 0,
      }

      addWordToDictionaryFromNewRow(newWord);     
    }
  });

  clearWordButton.addEventListener('click', () => {
    wordInput.value = '';
    countInput.value = '';
    translationCell.value = '';
    categoryCell.value = '';
  });

  div.appendChild(row);
  div.appendChild(addNewWordButton);
  div.appendChild(clearWordButton);
  return div;
}