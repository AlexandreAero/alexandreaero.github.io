const converter = new showdown.Converter();

fetch(sessionStorage.getItem('page'))
.then((res) => res.text())
.then((out) => {
  const table = extractTable(out);

  document.getElementById('title').innerHTML = getTableValue(table, 'title');
  document.getElementById('author').innerHTML = getTableValue(table, 'author');
  document.getElementById('date').innerHTML = getTableValue(table, 'date');
  document.getElementById('description').innerHTML = getTableValue(table, 'description');

  let contentWrapper = document.getElementById('main-content-wrapper');
  let html = converter.makeHtml(out);

  contentWrapper.insertAdjacentHTML('beforeend', html);

  hljs.highlightAll();
});
