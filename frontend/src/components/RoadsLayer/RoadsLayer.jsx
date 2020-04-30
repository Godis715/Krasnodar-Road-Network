import React from "react";
import { Polyline, CircleMarker, LayerGroup } from "react-leaflet";
import inBounds from "../../utils/inBounds";

class Roads extends React.Component {
    render() {
        const { nodes, adjList, zoom, bounds } = this.props;
        return (
            zoom > 15 &&
            <LayerGroup>
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
                                <CircleMarker
                                    center={position}
                                    key={key}
                                    radius={3}
                                    color={"#f00"}
                                />
                            )
                        )
                }
            </LayerGroup>
        );
    }
}

export default Roads;
