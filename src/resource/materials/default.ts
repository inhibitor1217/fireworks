export const vertexShader = `#version 300 es

layout(location = 0) in vec4 pos;

uniform mat4 worldTransform;
uniform mat4 cameraTransform;
uniform mat4 projectionMatrix;

void main() {
    gl_Position = projectionMatrix * inverse(cameraTransform) * worldTransform * pos;
}
`;

export const fragmentShader = `#version 300 es

precision mediump float;

uniform vec4 color;

out vec4 out_color;

void main() {
    float gamma = 2.2;
    out_color.rgb = pow(color.rgb, vec3(1.0 / gamma));
    out_color.a = color.a;
}
`;