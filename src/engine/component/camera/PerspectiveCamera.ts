import { mat4 } from 'gl-matrix';
import { EntityParams } from '../Entity';
import Camera, { CameraConfig, CameraConfigObject } from './Camera';

export type PerspectiveCameraConfigObject = {
    fov: number;
} & CameraConfigObject;

export class PerspectiveCameraConfig extends CameraConfig {
    fov: number;

    constructor(config?: Partial<PerspectiveCameraConfigObject>) {
        super(config);

        const { fov = 0.5 * Math.PI } = config || {};

        this.fov = fov;
    }

    get object(): PerspectiveCameraConfigObject {
        return {
            ...super.getObject(),
            fov: this.fov,
        };
    }

    set object(value: PerspectiveCameraConfigObject) {
        super.setObject(value);
        this.fov = value.fov;
    }

    isEqualTo(other: PerspectiveCameraConfig | PerspectiveCameraConfigObject) {
        return super.isEqualTo(other) && 
            this.fov === other.fov;
    }
}

type PerspectiveCameraParams = {
    config?: Partial<PerspectiveCameraConfig>
} & EntityParams;

export default class PerspectiveCamera extends Camera {
    private _config: PerspectiveCameraConfig;
    get config(): PerspectiveCameraConfig {
        return this._config;
    }
    
    updateConfig(value: Partial<PerspectiveCameraConfig>) {
        const updatedConfig = {
            ...this._config.object,
            ...value,
        };
        if (!this._config.isEqualTo(updatedConfig)) {
            this.dirty = true;
            this._config.object = updatedConfig;
        }
    }

    constructor(params: PerspectiveCameraParams) {
        super(params);

        this._config = new PerspectiveCameraConfig(params.config);
    }

    protected updateProjection(): void {
        mat4.perspective(
            this._projection, 
            this._config.fov, 
            this._config.aspectRatio, 
            this._config.near, 
            this._config.far
        );
    }
}