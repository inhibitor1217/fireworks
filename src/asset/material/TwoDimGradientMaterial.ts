import Material from "../../engine/render/Material";
import Program from "../../engine/render/Program";
import { fragmentShader, vertexShader } from "../../resource/material/2dGradient";

type TwoDimGradientMaterialConfig = {};

export default class TwoDimGradientMaterial extends Material {
    private _config: TwoDimGradientMaterialConfig | undefined;
    get config(): TwoDimGradientMaterialConfig | undefined {
        return this._config;
    }

    constructor(gl: WebGL2RenderingContext, config?: TwoDimGradientMaterialConfig) {
        const program = new Program(
            gl, { vertexShaderSource: vertexShader, fragmentShaderSource: fragmentShader }
        );

        super(program);

        this._config = config;
        
        this.initializeUniforms();
    }

    private initializeUniforms() {

    }
}