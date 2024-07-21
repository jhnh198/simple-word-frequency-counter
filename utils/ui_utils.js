import { CATEGORY_LIST } from './text_content/category_list.js';
import { grammar_guide } from './text_content/grammar_guide.js';

function showGrammarGuide() {
  let grammarGuideElement = document.createElement('div');
  grammarGuideElement.innerHTML = '';
  let grammarGuideHeader = document.createElement('h2');
  grammarGuideHeader.innerText = 'Grammar Guide';
  grammarGuideElement.appendChild(grammarGuideHeader);
  grammarGuideElement.style.display = 'block';
  grammarGuideElement.innerText = grammar_guide.text;

  //todo: add parameter for dictionaryTabContent
  let dictionaryTabContent = document.getElementById('dictionary-tab-content');
  dictionaryTabContent.innerHTML = '';
  dictionaryTabContent.appendChild(grammarGuideElement);
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

export async function buildWordFrequencyTable(dictionary) {
    //todo: add parameter for dictionaryTabContent
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

/*     try {
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
    } */

    const body = table.createTBody();

    Object.entries(dictionary).forEach(([word]) => {
        const row = body.insertRow();
        const wordCell = row.insertCell();
        wordCell.textContent = word;
        const countCell = row.insertCell();

        countCell.textContent = dictionary[word].count;
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