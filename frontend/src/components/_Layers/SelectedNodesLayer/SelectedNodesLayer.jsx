import React from "react";
import { Marker, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "./selectedNodesLayer.css";
import iconSvg from "./icon-svg.json";

const getIconSvg = (color) => iconSvg.replace("{color}", color);

const SELECTED_NODE_ICON = (color) => L.divIcon({
    className: "selected-node-icon",
    html: `<div style="--svg-icon:url(&quot;${
        getIconSvg(color)
    }&quot;)"/>`
});

function rainbowInterpolation(ratio) {
    const baseColors = [
        [255, 0, 0],
        [255, 255, 0],
        [0, 255, 0],
        [0, 255, 255],
        [0, 0, 255],
        [255, 0, 255],
        [255, 0, 0]
    ];
    const d = Math.floor((baseColors.length - 1) * ratio);
    const r = (baseColors.length - 1) * ratio - d;
    const color = baseColors[d].map(
        (col, i) => col * (1 - r) + baseColors[d + 1][i] * r
    );
    return color;
}

class SelectedNodesLayer extends React.PureComponent {
    render() {
        const { selectedNodes, nodes, onNodeSelected, onNodeFocus, onNodeLeave, clusters } = this.props;

        const nodesClusters = {};
        if (clusters) {
            console.log(clusters);
            clusters.forEach(
                ({ members }, ci) => members.forEach(
                    (nodeId) => {
                        nodesClusters[nodeId] = ci;
                    }
                )
            );
        }

        return (
            <LayerGroup>
                {
                    selectedNodes.map(
                        (nodeId) => (
                            <Marker key={nodeId}
                                position={nodes[nodeId]}
                                icon={
                                    SELECTED_NODE_ICON(
                                        clusters
                                            ? `rgb(${rainbowInterpolation(nodesClusters[nodeId] / clusters.length).join(",")})`
                                            : "rgb(0,0,0)"
                                    )
                                }
                                onClick={
                                    () => onNodeSelected(nodeId)
                                }
                                onMouseOver={
                                    () => onNodeFocus(nodeId)
                                }
                                onMouseOut={onNodeLeave}
                            />
                        )
                    )
                }
            </LayerGroup>
        );
    }
}

export default SelectedNodesLayer;
