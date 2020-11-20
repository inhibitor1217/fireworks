import { mat4 } from 'gl-matrix';

type ProgramConfig = {
    vertexShaderSource: string;
    fragmentShaderSource: string;
}

enum ShaderType {
    Vertex,
    Fragment,
}

export default class Program {
    private gl: WebGL2RenderingContext;
    private shaders: { [type in ShaderType]?: WebGLShader } = {};
    private program: WebGLProgram;

    private uniformLocations: { [key: string]: WebGLUniformLocation } = {};

    private disposed: boolean = false;
    
    config: ProgramConfig;
    
    constructor(gl: WebGL2RenderingContext, config: ProgramConfig) {
        this.gl = gl;
        this.config = config;

        this.shaders = {
            [ShaderType.Vertex]: this.createShader(ShaderType.Vertex, config.vertexShaderSource),
            [ShaderType.Fragment]: this.createShader(ShaderType.Fragment, config.fragmentShaderSource),
        }

        this.program = this.createProgram();
    }

    start(): void {
        if (this.disposed) {
            return;
        }

        this.gl.useProgram(this.program);
    }

    stop(): void {
        if (this.disposed) {
            return;
        }

        this.gl.useProgram(null);
    }

    dispose(): void {
        if (this.disposed) {
            return;
        }

        this.disposed = true;
        this.gl.deleteProgram(this.program);
        Object.values(this.shaders).forEach((shader) => {
            if (shader) {
                this.gl.deleteShader(shader);
            }
        });
    }

    setFloat(key: string, value: number | number[]) {
        if (Array.isArray(value)) {
            const [v0, v1, v2, v3] = value;

            if (value.length >= 4) {
                this.gl.uniform4f(this.getUniformLocation(key), v0, v1, v2, v3);
            } else if (value.length === 3) {
                this.gl.uniform3f(this.getUniformLocation(key), v0, v1, v2);
            } else if (value.length === 2) {
                this.gl.uniform2f(this.getUniformLocation(key), v0, v1);
            } else if (value.length === 1) {
                this.gl.uniform1f(this.getUniformLocation(key), v0);
            } else {
                console.warn('empty array is given to setFloat');
            }
        } else {
            this.gl.uniform1f(this.getUniformLocation(key), value);
        }
    }

    setMatrix(key: string, value: mat4) {
        this.gl.uniformMatrix4fv(this.getUniformLocation(key), false, value);
    }

    private createShader(type: ShaderType, source: string): WebGLShader {
        const createShaderParam = (() => {
            switch (type) {
                case ShaderType.Vertex:
                    return this.gl.VERTEX_SHADER;
                case ShaderType.Fragment:
                    return this.gl.FRAGMENT_SHADER;
            }
        })();

        const shader = this.gl.createShader(createShaderParam);

        if (!shader) {
            throw Error('Unable to create shader.');
        }

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            throw Error('Error occured while compiling shader.');
        }

        return shader;
    }

    private createProgram() {
        const program = this.gl.createProgram();

        if (!program) {
            throw Error('Unable to create program.');
        }

        Object.values(this.shaders).forEach((shader) => {
            if (shader) {
                this.gl.attachShader(program, shader);
            }
        });

        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error(this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            throw Error('Error occurred while linking program.');
        }

        return program;
    }

    private getUniformLocation(key: string) {
        if (!this.uniformLocations[key]) {
            const location = this.gl.getUniformLocation(this.program, key);
            if (!location) {
                throw Error(`Unable to fetch uniform location of ${key}`);
            }
            this.uniformLocations[key] = location;
        }

        return this.uniformLocations[key];
    }
}
