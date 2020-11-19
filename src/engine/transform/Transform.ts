import { vec3, quat, mat4 } from 'gl-matrix';

export default class Transform {
    private dirty: boolean;

    private _position: vec3;
    get position(): vec3 {
        return vec3.copy(vec3.create(), this._position);
    }
    set position(value: vec3) {
        if (!vec3.equals(this._position, value)) {
            vec3.copy(this._position, value);
            this.dirty = true;
        }
    }

    private _rotation: quat;
    get rotation(): quat {
        return quat.copy(quat.create(), this._rotation);
    }
    set rotation(value: quat) {
        if (!quat.equals(this._rotation, value)) {
            quat.copy(this._rotation, value);
            this.dirty = true;
        }
    }

    private _scale: vec3;
    get scale(): vec3 {
        return vec3.copy(vec3.create(), this._scale);
    }
    set scale(value: vec3) {
        if (!vec3.equals(this._scale, value)) {
            vec3.copy(this._scale, value);
            this.dirty = true;
        }
    }

    private _mat: mat4;
    get localTransform(): mat4 {
        if (this.dirty) {
            mat4.fromRotationTranslationScale(this._mat, this._rotation, this._position, this._scale);
            this.dirty = false;
        }

        return mat4.copy(mat4.create(), this._mat);
    }

    constructor() {
        this.dirty = false;
        this._position = vec3.create();
        this._rotation = quat.create();
        this._scale = vec3.fromValues(1, 1, 1);
        this._mat = mat4.create();
    }
}