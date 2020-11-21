import { vec2, vec3 } from 'gl-matrix';
import { SceneRenderProperties } from "../../engine/component/Scene";
import Mesh from '../../engine/render/mesh/Mesh';
import Meshes from '../../engine/render/mesh/Meshes';
import Color from "../../engine/util/Color";
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
};

const defaultParams: FireworksSystemParams = {
    gravity: 3.0,
    speedAvg: 2.0,
    speedDiv: 2.0,
    lifetimeAvg: 2.0,
    lifetimeDiv: 0.3,
    emissionRate: 3.0,
    numParticles: 240,
};

export default class FireworksSystem {
    params: FireworksSystemParams;

    private particleMesh: Mesh;
    private particles: FireworksParticle[];

    constructor(gl: WebGL2RenderingContext, params?: Partial<FireworksSystemParams>) {
        this.particleMesh = Meshes.triangle(gl, { twoDim: true });

        this.params = {
            ...defaultParams,
            ...(params || {})
        };

        this.particles = [];
    }

    render(gl: WebGL2RenderingContext, sceneProps: SceneRenderProperties) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this.particles.forEach((particle) => particle.render(sceneProps));

        gl.disable(gl.BLEND);
    }

    loop(gl: WebGL2RenderingContext, deltaTime: number): void {
        this.particles.forEach((particle) => {
            particle.loop(deltaTime);
        });

        this.particles = this.particles.filter((particle) => !particle.shouldDispose);

        if (randf(0.0, 1.0) < this.params.emissionRate * deltaTime) {
            this.emitParticles(gl);
        }
    }

    private emitParticles(gl: WebGL2RenderingContext): void {
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
                gl,
                this.particleMesh,
                {
                    color: particleColor,
                    velocity,
                    lifetime,
                    systemParams: this.params,
                    transform: {
                        initialPosition: vec3.fromValues(position[0], position[1], 0)
                    },
                },
            );

            this.particles.push(particle);
        }
    }
}