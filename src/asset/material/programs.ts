import Program from "../../engine/render/Program";
import * as twoDimSources from "../../resource/material/2d";
import * as twoDimGradientSources from '../../resource/material/2dGradient';

export enum Programs {
    twoDim,
    twoDimGradient,
};

export const getProgram = (() => {
    let programs: { [key in Programs]?: Program } = {};

    return (gl: WebGL2RenderingContext, key: Programs) => {
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
            }
        }

        return programs[key]!;
    };
})();
