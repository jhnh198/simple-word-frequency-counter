import { saveTranslationInputToDictionary } from './frequency_dictionary_data_handling.js';
import { CATEGORY_LIST } from './text_content/category_list.js';
import { grammar_guide } from './text_content/grammar_guide.js';

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

export function createInputFieldContainer(word, translation) {
  const input = document.createElement('input');
  input.type = 'text';
  input.class = 'translation';
  input.id = word;
  input.value = translation || '';
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
          setInputTimerEvent(translationCellInput);

          const categoryCell = row.insertCell();
          categoryCell.appendChild(createDropdown(word));
        }
        });
      }
    }
  );
table.appendChild(createEmptyWordRow());
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

//todo: change typing timer to work with a function that will save the translation to the dictionary
export function setInputTimerEvent(input) {
  //setup before functions
  let typingTimer;                //timer identifier
  let doneTypingInterval = 5000;  //time in ms (5 seconds)

  //on keyup, start the countdown
  input.addEventListener('keyup', () => {
      clearTimeout(typingTimer);
      if (translationInputElement.value) {
          typingTimer = setTimeout(updateWordTranslation, doneTypingInterval);
      }
  });
}

//todo: tweak to find only the word from the element that was changed. Instead of running a loop to find all words
function doneTypingTranslation(allSavedWords){
  saveTranslationInputToDictionary(frequency_translation_dictionary.currentTextTokensCount, frequency_translation_dictionary.allSavedWords);
}

//todo: find where these need to be implemented
function updateWordTranslation(word, translation, allSavedWords) {
  allSavedWords[word].translation = translation;
}

function updateWordCategory(word, category, allSavedWords) {
  allSavedWords[word].category = category;
}

//todo: create word row function to add to the table
export function createEmptyWordRow() {
  const div = document.createElement('div');
  div.classList.add('word-row');

  const table = document.getElementById('dictionary-table');
  
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
  div.appendChild(row);
  div.appendChild(addNewWordButton);
  div.appendChild(clearWordButton);
  return div;
}