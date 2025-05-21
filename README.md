## Summary
Word counter that uses tiny segmenter to tokenize japanese script. Includes a dictionary of over 1000 Japanese words. 

### How To Use
1. Add Japanese Text to be tokenized
2. Click Return Words and Frequency to return a list of words in the desired text
3. Inputs provided to add english translations of words as well as reading in hiragana
4. Download the current translation to save work and return later
5. Use Upload Frequency Dictionary to bring back past work

Controls: 

- Return Words and Frequency
  - This uses TinySegmenter to tokenize text. Filters are added to the script in Dictionary.analyzeAndFilterCurrentText. Words that are included in the dictionary will have translation and categorization 
    
- Download Full Translation
  - This will download the full translation dictionary in progress as a .csv
- Download Current Translation
  - This will provide a .csv of the current word list and any changes made 
- Download JSON
- Upload Frequency Dictionary
- Push to Translate Using DeepL
- View Full Dictionary
- View Current Dictionary
- View Focus Words
- View Grammar Guide
- View Help
