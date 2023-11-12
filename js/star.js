/**
 * Represents an easter egg shooting star.
 */
class Star {
    /**
     * Creates a star object with a parent container element.
     * @param {HTMLElement} parentContainerDiv 
     */
    constructor(parentContainerDiv) {
        this.container = parentContainerDiv;
        this.div = document.createElement('div');
    }

    /**
     * Visually spawns the star with a random position.
     */
    spawn() {
        const randomX = Math.random() * (this.container.offsetWidth - this.div.offsetWidth);
        const randomY = Math.random() * (this.container.offsetHeight - this.div.offsetHeight);

        this.div.className = 'shooting-star';

        this.div.style.left = `${randomX}px`;
        this.div.style.top = `${randomY}px`;

        this.container.append(this.div);
    }
}
