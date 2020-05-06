import React from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

class ObjectsLayer extends React.Component {
    render() {
        const { objects } = this.props;
        return (
            <MarkerClusterGroup
                maxClusterRadius={30}
                showCoverageOnHover={false}
                spiderfyOnMaxZoo={false}
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
                                />
                            )
                        )
                }
            </MarkerClusterGroup>
        );
    }
}

export default ObjectsLayer;
