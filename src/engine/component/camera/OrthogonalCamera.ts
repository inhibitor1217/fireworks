import { mat4 } from 'gl-matrix';
import { EntityParams } from '../Entity';
import Camera, { CameraConfig, CameraConfigObject } from './Camera';

export type OrthogonalCameraConfigObject = {
    size: number;
} & CameraConfigObject;

export class OrthogonalCameraConfig extends CameraConfig {
    size: number;

    constructor(config?: Partial<OrthogonalCameraConfigObject>) {
        super(config);

        const { size = 20.0 } = config || {};

        this.size = size;
    }

    get object(): OrthogonalCameraConfigObject {
        return {
            ...super.getObject(),
            size: this.size,
        }
    }

    set object(value: OrthogonalCameraConfigObject) {
        super.setObject(value);
        this.size = value.size;
    }

    isEqualTo(other: OrthogonalCameraConfig | OrthogonalCameraConfigObject): boolean {
        return super.isEqualTo(other) && 
            this.size === other.size;
    }
}

type OrthogonalCameraParams = {
    config?: Partial<OrthogonalCameraConfigObject>
} & EntityParams;

export default class OrthogonalCamera extends Camera {
    private _config: OrthogonalCameraConfig;
    get config(): OrthogonalCameraConfig {
        return this._config;
    }
    updateConfig(value: Partial<OrthogonalCameraConfig>) {
        const updatedConfig = {
            ...this._config.object,
            ...value
        };
        if (!this._config.isEqualTo(updatedConfig)) {
            this.dirty = true;
            this._config.object = updatedConfig;
        }
    }

    constructor(params: OrthogonalCameraParams) {
        super(params);

        this._config = new OrthogonalCameraConfig(params.config);
    }

    protected updateProjection(): void {
        mat4.ortho(
            this._projection,
            -this._config.size * this._config.aspectRatio,
            this._config.size * this._config.aspectRatio,
            -this._config.size,
            this._config.size,
            this._config.near,
            this._config.far,
        );
    }
}