import React from "react";
import { Marker, LayerGroup, Polyline } from "react-leaflet";
import L from "leaflet";
import "./closestObjectLayer.css";

class ClosestObjectLayer extends React.PureComponent {
    render() {
        const { nodePosition, objectPosition } = this.props;
        return (
            <LayerGroup>
                {
                    objectPosition &&
                    <>
                        <Marker
                            position={objectPosition}
                            icon={L.divIcon({
                                className: "closest-object-icon"
                            })}
                        />
                        <Polyline
                            positions={[nodePosition, objectPosition]}
                        />
                    </>
                }
            </LayerGroup>
        );
    }
}

export default ClosestObjectLayer;
