import Color from "../../util/Color";
import Mesh from "./Mesh";

type SquareMeshParams = {
    twoDim: boolean;
    gradient?: {
        topLeft: Color;
        topRight: Color;
        bottomLeft: Color;
        bottomRight: Color;
    }
};

const Meshes = {
    square(gl: WebGL2RenderingContext, params?: SquareMeshParams): Mesh {
        const mesh = new Mesh(gl);

        const { twoDim, gradient } = params || {};

        const vertices = [
            {
                pos2d: [-0.5, 0.5],
                color: gradient?.topLeft.values,
            },
            {
                pos2d: [-0.5, -0.5],
                color: gradient?.bottomLeft.values,
            },
            {
                pos2d: [0.5, -0.5],
                color: gradient?.bottomRight.values,
            },
            {
                pos2d: [0.5, 0.5],
                color: gradient?.topRight.values,
            },
        ];

        const vertexBufferData = new Float32Array([
            ...vertices.reduce<number[]>((acc, { pos2d, color }) => [
                ...acc,
                ...(twoDim ? pos2d : []),
                ...(gradient ? (color || []) : [])
            ], [])
        ]);

        const vertexAttributes = [
            ...(twoDim ? [{ dataType: gl.FLOAT, dimension: 2 }] : []),
            ...(gradient ? [{ dataType: gl.FLOAT, dimension: 4 }] : []),
        ];

        mesh.bindVertices(vertexBufferData);
        
        mesh.bindVertexIndices(new Uint32Array([
            0, 1, 3, 3, 1, 2,
        ]));

        mesh.commit(vertexAttributes);
        
        mesh.numVertices = 6;

        return mesh;
    },
};

export default Meshes;
