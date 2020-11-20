import Mesh from "./Mesh";

const Meshes = {
    square(gl: WebGL2RenderingContext): Mesh {
        const mesh = new Mesh(gl);
        mesh.bindVertices(new Float32Array([
            -0.5,  0.5,
            -0.5, -0.5, 
             0.5, -0.5, 
             0.5,  0.5,
        ]));
        mesh.bindVertexIndices(new Uint32Array([
            0, 1, 3, 3, 1, 2,
        ]));
        mesh.commit([{ dataType: gl.FLOAT, dimension: 2 }]);
        mesh.numVertices = 6;

        return mesh;
    },
};

export default Meshes;
