let url = 'https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/a.json';

fetch(url)
.then((res) => res.json())
.then((out) => {
    document.getElementById("title").innerHTML = out["title"];
    document.getElementById("author").innerHTML = out["author"];
    document.getElementById("date").innerHTML = out["date"];
    document.getElementById("description").innerHTML = out["description"];

    const contentWrapper = document.getElementById("main-content-wrapper");

    let obj = JSON.parse(out);

    let content = obj["content"];

    for(let sectionI = 0; sectionI < Object.keys(content).length; sectionI++) {
        for(let lineI = 0; lineI < Object.keys(content[i]["lines"]).length; lineI++) {
            console.log(content[sectionI]["lines"][lineI]);
        }
    }
})
.catch((err) => {
    throw err 
});