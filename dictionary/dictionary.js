import TinySegmenter from 'tiny-segmenter';


//dictionary class
//todo: current text tokens values need to get values from the dictionary. 
//todo: full dictionary is separate from current tokens since they only need to generate what works match the dictionary

//current text will get values from the dictionary
//new values will get passed to the main dictionary and update the main dictionary. 
//current text tokens are not a separate dictionary, they are a subset of the main dictionary.

/*
saveCurrentTokenCountToDictionary,
handleCurrentTokenDictionary,
downloadCSVFromDictionary,
downloadJSONFromDictionary,
*/

 class Dictionary {
   constructor(dictionary) {
      this.allSavedWords = dictionary.allSavedWords || {};
      this.currentTextTokenWords = {};      
   };

   //setter functions
    updateWordTranslationValue(word, value){
      this.allSavedWords[word].translation = value;
    }

    updateWordHiraganaReadingValue(word, value){
      this.allSavedWords[word].hiragana_reading = value;
    }

    updateWordCategoryValue(word, value){
      this.allSavedWords[word].category = value;
    }

    updateWordReadingValue(word, value){
      this.allSavedWords[word].reading = value;
    }

    updateWordRendakuValue(word, value){
      this.allSavedWords[word].rendaku = value;
    }

    updateWordValue(word){
      this.allSavedWords[word] = word;
    }

    //tokenizes, filters and counts text. returns current text token dictionary
    analyzeAndFilterCurrentText(text) {
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
  
      this.currentTextTokenWordCount = frequency;
  };

  addCurrentTokenCountToDictionary() {
    Object.entries(this.currentTextTokenWordCount).forEach(([word]) => {
      if (!this.allSavedWords[word]) {
          this.allSavedWords[word] = this.currentTextTokenWordCount[word];
          this.allSavedWords[word].translation = '';
          this.allSavedWords[word].hiragana_reading = '';
          this.allSavedWords[word].category = '名詞';
          this.allSavedWords[word].reading = '音読み';
          this.allSavedWords[word].rendaku = 0;
      } else {
          this.allSavedWords[word].count = parseInt(this.currentTextTokenWordCount[word].count || 0) + parseInt(this.allSavedWords[word].count || 0);
      }
    });
  }

  //todo: modify to work in dictionary class
  downloadCSVFromDictionary(dictionary, filename = 'translation.csv') {
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

  //todo: modify to work in dictionary class
  downloadJSONFromDictionary(dictionary, filename = 'translation.json') {
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

    //getter functions

}
}


/* 
frequency translation dictionary structure
let frequency_translation_dictionary = {

    set the current text tokens, this is a temporary value that interacts with the dictionary
    currentTextTokensCount: {},
    allSavedWords: {
      word: string,
      count: integer,
      translation: string,
      hiragana_reading: string,
      category: string
    }
}; */