//functions for sorters and to build the table
//table should hold dictionary data and gets input from script to pass to dict

//the sorting function would be better to sort the dictionary and then rebuild the table
//sort by header column clicked, word, count, translation, hiragana reading
//category separation should be removed with the sorter

import { CATEGORY_LIST } from './text_content/category_list.js';
import { READING_LIST } from './text_content/reading_list.js';
import {grammar_guide_data} from '../ui_component/grammar_guide_data.js';
import Dictionary from '../dictionary/dictionary.js';

class SortableTable {
  constructor(column, direction ='desc') {
    try {
      this.table = document.createElement('table');
      this.table.id = 'dictionary-table';
      this.table.classList.add('dictionary-table');
      this.table.direction = direction;
      this.table.column = column;
    } catch (error) {
      console.error('Error creating table:', error);
    }

    this.column = column;
    this.direction = direction;
    
    this.dictionary = new Dictionary();
  }

  buildWordFrequencyTable(isCurrentWords = false, isFocusedWords = false) {
    const dictionaryTabContent = document.getElementById('dictionary-tab-content');
    dictionaryTabContent.classList.remove('hidden');

    this.table.innerHTML = ''; // Clear previous content
  
    const body = this.table.createTBody();
  
    const headerRow = body.insertRow();
    const wordHeaderCell = headerRow.insertCell();
    wordHeaderCell.textContent = 'Word';
    wordHeaderCell.addEventListener('click', () => {
      this.dictionary.sortDictionary('word', 'asc');
      this.buildWordFrequencyTable(isCurrentWords, isFocusedWords);
    });

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
    const rendakuHeaderCell = headerRow.insertCell();
    rendakuHeaderCell.textContent = 'Rendaku';

    let usingWords = {}

    if(isCurrentWords) {
      usingWords = this.dictionary.currentTextTokenWords;
    } else if(isFocusedWords){
/*       usingWords = Object.entries(this.dictionary.currentTextTokenWords).map((word) => {
        if(word.category === '集中' && Object.keys(this.dictionary.currentTextTokenWords).find(word)) return word;
      }) */
    } else {
      usingWords = this.dictionary.allSavedWords;
    }

    console.log(usingWords)
  
    Object.entries(usingWords).forEach((word) => {
        const row = body.insertRow();
        const wordCell = row.insertCell();
        wordCell.textContent = word[0];
        const countCell = row.insertCell();
        countCell.textContent = usingWords[word]?.count || 0;
        
        const translationCell = row.insertCell();
        const translationCellInput = this.createInputFieldContainer(word, usingWords[word]?.translation, 'translation');
        translationCell.appendChild(translationCellInput);
  
        const hiraganaReadingCell = row.insertCell();
        const hiraganaReadingInput = this.createInputFieldContainer(word, usingWords[word]?.hiragana_reading, 'hiragana_reading');
        hiraganaReadingCell.appendChild(hiraganaReadingInput);
        hiraganaReadingInput.setAttribute('lang', 'ja');
        wanakana.bind(hiraganaReadingInput, /* options */);
        
        const categoryCell = row.insertCell();
        categoryCell.appendChild(this.createCategoryDropdown(word));
  
        const readingCell = row.insertCell();
        readingCell.appendChild(this.createReadingDropdown(word));

        //todo: clean up and set into function
        const rendakuCell = row.insertCell();
        const rendakuInput = document.createElement('select');
        rendakuInput.classList.add('rendaku-select');
        rendakuInput.innerHTML = `<option value="0"></option><option value="1">真実</option>`;        
        rendakuInput.id = `rendaku-${word}`;
        rendakuInput.value = this.dictionary.allSavedWords[word]?.rendaku || 0;
        rendakuInput.addEventListener('change', () => {
          this.dictionary.updateWordRendakuValue(word, rendakuInput.value);
        });
        rendakuCell.appendChild(rendakuInput);

        const deleteCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
  
        deleteButton.addEventListener('click', () => {
          this.saveAllInput(allSavedWordsFlag);
          delete this.dictionary.currentTextTokenWords[word];
          this.buildWordFrequencyTable();
        });
        deleteCell.appendChild(deleteButton);
      });
    this.table.appendChild(this.createEmptyWordRow(this.table));
    dictionaryTabContent.appendChild(this.table);
  }

  createInputFieldContainer(word, value, component) {
    const input = document.createElement('input');
    input.type = 'text';
    input.class = component;
    input.id = `${component}-${word}`;
    input.value = value || '';
  
    let typingTimer;
    let doneTypingInterval = 5000;
  
    function handleTyping() {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(updateValue, doneTypingInterval);
    }

    function updateValue() {
      if (component === 'translation') {
        this.dictionary.updateWordTranslationValue(word, input.value);
      } else if (component === 'hiragana_reading') {
        this.dictionary.updateWordHiraganaReadingValue(word, input.value);
      }
    }
  
    input.addEventListener('keyup', handleTyping);
    input.addEventListener('focusout', (e) => {
      updateValue.call(this);
      clearTimeout(typingTimer);
    });
  
    return input;
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
      this.dictionary.updateWordCategoryValue(word, select.value);
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
      this.dictionary.updateWordReadingValue(word, select.value);
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
    const categoryDropdown = this.createCategoryDropdown('');
    categoryCell.appendChild(categoryDropdown);
  
    const addNewWordButton = document.createElement('button');
    const clearWordButton = document.createElement('button');
    addNewWordButton.classList.add('control-button');
    clearWordButton.classList.add('control-button');
  
    addNewWordButton.textContent = 'Add New Word';
    clearWordButton.textContent = 'Clear Word';
  
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
  
        this.dictionary.addWordToDictionaryFromNewRow(newWord);     
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

  saveAllInput(allSavedWordsFlag = false) {
    const tempWords = allSavedWordsFlag ? this.dictionary.allSavedWords : this.dictionary.currentTextTokenWords; 
    
    Object.entries(tempWords).forEach((word) => {
      console.log(word);
      const translationInputValue = document.getElementById(`translation-${word[0]}`).value;
      const hiraganaReadingInput = document.getElementById(`hiragana_reading-${word[0]}`);
      const categoryInput = document.getElementById(`${word[0]}-category`);
      const readingInput = document.getElementById(`${word[0]}-reading`);
      const rendakuInput = document.getElementById(`rendaku-${word[0]}`);

      const tempWord = {
        word: word,
        count: word[1],
        translation: translationInputValue,
        hiragana_reading: hiraganaReadingInput.value,
        category: categoryInput.value,
        reading: readingInput.value,
        rendaku: rendakuInput.value,
      }

      this.dictionary.updateWordValue(tempWord);
    });    
  }

  createGrammarGuide() {
    const dictionaryTabContent = document.getElementById('dictionary-tab-content');
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
    this.table.innerHTML = ''; // Clear previous content
    this.table.classList.add('grammar-guide-table');
    this.table.appendChild(grammar_guide_container);
    dictionaryTabContent.appendChild(this.table);
  }
}

export default SortableTable;