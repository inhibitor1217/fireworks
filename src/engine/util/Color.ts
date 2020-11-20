const hexcodeRegex = /^0x([0-9a-fA-F]{6})$|^0x([0-9a-fA-F]{8})$/

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

    static copy(other: Color) {
        return new Color(other.r, other.g, other.b, other.a);
    }

    static hex(hexcode: string): Color {
        if (hexcodeRegex.test(hexcode)) {
            const hasAlpha = hexcode.length === 10;
            const a = hasAlpha ? parseInt(hexcode.substr(2, 2), 16) / 255.0 : 1;
            const r = parseInt(hexcode.substr(hasAlpha ? 4 : 2, 2), 16) / 255.0;
            const g = parseInt(hexcode.substr(hasAlpha ? 6 : 4, 2), 16) / 255.0;
            const b = parseInt(hexcode.substr(hasAlpha ? 8 : 6, 2), 16) / 255.0;

            return new Color(r, g, b, a);
        } else {
            console.warn(`given hexcode does not have correct pattern: ${hexcode}`);
            return Colors.white;
        }
    }

    get values(): Array<number> {
        return [this.r, this.g, this.b, this.a];
    }
}

export const Colors = {
    black: new Color(0, 0, 0),
    white: new Color(1, 1, 1),
    red: new Color(1, 0, 0),
    green: new Color(0, 1, 0),
    blue: new Color(0, 0, 1),
};