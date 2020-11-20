import React from 'react';
import { vec3 } from 'gl-matrix';
import Color from './engine/util/Color';
import OrthogonalCamera from './engine/component/camera/OrthogonalCamera';
import Meshes from './engine/render/mesh/Meshes';
import RenderedEntity from './engine/component/RenderedEntity';
import TwoDimGradientMaterial from './asset/material/TwoDimGradientMaterial';

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

        const backgroundEntity = new RenderedEntity({
            mesh: Meshes.square(
                gl, {
                    twoDim: true,
                    gradient: {
                        topLeft: Color.hex('0x091422'),
                        topRight: Color.hex('0x2a102c'),
                        bottomLeft: Color.hex('0x151a53'),
                        bottomRight: Color.hex('0x333563'),
                    }
                }
            ),
            material: new TwoDimGradientMaterial(gl),
            transform: {
                initialScale: vec3.fromValues(20 * width / height, 20, 1),
            },
        });

        const camera = new OrthogonalCamera({
            config: {
                aspectRatio: width / height,
                size: 10.0,
            },
            transform: {
                initialPosition: vec3.fromValues(0, 0, 1),
            }
        });

        const loop = (time: number) => {
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            backgroundEntity.render({ camera });

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
