export default function rainbowGradient(ratio) {
    const baseColors = [
        [255, 0, 0],
        [255, 255, 0],
        [0, 255, 0],
        [0, 255, 255],
        [0, 0, 255],
        [255, 0, 255],
        [255, 0, 0]
    ];
    const d = Math.floor((baseColors.length - 1) * ratio);
    const r = (baseColors.length - 1) * ratio - d;
    const color = baseColors[d].map(
        (col, i) => col * (1 - r) + baseColors[d + 1][i] * r
    );
    return color;
}
