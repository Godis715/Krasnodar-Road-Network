import React from "react";
import { Map, TileLayer } from "react-leaflet";
import fetchNodes from "./fetchNodes";
import fetchRoads from "./fetchRoads";
import fetchObjects from "./fetchObjects";
import leafletBoundsToArray from "./leafletBoundsToArray";
import RoadsLayer from "../RoadsLayer/RoadsLayer";
import ObjectsLayer from "../ObjectsLayer/ObjectsLayer";
import "./App.css";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            zoom: 12
        };

        this.map = React.createRef();

        this.onZoomChanged = this.onZoomChanged.bind(this);
        this.onMoveChanged = this.onMoveChanged.bind(this);
    }

    static defaultProps = {
        lat: 45.0347,
        lng: 38.9699,
        minZoom: 11,
        // find out exact boundaries
        latDelta: 0.25,
        lngDelta: 0.5
    }

    componentDidMount() {
        let nodes, objects, roads;
        const fetching = [
            fetchNodes().then(
                (_nodes) => nodes = _nodes
            ),
            fetchObjects().then(
                (_objects) => objects = _objects
            ),
            fetchRoads().then(
                (_roads) => roads = _roads
            )
        ];
        Promise.all(fetching).then(
            () => {
                this.setState({
                    nodes,
                    objects,
                    roads,
                    bounds: this.map.current.leafletElement.getBounds()
                });
            }
        );
    }

    onZoomChanged(ev) {
        this.setState({
            zoom: ev.target._zoom,
            bounds: this.map.current.leafletElement.getBounds()
        });
    }

    onMoveChanged(ev) {
        this.setState({
            bounds: this.map.current.leafletElement.getBounds()
        });
    }

    render() {
        const { lat, lng, latDelta, lngDelta, minZoom } = this.props;
        const { zoom, nodes, roads, bounds, objects } = this.state;

        const position = [lat, lng];

        const maxBounds = [
            [lat + latDelta, lng + lngDelta],
            [lat - latDelta, lng - lngDelta]
        ];

        return (
            <div className="App">
                <Map
                    center={position}
                    zoom={zoom}
                    minZoom={minZoom}
                    maxBounds={maxBounds}
                    maxBoundsViscosity={1.0}
                    onZoomEnd={this.onZoomChanged}
                    onMoveEnd={this.onMoveChanged}
                    ref={this.map}
                >
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        Boolean(nodes) && <>
                            <RoadsLayer
                                zoom={zoom}
                                nodes={nodes}
                                adjList={roads}
                                bounds={
                                    leafletBoundsToArray(bounds)
                                }
                            />
                            <ObjectsLayer
                                objects={objects}
                            />
                        </>
                    }
                </Map>
                <div className="toolbar-container"></div>
            </div>
        );
    }
}
