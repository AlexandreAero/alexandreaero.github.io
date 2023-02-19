const RAW_POST_URL = 'https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/';
const REPO_CONTENT_URL = 'https://api.github.com/repos/AlexandreAero/alexandreaero.github.io/contents/posts';

const converter = new showdown.Converter({metadata: true});

/**
 * Loads the blog posts and builds the UI for them.
 * @param {[string]} posts 
 */
async function loadPosts(posts) {
  const mainDiv = document.getElementById('blog-posts');

  try {
    for (const post of posts) {
      const response = await fetch(post);
      const text = await response.text();
      const html = converter.makeHtml(text);
      const metadata = converter.getMetadata();
      const tags = metadata.tags.split(';');

      const str = `
        <section onclick="location.href='./post.html'; sessionStorage.setItem('page', '${post}');">
          <img src=${metadata.thumbnail}>
          <div class="tags">
            ${tags.map(tag => `<h1>${tag}</h1>`).join('')}
          </div>
          <h1 id="title">${metadata.title}</h1>
          <h2 id="author">${metadata.author}</h1>
          <h3 id="date">${metadata.date}</h3>
          <h3 id="description">${metadata.description}</h3>
        </section>
      `;

      mainDiv.insertAdjacentHTML('beforeend', str);
    }
  } catch (error) {
    console.error(error);
  }
}

fetch(REPO_CONTENT_URL)
.then(response => response.json())
.then(data => data.map(item => `${RAW_POST_URL}${item.name}`))
.then(loadPosts)
.catch(error => console.error(error));