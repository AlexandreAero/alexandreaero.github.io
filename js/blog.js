const rawPostUrl = 'https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/';
const repoContentUrl = 'https://api.github.com/repos/AlexandreAero/alexandreaero.github.io/contents/posts';

const converter = new showdown.Converter({ metadata: true });

/**
 * Opens the blog post located at ``url``.
 * @param {String} url 
 */
function openPost(url) {
    location.href = './post.html';
    sessionStorage.setItem('page', url);
}

/**
 * Creates the HTML Dom of a post.
 * @param {String} url 
 * @param {Object} metadata 
 * @returns 
 */
function renderPost(url, metadata) {
    const tags = metadata.tags.split(';');
    return `
        <div class="post" onclick="openPost('${url}')">
            <h2 class="date">${metadata.date}</h2>
            <div class="post-content">
                <img class="thumbnail" src="${metadata.thumbnail}">
                <h1 class="title">${metadata.title}</h1>
                <div class="tags-container">
                    ${tags.map(tag => `<h1>${tag}</h1>`).join('')}
                </div>
                <p>${metadata.description_1}</p>
                <p>${metadata.description_2}</p>
            </div>
        </div>
        <hr>`;
}

/**
 * Loads the blog posts and builds the UI for them.
 * @param {[String]} postUrls 
 */
async function buildPosts(postUrls) {
    const postHolder = document.getElementById('blog-posts');

    try {
        for (const url of postUrls) {
            const response = await fetch(url);
            const text = await response.text();
            const html = converter.makeHtml(text);
            const metadata = converter.getMetadata();
            const postHtml = renderPost(url, metadata);
            postHolder.insertAdjacentHTML('afterbegin', postHtml);
        }
    } catch (error) {
        console.error(error);
    }
}

fetch(repoContentUrl)
    .then((response) => response.json())
    .then((data) => data.map(item => `${rawPostUrl}${item.name}`))
    .then(buildPosts)
    .catch((error) => console.error(error));
