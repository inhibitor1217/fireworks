import { mat4 } from 'gl-matrix';
import Entity, { EntityParams } from '../Entity';

export type CameraConfigObject = {
    near: number;
    far: number;
    aspectRatio: number;
}

export class CameraConfig {
    near: number;
    far: number;
    aspectRatio: number;

    constructor(config?: Partial<CameraConfigObject>) {
        const { near = 0.1, far = 120.0, aspectRatio = 1.0 } = config || {};

        this.near = near;
        this.far = far;
        this.aspectRatio = aspectRatio;
    }

    get object(): CameraConfigObject {
        return {
            near: this.near,
            far: this.far,
            aspectRatio: this.aspectRatio,
        };
    }

    getObject(): CameraConfigObject {
        return this.object;
    }

    set object(value: CameraConfigObject) {
        this.near = value.near;
        this.far = value.far;
        this.aspectRatio = value.aspectRatio;
    }

    setObject(value: CameraConfigObject) {
        this.object = value;
    }

    isEqualTo(other: CameraConfig | CameraConfigObject): boolean {
        return this.near === other.near &&
            this.far === other.far &&
            this.aspectRatio === other.aspectRatio;
    }
}

type CameraParams = {
    config?: Partial<CameraConfigObject>
} & EntityParams;

export default abstract class Camera extends Entity {
    protected dirty: boolean;
    protected _projection: mat4;

    constructor(params: CameraParams) {
        super(params);

        this.dirty = true;
        this._projection = mat4.create();
    }

    get projection(): mat4 {
        if (this.dirty) {
            this.updateProjection();
            this.dirty = false;
        }

        return mat4.copy(mat4.create(), this._projection);
    }

    protected updateProjection(): void {
        throw Error('Tried to call unimplemented method: Camera.updateProjection');
    }
}
