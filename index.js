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
const formattedMonths = Array.from({length: 12}, (_, i) => `${year}-${i+1}`);

getCommitCountsForMonths('AlexandreAero', 'alexandreaero.github.io', formattedMonths)
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
 * Retrieve the commit counts for a GitHub repository
 * for each month in a given year
 * @param {string} username 
 * @param {string} repo 
 * @param {[string]} months 
 * @returns 
 */
function getCommitCountsForMonths(username, repo, months) {
  const apiUrlTemplate = `https://api.github.com/repos/${username}/${repo}/commits?since=<MONTH>-01T00:00:00Z&until=<MONTH>-31T23:59:59Z`;
  
  const apiUrls = months.map(month => apiUrlTemplate.replace(/<MONTH>/g, month));
  
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
        result[month] = commitCounts[index];
      });
      return result;
    });
}