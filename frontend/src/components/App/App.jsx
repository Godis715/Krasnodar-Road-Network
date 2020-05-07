import React from "react";
import { Map, TileLayer } from "react-leaflet";
import CollapsableList from "../CollapsableList/CollapsableList";
import fetchNodes from "./fetchNodes";
import fetchRoads from "./fetchRoads";
import fetchObjects from "./fetchObjects";
import leafletBoundsToArray from "./leafletBoundsToArray";
import RoadsLayer from "../RoadsLayer/RoadsLayer";
import ObjectsLayer from "../ObjectsLayer/ObjectsLayer";
import findClosest from "./findClosestRequest";
import SelectedNodesLayer from "../SelectedNodesLayer/SelectedNodesLayer";
import ClosestObjectLayer from "../ClosestObjectsLayer/ClosestObjectsLayer";
import NodesLayer from "../NodesLayer/NodesLayer";
import deepEqual from "deep-equal";
import "./App.css";

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            zoom: 12,
            selectedNodes: []
        };

        this.map = React.createRef();

        this.onZoomChanged = this.onZoomChanged.bind(this);
        this.onMoveChanged = this.onMoveChanged.bind(this);
        this.onNodeSelected = this.onNodeSelected.bind(this);
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
        if (ev.target._zoom !== this.state.zoom) {
            console.log("Zoomed!");
            this.setState({
                zoom: ev.target._zoom,
                bounds: this.map.current.leafletElement.getBounds()
            });
        }
        else {
            console.log("Changing zoom skipped");
        }
    }

    onMoveChanged() {
        const boundsPrev = this.state.bounds;
        const bounds = this.map.current.leafletElement.getBounds();
        if (!deepEqual(bounds, boundsPrev)) {
            console.log("Moved!");
            this.setState({
                bounds
            });
        }
        else {
            console.log("CHanging bounds skipped");
        }
    }

    onNodeSelected(nodeId) {
        console.log("Node selected!");
        const { selectedNodes } = this.state;
        const i = selectedNodes.findIndex(
            (id) => id === nodeId
        );
        if (i === -1) {
            this.setState({
                selectedNodes: [
                    ...selectedNodes,
                    nodeId
                ],
                focused: null
            });
        }
        else {
            this.setState({
                selectedNodes: [
                    ...selectedNodes.slice(0, i),
                    ...selectedNodes.slice(i + 1)
                ],
                focused: null
            });
        }
    }

    render() {
        const { lat, lng, latDelta, lngDelta, minZoom } = this.props;
        const { zoom, nodes, roads, bounds, objects, focused, closest, selectedNodes } = this.state;

        const position = [lat, lng];

        const maxBounds = [
            [lat + latDelta, lng + lngDelta],
            [lat - latDelta, lng - lngDelta]
        ];

        const highlightObject = closest && focused && closest[focused];

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
                            <ObjectsLayer
                                objects={objects}
                            />

                            {
                                zoom > 15 &&
                                <NodesLayer
                                    nodes={nodes}
                                    bounds={
                                        leafletBoundsToArray(bounds)
                                    }
                                    clusterNodes={this.state.clusterNodes}
                                    onNodeSelected={this.onNodeSelected}
                                />
                            }
                            {
                                zoom > 15 &&
                                <RoadsLayer
                                    nodes={nodes}
                                    adjList={roads}
                                    bounds={
                                        leafletBoundsToArray(bounds)
                                    }
                                    showRoads={this.state.showRoads}
                                />
                            }

                            <SelectedNodesLayer
                                nodes={nodes}
                                selectedNodes={selectedNodes}
                                onNodeSelected={this.onNodeSelected}
                                onNodeFocus={
                                    (nodeId) => {
                                        console.log("Node focused!");
                                        this.setState({
                                            focused: nodeId
                                        });
                                    }
                                }
                                onNodeLeave={
                                    () => {
                                        console.log("Node left!");
                                        this.setState({
                                            focused: null
                                        });
                                    }
                                }
                            />
                            <ClosestObjectLayer
                                objectPosition={highlightObject && nodes[highlightObject]}
                                nodePosition={focused && nodes[focused]}
                            />
                        </>
                    }
                </Map>
                <div className="toolbar-container">
                    <div>
                        <h2>Отображение</h2>
                        <div>
                            <input
                                type="checkbox"
                                id="show-roads"
                                checked={this.state.showRoads}
                                onChange={
                                    () => this.setState({
                                        showRoads: !this.state.showRoads
                                    })
                                }
                            />
                            <label htmlFor="show-roads">Показать дороги</label>

                            <input
                                type="checkbox"
                                id="cluster-nodes"
                                checked={this.state.clusterNodes}
                                onChange={
                                    () => this.setState({
                                        clusterNodes: !this.state.clusterNodes
                                    })
                                }
                            />
                            <label htmlFor="cluster-nodes">Кластеризовывать узлы</label>
                        </div>
                    </div>
                    <h2>Выбранно узлов: {selectedNodes.length}</h2>
                    <CollapsableList
                        items={[
                            {
                                title: "Поиск ближайших объектов",
                                content: (<>
                                    <div onChange={(ev) => console.log(ev.target.value)}>
                                        <button
                                            onClick={
                                                () => findClosest(selectedNodes).then(
                                                    (data) => this.setState({ closest: data })
                                                )
                                            }
                                        >
                                            Найти
                                        </button>
                                    </div>
                                </>)
                            },
                            {
                                title: "Поиск оптимально расположенного объекта",
                                content: <div>Описание второго задания</div>
                            }
                        ]}
                    />
                </div>
            </div>
        );
    }
}
