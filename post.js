const converter = new showdown.Converter({metadata: true});

fetch(sessionStorage.getItem('page'))
.then((res) => res.text())
.then((out) => {
  const html = converter.makeHtml(out);

  const metadata = converter.getMetadata();

  document.getElementById('title').innerHTML = metadata['title'];
  document.getElementById('author').innerHTML = metadata['author'];
  document.getElementById('date').innerHTML = metadata['date'];
  document.getElementById('description').innerHTML = metadata['description'];

  const contentWrapper = document.getElementById('main-content-wrapper');

  contentWrapper.insertAdjacentHTML('beforeend', html);

  hljs.highlightAll();
})
.catch((err) => {
  throw err;
});