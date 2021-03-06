import { UNIFORMS } from "../../engine/util/const";

export const vertexShader = `#version 300 es

layout(location = 0) in vec2 pos;

uniform mat4 ${UNIFORMS.worldTransform};
uniform mat4 ${UNIFORMS.inverseCameraTransform};
uniform mat4 ${UNIFORMS.projection};

void main() {
    gl_Position = ${UNIFORMS.projection}
        * ${UNIFORMS.inverseCameraTransform}
        * ${UNIFORMS.worldTransform}
        * vec4(pos, 0, 1);
}

`;

export const fragmentShader = `#version 300 es

precision mediump float;

uniform vec4 color;

out vec4 out_color;

void main() {
    out_color = color;
}

`;