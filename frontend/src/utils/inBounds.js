export default function(pos, bounds) {
    return pos[0] >= bounds[0][0] && pos[0] <= bounds[1][0] &&
        pos[1] >= bounds[0][1] && pos[1] <= bounds[1][1];
}