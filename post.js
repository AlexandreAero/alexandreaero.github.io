const converter = new showdown.Converter({metadata: true});

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
  console.log(converter.getMetadata());

  contentWrapper.insertAdjacentHTML('beforeend', html);

  hljs.highlightAll();
})
.catch((err) => {
  throw err;
});