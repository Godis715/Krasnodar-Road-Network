import React from "react";
import { Marker, LayerGroup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import inBounds from "../../../utils/inBounds";
import L from "leaflet";

import "./nodesLayer.css";

const CLUSTER_CUSTOM_ICON_GENERATOR = () => L.divIcon({
    className: "node-cluster-icon"
});

const CUSTOM_ICON_CLUSTER = L.divIcon({
    className: "node-icon"
});

class NodesLayer extends React.PureComponent {

    render() {
        console.log("Rendering nodes");
        const { nodes, bounds, onNodeSelected, clusterNodes } = this.props;
        const objectsToRender = Object
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
                            () => onNodeSelected(key)
                        }
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
