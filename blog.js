const posts = [
    "https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/a.json",
    "https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/b.json"
];

for(let i = 0; i < posts.length; i++) {
    fetch(posts[i])
    .then((res) => res.json())
    .then((out) => {
        let str = `
        <section>
            <img src=${out["thumbnail"]}>
            <div class="tags">
                <h1>${out["tags"][0]}</h1>
                <h1>${out["tags"][1]}</h1>
                <h1>${out["tags"][2]}</h1>
                <h1>${out["tags"][3]}</h1>
            </div>
            <h1 id="title">${out["title"]}</h1>
            <h2 id="author">${out["author"]}</h1>
            <h3 id="date">${out["date"]}</h3>
            <h3 id="description">${out["description"]}</h3>
        </section>
        `;

        const mainDiv = document.getElementById("blog-posts");

        mainDiv.insertAdjacentHTML("beforeend", str);
    })
    .catch((err) => {
        throw err 
    });
}