const baseUrl = 'https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/';

// TODO: make this more "automatic"
const posts = [
  `${baseUrl}/0001.md`,
  `${baseUrl}/0002.md`
];

const converter = new showdown.Converter({metadata: true});

for(let i = 0; i < posts.length; i++) {
  fetch(posts[i])
  .then((res) => res.text())
  .then((out) => {
    let html = converter.makeHtml(out);

    const metadata = converter.getMetadata();

    const tags = metadata['tags'].split(';');

    let str = `
      <section onclick="location.href='./post.html'; sessionStorage.setItem('page', '${posts[i]}');">
        <img src=${metadata['thumbnail']}>
        <div class="tags">
          <h1>${tags[0]}</h1>
          <h1>${tags[1]}</h1>
          <h1>${tags[2]}</h1>
          <h1>${tags[3]}</h1>
        </div>
          <h1 id="title">${metadata['title']}</h1>
          <h2 id="author">${metadata['author']}</h1>
          <h3 id="date">${metadata['date']}</h3>
          <h3 id="description">${metadata['description']}</h3>
        </section>
      `;

    const mainDiv = document.getElementById('blog-posts');

    mainDiv.insertAdjacentHTML('beforeend', str);
  })
  .catch((err) => {
    throw err;
  });
}
