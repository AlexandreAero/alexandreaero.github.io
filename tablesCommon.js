// The character that delemits the data table from the post content
const tableSeparator = '*';

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
