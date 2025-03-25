/* 
export function makeElementFromToken(frequency_translation_dictionary){
  let elementsToReturn = [];

  Object.entries(frequency_translation_dictionary).forEach(([word]) => {
    elementsToReturn.push(createWordElement(frequency_translation_dictionary[word]));
  });

  return elementsToReturn;
}

//todo: get hover elements working
export function createWordElement(word){
  let element = document.createElement('span');
  element.classList.add('word');
  element.innerText = word;
  element.addEventListener('hover', () => {
    let translation = document.getElementById(`translation-${word}`).value;
    let hiragana_reading = document.getElementById(`hiragana_reading-${word}`).value;
    let category = document.getElementById(`${word}-category`).value;

    let hoverDiv = document.createElement('div');

    //todo: create hover div styling
    hoverDiv.classList.add('hover-div');
    hoverDiv.innerText = `Translation: ${translation}\nHiragana Reading: ${hiragana_reading}\nCategory: ${category}`;
  });

  element.addEventListener('mouseleave', () => {
    let hoverDiv = document.querySelector('.hover-div');
    if(hoverDiv) {
      hoverDiv.remove();
    }
  });
  return element;
} */