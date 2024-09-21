import { CATEGORY_LIST } from './text_content/category_list.js';
import { grammar_guide } from './text_content/grammar_guide.js';
import { 
  updateCategoryChangeValue,
  updateInputChangeValue,
  addWordToDictionaryFromNewRow,
 } from '../script.js';


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

//todo: set hiragana input to kana by default
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
    console.log('typing');
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  }

  function doneTyping() {
    console.log('done typing');
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
      const hiragana_readingHeaderCell = headerRow.insertCell();
      hiragana_readingHeaderCell.textContent = 'Hiragana Reading';
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
          const translationCellInput = createInputFieldContainer(word, dictionary[word]?.translation, 'translation', 'en');
          translationCell.appendChild(translationCellInput);

          const hiraganaReadingCell = row.insertCell();
          const hiraganaReadingInput = createInputFieldContainer(word, dictionary[word]?.hiragana_reading, 'hiragana_reading', 'ja');
          hiraganaReadingCell.appendChild(hiraganaReadingInput);
          
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

export function createEmptyWordRow(table) {
  const div = document.createElement('div');
  div.classList.add('word-row');
  
  const row = table.insertRow();
  //create input field for word
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
  const categoryDropdown = createDropdown('');
  categoryCell.appendChild(categoryDropdown);

  const addNewWordButton = document.createElement('button');
  const clearWordButton = document.createElement('button');
  addNewWordButton.textContent = 'Add New Word';
  clearWordButton.textContent = 'Clear Word';

  addNewWordButton.addEventListener('click', () => {
    if(translationInput.value && wordInput.value && countInput.value && categoryDropdown.value) {
      let newWord = {
        word: wordInput.value,
        translation: translationInput.value,
        count: countInput.value,
        category: categoryDropdown.value
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