import { vec3, quat, mat4 } from 'gl-matrix';

export type TransformParams = {
    initialPosition?: vec3;
    initialRotation?: quat;
    initialScale?: vec3;
};

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

    rotateX(angle: number): void {
        quat.rotateX(this._rotation, this._rotation, angle);
        this.dirty = true;
    }

    rotateY(angle: number): void {
        quat.rotateY(this._rotation, this._rotation, angle);
        this.dirty = true;
    }

    rotateZ(angle: number): void {
        quat.rotateZ(this._rotation, this._rotation, angle);
        this.dirty = true;
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
        this.update();
        return mat4.copy(mat4.create(), this._mat);
    }

    private _inverse: mat4;
    get inverseLocalTransform(): mat4 {
        this.update();
        return mat4.copy(mat4.create(), this._inverse);   
    }

    constructor(params?: TransformParams) {
        this._position = params?.initialPosition 
            ? vec3.copy(vec3.create(), params.initialPosition) 
            : vec3.create();
        
        this._rotation = params?.initialRotation
            ? quat.copy(quat.create(), params.initialRotation)
            : quat.create();
        
        this._scale = params?.initialScale
            ? vec3.copy(vec3.create(), params.initialScale)
            : vec3.fromValues(1, 1, 1);
        
        this._mat = mat4.create();
        this._inverse = mat4.create();
        this.dirty = true;
    }

    private update(): void {
        if (this.dirty) {
            mat4.fromRotationTranslationScale(this._mat, this._rotation, this._position, this._scale);
            mat4.invert(this._inverse, this._mat);
            this.dirty = false;
        }
    }
}