let url = 'https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/a.json';

fetch(url)
.then((res) => res.json())
.then((out) => {
    document.getElementById("title").innerHTML = out["title"];
    document.getElementById("author").innerHTML = out["author"];
    document.getElementById("date").innerHTML = out["date"];
    document.getElementById("description").innerHTML = out["description"];

    const content = document.getElementById("main-content-wrapper");
})
.catch((err) => { 
    throw err 
});