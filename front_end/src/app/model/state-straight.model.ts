import { CardState } from './card-state.model';

export class StateStraight extends CardState {

    constructor() {
        super();
    }

    /**
     * 右から左へ流す
     */
    setCoordLikeNico(x: number, index: number) {
        const px = x / 2;
        const minY = 100;
        const py = 100 * index + minY;
        const start = { x: px, y: py };
        const end = { x: -px, y: py };
        this.setCoordManual(start, end);
    }
}
