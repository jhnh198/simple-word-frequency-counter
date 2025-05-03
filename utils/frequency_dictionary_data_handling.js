
//todo: move this to dictionary class
export async function analyzeText(text) {
    if (text === '') {
        throw new Error('No text to analyze');
    }
    
    const segmenter = new TinySegmenter();
    const words = segmenter.segment(text);

    //regex to remove english letters, numbers, newlines, spaces, and parentheses
    const regex = /^[a-zA-Z0-9\t\n\r\s]+$/g;

    //regex to remove special characters
    const symbolRegex = /[\u0021-\u002F\u003A-\u0040\u3000-\u303F\uFF08\uFF01-\uFF3F]+/;
    const removeSingleHiragana = /^[\u3040-\u309F]{1}$/;
    const katakanaRegex = /[\u30A0-\u30FF]/;
 
    const filteredWords = words.filter(word => !word.match(regex) && !word.match(symbolRegex) && !word.match(katakanaRegex) && !word.match(removeSingleHiragana));    
    const frequency = {};
    const removeHangingSokuonFilteredWords = filteredWords.map(word => {
        if (word.match(/[\u3063]{1}$/)) {
            return word.slice(0, -1);
        } else {
            return word;
        }
    });

    removeHangingSokuonFilteredWords.forEach(word => {
        if (frequency[word]) {
            frequency[word]++;
        } else {
            frequency[word] = 1;
        }
    });

    return frequency;
};

//todo: the next following functions update the entire dictionary, need to change to only update the new word
export function saveCurrentTokenCountToDictionary(currentTextTokensCount, allSavedWords) {
  let tempAllSavedWords = allSavedWords;
    Object.entries(currentTextTokensCount).forEach(([word]) => {
        if (!allSavedWords[word]) {
            allSavedWords[word] = currentTextTokensCount[word];
        } else {
            allSavedWords[word].count = parseInt(currentTextTokensCount[word].count || 0) + parseInt(allSavedWords[word].count || 0);
        }
    });

    return tempAllSavedWords;
}

export function handleCurrentTokenDictionary(wordTokenFrequencyCount, allSavedWords) {
    const tempCurrentTextTokens = {};
    Object.entries(wordTokenFrequencyCount).forEach(([word, count]) => {
        if (!allSavedWords[word]) {
          tempCurrentTextTokens[word] = { count: count, translation: '', hiragana_reading: '', category: '名詞', reading: '音読み', rendaku: 0};
        } else {
          tempCurrentTextTokens[word] = { 
            count: count, 
            translation: allSavedWords[word]?.translation,
            hiragana_reading: allSavedWords[word]?.hiragana_reading,
            category: allSavedWords[word]?.category,
            reading: allSavedWords[word]?.reading,
            rendaku: allSavedWords[word]?.rendaku
          };
        }
    });
    return tempCurrentTextTokens;
}

export function downloadCSVFromDictionary(dictionary, filename = 'translation.csv') {
  const header = 'Word,Count,Translation,Hiragana Reading,Category,Reading,Rendaku\n';
  const csv = Object.entries(dictionary).map(([word, data]) => {
    return `${word},${data.count},${data.translation},${data.hiragana_reading},${data.category},${data.reading},${data.rendaku}`;
  }).join('\n');

  const blob = new Blob([header + csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSONFromDictionary(dictionary, filename = 'translation.json') {
  const inputTextValue = document.getElementById('input-text').value;
  const freeTranslationTextValue = document.getElementById('free-translation-text-area').value;

  const dictionaryData = {
    title: filename,
    inputText: inputTextValue,
    freeTranslation: freeTranslationTextValue,
    allSavedWords: dictionary,
  }

  const json = JSON.stringify(dictionaryData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}