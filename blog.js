const baseUrl = 'https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/';

const table = `
|key|value|
|-----------|-----------|
|title|That time my Discord server has been raided because of a dumb mistake.|
|author|PilotAlex|
|date|24/09/2022|
|description|I used to have a Discord server a little while ago with my friends, it was a private server with only 4-5 people in it. But things started to get messy when I developed a Discord bot that leaked our server secret key.|
|tags|Discord;Server;Bot;JavaScript|
|thumbnail|https://avatars.githubusercontent.com/u/26492485?s=200&v=4|
`;

// TODO: make this more "automatic"
const posts = [
  `${baseUrl}/0001.md`
  `${baseUrl}/0002.md`,
];

for(let i = 0; i < posts.length; i++) {
  fetch(posts[i])
  .then((res) => res.text())
  .then((out) => {
    const tags = getTableValue(table, "tags").split(";");

    let str = `
      <section onclick="location.href='./post.html'; sessionStorage.setItem('page', '${posts[i]}');">
        <img src=${getTableValue(table, "thumbnail")}>
        <div class="tags">
          <h1>${tags[0]}</h1>
          <h1>${tags[1]}</h1>
          <h1>${tags[2]}</h1>
          <h1>${tags[3]}</h1>
        </div>
          <h1 id="title">${getTableValue(table, "title")}</h1>
          <h2 id="author">${getTableValue(table, "author")}</h1>
          <h3 id="date">${getTableValue(table, "date")}</h3>
          <h3 id="description">${getTableValue(table, "description")}</h3>
        </section>
      `;

    const mainDiv = document.getElementById("blog-posts");

    mainDiv.insertAdjacentHTML("beforeend", str);
  })
  .catch((err) => {
    throw err;
  });
}

/**
 * 
 * @param {string} key 
 * @returns 
 */
function getTableValue(table, key) {
  let result = {};

  table = table.trim();

  let split = table.split("\n");

  for(let i = 2; i < split.length; i++) {
    let temp = split[i];
    
    const key = temp.split("|")[1].trim();
    const value = temp.split("|")[2].trim();

    result[key] = value;
  }

  return result[key];
}