export default function probablyIntersects(segment, bbox) {
    return 0 === (bitCode(segment[0], bbox) & bitCode(segment[1], bbox));
}

function bitCode(p, bbox) {
    let code = 0;

    if (p[0] < bbox[0][0]) {
        code |= 1; // left
    }
    else if (p[0] > bbox[1][0]) {
        code |= 2; // right
    }

    if (p[1] < bbox[0][1]) {
        code |= 4; // bottom
    }
    else if (p[1] > bbox[1][1]) {
        code |= 8; // top
    }

    return code;
}
