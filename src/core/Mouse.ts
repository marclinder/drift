/**
 * Mouse class handles mouse interactions, tracking position and click state.
 *
 * @export
 * @class Mouse
 */
export class Mouse {
    public static x = window.innerWidth / 2;
    public static y = window.innerHeight / 2;
    public static down = false;

    /**
     * Creates an instance of Mouse.
     * @memberof Mouse
     */
    constructor() {
        this.addListeners();
    }
    
    /**
     * Adds event listeners for mouse movement and click events.
     *
     * @private
     * @memberof Mouse
     */
    private addListeners() {
        window.addEventListener('mousemove', (e) => {
            Mouse.x = e.clientX;
            Mouse.y = e.clientY;
        });

        window.addEventListener('mousedown', () => {
            Mouse.down = true;
        });

        window.addEventListener('mouseup', () => {
            Mouse.down = false;
        });
    }

}

const mouse = new Mouse();