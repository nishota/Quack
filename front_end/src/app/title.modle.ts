export class Title {
    public text: string;
    public className: string;
    public coord = { x: 0, y: 0 };
    public coordBefore = { x: 0, y: 0 };
    //public color: string;
    
    constructor(text: string, className: string, color?:string) {
        this.text = text;
        this.className = className;
        //this.color = color;
    }

    /**
     * 座標を指定する。
     * @param x ブラウザの横方向(右が正)
     * @param y ブラウザの縦方向（下が正)
     */
    public setCoord(x: number, y: number) {
        this.coordBefore.x = this.coord.x;
        this.coordBefore.y = this.coord.y;
        this.coord.x = x;
        this.coord.y = y;
    }

    /**
     * 乱数を使って座標計算
     */
    public setCoordRandom() {
        const min = 0;
        const max = 600;
        const value = max + 1 - min;
        this.setCoord(
            Math.ceil(Math.random() * value) + min,
            Math.ceil(Math.random() * value)
        );
    }

    /**
     * now,beforeの座標を0に戻す
     */
    resetCoord() {
        this.setCoord(0, 0);
        this.setCoord(0, 0);
    }
}
