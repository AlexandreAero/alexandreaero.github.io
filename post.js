fetch("https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/a.json")
.then((res) => res.json())
.then((out) => {
    document.getElementById("title").innerHTML = out["title"];
    document.getElementById("author").innerHTML = out["author"];
    document.getElementById("date").innerHTML = out["date"];
    document.getElementById("description").innerHTML = out["description"];

    let contentWrapper = document.getElementById("main-content-wrapper");
    
    let content = out["content"];

    for(let sectionI = 0; sectionI < Object.keys(content).length; sectionI++) {
        let textStr = `<h2 id="sub-section-title">${content[sectionI]["title"]}</h2>`;

        contentWrapper.insertAdjacentHTML("beforeend", textStr);
        for(let lineI = 0; lineI < Object.keys(content[sectionI]["lines"]).length; lineI++) {
            let line = content[sectionI]["lines"][lineI];

            if(line.includes("[CODE]")) {
                let lineCpy = line.replace("[CODE]", "");
                let str = `<pre><code>${lineCpy}</code></pre>`;

                contentWrapper.insertAdjacentHTML("beforeend", str);
            } else if(line.includes("[QUOTE]")){
                let lineCpy = line.replace("[QUOTE]", "");
                let str = `<q>${lineCpy}</q>`;

                contentWrapper.insertAdjacentHTML("beforeend", str);
            } else {
                let str = `<h3>${line}</h3>`;

                contentWrapper.insertAdjacentHTML("beforeend", str);
            }
        }
    }

    hljs.highlightAll();
})
.catch((err) => {
    throw err 
});