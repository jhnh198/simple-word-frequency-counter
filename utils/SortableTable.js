//functions for sorters and to build the table
//table should hold dictionary data and gets input from script to pass to dict

//the sorting function would be better to sort the dictionary and then rebuild the table
//sort by header column clicked, word, count, translation, hiragana reading
//category separation should be removed with the sorter

import { CATEGORY_LIST } from './text_content/category_list.js';
import { READING_LIST } from './text_content/reading_list.js';
import { grammar_guide_data } from '../ui_component/grammar_guide_data.js';
import { help_guide_data } from '../ui_component/help/help_guide.js';
import Dictionary from '../dictionary/dictionary.js';

class SortableTable {
  constructor(column, direction ='desc') {
    try {
      this.table = document.createElement('table');
      this.table.id = 'dictionary-table';
      this.table.classList.add('dictionary-table');
      this.direction = direction;
      this.column = column;
    } catch (error) {
      console.error('Error creating table:', error);
    }

    this.column = column;
    this.direction = direction;
    
    this.dictionary = new Dictionary();
  }

  changeDirection() {
    this.direction = this.direction === 'asc' ? 'desc' : 'asc';
  }

  buildWordFrequencyTable(isCurrentWords = false, isFocusedWords = false) {
    const dictionaryTabContent = document.getElementById('dictionary-tab-content');
    dictionaryTabContent.classList.remove('hidden');

    this.table.innerHTML = ''; // Clear previous content
  
    const body = this.table.createTBody();
  
    const headerRow = body.insertRow();
    const wordHeaderCell = headerRow.insertCell();
    wordHeaderCell.textContent = 'Word';
    wordHeaderCell.classList.add('table-header-border')
    wordHeaderCell.addEventListener('click', () => {
      this.changeDirection();
      this.dictionary = this.dictionary.sortDictionary('word',"asc");
      this.buildWordFrequencyTable(isCurrentWords, isFocusedWords);
    });

    const countHeaderCell = headerRow.insertCell();
    countHeaderCell.textContent = 'Count';

    countHeaderCell.addEventListener('click', () => {
      this.changeDirection();
      this.dictionary.sortDictionary('count', this.direction);
      this.buildWordFrequencyTable(isCurrentWords, isFocusedWords);
    });

    const translationHeaderCell = headerRow.insertCell();
    translationHeaderCell.textContent = 'Translation';
    translationHeaderCell.addEventListener('click', () => {
      this.changeDirection();
      this.dictionary.sortDictionary('translation', this.direction);
      this.buildWordFrequencyTable(isCurrentWords, isFocusedWords);
    });

    const hiragana_readingHeaderCell = headerRow.insertCell();
    hiragana_readingHeaderCell.textContent = 'Hiragana Reading';
    hiragana_readingHeaderCell.addEventListener('click', () => {
      this.changeDirection();
      this.dictionary.sortDictionary('hiragana_reading', this.direction);
      this.buildWordFrequencyTable(isCurrentWords, isFocusedWords);
    });

    const categoryHeaderCell = headerRow.insertCell();
    categoryHeaderCell.textContent = 'Category'; 
    categoryHeaderCell.addEventListener('click', () => {
      this.changeDirection();
      this.dictionary.sortDictionary('category',  this.direction);
      this.buildWordFrequencyTable(isCurrentWords, isFocusedWords);
    });

    const readingHeaderCell = headerRow.insertCell();
    readingHeaderCell.textContent = 'Reading';

    const rendakuHeaderCell = headerRow.insertCell();
    rendakuHeaderCell.textContent = 'Rendaku';

    let usingWords;

    if (isCurrentWords) {
      usingWords = Object.entries(this.dictionary.currentTextTokenWords).map(([word]) => {
        return word;
      });
    } else if (isFocusedWords) {
      usingWords = Object.entries(this.dictionary.currentTextTokenWords).map(([word]) => {
        if(this.dictionary.allSavedWords[word].category === '集中') {
          return word;
        }
      });
    } else {
      usingWords = Object.keys(this.dictionary.allSavedWords).map(word => {
        return word;
      });
    }

    if (usingWords.length === 0) {
      const emptyRow = body.insertRow();
      const emptyCell = emptyRow.insertCell();
      emptyCell.colSpan = 7; // Adjust based on the number of columns
      emptyCell.textContent = 'No words found.';
      this.table.appendChild(emptyRow);
      return;
    }
    
    usingWords.forEach((word) => {
      const row = body.insertRow();
      const wordCell = row.insertCell();
      wordCell.textContent = word;
      const countCell = row.insertCell();
      countCell.textContent = this.dictionary.allSavedWords[word].count;
      
      const translationCell = row.insertCell();
      const translationCellInput = this.createInputFieldContainer(word, this.dictionary.allSavedWords[word]?.translation, 'translation');
      translationCell.appendChild(translationCellInput);

      const hiraganaReadingCell = row.insertCell();
      const hiraganaReadingInput = this.createInputFieldContainer(word, this.dictionary.allSavedWords[word]?.hiragana_reading, 'hiragana_reading');
      hiraganaReadingCell.appendChild(hiraganaReadingInput);
      hiraganaReadingInput.setAttribute('lang', 'ja');
      wanakana.bind(hiraganaReadingInput, /* options */);
      
      const categoryCell = row.insertCell();
      categoryCell.appendChild(this.createCategoryDropdown(word));

      const readingCell = row.insertCell();
      readingCell.appendChild(this.createReadingDropdown(word));

      const rendakuCell = row.insertCell();
      rendakuCell.appendChild(this.createRendakuDropdown(word));

      const deleteCell = row.insertCell();
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';

      deleteButton.addEventListener('click', () => {
        this.saveAllInput();
        delete this.dictionary.currentTextTokenWords[word];
        this.buildWordFrequencyTable(isCurrentWords, isFocusedWords);
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

    select.value = this.dictionary.allSavedWords[word]?.category || '名詞';
  
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

    select.value = this.dictionary.allSavedWords[word]?.reading || '音読み';
  
    select.addEventListener('change', () => {
      this.dictionary.updateWordReadingValue(word, select.value);
    });
    return select;
  }

  createRendakuDropdown(word) {
    const select = document.createElement('select');
    select.id = `rendaku-${word}`;
  
    const rendakuOptions = ['仮性', '有声化', '無声化'];
  
    rendakuOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      select.appendChild(opt);
    });
  
    select.value = this.dictionary.allSavedWords[word]?.rendaku || '仮性';
  
    select.addEventListener('change', () => {
      this.dictionary.updateWordRendakuValue(word, select.value);
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

  createHelpGuide(){
    const dictionaryTabContent = document.getElementById('dictionary-tab-content');
    const help_guide_container = document.createElement('div');

    help_guide_data.all_data.forEach((section) => {
      const section_container = document.createElement('div');
      section_container.classList.add('section-container');
      help_guide_container.appendChild(section_container);
  
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
    this.table.classList.add('help-guide-table');
    this.table.appendChild(help_guide_container);
    dictionaryTabContent.appendChild(this.table);
  }
}

export default SortableTable;