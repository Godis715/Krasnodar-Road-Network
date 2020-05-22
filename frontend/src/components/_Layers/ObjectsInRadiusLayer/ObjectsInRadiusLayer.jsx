import React from "react";
import { Marker, LayerGroup, Polyline } from "react-leaflet";
import L from "leaflet";

import "./objectsInRadiusLayer.css";

class ObjectsInRadiusLayer extends React.PureComponent {
    render() {
        const { nodePosition, objectPositions } = this.props;
        return (
            <LayerGroup>
                {
                    objectPositions &&
                    objectPositions.map(
                        (objPos) => <>
                            <Marker
                                position={objPos}
                                icon={L.divIcon({
                                    className: "object-in-radius-icon"
                                })}
                            />
                            <Polyline
                                positions={[nodePosition, objPos]}
                            />
                        </>
                    )
                }
            </LayerGroup>
        );
    }
}

export default ObjectsInRadiusLayer;
