Word counter that uses tiny segmenter to tokenize japanese script. 

DeepL is also implemented but does not do a good job of translating words due to context
- Save words, frequency and translation to csv or json file that can be imported or exported. 
- Enter translation manually for practice
- Single katakana and hiragana omitted for convenience. This can be removed by removing the appropriate regex
- Empty spaces, numbers, english words and symbols omitted. 
- Implements a default dictionary that will 
