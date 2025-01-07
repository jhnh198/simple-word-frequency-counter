import { 
    analyzeText,
    loadLocalStorage,
    saveCurrentTokenCountToDictionary,
    handleCurrentTokenDictionary,
    saveToLocalStorage,
    downloadCSVFromDictionary,
} from './utils/frequency_dictionary_data_handling.js';

import {
    buildWordFrequencyTable,
    showGrammarGuide,
} from './utils/ui_utils.js';

//get main document elements
const countFrequencyButton = document.getElementById('countFrequencyButton');
const downloadCurrentTranslationButton = document.getElementById('downloadCurrentTranslationButton');
const dictionaryTabContent = document.getElementById('dictionary-tab-content');
const titleTextContent = document.getElementById('title');

let text = `ここは不思議ふしぎな 時ときの迷宮めいきゅう
閉とざされた記憶きおくが目覚めざめ
なぜここにいる なぜ私わたしなの?
抜ぬけ殻がらの答こたえが踊おどる
夢ゆめだとしてもいい
過去かこを塗ぬり替かえれたら
悪魔あくまにだってなってみせる

覚おぼえてるよ君きみとはじめて
出会であった日ひのことを
なんだか風かぜが優やさしかった (予\感よかんがしてた)
初はじめて会あったのに懐なつかしい
もしかしたら君きみも そう思おもってくれたかな なんて
あれから 毎日まいにちたのしくて
かなしくて
少すこしだけさみしい
そのすべてで胸むねはいっぱい
君きみの名前なまえで 胸むねはいっぱい

025-8- and S04
この声こえ 聴きこえてますか
もっと教おしえて欲ほしい
いろんな星ほしのこと
いろんな君きみのこと

025-8- and S04
この声こえ 届とどいてますか
もっと聴きかせてほしい
いろんな星ほしのこと
いろんな歌うたのこと

別々べつべつの道みちを歩あるきながら
同おなじ夢ゆめを見みてた
だからひとりじゃなかったよ

失うしなってからそこここに
君きみを見みつけてしまう
髪かみの匂においや後うしろ姿すがた

あれから 毎日まいにち美うつくしくて
さわがしくて
少すこしだけさみしい
ふたりだから
星ほしがきれいで
海うみは深ふかくて
空そらが高たかいんだ

021-5- and F09
この声こえ 聴きこえてますか
もっと教おしえて欲ほしい
いろんな星ほしのこと
いろんな君きみのこと

021-5- and F09
この声こえ 届とどいてますか
もっと聴きかせてほしい
いろんな星ほしのこと
いろんな歌うたのこと

いまの私わたしどうかな
強つよくなれたのかな
そっと 教おしえてほしい

神様かみさまに
恋こいをしてた頃ころは

021-5- and F09
思おもってなかったよ

021-5- and F09
この声こえ 届とどいてますか

021-5- and F09
F09
この声こえ 届とどいてますか
F09
もっと聴きかせてほしい
いろんな星ほしのこと
いろんな君きみのこと

神様かみさまに
025-8- and S04
この声こえ 届とどいてますか
恋こいをしてた頃ころは
もっと聴きかせてほしい
いろんな星ほしのこと

025-8- and S04
(025-8- and S04)
この声こえ 届とどいてますか
025-8- and S04
(025-8- and S04)
もっと聴きかせてほしい

025-8- and S04
S04
この声こえ 届とどいてますか
S04
もっと感かんじていたい
いまあなたといること

025-8- and S04
S04
この声こえ 届とどいてますか
届とどいて
もっと感かんじていたい

いまあなたといること
いまあなたといること(いまあなたといること)
いまあなたといること(いまあなたといること) 
`;

let inputText = document.getElementById('inputText');
inputText.value = text;

let frequency_translation_dictionary = {currentTextTokensCount: {}, allSavedWords: loadLocalStorage()};
if(frequency_translation_dictionary.allSavedWords.entries !== 0) {
  buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
}

