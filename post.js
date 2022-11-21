let url = 'https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/a.json';

fetch(url)
.then((res) => res.json())
.then((out) => {
    document.getElementById("title").innerHTML = out["title"];
    document.getElementById("author").innerHTML = out["author"];
    document.getElementById("date").innerHTML = out["date"];
    document.getElementById("description").innerHTML = out["description"];

    const contentWrapper = document.getElementById("main-content-wrapper");

    for(let section = 0; section < out["content"]; section++) {
        for(let line = 0; line < out["content"][section]["lines"]; line++) {
            let text = document.createElement("h3");
            text.innerHTML = out["content"][section]["lines"][line];
    
            contentWrapper.innerHTML += text;
        }
    }
})
.catch((err) => {
    throw err 
});