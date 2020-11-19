import React from 'react';
import Canvas from './Canvas';

type Dimension = {
    width: number;
    height: number;
};

const App: React.FunctionComponent = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const [dimension, setDimension] = React.useState<Dimension | null>(null);

    const updateDimension = () => {
        if (containerRef.current) {
            setDimension({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight,
            });
        }
    };

    React.useEffect(() => {
        updateDimension();
    }, []);

    React.useEffect(() => {
        window.addEventListener('resize', updateDimension);
        return () => window.removeEventListener('resize', updateDimension);
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            {dimension && <Canvas width={dimension.width} height={dimension.height} />}
        </div>
    );
};

export default App;
