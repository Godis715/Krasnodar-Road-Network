import React from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import "./objectsLayer.css";

const OBJECT_ICON = L.divIcon({
    className: "object-icon"
});

class ObjectsLayer extends React.Component {
    render() {
        const { objects, onObjectSelected } = this.props;
        return (
            <MarkerClusterGroup
                maxClusterRadius={30}
                showCoverageOnHover={false}
                spiderfyOnMaxZoo={false}
                removeOutsideVisibleBounds={true}
            >
                {
                    Object.entries(objects)
                        .filter(
                            ([_, { type }]) => type === "infrastructure"
                        )
                        .map(
                            ([key, { location }]) => (
                                <Marker
                                    position={[location[1], location[0]]}
                                    key={key}
                                    icon={OBJECT_ICON}
                                    onClick={
                                        () => onObjectSelected(key)
                                    }
                                />
                            )
                        )
                }
            </MarkerClusterGroup>
        );
    }
}

export default ObjectsLayer;
