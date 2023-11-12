const projectTiles = document.querySelectorAll('.project-tile');
const githubCommitsGraph = document.getElementById('github-commits-graph');
const shootingStarsContainer = document.getElementById('shooting-stars-container');
const commitmentTiles = [document.querySelector('.first-commitment'),
                         document.querySelector('.second-commitment'),
                         document.querySelector('.third-commitment'),
                         document.querySelector('.fourth-commitment'),
                         document.querySelector('.fifth-commitment'),
                         document.querySelector('.sixth-commitment'),
                         document.querySelector('.seventh-commitment')];

/**
 * Initialize all sub functions and sub systems of the page.
 */
function initialize() {
    initializeCommitmentTiles();
    initializeProjectTileMouseOver();
    createProjectCarousel();
    createCommitChart();
}

/**
 * Handles the tilt effect for the commitment tiles.
 */
function initializeCommitmentTiles() {
    VanillaTilt.init(commitmentTiles, {
        max: 10,
        speed: 3000,
        glare: true,
        "max-glare": 0.2
    });
}

/**
 * Handles the mouse move effect for project tiles.
 */
function initializeProjectTileMouseOver() {
    for (const tile of projectTiles) {
        tile.onmousemove = (e) => handleOnMouseMove(e);
    }
}

/**
 * Handles the mouse move effect for a specific tile.
 * @param {MouseEvent} event
 */
function handleOnMouseMove(event) {
    const { currentTarget: target } = event;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
}

for (const tile of projectTiles) {
    tile.onmousemove = (e) => handleOnMouseMove(e);
}

/**
 * Creates the project section carousel with TNS.
 */
function createProjectCarousel() {
    tns({
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
    });
}

/**
 * Creates the GitHub commit chart.
 */
async function createCommitChart() {
    const githubUsername = 'AlexandreAero';
    const currentYear = new Date().getFullYear();
    const count = await getCountCommitsForYearAndMonth(githubUsername, currentYear);

    const chartCfg = {
        type: 'line',
        data: {
            labels: Object.keys(count),
            datasets: [{
                fill: true,
                label: 'Total commit count this year.',
                data: Object.values(count),
                borderWidth: 4,
                borderColor: 'rgb(115, 110, 250)',
                lineTension: 0.35,
                pointRadius: 0,
                backgroundColor: 'rgba(115, 110, 250, 0.1)'
            }]
        }
    };

    try {
        new Chart(githubCommitsGraph, chartCfg);
    } catch (error) {
        console.error(`Failed to create commit chart: ${error}`);
    }
}

/**
 * Retrieve the total commit counts for all GitHub repositories
 * for each month in a given year
 * @param {String} username
 * @param {Number} year
 * @returns {Promise<{[String]: Number}>}
 */
async function getCountCommitsForYearAndMonth(username, year) {
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
        .forEach((monthYearString) => {
            sortedCommitCounts[monthYearString] = commitCounts[monthYearString];
        });

    // Store the data in the cache
    localStorage.setItem(cacheKey, JSON.stringify(sortedCommitCounts));
    localStorage.setItem(`${cacheKey}-date`, new Date());

    return sortedCommitCounts;
}

initialize();
