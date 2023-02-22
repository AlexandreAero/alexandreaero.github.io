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

    console.log(count);
    console.log(`No data update needed, last update was: ${sessionStorage.getItem('lastUpdateDate')}`);
  } else {
    // Data needs update
    const currentYear = new Date().getFullYear();
    const count = await countCommitsForYearAndMonth(githubUsername, currentYear);

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
async function countCommitsForYearAndMonth(username, year) {
  const repos = await fetch(`https://api.github.com/users/${username}/repos`).then(res => res.json());

  const commitCounts = {};

  // Initialize the commit counts for all months in the year to zero
  for (let month = 1; month <= 12; month++) {
    const monthYearString = `${year}-${month.toString().padStart(2, '0')}`;
    commitCounts[monthYearString] = 0;
  }

  for (const repo of repos) {
    const commits = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits`).then(res => res.json());

    for (const commit of commits) {
      const commitDate = new Date(commit.commit.author.date);

      if (commitDate.getFullYear() === year) {
        const monthYearString = `${commitDate.getFullYear()}-${(commitDate.getMonth() + 1).toString().padStart(2, '0')}`;
        commitCounts[monthYearString] += 1;
      }
    }
  }

  // Sort the commit counts by month
  const sortedCommitCounts = {};
  Object.keys(commitCounts)
    .sort()
    .forEach(monthYearString => {
      sortedCommitCounts[monthYearString] = commitCounts[monthYearString];
    });

  return sortedCommitCounts;
}

init();