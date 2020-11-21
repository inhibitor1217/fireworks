import Material from "../../engine/render/Material";
import ProgramManager, { Programs } from "./programs";

type TwoDimGradientMaterialConfig = {};

export default class TwoDimGradientMaterial extends Material {
    private _config: TwoDimGradientMaterialConfig | undefined;
    get config(): TwoDimGradientMaterialConfig | undefined {
        return this._config;
    }

    constructor(gl: WebGL2RenderingContext, config?: TwoDimGradientMaterialConfig) {
        super(ProgramManager.getProgram(gl, Programs.twoDimGradient));

        this._config = config;
    }
}