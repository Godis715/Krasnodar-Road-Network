import React from "react";
import { Polyline } from "react-leaflet";
import inBounds from "../../../utils/inBounds";
import leafletBoundsToArray from "../../../utils/leafletBoundsToArray";

class ShortestPathsTreeLayer extends React.PureComponent {
    render() {
        const { nodes, adjList, bounds } = this.props;
        const boundsArr = leafletBoundsToArray(bounds);
        return <>{
            adjList
                .filter(
                    ([from, to]) =>
                        inBounds(nodes[from], boundsArr) ||
                        inBounds(nodes[to], boundsArr)
                )
                .map(
                    ([from, to]) => (
                        <Polyline
                            positions={[nodes[from], nodes[to]]}
                            key={`SPT-${from}-${to}`}
                            color="purple"
                        />
                    )
                )
        }</>;
    }
}

export default ShortestPathsTreeLayer;
