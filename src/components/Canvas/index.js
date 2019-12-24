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
    const canvas = useRef();
    const [size, setSize] = useState(getParentDimensions(canvas.current));

    const hydrate = callback => {
        setSize(getParentDimensions(canvas.current));
        setTimeout(() => {
            const { width: bitmapWidth, height: bitmapHeight } = canvas.current;
            const ctx = canvas.current.getContext("2d");
            callback({ ctx, width: bitmapWidth, height: bitmapHeight })
        }, 50);
    }

    const _componentWillMount = () => hydrate(props.onMount);

    const _dimensionsWillCange = () => {
        window.addEventListener("resize", () => {
            hydrate(props.onResize);
        });
    }

    useLayoutEffect(() => {
        _componentWillMount()
        _dimensionsWillCange()
        return () => window.removeEventListener("resize", hydrate)
    }, []);

    const { width: elementWidth, height: elementHeight } = size;
    return (
        <div style={props.style}>
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