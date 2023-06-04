/**
 * Represents an easter egg star.
 */
class star {
  constructor(parentContainerDiv) {
    this.container = parentContainerDiv;
    this.dom = document.createElement('div');
  }

  /**
   * Visually spawns the star with a random positon.
   */
  spawn() {
    const randomX = Math.random() * (this.container.offsetWidth - this.dom.offsetWidth);
    const randomY = Math.random() * (this.container.offsetHeight - this.dom.offsetHeight);

    this.dom.className = 'shooting-star';

    this.dom.style.left = randomX + 'px';
    this.dom.style.top = randomY + 'px';

    this.container.append(this.dom);
  }
}

/**
 * Setups the shooting star easter egg.
 */
function setupShootingStarsEasterEgg() {
  const container  = document.getElementById('shooting-stars-container');
  const MAX_STARS  = 10;   // We recycle 10 stars at max
  const MS         = 100 ; // Spawn a star every 100ms
  
  let activeStars  = [];   // Keep track of our active stars
  let interval     = null;
  let enteredChars = '';

  document.addEventListener('keydown', (event) => {
    const keyChar = event.key;
    enteredChars += keyChar;

    if (enteredChars.includes('pilotalex')) {
      enteredChars = '';
      clearInterval(interval);
      interval = setInterval(() => {
        generateStars(MAX_STARS, activeStars, container);
      }, MS);
    }

    setTimeout(() => {
      clearInterval(interval);
    }, 10000);
  });
}

/**
 * Helper function to create and spawn ``count`` stars and
 * populates the ``activeStars`` array.
 * @param {Number} count 
 * @param {Array} activeStars 
 * @param {DOM Element} container 
 */
function generateStars(count, activeStars, container) {
  const spawnStar = new star(container);
  spawnStar.spawn();

  activeStars.push(spawnStar.dom);

  // Remove the oldest star if the maximum limit is reached
  if (activeStars.length > count) {
    const oldestStar = activeStars.shift();
    oldestStar.remove();
  }
}

/**
 * Handles the show hide animations for the thechnologie cards.
 */
function showHideAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  });

  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((elm) => observer.observe(elm));
}

/**
 * Creates the project section carousel with TNS.
 */
function createProjectCarousel() {
  const tnsCfg = {
    container: '.projects-carousel',
    items: 1,
    autoplayButtonOutput: false,
    loop: false,
    rewind: true,
    fixedWidth: 400,
    swipeAngle: false,
    speed: 400,
    autoplay: true,
    controls: false,
    autoplayTimeout: 2000,
  };
  
  tns(tnsCfg);
}

/**
 * Creates the github commit chart.
 */
function createCommitChart() {
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
        pointRadius: 0,
        fill: 'stack',
        backgroundColor: 'rgba(255, 255, 255, 0.35)'
      }]
    }
  };
  
  const githubUsername = 'AlexandreAero';
  const currentYear = new Date().getFullYear();
  
  countCommitsForYearAndMonth(githubUsername, currentYear).then((count) => {
    chartCfg.data.labels = Object.keys(count);
    chartCfg.data.datasets[0].data = Object.values(count);
    
    const ctx = document.getElementById('github-commits-graph');
    
    new Chart(ctx, chartCfg);
  });
}

/**
 * Retrieve the total commit counts for all GitHub repositories
 * for each month in a given year
 * @param {String} username
 * @param {Number} year
 * @returns {Promise<{[string]: number}>}
 */
async function countCommitsForYearAndMonth(username, year) {
  // Check the cache
  const cacheKey = `${username}-${year}-data`;
  const cacheData = localStorage.getItem(cacheKey);
  const cacheDate = localStorage.getItem(`${cacheKey}-date`);
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (cacheData && cacheDate && Date.now() - new Date(cacheDate) < oneDayMs) {
    console.log(`No data update needed, last update was: ${cacheDate}`);
    console.log(`Returning cached data for ${username} ${year}`);
    return JSON.parse(cacheData);
  }

  console.log(`Fetching and updating new data for ${username} ${year}`);

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

  // Store the data in the cache
  localStorage.setItem(cacheKey, JSON.stringify(sortedCommitCounts));
  localStorage.setItem(`${cacheKey}-date`, new Date());

  return sortedCommitCounts;
}

setupShootingStarsEasterEgg();
showHideAnimations();
createProjectCarousel();
createCommitChart();
