
import SortableTable from "./utils/SortableTable.js";

//todo: need to add node.js and server to write to dictionary file
//todo: add words to the json file from inputs
//todo: update json with frequency count words

//get main document elements
const titleInput = document.getElementById('title-input');
const freeTranslationTextArea = document.getElementById('free-translation-text-area');

let inputText = document.getElementById('input-text');
let text = `君の声が届かない場所では
誰も教えてくれなかった 歪んだルール

幼い頃に強く願った
夢のありかを探す旅は始まったばかり

嘆いた時間はもう要らない
限界の壁を今すぐ壊して

枯れない強い想いで輝くプライド
どんな痛みに触れたとしても変わらない記憶

視界を拡げて見つけた誓いを抱いて
曇りなき眼で 選んだ道を
君に繋ぐから

声を響かせて
運命に抗ってゆけ

このままずっと息を殺して
変わらない未来 睨み続け 生きていたくはない

ちぎれた心 拾い集め
情熱の海へ今すぐ飛び込め

Go to the outside of daydream, break your limits

叶えたい弱い自分に宿したプライド
孤独の波に飲み込まれても 変わらない願い

理想を掲げて見つけた希望を抱いて
まだ見ぬ明日で 微笑む君に辿り着けるから
声が届くまで 運命を貫いてゆけ

震える肩を抱き寄せ笑う
君がいるから 歌い続けるよ

枯れない強い想いで輝くプライド
どんな痛みに触れたとしても変わらない記憶

視界を拡げて見つけた誓いを抱いて
曇りなき眼で 選んだ道を
君に繋ぐから

声を響かせて
逆境を切り裂いてゆけ
運命に抗ってゆけ
Proud of myself, ah`;
inputText.value = text;

const sortable_table = new SortableTable();

//set up event listeners on load
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('grammar-guide-button').addEventListener('click', () => {
    sortable_table.createGrammarGuide();
  });

    document.getElementById('hide-previous-translations-checkbox').addEventListener('change', (e) => {
      if (e.target.value === 'on') {
        document.querySelectorAll('input').forEach(container => {
          container.value = '';
        })
        Object.entries(frequency_translation_dictionary.currentTextTokensCount).forEach(([word]) => {
          const input = document.getElementById(word);
          input.value = frequency_translation_dictionary[word]?.translation || '';
        });
      }
    });

    document.getElementById('count-frequency-button').addEventListener('click', async (e) => {
      try {
        sortable_table.dictionary.processText(inputText.value);
        sortable_table.buildWordFrequencyTable(true, false);
      } catch (error) {
        console.error('Error processing text:', error); 
      }
    });

    document.getElementById('download-json-button').addEventListener('click', () => {
      sortable_table.dictionary.downloadJSONFromDictionary(titleInput?.value);
    });

    document.getElementById('frequency-dictionary-button').addEventListener('click', async() => {
      sortable_table.buildWordFrequencyTable();
    });

    document.getElementById('word-frequency-output-button').addEventListener('click', () => {
      try {
        sortable_table.dictionary.processText(inputText.value);
        sortable_table.buildWordFrequencyTable(true, false);
      } catch (error) {
        console.error('Error processing text:', error); 
      }
    });

    document.getElementById('frequency-dictionary-upload').addEventListener('change', (e) => {
      sortable_table.dictionary.handleFrequencyDictionaryUpload(e);
      sortable_table.buildWordFrequencyTable();
    });

    document.getElementById(`download-current-translation-button`).addEventListener('click', () => {
      sortable_table.dictionary.downloadCSVFromDictionary(titleInput?.value);
    });
    
    document.getElementById('download-full-dictionary-button').addEventListener('click', () => {
      sortable_table.dictionary.downloadCSVFromDictionary(titleInput?.value);
    });

    //translation event listeners
    document.getElementById('translate-button').addEventListener('click', () => {
      translateText(inputText.value, "EN");
    }); 

    document.getElementById('clear-input-button').addEventListener('click', () => {
      inputText.value = '';
      freeTranslationTextArea.value = '';
      titleInput.value = '';
    });

    document.getElementById('focus-words-button').addEventListener('click', () => {
      let isFocusedWords = true;
      let isCurrentWords = false;
      sortable_table.dictionary.processText(inputText.value);
      sortable_table.buildWordFrequencyTable(isCurrentWords, isFocusedWords);
    });

    document.getElementById('help-section-button').addEventListener('click', () => {
      sortable_table.createHelpGuide();
    });

    //todo: create hover for token words
    document.getElementById('hover-content-button').addEventListener('click', () => {
      console.log('hover content button clicked');
      });
      //1 get tokens from text if not already done
      // make the table words into hover elements and highlight all instances of the word by adding a class to each span matching the word
      //2 replace all tokens with span tags
      //3 add event listeners to each span tag
      //4 create a hover div
      //5 add the hover div to the body
      //6 add event listeners to the hover div
      //7 remove the hover div when mouse leaves
      //8 add the translation to the hover div
      //9 add the hiragana reading to the hover div
      //10 add the category to the hover div
});