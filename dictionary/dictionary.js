//dictionary class
//todo: current text tokens values need to get values from the dictionary. 
//current text will get values from the dictionary
//new values will get passed to the main dictionary and update the main dictionary. 
//current text tokens are not a separate dictionary, they are a subset of the main dictionary.

import { CATEGORY_LIST } from './text_content/category_list.js';
import { READING_LIST } from './text_content/reading_list.js';

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