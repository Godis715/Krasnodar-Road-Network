import React from "react";
import { Polyline } from "react-leaflet";
import inBounds from "../../../utils/inBounds";

class Roads extends React.PureComponent {
    render() {
        const { nodes, adjList, bounds } = this.props;
        return <>{
            adjList
                .filter(
                    (roadNodes) => roadNodes.some(
                        (nodeId) => inBounds(nodes[nodeId], bounds)
                    )
                )
                .map(
                    (roadNodes, ri) => (
                        <Polyline
                            positions={
                                roadNodes.map(
                                    (nodeId) => nodes[nodeId]
                                )
                            }
                            key={
                                `road-${ri}`
                            }
                        />
                    )
                )
        }</>;
    }
}

export default Roads;
