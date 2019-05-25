export class Card {
    coord = { x: 0, y: 0 };
    coordBefore = { x: 0, y: 0 };
    scale = 1;
    opacity = 1;
    // public color: string;
    constructor() { }

    /**
     * 座標を指定する。連続的に移動するときに利用する
     * @param x ブラウザの横方向(右が正)
     * @param y ブラウザの縦方向（下が正)
     */
    setCoord(x: number, y: number) {
        this.coordBefore.x = this.coord.x;
        this.coordBefore.y = this.coord.y;
        this.coord.x = x;
        this.coord.y = y;
    }
    /**
     * 座標を指定する。始点、終点を決めて移動させる。
     */
    setCoordManual(start: { x: number, y: number, }, end: { x: number, y: number }) {
        this.coordBefore = start;
        this.coord = end;
    }

    init() {
        this.setCoordRandom();
        this.setCoordRandom();
        this.setScaleAndOpacityRandom();
    }

    /**
     * 乱数を使って座標計算
     */
    setCoordRandom() {
        const maxX = 200;
        const minY = 100;
        const maxY = 200;
        const sign = Math.random() > 0.5 ? 1 : -1;
        const coeffX = maxX;
        const coeffY = maxY;

        this.setCoord(
            Math.ceil(sign * Math.random() * coeffX),
            Math.ceil(Math.random() * coeffY) + minY
        );
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


    /**
     * 乱数を使ってスケールと不透明度を計算
     * スケールと不透明度は比例するように設定している
     */
    setScaleAndOpacityRandom() {
        const coef = Math.random();
        this.setScale(coef);
        this.setOpacity(coef);
    }
    /**
     * now,beforeの座標を0に戻す
     */
    resetCoord() {
        this.setCoord(0, 0);
        this.setCoord(0, 0);
    }

    setScale(coefficient: number) {
        this.scale = coefficient * 1.2;
    }

    setOpacity(coefficient: number) {
        this.opacity = coefficient;
    }
}
