import { mat4 } from 'gl-matrix';

type CameraConfig = {
    near: number;
    far: number;
    fov: number;
    aspectRatio: number;
};

export default class Camera {
    private _config: CameraConfig;
    get config(): CameraConfig {
        return this._config;
    }
    
    updateConfig(value: Partial<CameraConfig>) {
        const isNotEqual = 
            (value.near !== undefined && (value.near !== this._config.near)) ||
            (value.far !== undefined && (value.far !== this._config.far)) ||
            (value.fov !== undefined && (value.fov !== this._config.fov)) ||
            (value.aspectRatio !== undefined && (value.aspectRatio !== this._config.aspectRatio));
        
        if (isNotEqual) {
            this.dirty = true;
            this._config = {
                ...this._config,
                ...value,
            };
        }
    }

    private _projection: mat4;
    get projection(): mat4 {
        if (this.dirty) {
            mat4.perspective(
                this._projection, 
                this._config.fov, 
                this._config.aspectRatio, 
                this._config.near, 
                this._config.far
            );
        }

        return this._projection;
    }
 
    private dirty: boolean;

    constructor(config: CameraConfig) {
        this._config = config;
        
        this._projection = mat4.create();
        this.dirty = false;
    }
}