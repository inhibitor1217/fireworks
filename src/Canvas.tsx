import React from 'react';
import { vec3 } from 'gl-matrix';
import TwoDimDefaultMaterial from './asset/material/TwoDimDefaultMaterial';
import Mesh from './engine/render/Mesh';
import Transform from './engine/transform/Transform';
import { Colors } from './engine/util/Color';

interface CanvasProps {
    width: number;
    height: number;
}

function getWebGLContext(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.warn('WebGL2 is not supported in this browser.');
        return;
    }

    return gl;
}

const Canvas: React.FunctionComponent<CanvasProps> = ({ width, height }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const gl = getWebGLContext(canvas);
        if (!gl) {
            return;
        }

        gl.viewport(0, 0, width, height);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const material = new TwoDimDefaultMaterial(gl, { color: Colors.white });
        
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

        const transform = new Transform();

        const loop = (time: number) => {
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            transform.position = vec3.fromValues(
                0.3 * Math.cos(0.0004 * Math.PI * time),
                0.3 * Math.sin(0.0004 * Math.PI * time),
                0
            );

            mesh.start();
            material.start();
            material.program.setMatrix('worldTransform', transform.localTransform);

            mesh.render();

            mesh.stop();
            material.stop();

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }, [width, height]);

    return (
        <canvas ref={canvasRef} width={width} height={height} />
    );
};

export default Canvas;
