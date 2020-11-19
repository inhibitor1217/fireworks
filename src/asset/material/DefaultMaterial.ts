import Material from "../../engine/Material";
import Program from "../../engine/Program";
import Color, { Colors } from "../../engine/util/Color";
import { fragmentShader, vertexShader } from "../../resource/materials/default";

type DefaultMaterialConfig = {
    color?: Color;
};

export default class DefaultMaterial extends Material {
    private _config: DefaultMaterialConfig | undefined;
    get config(): DefaultMaterialConfig | undefined {
        return this._config;
    }

    private _color: Color;
    get color(): Color {
        return this._color;
    }
    set color(value: Color) {
        this._color = value;
        this.program.start();
        this.program.setFloat('color', this._color.values);
    }

    constructor(gl: WebGL2RenderingContext, config?: DefaultMaterialConfig) {
        const program = new Program(
            gl, { vertexShaderSource: vertexShader, fragmentShaderSource: fragmentShader }
        );

        super(program);

        this._config = config;
        this._color = this.config?.color || Colors.black;

        this.initializeUniforms();
    }

    initializeUniforms() {
        this.color = this.config?.color || Colors.black;
    }
}