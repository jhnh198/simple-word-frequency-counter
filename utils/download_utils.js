function downloadFullDictionary() {
  const blob = new Blob([JSON.stringify(frequency_translation_dictionary, null, "\t")], { type: 'text/plain' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `frequency_translation_dictionary.txt`;
  a.click();
}

function saveToCSV() {
  const header = 'Word,Count,Translation,Category\n';
  const csv = Object.entries(frequency_translation_dictionary).map(([word, data]) => {
      return `${word},${data.count},${data.translation},${data.category}`;
  }).join('\n');

  const blob = new Blob([header, csv], { type: 'text/csv' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `frequency_translation_dictionary.csv`;
  a.click();
}