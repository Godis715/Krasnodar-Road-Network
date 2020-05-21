import React from "react";
import { Marker, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "./selectedNodesLayer.css";
import iconSvg from "./icon-svg.json";

const getIconSvg = (color) => iconSvg.replace("{color}", color);

const SELECTED_NODE_ICON = (style) => L.divIcon({
    className: "selected-node-icon",
    html: `<div style="--svg-icon:url(&quot;${
        getIconSvg(style.color)
    }&quot;); --opacity: ${style.opacity}"/>`
});

class SelectedNodesLayer extends React.PureComponent {
    render() {
        const { selectedNodes, nodes, onNodeSelected, onNodeFocus, onNodeLeave, clusters, nodeColors } = this.props;

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
                                        nodeColors
                                            ? nodeColors[nodeId]
                                            : {
                                                color: "black",
                                                opacity: 1
                                            }
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
