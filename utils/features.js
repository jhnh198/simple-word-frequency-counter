//may add in later
function addHighlight(word) {
  const text = document.getElementById('inputText').value;
  const regex = new RegExp(`\\b${word}\\b`, 'g');
  const newText = text.replace(regex, `<span class="highlight">${word}</span>`);
  document.getElementById('inputText').value = newText;
}

function removeHighlight(word) {
  const text = document.getElementById('inputText').value;
  const regex = new RegExp(`\\b${word}\\b`, 'g');
  const newText = text.replace(regex, word);
  document.getElementById('inputText').value = newText;
}