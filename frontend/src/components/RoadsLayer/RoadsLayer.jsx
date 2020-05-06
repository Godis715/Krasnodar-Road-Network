import React from "react";
import { Polyline, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import inBounds from "../../utils/inBounds";
import L from "leaflet";

const CUSTOM_ICON_GENERATOR = () => L.divIcon({
    className: "custom-icon-cluster"
});

const CUSTOM_ICON_CLUSTER = L.divIcon({
    className: "custom-icon"
});

class Roads extends React.PureComponent {

    render() {
        const { nodes, adjList, zoom, bounds } = this.props;
        return (
            zoom > 15 &&
            <MarkerClusterGroup
                maxClusterRadius={20}
                showCoverageOnHover={false}
                spiderfyOnMaxZoo={false}
                iconCreateFunction={CUSTOM_ICON_GENERATOR}
            >
                {
                    adjList
                        .filter(
                            ([from, to]) =>
                                inBounds(nodes[from], bounds) ||
                                inBounds(nodes[to], bounds)
                        )
                        .map(
                            ([from, to]) => (
                                <Polyline
                                    positions={[nodes[from], nodes[to]]}
                                    key={`${from}-${to}`}
                                />
                            )
                        )
                }
                {
                    Object
                        .entries(nodes)
                        .filter(
                            ([_, pos]) => inBounds(pos, bounds)
                        )
                        .map(
                            ([key, position]) => (
                                <Marker
                                    position={position}
                                    key={key}
                                    icon={CUSTOM_ICON_CLUSTER}
                                    onClick={
                                        (ev) => console.log(key)
                                    }
                                />
                            )
                        )
                }
            </MarkerClusterGroup>
        );
    }
}

export default Roads;
