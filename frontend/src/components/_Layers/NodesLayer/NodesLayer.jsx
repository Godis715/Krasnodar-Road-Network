import React from "react";
import { Marker, LayerGroup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import inBounds from "../../../utils/inBounds";
import leafletBoundsToArray from "../../../utils/leafletBoundsToArray";
import L from "leaflet";

import "./nodesLayer.css";

const CLUSTER_CUSTOM_ICON_GENERATOR = () => L.divIcon({
    className: "node-cluster-icon"
});

const CUSTOM_ICON_CLUSTER = L.divIcon({
    className: "node-icon"
});

class NamedMarker extends React.PureComponent {
    render() {
        const { name, onClick, ...otherProps } = this.props;
        return <Marker
            {...otherProps}
            onClick={
                () => onClick(name)
            }
        />;
    }
}

class NodesLayer extends React.PureComponent {
    render() {
        const { nodes, bounds, onNodeSelected, clusterNodes } = this.props;
        const boundsArr = leafletBoundsToArray(bounds);
        const objectsToRender = Object
            .entries(nodes)
            .filter(
                ([_, pos]) => inBounds(pos, boundsArr)
            )
            .map(
                ([key, position]) => (
                    <NamedMarker
                        position={position}
                        key={key}
                        name={key}
                        icon={CUSTOM_ICON_CLUSTER}
                        onClick={onNodeSelected}
                    />
                )
            );

        return clusterNodes
            ? <MarkerClusterGroup
                maxClusterRadius={25}
                showCoverageOnHover={false}
                spiderfyOnMaxZoo={false}
                iconCreateFunction={CLUSTER_CUSTOM_ICON_GENERATOR}
                animateAddingMarkers={false}
                animate={false}
            >
                {objectsToRender}
            </MarkerClusterGroup>
            : <LayerGroup>
                {objectsToRender}
            </LayerGroup>;
    }
}

export default NodesLayer;
