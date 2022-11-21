let url = 'https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/posts/a.json';

fetch(url)
.then(res => res.json())
.then(out =>
  console.log(out["author"]))
.catch(err => { throw err });