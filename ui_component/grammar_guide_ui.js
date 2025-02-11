export function createGrammarGuide(grammar_guide_data) {
  const grammar_guide_container = document.createElement('div');

  grammar_guide_data.all_data.forEach((section) => {
    const section_container = document.createElement('div');
    section_container.classList.add('section-container');
    grammar_guide_container.appendChild(section_container);

    const header = document.createElement('h2');
    header.textContent = section.header;
    section_container.appendChild(header);

    const subheader = document.createElement('h3');
    subheader.textContent = section.subheader;
    section_container.appendChild(subheader);

    section.content.forEach((content) => {
      if (content.table) {
        const table = document.createElement('table');
        section_container.appendChild(table);

        const thead = document.createElement('thead');
        table.appendChild(thead);

        const tr = document.createElement('tr');
        thead.appendChild(tr);

        content.table.headers.forEach((header) => {
          const th = document.createElement('th');
          th.textContent = header;
          tr.appendChild(th);
        });

        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        content.table.rows.forEach((row) => {
          const tr = document.createElement('tr');
          tbody.appendChild(tr);

          row.forEach((cell) => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
          });
        });
      }

      if (content.list) {
        const ul = document.createElement('ul');
        section_container.appendChild(ul);

        content.list.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = item;
          ul.appendChild(li);
        });
      }
    });
  });
  console.log(grammar_guide_container);
  return grammar_guide_container;
}