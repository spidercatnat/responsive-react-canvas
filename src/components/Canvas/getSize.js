const getSize = el => {
    if (el === window || el === document.body) {
        return [window.innerWidth, window.innerHeight];
    }
    const { width, height } = el.getBoundingClientRect();
    return { width: Math.round(width), height: Math.round(height) };
};

export default getSize;