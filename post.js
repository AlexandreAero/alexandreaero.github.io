const converter = new showdown.Converter();

const table = `
|key|value|
|-----------|-----------|
|title|That time my Discord server has been raided because of a dumb mistake.|
|author|By Pilot Alex|
|date|24/09/2022|
|description|I used to have a Discord server a little while ago with my friends, it was a private server with only 4-5 people in it. But things started to get messy when I developed a Discord bot that leaked our server secret key.|
|tags|Discord;Server;Bot;JavaScript|
|thumbnail|https://avatars.githubusercontent.com/u/26492485?s=200&v=4|
`;

fetch(sessionStorage.getItem('page'))
.then((res) => res.text())
.then((out) => {
    document.getElementById("title").innerHTML = getTableValue(table, "title");
    document.getElementById("author").innerHTML = getTableValue(table, "author");
    document.getElementById("date").innerHTML = getTableValue(table, "date");
    document.getElementById("description").innerHTML = getTableValue(table, "description");

    let contentWrapper = document.getElementById("main-content-wrapper");
    let html = converter.makeHtml(out);

    contentWrapper.insertAdjacentHTML("beforeend", html);

    hljs.highlightAll();
});

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