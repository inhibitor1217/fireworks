import Transform, { TransformParams } from "../transform/Transform";

export type EntityParams = {
    transform?: TransformParams;
}

export default class Entity {
    transform: Transform;

    constructor(params: EntityParams) {
        this.transform = new Transform(params.transform);
    }
}