import Material from "../../engine/render/Material";
import { getProgram, Programs } from "./programs";

type TwoDimGradientMaterialConfig = {};

export default class TwoDimGradientMaterial extends Material {
    private _config: TwoDimGradientMaterialConfig | undefined;
    get config(): TwoDimGradientMaterialConfig | undefined {
        return this._config;
    }

    constructor(gl: WebGL2RenderingContext, config?: TwoDimGradientMaterialConfig) {
        super(getProgram(gl, Programs.twoDimGradient));

        this._config = config;
    }
}