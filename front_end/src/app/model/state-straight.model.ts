import { CardState } from './card-state.model';

export class StateStraight extends CardState {
    constructor() {
        super();
    }

    /**
     * 右から左へ流す
     */
    setCoordLikeNico() {
        const px = 900;
        const minY = 100;
        const maxY = 400;
        const py = Math.random() * maxY + minY;
        const start = { x: px, y: py };
        const end = { x: -px, y: py };
        this.setCoordManual(start, end);
    }
}
