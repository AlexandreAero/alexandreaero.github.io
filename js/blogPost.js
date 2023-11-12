/**
 * A blog post containing data about the post.
 */
class BlogPost {
    /**
     * Creates a new blog post.
     * @param {String} url 
     * @param {String} title 
     * @param {String} author 
     * @param {String} date 
     * @param {String} description 
     * @param {Object} metadata 
     */
    constructor(url, title, author, date, description, metadata) {
        this.url = url;
        this.title = title;
        this.author = author;
        this.date = date;
        this.description = description;
        this.metadata = metadata;
    }

    async show() {
        location.href = '../html/post.html';

        try {
            const response = await fetch(this.url);
            const markdownText = await response.text();
    
            const html = converter.makeHtml(markdownText);
            const metadata = converter.getMetadata();
    
            document.getElementById('title').innerHTML = metadata.title;
            document.getElementById('author').innerHTML = metadata.author;
            document.getElementById('date').innerHTML = metadata.date;
            document.getElementById('description').innerHTML = metadata.description;
    
            const contentWrapper = document.getElementById('main-content-wrapper');
            contentWrapper.insertAdjacentHTML('beforeend', html);
    
            hljs.highlightAll();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Creates the HTML DOM of a post and returns the parent element.
     * @returns 
     */
    getPreviewView() {
        const tags = this.metadata.tags.split(';');

        const parent = document.createElement('div');
        parent.onclick = () => this.show();
        parent.className = 'post';

        const date = document.createElement('h2');
        date.className = 'date';
        date.innerHTML = this.metadata.date;

        const content = document.createElement('div');
        content.className = 'post-content';

        const thumbnail = document.createElement('img');
        thumbnail.alt = 'Blog thumbnail';
        thumbnail.className = 'thumbnail';
        thumbnail.src = this.metadata.thumbnail;

        const title = document.createElement('h1');
        title.className = 'title';
        title.innerHTML = this.metadata.title;

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tags-container';

        tags.forEach((tag) => {
            const tagElement = document.createElement('h1');
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });

        const desc1 = document.createElement('p');
        desc1.innerHTML = this.metadata.description_1;

        const desc2 = document.createElement('p');
        desc2.innerHTML = this.metadata.description_2;

        const hr = document.createElement('hr');

        content.append(thumbnail, title, tagsContainer, desc1, desc2);

        parent.append(date, content);

        return parent;
    }
}
