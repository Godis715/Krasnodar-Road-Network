import React from "react";
import { Marker, LayerGroup } from "react-leaflet";
import "./centroidsLayer.css";
import L from "leaflet";

const CentroidIcon = (style) => L.divIcon({
    className: "centroid-icon",
    html: `<div style="--color:${style.color}"/>`
});

class CentroidsLayer extends React.PureComponent {
    render() {
        const { centroids } = this.props;

        return <LayerGroup>{
            centroids.map(
                ({ style, center }, i) => (
                    <Marker
                        key={`centroid-${i}`}
                        position={center}
                        icon={CentroidIcon(style)}
                    />
                )
            )
        }</LayerGroup>;
    }
}

export default CentroidsLayer;
