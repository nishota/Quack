export class CardState {
    coord = { x: 0, y: 0 };
    coordBefore = { x: 0, y: 0 };
    scale = 1;
    opacity = 1;
    // public color: string;
    constructor() { }

    /**
     * 座標を指定する。始点、終点を決めて移動させる。
     */
    setCoordManual(start: { x: number, y: number, }, end: { x: number, y: number }) {
        this.coordBefore = start;
        this.coord = end;
    }

    /**
     * Beforeから指定位置に移動するように設定する。
     * @param xNext ブラウザの横方向(右が正)
     * @param yNext ブラウザの縦方向（下が正)
     */
    setCoordTo(xNext: number, yNext: number) {
        this.setCoordManual(this.coord, { x: xNext, y: yNext });
    }

    init() {
        this.initCoord();
        this.initScale();
        this.initOpacity();
    }

    initCoord() {
        this.coord = { x: 0, y: 0 };
        this.coordBefore = { x: 0, y: 0 };
    }

    initScale() {
        this.scale = 1;
    }

    initOpacity() {
        this.opacity = 1;
    }

    set Scale(scale: number) {
        this.scale = scale;
    }

    set Opacity(opacity: number) {
        this.opacity = opacity;
    }
}

export class StateStraight extends CardState {

    constructor() {
        super();
    }

    /**
     * カードを右から左へ流す
     * @param x 横幅
     * @param index 画面内の縦方向のカード数
     */
    setCoordRightToLeft(x: number, index: number) {
        const px = x / 2;
        const minY = 10;
        const py = 100 * index + minY;
        const start = { x: px, y: py };
        const end = { x: -px, y: py };
        this.setCoordManual(start, end);
    }
}