//todo: change to ignore count and only update the new word
export function updateInputChangeValue(word, value, component){
  console.log('update input change value');
  if(component === 'translation'){
    frequency_translation_dictionary.currentTextTokensCount[word].translation = value;
  } else if(component === 'hiragana_reading'){
    frequency_translation_dictionary.currentTextTokensCount[word].hiragana_reading = value;
  }
  frequency_translation_dictionary.allSavedWords[word] = frequency_translation_dictionary.currentTextTokensCount[word];
}

export function updateCategoryChangeValue(word, category){
  frequency_translation_dictionary.allSavedWords[word].category = category;  
}

export function addWordToDictionaryFromNewRow(newWord){
  frequency_translation_dictionary.allSavedWords[newWord.word] = newWord;
  buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
}

//set up event listeners on load
document.addEventListener('DOMContentLoaded', () => {
    //error handling event listeners
    document.getElementById('inputText').addEventListener('input', () => {
        countFrequencyButton.classList.remove('error');
    });

    //ui-utils event listeners
    document.getElementById('word-frequency-output-button').addEventListener('click', async () => {
      buildWordFrequencyTable(frequency_translation_dictionary.currentTextTokensCount, dictionaryTabContent);
      makeElementFromToken(frequency_translation_dictionary.currentTextTokensCount);

      //take the input text field, replace all tokens with hoverable spans
      // const text = inputText.value;
      // const tokens = text.split(' ');
      // const newTokens = tokens.map(token => {
      //   const span = document.createElement('span');
      //   span.classList.add('token');
      //   span.innerText = token;
      //   return span;
      // });
    });

    document.getElementById('grammar-guide-button').addEventListener('click', () => {
        showGrammarGuide(dictionaryTabContent);
    });

    document.getElementById('hidePreviousTranslationsCheckbox').addEventListener('change', () => {
        handleHidePreviousTranslations(hidePreviousTranslationsCheckbox, wordTokenFrequencyCount)
    });

    //frequency dictionary data handler event listeners
    document.getElementById('countFrequencyButton').addEventListener('click', async () => {
        let wordTokenFrequencyCount = await analyzeText(inputText.value, countFrequencyButton, downloadCurrentTranslationButton );
        frequency_translation_dictionary.currentTextTokensCount = handleCurrentTokenDictionary(wordTokenFrequencyCount, frequency_translation_dictionary.allSavedWords);
        saveCurrentTokenCountToDictionary(frequency_translation_dictionary.currentTextTokensCount, frequency_translation_dictionary.allSavedWords);
        buildWordFrequencyTable(frequency_translation_dictionary.currentTextTokensCount, dictionaryTabContent);
    });

    //this saves current entries to local storage for the frequency translation dictionary
    document.getElementById('saveTranslationLocalButton').addEventListener('click', async () => { 
      saveToLocalStorage(frequency_translation_dictionary.allSavedWords);
    });

    document.getElementById('frequency-dictionary-button').addEventListener('click', async() => {
        buildWordFrequencyTable(frequency_translation_dictionary.allSavedWords, dictionaryTabContent);
    });

    document.getElementById('frequency-dictionary-upload').addEventListener('change', (e) => {
      const reader = new FileReader();
      reader.readAsText(e.target.files[0]);
      const dictionary = {};

      reader.onload = function(e) {
        const text = reader.result;
        const rows = text.split('\n');

        rows.forEach(row => {
          const [word, count, translation, hiragana_reading, category] = row.split(',');
          dictionary[word] = { count:count, translation: translation, hiragana_reading: hiragana_reading, category: category };
        });
        buildWordFrequencyTable(dictionary, dictionaryTabContent);
      };
      frequency_translation_dictionary.allSavedWords = dictionary;
      frequency_translation_dictionary.currentTextTokensCount = dictionary;
    });

    document.getElementById(`downloadCurrentTranslationButton`).addEventListener('click', () => {
      downloadCSVFromDictionary(frequency_translation_dictionary.currentTextTokensCount, titleTextContent?.value);
    });
    
    document.getElementById('downloadFullTranslationFrequencyDictionaryButton').addEventListener('click', () => {
      downloadCSVFromDictionary(frequency_translation_dictionary.allSavedWords);
    });

    //translation event listeners
    document.getElementById('translate-button').addEventListener('click', () => {
        const text = document.getElementById('inputText').value;
        translateText(text, "EN");
    });
});