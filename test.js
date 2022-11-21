let url = 'https://raw.githubusercontent.com/AlexandreAero/alexandreaero.github.io/main/test.json';

fetch(url)
.then(res => res.json())
.then(out =>
  console.log('Checkout this JSON! ', out))
.catch(err => { throw err });