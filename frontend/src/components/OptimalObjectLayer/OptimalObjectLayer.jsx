import React from "react";
import { Marker, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "./optimalObjectLayer.css";

const OPTIMAL_ICON = L.divIcon({
    className: "optimal-object-icon"
});

class OptimalObjectLayer extends React.PureComponent {
    render() {
        const { objectPosition } = this.props;
        return (
            <LayerGroup>
                {
                    objectPosition &&
                    <Marker
                        position={objectPosition}
                        icon={OPTIMAL_ICON}
                    />
                }
            </LayerGroup>
        );
    }
}

export default OptimalObjectLayer;
