import Material from "../../engine/render/Material"
import Color, { Colors } from "../../engine/util/Color"
import { getProgram, Programs } from "./programs";

type TwoDimDefaultMaterialConfig = {
    color?: Color;
}

export default class TwoDimDefaultMaterial extends Material {
    private _config: TwoDimDefaultMaterialConfig | undefined;
    get config(): TwoDimDefaultMaterialConfig | undefined {
        return this._config;
    }

    color: Color;

    constructor(gl: WebGL2RenderingContext, config?: TwoDimDefaultMaterialConfig) {
        super(getProgram(gl, Programs.twoDim));

        this._config = config;
        this.color = this.config?.color || Colors.black;
    }

    start(): void {
        super.start();
        this.program.setFloat('color', this.color.values);
    }
}
