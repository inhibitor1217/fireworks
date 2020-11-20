import { vec2, vec3 } from 'gl-matrix';
import TwoDimDefaultMaterial from '../../asset/material/TwoDimDefaultMaterial';
import RenderedEntity from "../../engine/component/RenderedEntity";
import Meshes from '../../engine/render/mesh/Meshes';
import Color from "../../engine/util/Color";
import { FireworksSystemParams } from './FireworksSystem';

export type FireworksParticleParams = {
    color: Color;
    velocity: vec2;
    lifetime: number;
    systemParams: FireworksSystemParams;
};

export class FireworksParticle extends RenderedEntity {
    readonly initialColor: Color;
    readonly initialVelocity: vec2;
    readonly initialLifetime: number;
    readonly systemParams: FireworksSystemParams;
    
    private color: Color;
    private velocity: vec2;
    private lifetime: number;

    get relativeLifetime(): number {
        return this.lifetime / this.initialLifetime;
    }

    get elapsedTime(): number {
        return this.initialLifetime - this.lifetime;
    }
    
    private _shouldDispose: boolean;
    get shouldDispose(): boolean {
        return this._shouldDispose;
    }

    constructor(gl: WebGL2RenderingContext, params: FireworksParticleParams) {
        const { color, velocity, lifetime, systemParams } = params;

        super({
            mesh: Meshes.triangle(gl),
            material: new TwoDimDefaultMaterial(gl, { color })
        });
        
        this.systemParams = systemParams;

        this.initialColor = color;
        this.color = Color.copy(this.initialColor);
        this.initialVelocity = vec2.copy(vec2.create(), velocity);
        this.velocity = vec2.copy(vec2.create(), this.initialVelocity);
        this.initialLifetime = lifetime;
        this.lifetime = this.initialLifetime;

        this._shouldDispose = false;
    }

    loop(deltaTime: number): void {
        this.move(deltaTime);
        this.degrade(deltaTime);
    }

    private move(deltaTime: number): void {
        this.transform.position = vec3.add(
            this.transform.position,
            this.transform.position,
            vec3.fromValues(
                this.velocity[0] * deltaTime,
                this.velocity[1] * deltaTime,
                0.0
            ),
        );

        this.velocity = vec2.add(
            vec2.create(),
            vec2.fromValues(
                this.initialVelocity[0] * this.relativeLifetime,
                this.initialVelocity[1] * this.relativeLifetime,
            ),
            vec2.fromValues(
                0.0,
                -this.elapsedTime * this.systemParams.gravity,
            ),
        );
    }

    private degrade(deltaTime: number): void {
        this.lifetime -= deltaTime;

        if (this.lifetime <= 0) {
            this._shouldDispose = true;
        }

        this.color = new Color(
            this.initialColor.r,
            this.initialColor.g,
            this.initialColor.b,
            this.relativeLifetime
        );
    }
}