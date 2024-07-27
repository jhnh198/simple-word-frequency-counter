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
          translationCell.appendChild(createInputFieldContainer(word, dictionary[word]?.translation));
          const categoryCell = row.insertCell();
          categoryCell.appendChild(createDropdown(word));
        }
      });
    }
  }
);

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