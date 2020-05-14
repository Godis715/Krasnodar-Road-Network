import React from "react";
import { Map, TileLayer } from "react-leaflet";
import CollapsableList from "../CollapsableList/CollapsableList";

// Requests
import {
    findClosest,
    findInRadius,
    fetchNodes,
    fetchRoads,
    fetchObjects,
    findOptimal,
    findSPT,
    clusterNodes
} from "./requests";

// Layers
import RoadsLayer from "../_Layers/RoadsLayer/RoadsLayer";
import ObjectsLayer from "../_Layers/ObjectsLayer/ObjectsLayer";
import SelectedNodesLayer from "../_Layers/SelectedNodesLayer/SelectedNodesLayer";
import ClosestObjectLayer from "../_Layers/ClosestObjectsLayer/ClosestObjectsLayer";
import ObjectsInRadiusLayer from "../_Layers/ObjectsInRadiusLayer/ObjectsInRadiusLayer";
import ShortestPathsTreeLayer from "../_Layers/ShortestPathsTreeLayer/ShortestPathsTreeLayer";
import SelectedObjectLayer from "../_Layers/SelectedObjectLayer/SelectedObjectLayer";
import OptimalObjectLayer from "../_Layers/OptimalObjectLayer/OptimalObjectLayer";
import NodesLayer from "../_Layers/NodesLayer/NodesLayer";

// Menus
import ShortestPathsTreeMenu from "../_Menus/ShortestPathsTreeMenu/ShortestPathsTreeMenu";
import FindClosestMenu from "../_Menus/FindClosestMenu/FindClosestMenu";
import FindInRadiusMenu from "../_Menus/FindInRadiusMenu/FindInRadiusMenu";
import ClusteringMenu from "../_Menus/ClusteringMenu/ClusteringMenu";
import FindOptimalMenu from "../_Menus/FindOptimalMenu/FindOptimalMenu";

// Utils
import leafletBoundsToArray from "./leafletBoundsToArray";
import deepEqual from "deep-equal";

