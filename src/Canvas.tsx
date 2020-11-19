import React from 'react';

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
    }, [width, height]);

    return (
        <canvas ref={canvasRef} width={width} height={height} />
    );
};

export default Canvas;
