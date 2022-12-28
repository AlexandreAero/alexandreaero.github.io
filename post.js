const converter = new showdown.Converter();

fetch(sessionStorage.getItem('page'))
.then((res) => res.text())
.then((out) => {
  const table = extractTable(out);

  document.getElementById('title').innerHTML = getTableValue(table, 'title');
  document.getElementById('author').innerHTML = getTableValue(table, 'author');
  document.getElementById('date').innerHTML = getTableValue(table, 'date');
  document.getElementById('description').innerHTML = getTableValue(table, 'description');

  let contentWrapper = document.getElementById('main-content-wrapper');
  let html = converter.makeHtml(out);

  contentWrapper.insertAdjacentHTML('beforeend', html);

  hljs.highlightAll();
});

/**
 * 
 * @param {string} out
 * @returns 
 */
function extractTable(out) {
  return out.split('*')[0].trim();
}

/**
 * 
 * @param {string} key
 * @returns 
 */
function getTableValue(table, key) {
  let result = {};
  
  table = table.trim();
  
  let split = table.split('\n');
  
  for(let i = 2; i < split.length; i++) {
    let temp = split[i];
      
    const key = temp.split('|')[1].trim();
    const value = temp.split('|')[2].trim();
  
    result[key] = value;
  }
  
  return result[key];
}