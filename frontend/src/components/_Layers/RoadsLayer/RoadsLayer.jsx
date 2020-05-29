import React from "react";
import { Polyline } from "react-leaflet";
import probablyIntersects from "../../../utils/probablyIntersects";
import leafletBoundsToArray from "../../../utils/leafletBoundsToArray";
import PolylineDecorator from "../../PolylineDecorator/PolylineDecorator";
import L from "leaflet";

function createArrowPatterns(color) {
    return [
        {
            offset: 25,
            repeat: 25,
            symbol: L.Symbol.arrowHead({
                pixelSize: 6,
                pathOptions: {
                    fillOpacity: 0.5,
                    weight: 0,
                    color: "#000"
                }
            })
        },
        {
            offset: 22,
            repeat: 25,
            symbol: L.Symbol.arrowHead({
                pixelSize: 6,
                pathOptions: {
                    fillOpacity: 1,
                    weight: 0,
                    color
                }
            })
        }
    ];
}

class Roads extends React.PureComponent {
    render() {
        const { nodes, adjList, bounds, color } = this.props;
        const roadsFilter = (roadNodes) => {
            const boundsArr = leafletBoundsToArray(bounds);
            return roadNodes.slice(1).some(
                (nodeId, i) => probablyIntersects(
                    [
                        nodes[roadNodes[i]],
                        nodes[nodeId]
                    ],
                    boundsArr
                )
            );
        };

        return <>{[
            /*...oneWayRoads
                .filter(roadsFilter)
                .map(
                    (roadNodes, ri) => (
                        <PolylineDecorator
                            patterns={createArrowPatterns(color)}
                            color={color}
                            weight={6}
                            positions={
                                roadNodes.map(
                                    (nodeId) => nodes[nodeId]
                                )
                            }
                            key={`one-way-road-${ri}`}
                        />
                    )
                ),*/
            ...adjList
                .filter(roadsFilter)
                .map(
                    (roadNodes, ri) => (
                        <Polyline
                            color={color}
                            positions={
                                roadNodes.map(
                                    (nodeId) => nodes[nodeId]
                                )
                            }
                            key={`two-way-road-${ri}`}
                        />
                    )
                )
        ]}</>;
    }
}

export default Roads;
