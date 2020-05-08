import React from "react";
import { Marker, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "./selectedNodesLayer.css";

const SELECTED_NODE_ICON = L.divIcon({
    className: "selected-node-icon"
});

class SelectedNodesLayer extends React.PureComponent {
    render() {
        const { selectedNodes, nodes, onNodeSelected, onNodeFocus, onNodeLeave } = this.props;
        return (
            <LayerGroup>
                {
                    selectedNodes.map(
                        (nodeId) => (
                            <Marker
                                position={nodes[nodeId]}
                                key={nodeId}
                                icon={SELECTED_NODE_ICON}
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
