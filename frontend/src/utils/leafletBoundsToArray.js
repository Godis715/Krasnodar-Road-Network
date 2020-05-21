export default function leafletBoundsToArray(leafletBounds) {
    return [
        [leafletBounds._southWest.lat, leafletBounds._southWest.lng],
        [leafletBounds._northEast.lat, leafletBounds._northEast.lng]
    ];
}
