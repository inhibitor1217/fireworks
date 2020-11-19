export default class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    
    constructor(r: number, g: number, b: number, a?: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a || 1.0;
    }

    get values(): Array<number> {
        return [this.r, this.g, this.b, this.a];
    }
}

export const Colors = {
    black: new Color(0, 0, 0),
    white: new Color(1, 1, 1),
};