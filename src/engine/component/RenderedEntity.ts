import Material from "../render/Material";
import Mesh from "../render/mesh/Mesh";
import { UNIFORMS } from "../util/const";
import Entity, { EntityParams } from "./Entity";
import { SceneRenderProperties } from "./Scene";

export type RenderedEntityParams = {
    material: Material;
    mesh: Mesh;
} & EntityParams;

export default class RenderedEntity extends Entity {
    material: Material;
    mesh: Mesh;

    constructor(params: RenderedEntityParams) {
        super(params);

        const { material, mesh } = params;

        this.material = material;
        this.mesh = mesh;
    }

    render(sceneProps: SceneRenderProperties): void {
        this.mesh.start();
        this.material.start();

        this.material.program.setMatrix(UNIFORMS.worldTransform, this.transform.localTransform);
        this.material.program.setMatrix(UNIFORMS.inverseCameraTransform, sceneProps.camera.transform.inverseLocalTransform);
        this.material.program.setMatrix(UNIFORMS.projection, sceneProps.camera.projection);

        this.mesh.render();

        this.mesh.stop();
        this.material.stop();
    }
}