const chartCfg = {
  type: 'line',
  data: {
    labels: undefined,
    datasets: [{
      label: 'Total commit count this year.',
      data: undefined,
      borderWidth: 3,
      borderColor: 'rgb(255, 255, 255)',
      lineTension: 0.2,
    }]
  }
};

const githubUsername = 'AlexandreAero';
const today = new Date().toLocaleDateString();

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

/**
 * Inits the index page.
 */
async function init() {
  if (sessionStorage.getItem('lastUpdateDate') === today) {
    // Get from cache
    const count = JSON.parse(sessionStorage.getItem('count'));
      
    chartCfg.data.labels = Object.keys(count);
    chartCfg.data.datasets[0].data = Object.values(count);

    console.log(`No data updated needed, last update was: ${sessionStorage.getItem('lastUpdateDate')}`);
  } else {
    // Data needs update
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const repoNames = await getRepositoryNames(githubUsername);
    const count = await getCommitCountsForMonths(githubUsername, repoNames, currentYear, months);
  
    sessionStorage.setItem('count', JSON.stringify(count));
    sessionStorage.setItem('lastUpdateDate', today);
  
    console.log("Updated data now");
  }
  
  const ctx = document.getElementById('github-profile-stats');
  
  new Chart(ctx, chartCfg);
}

/**
 * Retrieve the total commit counts for all GitHub repositories
 * for each month in a given year
 * @param {string} username 
 * @param {[string]} repos 
 * @param {number} year 
 * @param {[string]} months 
 * @returns {Promise<{[string]: number}>}
 */
async function getCommitCountsForMonths(username, repos, year, months) {
  const apiUrlTemplate = `https://api.github.com/repos/<USERNAME>/<REPO>/commits?since=<MONTH>-01T00:00:00Z&until=<MONTH>-31T23:59:59Z`;
  
  const apiUrls = repos.flatMap(repo => months.map(month => apiUrlTemplate.replace(/<USERNAME>/g, username).replace(/<REPO>/g, repo).replace(/<MONTH>/g, `${year}-${month.toString().padStart(2, '0')}`)));
  
  const fetchPromises = apiUrls.map(async (apiUrl) => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.length;
    } catch (error) {
      console.error(error);
      return 0;
    }
  });
  
  const commitCounts = await Promise.all(fetchPromises);
  const result = {};
  
  months.forEach((month, index) => {
    const total = commitCounts.slice(index * repos.length, (index + 1) * repos.length).reduce((a, b) => a + b, 0);
    result[`${year}-${month.toString().padStart(2, '0')}`] = total;
  });
  
  return result;
}

/**
 * Retrieve the list of repositories for a GitHub user
 * @param {string} username 
 * @returns {Promise<[string]>}
 */
async function getRepositoryNames(username) {
  const apiUrl = `https://api.github.com/users/${username}/repos`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.map(repo => repo.name);
  } catch (error) {
    console.error(error);
    return [];
  }
}

init();