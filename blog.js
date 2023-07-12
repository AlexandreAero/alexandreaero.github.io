const rawPostUrl = 'https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/';
const repoContentUrl = 'https://api.github.com/repos/AlexandreAero/alexandreaero.github.io/contents/posts';

const converter = new showdown.Converter({ metadata: true });

/**
 * Loads the blog posts and builds the UI for them.
 * @param {[string]} posts 
 */
async function loadPosts(posts) {
  const parentHolder = document.getElementById('blog-posts');

  try {
    for (const post of posts) {
      const response = await fetch(post);
      const text = await response.text();
      const html = converter.makeHtml(text);
      const metadata = converter.getMetadata();
      const tags = metadata.tags.split(';');
    
      const str = `
        <div id="post">
          <h2 class="date">${metadata.date}</h2>
          <div class="post-content">
            <img class="thumbnail" src=${metadata.thumbnail}>
            <h1 class="title">${metadata.title}<h1>
            <div class="tags-container">
              ${tags.map(tag => `<h1>${tag}</h1>`).join('')}
            </div>
            <p>
              ${metadata.description_1}
            </p>
            <p>
              ${metadata.description_2}
            </p>
          </div>
        </div>
        <hr>
      `;

      parentHolder.insertAdjacentHTML('afterbegin', str);
    }
  } catch (error) {
    console.error(error);
  }
}

fetch(repoContentUrl)
  .then((response) => response.json())
  .then((data) => data.map(item => `${rawPostUrl}${item.name}`))
  .then(loadPosts)
  .catch((error) => console.error(error));
  