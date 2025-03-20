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

    //todo: should process all text through to get the current text tokens
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
  
      return frequency;
  };

    //getter functions

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