const apiKey = ''; // Replace with your actual API key

async function translateText(text, targetLang) {
  const url = 'https://api-free.deepl.com/v2/translate';

  try {
      const response = await axios.post(url, null, {
          params: {
              auth_key: apiKey,
              text: text,
              target_lang: targetLang,
              source_lang: 'JA'
          }
      });
      
      return response.data.translations[0].text;
  } catch (error) {
      console.error('Error translating text:', error);
      document.getElementById('output').innerText = 'Translation error';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('translateButton').addEventListener('click', () => {
      const text = document.getElementById('textInput').value;
      const targetLang = document.getElementById('languageSelect').value;
      translateText(text, targetLang);
  });
});