import Mesh from "../../engine/render/mesh/Mesh";
import { randf } from "../../util/rand";

type SkylineParams = {
    averageWidthRatio: number;
    minRelativeWidth: number;
    maxRelativeWidth: number;
    averageHeightRatio: number;
    minRelativeHeight: number;
    maxRelativeHeight: number;
}

const defaultSkylineParams: SkylineParams = {
    averageWidthRatio: 0.025,
    minRelativeWidth: 0.333,
    maxRelativeWidth: 3.0,
    averageHeightRatio: 0.040,
    minRelativeHeight: 0.5,
    maxRelativeHeight: 4.0,
};

const SkylineMesh = (gl: WebGL2RenderingContext, params?: Partial<SkylineParams>): Mesh => {
    const {
        averageWidthRatio,
        minRelativeHeight,
        maxRelativeHeight,
        averageHeightRatio,
        minRelativeWidth,
        maxRelativeWidth
    } = {
        ...defaultSkylineParams,
        ...(params || {})
    };

    const buildings: { width: number; height: number }[] = [];
    const vertexData: number[] = [];
    const indexData: number[] = [];
    
    let x = -0.5;
    
    while (x < 0.5) {
        const width = randf(averageWidthRatio * minRelativeWidth, averageWidthRatio * maxRelativeWidth);
        const height = randf(averageHeightRatio * minRelativeHeight, averageHeightRatio * maxRelativeHeight);

        x += width;
        buildings.push({ width, height });
    }

    buildings.reduce((x, { width, height }, index) => {
        vertexData.push(
            x, -0.5 + height,
            x, -0.5,
            x + width, -0.5,
            x + width, -0.5 + height,
        );
        indexData.push(
            4 * index,
            4 * index + 1,
            4 * index + 3,
            4 * index + 3,
            4 * index + 1,
            4 * index + 2,
        );

        return x + width;
    }, -0.5);

    const mesh = new Mesh(gl);

    mesh.bindVertices(new Float32Array(vertexData));
    mesh.bindVertexIndices(new Uint32Array(indexData));
    mesh.commit([{ dataType: gl.FLOAT, dimension: 2 }]);
    mesh.numVertices = 6 * buildings.length;

    return mesh;
};

export default SkylineMesh;
