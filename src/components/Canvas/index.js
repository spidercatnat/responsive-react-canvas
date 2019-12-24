import React, { useRef, useState, useLayoutEffect } from 'react';
import getSize from './getSize';


/**
 * props:
 * onResize - function to execute when the window is resized
 * onLoad - function to execute to initialize app
 * dimensions - specify dimensions { width, height } 
 * styles - accepts custom styles for canvas container
 * refreshRate - time (in ms) in which to execute specified redraw function on resize. Default is 50ms.
 */

const scale = window.devicePixelRatio || 1;

const getParentDimensions = canvas => {
    if (!canvas || !canvas.parentElement) return { width: 0, height: 0 };
    const { width, height } = getSize(canvas.parentElement);
    return { width, height };
}

const Canvas = props => {
    const [size, setSize] = useState(getParentDimensions(canvas.current));

    const hydrate = callback => {
        setSize(getParentDimensions(canvas.current));
        setTimeout(() => {
            const { width: bitmapWidth, height: bitmapHeight } = canvas.current;
            const ctx = canvas.current.getContext("2d");
            callback({ ctx, width: bitmapWidth, height: bitmapHeight })
        }, 50);
    }

    const componentWillMount = () => hydrate(props.onMount);

    const dimensionsWillCange = () => {
        window.addEventListener("resize", () => {
            hydrate(props.onResize);
        });
    }

    useLayoutEffect(() => {
        componentWillMount()
        dimensionsWillCange()
        return () => window.removeEventListener("resize", hydrate)
    }, []);

    const canvas = useRef();
    const { width: elementWidth, height: elementHeight } = size;
    const { style, width, height } = props;
    const styles = {
        container: {
            ...style,
            width,
            height
        }
    }
    return (
        <div style={styles.container}>
            <canvas
                ref={canvas}
                width={elementWidth * scale}
                height={elementHeight * scale}
                style={{ width: elementWidth, height: elementHeight }}
            />
        </div>
    )
}

export { Canvas };