import React from "react";
import { Polyline } from "react-leaflet";
import inBounds from "../../../utils/inBounds";

class ShortestPathsTreeLayer extends React.PureComponent {
    render() {
        const { nodes, adjList, bounds } = this.props;
        return <>{
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
                            key={`SPT-${from}-${to}`}
                            color="purple"
                        />
                    )
                )
        }</>;
    }
}

export default ShortestPathsTreeLayer;