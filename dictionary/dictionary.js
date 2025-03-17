//dictionary class
//todo: current text tokens values need to get values from the dictionary. 
//current text will get values from the dictionary
//new values will get passed to the main dictionary and update the main dictionary. 
//current text tokens are not a separate dictionary, they are a subset of the main dictionary.

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

    //getter functions

  }