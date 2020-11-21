import React from 'react';
import { vec3 } from 'gl-matrix';
import Color from './engine/util/Color';
import OrthogonalCamera from './engine/component/camera/OrthogonalCamera';
import Meshes from './engine/render/mesh/Meshes';
import RenderedEntity from './engine/component/RenderedEntity';
import TwoDimGradientMaterial from './asset/material/TwoDimGradientMaterial';
import SkylineMesh from './asset/mesh/SkylineMesh';
import TwoDimDefaultMaterial from './asset/material/TwoDimDefaultMaterial';
import FireworksSystem from './lib/fireworks/FireworksSystem';
import ProgramManager from './asset/material/programs';

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

const SCENE_SIZE = 20.0;

const Canvas: React.FunctionComponent<CanvasProps> = ({ width, height }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const requestRef = React.useRef<number>();
    const timestampRef = React.useRef<number>();

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const gl = getWebGLContext(canvas);
        if (!gl) {
            return;
        }

        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

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
                initialScale: vec3.fromValues(SCENE_SIZE * width / height, SCENE_SIZE, 1),
            },
        });

        const skylines = [
            new RenderedEntity({
                mesh: SkylineMesh(gl, { averageWidthRatio: 0.008, minRelativeHeight: 4.0, maxRelativeHeight: 8.0 }),
                material: new TwoDimDefaultMaterial(gl, { color: Color.hex('0x202840') }),
                transform: {
                    initialScale: vec3.fromValues(SCENE_SIZE * width / height, SCENE_SIZE, 1),
                },
            }),
            new RenderedEntity({
                mesh: SkylineMesh(gl, { averageWidthRatio: 0.015, minRelativeHeight: 2.4, maxRelativeHeight: 6.0 }),
                material: new TwoDimDefaultMaterial(gl, { color: Color.hex('0x10161B') }),
                transform: {
                    initialScale: vec3.fromValues(SCENE_SIZE * width / height, SCENE_SIZE, 1),
                },
            }),
            new RenderedEntity({
                mesh: SkylineMesh(gl),
                material: new TwoDimDefaultMaterial(gl, { color: Color.hex('0x050709') }),
                transform: {
                    initialScale: vec3.fromValues(SCENE_SIZE * width / height, SCENE_SIZE, 1),
                },
            }),
        ]

        const camera = new OrthogonalCamera({
            config: {
                aspectRatio: width / height,
                size: 0.5 * SCENE_SIZE,
            },
            transform: {
                initialPosition: vec3.fromValues(0, 0, 1),
            }
        });

        const fireworks = new FireworksSystem(gl);

        const loop = (time: number) => {
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            /* render phase */
            backgroundEntity.render({ camera });
            skylines.forEach((skyline) => skyline.render({ camera }));
            fireworks.render({ camera });

            /* update phase */
            if (timestampRef.current) {
                const deltaTime = 0.001 * (time - timestampRef.current);

                fireworks.loop(deltaTime);
            }

            timestampRef.current = time;
            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);

        return () => {
            if (requestRef.current !== undefined) {
                cancelAnimationFrame(requestRef.current);

                backgroundEntity.dispose();
                skylines.forEach((skyline) => skyline.dispose());
                fireworks.dispose();
                ProgramManager.cleanup();
            }
        };
    }, [width, height]);

    return (
        <canvas ref={canvasRef} width={width} height={height} />
    );
};

export default Canvas;
