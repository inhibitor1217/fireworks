export const vertexShader = `#version 300 es

layout(location = 0) in vec2 pos;

uniform mat4 worldTransform;

void main() {
    gl_Position = worldTransform * vec4(pos, 0, 1);
}

`;

export const fragmentShader = `#version 300 es

precision mediump float;

const float gamma = 2.2;

uniform vec4 color;

out vec4 out_color;

void main() {
    out_color.rgb = pow(color.rgb, vec3(1.0 / gamma));
    out_color.a = color.a;
}

`;