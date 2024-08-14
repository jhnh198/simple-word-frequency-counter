import { CATEGORY_LIST } from './text_content/category_list.js';
import { grammar_guide } from './text_content/grammar_guide.js';
import { updateCategoryChangeValue, updateInputChangeValue } from '../script.js';


export function showGrammarGuide(dictionaryTabContent) {
  let grammarGuideElement = document.createElement('div');
  grammarGuideElement.innerHTML = '';
  let grammarGuideHeader = document.createElement('h2');
  grammarGuideHeader.innerText = 'Grammar Guide';
  grammarGuideElement.appendChild(grammarGuideHeader);
  grammarGuideElement.style.display = 'block';
  grammarGuideElement.innerText = grammar_guide.text;

  dictionaryTabContent.innerHTML = '';
  dictionaryTabContent.appendChild(grammarGuideElement);
}

//todo: trim down clear timeout
export function createInputFieldContainer(word, translation) {
  const input = document.createElement('input');
  input.type = 'text';
  input.class = 'translation';
  input.id = word;
  input.value = translation || '';

  input.addEventListener('keyup', () => {
    let typingTimer;                //timer identifier
    let doneTypingInterval = 5000;  //time in ms (5 seconds)

    //todo: this runs for each keyup event, need to refactor to only run after user stops typing
    clearTimeout(typingTimer);
    if (input.value) {
      typingTimer = setTimeout(() => updateInputChangeValue(word, input.value), doneTypingInterval);
    }

  }, 5000);
  return input;
}

export async function buildWordFrequencyTable(dictionary, dictionaryTabContent) {
  dictionaryTabContent.innerHTML = '';
  dictionaryTabContent.classList.remove('hidden');

  const table = document.createElement('table');
  table.id = 'dictionary-table';
  table.classList.add('dictionary-table');

  const body = table.createTBody();

  //check if any words exist that match the category
  CATEGORY_LIST.forEach(category => {
    if (Object.values(dictionary).some(entry => entry.category === category)) {
      const categoryRow = body.insertRow();
      const categoryCell = categoryRow.insertCell();
      categoryCell.colSpan = 4;
      categoryCell.textContent = category;
      categoryCell.style.fontWeight = 'bold';
      categoryCell.style.textAlign = 'center';
      categoryCell.style.paddingBottom = '15px';

      const headerRow = body.insertRow();
      const wordHeaderCell = headerRow.insertCell();
      wordHeaderCell.textContent = 'Word';
      const countHeaderCell = headerRow.insertCell();
      countHeaderCell.textContent = 'Count';
      const translationHeaderCell = headerRow.insertCell();
      translationHeaderCell.textContent = 'Translation';
      const categoryHeaderCell = headerRow.insertCell();
      categoryHeaderCell.textContent = 'Category'; 

      Object.entries(dictionary).forEach(([word]) => {
        if(dictionary[word].category === category) {
          const row = body.insertRow();
          const wordCell = row.insertCell();
          wordCell.textContent = word;
          const countCell = row.insertCell();
      
          countCell.textContent = dictionary[word].count;
          const translationCell = row.insertCell();
          const translationCellInput = createInputFieldContainer(word, dictionary[word]?.translation);
          translationCell.appendChild(translationCellInput);

          const categoryCell = row.insertCell();
          categoryCell.appendChild(createDropdown(word));
        }
        });
      }
    }
  );
  table.appendChild(createEmptyWordRow(table));
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

  select.addEventListener('change', () => {
    updateCategoryChangeValue(word, select.value);
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

//todo: create word row function to add to the table
export function createEmptyWordRow(table) {
  const div = document.createElement('div');
  div.classList.add('word-row');
  
  const row = table.insertRow();
  //create input field for word
  const wordCell = row.insertCell();
  let wordInput = createInputFieldContainer('', '');
  wordCell.appendChild(wordInput);
   
  const countCell = row.insertCell();
  let countInput = createInputFieldContainer('', '');
  countCell.appendChild(countInput);
  
  const translationCell = row.insertCell();
  translationCell.appendChild(createInputFieldContainer('', ''));
  const categoryCell = row.insertCell();
  categoryCell.appendChild(createDropdown(''));

  const addNewWordButton = document.createElement('button');
  const clearWordButton = document.createElement('button');
  addNewWordButton.textContent = 'Add New Word';
  clearWordButton.textContent = 'Clear Word';

  addNewWordButton.addEventListener('click', () => {
    if(translationCell.value && wordInput.value && countInput.value && categoryCell.value) {
      const newRow = createEmptyWordRow(table);
      table.appendChild(newRow);

      let newWord = {
        word: wordInput.value,
        translation: translationCell.value,
        count: countInput.value,
        category: categoryCell.value
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

function clearInputFields(input) {
  input.value = '';
  
}