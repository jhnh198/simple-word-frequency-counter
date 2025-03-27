//functions for sorters and to build the table
//table should hold dictionary data and gets input from script to pass to dict

//the sorting function would be better to sort the dictionary and then rebuild the table
//sort by header column clicked, word, count, translation, hiragana reading
//category separation should be removed with the sorter

import { CATEGORY_LIST } from './text_content/category_list.js';
import { READING_LIST } from './text_content/reading_list.js';
import Dictionary from '../dictionary/dictionary.js';

export class SortableTable {
  //todo: add sorting by column
  constructor() {
    this.table = document.createElement('table');
    this.table.id = 'dictionary-table';
    this.table.classList.add('dictionary-table');

    //this.column = column;
    //this.direction = direction;

    fetch('../dictionary_data/frequency_dictionary_data.json')
    .then((response) => response.json())
    .then((json) => 
      allSavedWords = json.allSavedWords
     ).then(() => {
      this.dictionary = new Dictionary(allSavedWords);
    });
  }

  //todo: remove repeated code from wk input
  //todo: implement input value to dictionary
  createInputFieldContainer(word, translation, component) {
    const input = document.createElement('input');
    input.type = 'text';
    input.class = component;
    input.id = `${component}-${word}`;
    input.value = translation || '';
  
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

  //todo: implement input value to dictionary
  createWanaKanaInputFieldContainer(word, hiragana_reading) {
    const input = document.createElement('input');
    input.type = 'text';
    input.class = 'hiragana_reading';
    input.id = `hiragana_reading-${word}`;
    input.value = hiragana_reading || '';
  
    wanakana.bind(input, /* options */);
  
    let typingTimer;
    let doneTypingInterval = 5000;
  
    function handleTyping() {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
  
    function doneTyping() {
      updateInputChangeValue(word, input.value, 'hiragana_reading');
    }
  
    input.addEventListener('keyup', handleTyping);
  
    return input;
  }

  async buildWordFrequencyTable() {
    const dictionaryTabContent = document.getElementById('dictionary-tab-content');
    dictionaryTabContent.classList.remove('hidden');
  
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

  createCategoryDropdown(word) {
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
  
  createReadingDropdown(word) {
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

  createEmptyWordRow(table) {
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

  createGrammarGuide(grammar_guide_data) {
    const grammar_guide_container = document.createElement('div');
  
    grammar_guide_data.all_data.forEach((section) => {
      const section_container = document.createElement('div');
      section_container.classList.add('section-container');
      grammar_guide_container.appendChild(section_container);
  
      const header = document.createElement('h2');
      header.textContent = section.header;
      section_container.appendChild(header);
  
      const subheader = document.createElement('h3');
      subheader.textContent = section.subheader;
      section_container.appendChild(subheader);
  
      section.content.forEach((content) => {
        if (content.table) {
          const table = document.createElement('table');
          section_container.appendChild(table);
  
          const thead = document.createElement('thead');
          table.appendChild(thead);
  
          const tr = document.createElement('tr');
          thead.appendChild(tr);
  
          content.table.headers.forEach((header) => {
            const th = document.createElement('th');
            th.textContent = header;
            tr.appendChild(th);
          });
  
          const tbody = document.createElement('tbody');
          table.appendChild(tbody);
  
          content.table.rows.forEach((row) => {
            const tr = document.createElement('tr');
            tbody.appendChild(tr);
  
            row.forEach((cell) => {
              const td = document.createElement('td');
              td.textContent = cell;
              tr.appendChild(td);
            });
          });
        }
  
        if (content.list) {
          const ul = document.createElement('ul');
          section_container.appendChild(ul);
  
          content.list.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
          });
        }
      });
    });
    return grammar_guide_container;
  }
}