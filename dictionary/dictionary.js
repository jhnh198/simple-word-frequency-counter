//current text will get values from the dictionary
//new values will get passed to the main dictionary and update the main dictionary. 
//current text tokens are not a separate dictionary, they are a subset of the main dictionary.

class Dictionary {
   constructor() {
    fetch('../dictionary_data/frequency_dictionary_data.json')
    .then((response) => response.json())
    .then((json) => 
      this.allSavedWords = json.allSavedWords
     )  
     this.currentTextTokenWords = {};
     this.focusWords = [];
   };

   //handle analysis of text, filtering, add words to dictionary
   processText(text) {
      this.analyzeAndFilterCurrentText(text);
      this.addCurrentTokenCountToDictionary();
   }

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

    handleFrequencyDictionaryUpload(event){
      const file = event.target.files[0];
      const reader = new FileReader();
      const fileType = file.type;
  
      if (fileType === 'application/json' || fileType === 'text/json') {
        reader.onload = (e) => {
          const text = reader.result;
          const dictionaryData = JSON.parse(text);
          this.currentTextTokenWords = dictionaryData
        };
      } else {
          reader.onload = (e) => {
            let text = reader.result;
            text = text.replace(/\\[nrt]/g, ''); // Remove escape characters
            text = text.replace(/\r/g, ''); // Remove carriage return characters
            const rows = text.split(/\n/); // Split by new line characters
  
            rows.forEach(row => {
              const [word, count, translation, hiragana_reading, category, reading, rendaku] = row.split(',');
              this.currentTextTokenWords[word] = { count: count, translation: translation, hiragana_reading: hiragana_reading, category: category, reading: reading || '音読み', rendaku: rendaku || "仮性" };
              });
          };
      }
      reader.readAsText(file);
    }

    getFocusWords(){
      return this.focusWords;
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
      
      this.currentTextTokenWords = {
          ...frequency,
      }
  };

  addCurrentTokenCountToDictionary() {
    Object.entries(this.currentTextTokenWords).forEach(([word, count]) => {
        try {
          if (!this.allSavedWords[word]) {
            this.allSavedWords[word] = {
                count: count,
                translation: '',
                hiragana_reading: '',
                category: '',
                reading: '',
                rendaku: ''
            };
          } else {
            this.allSavedWords[word].count = parseInt(count) + parseInt(this.allSavedWords[word].count);
        }
        } catch (error) {
          console.log(`Error adding word ${word} to dictionary: ${error}`);
        }
    });
  }

  downloadCSVFromDictionary(filename = 'translation.csv') {
    const header = 'Word,Count,Translation,Hiragana Reading,Category,Reading,Rendaku\n';
    const csv = Object.entries(this.allSavedWords).map(([word, data]) => {
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

  downloadJSONFromDictionary() {
    const inputTextValue = document.getElementById('input-text').value;
    const freeTranslationTextValue = document.getElementById('free-translation-text-area').value;
  
    const dictionaryData = {
      title: 'Japanese Dictionary',
      inputText: inputTextValue,
      freeTranslation: freeTranslationTextValue,
      allSavedWords: this.allSavedWords,
    }
  
    const json = JSON.stringify(dictionaryData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'full_jp_dict.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  sortDictionary(term, direction) {
    console.log(`Sorting dictionary by ${term} in ${direction} order.`);
    this.allSavedWords = Object.entries(this.allSavedWords).sort((a, b) => {
      if (direction === 'asc') {
        return a[1][term] - b[1][term];
      } else if (direction === 'desc') {
        return b[1][term] - a[1][term];
      } else {
        throw new Error('Invalid sort direction. Use "asc" or "desc".');
      }
    });
    this.allSavedWords = Object.fromEntries(this.allSavedWords);
    return this.allSavedWords;
    console.log(`Return sorted dictionary ${this.allSavedWords} `);
  }
}

export default Dictionary;
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