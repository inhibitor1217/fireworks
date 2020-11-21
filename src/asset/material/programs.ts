import Program from "../../engine/render/Program";
import * as twoDimSources from "../../resource/material/2d";
import * as twoDimGradientSources from '../../resource/material/2dGradient';
import * as twoDimInstancedSources from '../../resource/material/2dInstanced';

export enum Programs {
    twoDim,
    twoDimGradient,
    TwoDimInstanced,
};

const ProgramManager = (() => {
    let programs: { [key in Programs]?: Program } = {};

    return {
        getProgram(gl: WebGL2RenderingContext, key: Programs) {
            if (!programs[key]) {
                switch (key) {
                    case Programs.twoDim:
                        programs[key] = new Program(
                            gl, {
                                vertexShaderSource: twoDimSources.vertexShader,
                                fragmentShaderSource: twoDimSources.fragmentShader
                            }
                        );
                        break;
                    case Programs.twoDimGradient:
                        programs[key] = new Program(
                            gl, {
                                vertexShaderSource: twoDimGradientSources.vertexShader,
                                fragmentShaderSource: twoDimGradientSources.fragmentShader
                            }
                        );
                        break;
                    case Programs.TwoDimInstanced:
                        programs[key] = new Program(
                            gl, {
                                vertexShaderSource: twoDimInstancedSources.vertexShader,
                                fragmentShaderSource: twoDimInstancedSources.fragmentShader,
                            }
                        );
                        break;
                }
            }

            return programs[key]!;
        },
        cleanup() {
            Object.values(programs).forEach((program) => program?.dispose());
        },
    };
})();

export default ProgramManager;
