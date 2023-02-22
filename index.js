// Handle hide and show animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show');
    }
  });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((elm) => observer.observe(elm));

// Chart implementation
const year = new Date().getFullYear();
const months = Array.from({length: 12}, (_, i) => i + 1);

getCommitCountsForMonths('AlexandreAero', ['alexandreaero.github.io'], year, months)
  .then((count) => {
    const ctx = document.getElementById('github-profile-stats');
    const cfg = {
      type: 'line',
      data: {
        labels: Object.keys(count),
        datasets: [{
          label: "Total commit count this year.",
          data: Object.values(count),
          borderWidth: 3,
          borderColor: 'rgb(255, 255, 255)',
          lineTension: 0.2,
        }]
      }
    };

    new Chart(ctx, cfg);
  });

/**
 * Retrieve the total commit counts for all GitHub repositories
 * for each month in a given year
 * @param {string} username 
 * @param {[string]} repos 
 * @param {number} year 
 * @param {[string]} months 
 * @returns {Promise<{[string]: number}>}
 */
function getCommitCountsForMonths(username, repos, year, months) {
  const apiUrlTemplate = `https://api.github.com/repos/<USERNAME>/<REPO>/commits?since=<MONTH>-01T00:00:00Z&until=<MONTH>-31T23:59:59Z`;
  
  const apiUrls = repos.flatMap(repo => months.map(month => apiUrlTemplate.replace(/<USERNAME>/g, username).replace(/<REPO>/g, repo).replace(/<MONTH>/g, `${year}-${month.toString().padStart(2, '0')}`)));
  
  const fetchPromises = apiUrls.map(apiUrl => fetch(apiUrl)
    .then(response => response.json())
    .then(data => data.length)
    .catch(error => {
      console.error(error);
      return 0;
    })
  );
  
  return Promise.all(fetchPromises)
    .then(commitCounts => {
      const result = {};
      months.forEach((month, index) => {
        const total = commitCounts.slice(index * repos.length, (index + 1) * repos.length).reduce((a, b) => a + b, 0);
        result[`${year}-${month.toString().padStart(2, '0')}`] = total;
      });
      return result;
    });
}
