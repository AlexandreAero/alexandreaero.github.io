const rawPostUrl = 'https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/';
const repoContentUrl = 'https://api.github.com/repos/AlexandreAero/alexandreaero.github.io/contents/posts';

/**
 * Handles the blog system and its UI.
 */
class Blog {
    /**
     * Creates the blog system. The parameter is the parent of
     * the blog posts UI.
     * @param {HTMLElement} postContainer 
     */
    constructor(postContainer) {
        this.container = postContainer;
        this.converter = new showdown.Converter({ metadata: true });

        this.init();
    }

    /**
     * Initializes the blog system.
     */
    async init() {
        try {
            const urls = await this.getPostURLs();
            await this.build(urls);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Fetches the URLs of the blog posts.
     * @returns {[String]}
     */
    async getPostURLs() {
        try {
            const response = await fetch(repoContentUrl);
            const data = await response.json();
            return data.map(item => `${rawPostUrl}${item.name}`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Creates the UI for the blog posts.
     * @param {[String]} postUrls 
     */
    async build(postUrls) {
        try {
            for (const url of postUrls) {
                const response = await fetch(url);
                const text = await response.text();

                this.converter.makeHtml(text);

                const metadata = this.converter.getMetadata();
                const post = new BlogPost(url,
                                          metadata.title, 
                                          metadata.author,
                                          metadata.date, 
                                          metadata.description,
                                          metadata);
                const postHtml = post.getPreviewView();

                this.container.appendChild(postHtml);
            }
        } catch (error) {
            throw error;
        }
    }
}

const container = document.getElementById('blog-posts');
const blog = new Blog(container);
