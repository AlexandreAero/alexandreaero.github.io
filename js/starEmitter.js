/**
 * Easter egg star emitter which emits a certain amount of
 * stars when needed.
 */
class StarEmitter {
    /**
     * Creates a new star emitter.
     * @param {Number} spawnIntervalMs 
     * @param {Number} maxStars 
     */
    constructor(spawnIntervalMs, maxStars) {
        this.spawnIntervalMs = spawnIntervalMs;
        this.maxStars = maxStars;

        this.starStack = [];
        this.interval = null;
        this.charStack = '';

        this.bindEventListeners();
    }

    /**
     * Binds the event listeners.
     */
    bindEventListeners() {
        document.addEventListener('keydown', (event) => {
            const keyChar = event.key;
            this.charStack += keyChar;

            if (this.charStack.includes('pilotalex')) {
                this.charStack = '';
                clearInterval(this.interval);

                this.interval = setInterval(() => {
                    this.generateStars(this.maxStars, shootingStarsContainer);
                }, this.spawnIntervalMs);
            }

            setTimeout(() => clearInterval(this.interval), 10000);
        });
    }

    /**
     * Creates and spawns ``count`` stars.
     * @param {Number} count 
     * @param {HTMLElement} container 
     */
    generateStars(count, container) {
        const newStar = new Star(container);
        newStar.spawn();

        this.starStack.push(newStar.div);

        if (this.starStack.length > count) {
            const oldestStar = this.starStack.shift();
            oldestStar.remove();
        }
    }
}

const emitter = new StarEmitter(100, 20);
