import { vec2, vec3 } from 'gl-matrix';
import ProgramManager, { Programs } from '../../asset/material/programs';
import { SceneRenderProperties } from "../../engine/component/Scene";
import Material from '../../engine/render/Material';
import Color from "../../engine/util/Color";
import { UNIFORMS } from '../../engine/util/const';
import { randf } from "../../util/rand";
import { FireworksParticle } from "./FireworksParticle";

export type FireworksSystemParams = {
    gravity: number;
    speedAvg: number;
    speedDiv: number;
    lifetimeAvg: number;
    lifetimeDiv: number;
    emissionRate: number;
    numParticles: number;
    maxParticles: number;
};

const defaultParams: FireworksSystemParams = {
    gravity: 3.0,
    speedAvg: 2.0,
    speedDiv: 2.0,
    lifetimeAvg: 2.0,
    lifetimeDiv: 0.3,
    emissionRate: 3.0,
    numParticles: 240,
    maxParticles: 12000,
};

export default class FireworksSystem {
    params: FireworksSystemParams;

    private gl: WebGL2RenderingContext;
    private particles: FireworksParticle[];

    private vao: WebGLVertexArrayObject;
    private meshVbo: WebGLBuffer;
    private colorVbo: WebGLBuffer;
    private worldTranformVbo: WebGLBuffer;
    private material: Material;

    private colorBuffer: Float32Array;
    private worldTransformBuffer: Float32Array;

    constructor(gl: WebGL2RenderingContext, params?: Partial<FireworksSystemParams>) {
        this.params = {
            ...defaultParams,
            ...(params || {})
        };

        this.particles = [];

        /* Create particle system */
        this.gl = gl;

        const vao = this.gl.createVertexArray();
        if (!vao) {
            throw Error('Unable to create vertex array.');
        }
        this.vao = vao;

        this.gl.bindVertexArray(vao);

        const meshVertexBuffer = this.gl.createBuffer();
        if (!meshVertexBuffer) {
            throw Error('Unable to create buffer.');
        }
        this.meshVbo = meshVertexBuffer;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, meshVertexBuffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([
                0, Math.sqrt(3) / 4,
                -0.5, -0.5,
                0.5, -0.5,
            ]),
            this.gl.STATIC_DRAW,
        );
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(0);

        const colorBuffer = this.gl.createBuffer();
        if (!colorBuffer) {
            throw Error('Unable to create buffer.');
        }
        this.colorVbo = colorBuffer;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.colorBuffer = new Float32Array(Array(this.params.maxParticles * 4).fill(0.0))
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(this.colorBuffer),
            this.gl.DYNAMIC_DRAW,
        );
        this.gl.vertexAttribPointer(1, 4, this.gl.FLOAT, false, 16, 0);
        this.gl.vertexAttribDivisor(1, 1);
        this.gl.enableVertexAttribArray(1);

        const worldTransformBuffer = this.gl.createBuffer();
        if (!worldTransformBuffer) {
            throw Error('Unable to create buffer.');
        }
        this.worldTranformVbo = worldTransformBuffer;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, worldTransformBuffer);
        this.worldTransformBuffer = new Float32Array(Array(this.params.maxParticles * 16).fill(0.0));
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            this.worldTransformBuffer,
            this.gl.DYNAMIC_DRAW,
        );
        for (let i = 0; i < 4; i++) {
            const location = 2 + i;
            const offset = i * 16;
            this.gl.vertexAttribPointer(location, 4, this.gl.FLOAT, false, 64, offset);
            this.gl.vertexAttribDivisor(location, 1);
            this.gl.enableVertexAttribArray(location);
        }

        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.material = new Material(ProgramManager.getProgram(this.gl, Programs.TwoDimInstanced));
    }

    dispose(): void {
        this.gl.deleteVertexArray(this.vao);
        this.gl.deleteBuffer(this.meshVbo);
        this.gl.deleteBuffer(this.colorVbo);
        this.gl.deleteBuffer(this.worldTranformVbo);
    }

    render(sceneProps: SceneRenderProperties) {
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.gl.bindVertexArray(this.vao);
        this.material.start();

        this.material.program.setMatrix(UNIFORMS.inverseCameraTransform, sceneProps.camera.transform.inverseLocalTransform);
        this.material.program.setMatrix(UNIFORMS.projection, sceneProps.camera.projection);

        this.particles.forEach((particle, index) => {
            this.colorBuffer[4 * index] = particle.color.r;
            this.colorBuffer[4 * index + 1] = particle.color.g;
            this.colorBuffer[4 * index + 2] = particle.color.b;
            this.colorBuffer[4 * index + 3] = particle.color.a;

            for (let i = 0; i < 16; i++) {
                this.worldTransformBuffer[16 * index + i] = particle.transform.localTransform[i];
            }
        });

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorVbo);
        this.gl.bufferSubData(
            this.gl.ARRAY_BUFFER,
            0,
            this.colorBuffer,
        );

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.worldTranformVbo);
        this.gl.bufferSubData(
            this.gl.ARRAY_BUFFER,
            0,
            this.worldTransformBuffer,
        );

        this.gl.drawArraysInstanced(
            this.gl.TRIANGLES,
            0,
            3,
            this.particles.length,
        );

        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.material.stop();

        this.gl.disable(this.gl.BLEND);
    }

    loop(deltaTime: number): void {
        this.particles.forEach((particle) => {
            particle.loop(deltaTime);
        });

        this.particles = this.particles.filter((particle) => !particle.shouldDispose);

        if (randf(0.0, 1.0) < this.params.emissionRate * deltaTime) {
            this.emitParticles();
        }
    }

    private emitParticles(): void {
        const color = new Color(
            randf(0.0, 1.0),
            randf(0.0, 1.0),
            randf(0.0, 1.0)
        );

        const position = vec2.fromValues(
            randf(-15.0, 15.0),
            randf(-2.0, 15.0),
        );

        const { speedAvg, speedDiv, lifetimeAvg, lifetimeDiv, numParticles } = this.params;

        for(let i = 0; i < numParticles; i++) {
            if (this.particles.length >= this.params.maxParticles) {
                return;
            }

            const particleColor = new Color(
                color.r + randf(-0.30, 0.30),
                color.g + randf(-0.30, 0.30),
                color.b + randf(-0.30, 0.30),
            );
            const angle = randf(-Math.PI, +Math.PI);
            const speed = randf(speedAvg - speedDiv, speedAvg + speedDiv);
            const velocity = vec2.fromValues(
                speed * Math.cos(angle),
                speed * Math.sin(angle),
            );
            const lifetime = randf(lifetimeAvg - lifetimeDiv, lifetimeAvg + lifetimeDiv);

            const particle = new FireworksParticle(
                this.gl,
                {
                    color: particleColor,
                    velocity,
                    lifetime,
                    systemParams: this.params,
                    initialPosition: vec3.fromValues(position[0], position[1], 0),
                },
            );

            this.particles.push(particle);
        }
    }
}