import "./App.css";

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            zoom: 12,
            selectedNodes: [],
            openedTab: null,
            lat: 45.0347,
            lng: 38.9699
        };

        this.map = React.createRef();

        this.onZoomChanged = this.onZoomChanged.bind(this);
        this.onMoveChanged = this.onMoveChanged.bind(this);
        this.onNodeSelected = this.onNodeSelected.bind(this);
        this.onObjectSelected = this.onObjectSelected.bind(this);
        this.onTabChanged = this.onTabChanged.bind(this);
    }

    static defaultProps = {
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
            )/*,
            fetchRoads().then(
                (_roads) => roads = _roads
            )*/
        ];
        Promise.all(fetching).then(
            () => {
                this.setState({
                    nodes,
                    objects,
                    // roads,
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

    onMoveChanged(ev) {
        console.log(this.map.current);
        const boundsPrev = this.state.bounds;
        const bounds = this.map.current.leafletElement.getBounds();
        if (!deepEqual(bounds, boundsPrev)) {
            console.log("Moved!");
            this.setState({
                bounds
            });
        }
        else {
            console.log("Changing bounds skipped");
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
                focused: null,
                inRadius: null,
                closest: null,
                optimal: null
            });
        }
        else {
            this.setState({
                selectedNodes: [
                    ...selectedNodes.slice(0, i),
                    ...selectedNodes.slice(i + 1)
                ],
                focused: null,
                inRadius: null,
                closest: null,
                optimal: null
            });
        }
    }

    onObjectSelected(objectId) {
        const { selectedObject, openedTab } = this.state;
        if (openedTab !== "shortest-paths-tree") {
            console.log("Unable to select not in shortest-paths-tree tab");
            return;
        }
        if (!selectedObject || selectedObject !== objectId) {
            this.setState({
                selectedObject: objectId
            });
        }
        else {
            this.setState({
                selectedObject: null
            });
        }
    }

    onTabChanged(openedTab) {
        this.setState({ openedTab });
    }

    render() {
        const { latDelta, lngDelta, minZoom } = this.props;
        const {
            // map general
            lat,
            lng,
            zoom,
            bounds,
            nodes,
            roads,
            objects,
            // interface general
            openedTab,
            // customization
            shouldClusterNodes,
            showRoads,
            // map interaction
            selectedObject,
            selectedNodes,
            focused,
            // data from backend
            closest,
            inRadius,
            optimal,
            clusters,
            sptData
        } = this.state;

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
                                onObjectSelected={this.onObjectSelected}
                            />

                            {
                                zoom > 15 &&
                                <NodesLayer
                                    nodes={nodes}
                                    bounds={
                                        leafletBoundsToArray(bounds)
                                    }
                                    clusterNodes={shouldClusterNodes}
                                    onNodeSelected={this.onNodeSelected}
                                />
                            }
                            {/*
                                showRoads && zoom > 15 &&
                                <RoadsLayer
                                    nodes={nodes}
                                    adjList={roads}
                                    bounds={
                                        leafletBoundsToArray(bounds)
                                    }
                                />
                                */
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
                            {
                                openedTab === "find-closest" &&
                                <ClosestObjectLayer
                                    objectPosition={highlightObject && nodes[highlightObject]}
                                    nodePosition={focused && nodes[focused]}
                                />
                            }
                            {
                                openedTab === "find-in-radius" &&
                                <ObjectsInRadiusLayer
                                    objectPositions={
                                        focused && inRadius && inRadius[focused]
                                            .map(
                                                (nodeId) => nodes[nodeId]
                                            )
                                    }
                                    nodePosition={focused && nodes[focused]}
                                />
                            }
                            {
                                openedTab === "find-optimal" &&
                                <OptimalObjectLayer
                                    objectPosition={optimal && nodes[optimal]}
                                />
                            }
                            {
                                openedTab === "shortest-paths-tree" &&
                                <SelectedObjectLayer
                                    onObjectSelected={this.onObjectSelected}
                                    objects={objects}
                                    selectedObject={selectedObject}
                                />
                            }
                            {
                                openedTab === "shortest-paths-tree" && sptData &&
                                <ShortestPathsTreeLayer
                                    adjList={sptData.shortest_paths_tree}
                                    nodes={nodes}
                                    bounds={
                                        leafletBoundsToArray(bounds)
                                    }
                                />
                            }
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
                                checked={showRoads}
                                onChange={
                                    () => this.setState({
                                        showRoads: !showRoads
                                    })
                                }
                            />
                            <label htmlFor="show-roads">Показать дороги</label>

                            <input
                                type="checkbox"
                                id="cluster-nodes"
                                checked={shouldClusterNodes}
                                onChange={
                                    () => this.setState({
                                        shouldClusterNodes: !shouldClusterNodes
                                    })
                                }
                            />
                            <label htmlFor="cluster-nodes">Кластеризовывать узлы</label>
                        </div>
                    </div>
                    <h2>Выбранно узлов: {selectedNodes.length}</h2>
                    <CollapsableList
                        onChange={this.onTabChanged}
                        opened={openedTab}
                        items={[
                            {
                                id: "find-closest",
                                title: "Поиск ближайших объектов",
                                content: <FindClosestMenu
                                    onFindClosest={
                                        (metrics) => findClosest(selectedNodes, metrics).then(
                                            (data) => this.setState({ closest: data })
                                        )
                                    }
                                    disabled={Boolean(closest)}
                                />
                            },
                            {
                                id: "find-in-radius",
                                title: "Найти объекты в радиусе",
                                content: <FindInRadiusMenu
                                    onFindInRadius={
                                        (radius, metrics) => findInRadius(selectedNodes, radius, metrics).then(
                                            (data) => this.setState({ inRadius: data })
                                        )
                                    }
                                    disabled={Boolean(inRadius)}
                                />
                            },
                            {
                                id: "find-optimal",
                                title: "Поиск оптимально расположенного объекта",
                                content: <FindOptimalMenu
                                    onFindOptimal={
                                        (criterion, metrics) => findOptimal(selectedNodes, criterion, metrics).then(
                                            (data) => this.setState({ optimal: data })
                                        )
                                    }
                                    onNavigate={
                                        () => this.setState({
                                            lat: nodes[optimal][0],
                                            lng: nodes[optimal][1]
                                        })
                                    }
                                    disabled={Boolean(optimal)}
                                />
                            },
                            {
                                id: "shortest-paths-tree",
                                title: "Дерево кратчайших путей",
                                content: <ShortestPathsTreeMenu
                                    onFindShortestPathsTree={
                                        () => findSPT(objects[selectedObject].ref, selectedNodes).then(
                                            (data) => this.setState({ sptData: data })
                                        )
                                    }
                                    disabled={
                                        Boolean(sptData && selectedObject)
                                    }
                                    info={sptData}
                                />
                            },
                            {
                                id: "clustering",
                                title: "Кластеризация узлов",
                                content: <ClusteringMenu
                                    onClusterNodes={
                                        (num, metrics) => clusterNodes(selectedNodes, num, metrics).then(
                                            (data) => console.log(data)//this.setState({ clusters: data })
                                        )
                                    }
                                    disabled={Boolean(clusters)}
                                />
                            }
                        ]}
                    />
                </div>
            </div>
        );
    }
}
