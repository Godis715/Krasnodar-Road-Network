import React from "react";
import { Polyline } from "react-leaflet";
import probablyIntersects from "../../../utils/probablyIntersects";
import leafletBoundsToArray from "../../../utils/leafletBoundsToArray";

class Roads extends React.PureComponent {
    render() {
        const { nodes, adjList, bounds } = this.props;
        const boundsArr = leafletBoundsToArray(bounds);
        return <>{
            adjList
                .filter(
                    (roadNodes) => roadNodes.slice(1).some(
                        (nodeId, i) => probablyIntersects(
                            [
                                nodes[roadNodes[i]],
                                nodes[nodeId]
                            ],
                            boundsArr
                        )
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
