export default function formatDistance(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)}м`;
    }

    const kilometers = Math.round(meters / 10) / 100;
    return `${kilometers}км`;
}
