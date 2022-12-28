// The character that delemits the data table from the post content
const tableSeparator = '*';

/**
 * Extracts the markdown table from the `out` string.
 * @param {string} out
 * @returns The extracted markdown table as a string.
 */
function extractTable(out) {
  return out.split(tableSeparator)[0].trim();
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
