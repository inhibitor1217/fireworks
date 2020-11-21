import React from 'react';
import Fireworks from './Fireworks';

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
        <div className="container">
            <div ref={containerRef} className="canvas-wrapper">
                {dimension && <Fireworks width={dimension.width} height={dimension.height} />}
            </div>
        </div>
    );
};

export default App;
