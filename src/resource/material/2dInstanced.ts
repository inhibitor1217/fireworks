import { UNIFORMS } from '../../engine/util/const';

export const vertexShader = `#version 300 es

layout(location = 0) in vec2 pos;
layout(location = 1) in vec4 color;
layout(location = 2) in mat4 worldTransform;

out vec4 pass_color;

uniform mat4 ${UNIFORMS.inverseCameraTransform};
uniform mat4 ${UNIFORMS.projection};

void main() {
    gl_Position = ${UNIFORMS.projection}
        * ${UNIFORMS.inverseCameraTransform}
        * worldTransform
        * vec4(pos, 0, 1);
    pass_color = color;
}

`;

export const fragmentShader = `#version 300 es

precision mediump float;

in vec4 pass_color;

out vec4 out_color;

void main() {
    out_color = pass_color;
}

`;