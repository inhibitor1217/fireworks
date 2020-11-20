import { UNIFORMS } from "../../engine/util/const";

export const vertexShader = `#version 300 es

layout(location = 0) in vec2 pos;
layout(location = 1) in vec4 color;

out vec4 vert_color;

uniform mat4 ${UNIFORMS.worldTransform};
uniform mat4 ${UNIFORMS.inverseCameraTransform};
uniform mat4 ${UNIFORMS.projection};

void main() {
    gl_Position = projection * inverseCameraTransform * worldTransform * vec4(pos, 0, 1);
    vert_color = color;
}

`;

export const fragmentShader = `#version 300 es

precision mediump float;

in vec4 vert_color;

out vec4 out_color;

void main() {
    out_color = vert_color;
}
`;
