import React from 'react';
import { vec3 } from 'gl-matrix';
import TwoDimDefaultMaterial from './asset/material/TwoDimDefaultMaterial';
import Transform from './engine/transform/Transform';
import { Colors } from './engine/util/Color';
import OrthogonalCamera from './engine/component/camera/OrthogonalCamera';
import Meshes from './engine/render/mesh/Meshes';

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
    const requestRef = React.useRef<number>();

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
        
        const mesh = Meshes.square(gl);

        const camera = new OrthogonalCamera({
            config: {
                aspectRatio: width / height,
                size: 10.0,
            },
            transform: {
                initialPosition: vec3.fromValues(0, 0, 1),
            }
        });

        const transform = new Transform();

        const loop = (time: number) => {
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            transform.position = vec3.fromValues(
                5.0 * Math.cos(0.0004 * Math.PI * time),
                5.0 * Math.sin(0.0004 * Math.PI * time),
                0
            );

            mesh.start();
            material.start();
            material.program.setMatrix('worldTransform', transform.localTransform);
            material.program.setMatrix('inverseCameraTransform', camera.transform.inverseLocalTransform);
            material.program.setMatrix('projection', camera.projection);

            mesh.render();

            mesh.stop();
            material.stop();

            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);

        return () => {
            if (requestRef.current !== undefined) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [width, height]);

    return (
        <canvas ref={canvasRef} width={width} height={height} />
    );
};

export default Canvas;
