import React from "react";
import { Map, TileLayer } from "react-leaflet";
import CollapsableList from "../CollapsableList/CollapsableList";
import CheckboxGroup from "../CheckboxGroup/CheckboxGroup";

// Requests
import {
    findClosest,
    findInRadius,
    fetchNodes,
    fetchRoads,
    fetchObjects,
    findOptimal,
    findSPT,
    findCBT,
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
import CentroidsLayer from "../_Layers/CentroidsLayer/CentroidsLayer";
import NodesLayer from "../_Layers/NodesLayer/NodesLayer";

// Menus
import ShortestPathsTreeMenu from "../_Menus/ShortestPathsTreeMenu/ShortestPathsTreeMenu";
import SelectRandomMenu from "../_Menus/SelectRandomMenu/SelectRandomMenu";
import FindClosestMenu from "../_Menus/FindClosestMenu/FindClosestMenu";
import FindInRadiusMenu from "../_Menus/FindInRadiusMenu/FindInRadiusMenu";
import ClusteringMenu from "../_Menus/ClusteringMenu/ClusteringMenu";
import FindOptimalMenu from "../_Menus/FindOptimalMenu/FindOptimalMenu";

// Utils
import getRandomElements from "./randomElements";
import { getSubclusters } from "../../utils/dendrogram";
import rainbowGradient from "../../utils/rainbowGradient";
import deepEqual from "deep-equal";

import "./App.css";

function getNodeColors(clusters) {
    const nodesColors = {};

    clusters.forEach(
        ({ members }, ci) => members.forEach(
            (nodeId) => {
                nodesColors[nodeId] = {
                    color: `rgb(${
                        rainbowGradient(ci / clusters.length).join(",")
                    })`,
                    opacity: 1
                };
            }
        )
    );

    return nodesColors;
}

export default class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            zoom: 12,
            selectedNodes: [],
            openedTab: null,
            lat: 45.0347,
            lng: 38.9699,
            shouldClusterNodes: true,
            shouldClusterObjects: true,
            showObjects: true
        };

        this.map = React.createRef();

        const methodsToBind = [
            "onFindSPT",
            "onFindClosest",
            "onFindOptimal",
            "onZoomChanged",
            "onMoveChanged",
            "onNodeSelected",
            "onFindInRadius",
            "onObjectSelected",
            "onSubclusterSelected",
            "onSubclusterLeft",
            "onSelectRandom",
            "onClusterNodes",
            "onTabChanged",
            "onNodeFocus",
            "onNodeLeave",
            "onToggleShowRoads",
            "onToggleShouldClusterNodes",
            "onToggleShouldClusterObjects",
            "onToggleShowObjects"
        ];

        methodsToBind.forEach(
            (methodName) => {
                if (!this[methodName]) {
                    throw new Error(`Method ${methodName} doesn't exit in App component`);
                }
                this[methodName] = this[methodName].bind(this);
            }
        );
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

    getBounds() {
        const newBounds = this.map.current.leafletElement.getBounds();
        const oldBounds = this.state.bounds;
        if (!deepEqual(oldBounds, newBounds)) {
            return newBounds;
        }

        return oldBounds;
    }

    onZoomChanged(ev) {
        console.log("On zoom");
        this.setState({
            zoom: ev.target._zoom,
            bounds: this.getBounds()
        });
    }

    onMoveChanged() {
        this.setState({
            bounds: this.getBounds()
        });
    }

    onNodeSelected(nodeId) {
        const dataToReset = {
            focused: null,
            inRadius: null,
            closest: null,
            optimal: null,
            clusters: null,
            dendrogram: null,
            nodeColors: null,
            sptData: null
        };
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
                ...dataToReset
            });
        }
        else {
            this.setState({
                selectedNodes: [
                    ...selectedNodes.slice(0, i),
                    ...selectedNodes.slice(i + 1)
                ],
                ...dataToReset
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
                selectedObject: objectId,
                sptData: null
            });
        }
        else {
            this.setState({
                selectedObject: null,
                sptData: null
            });
        }
    }

    onTabChanged(openedTab) {
        this.setState({ openedTab });
    }

    onSelectRandom(count) {
        const dataToReset = {
            focused: null,
            inRadius: null,
            closest: null,
            optimal: null,
            clusters: null,
            dendrogram: null,
            nodeColors: null,
            sptData: null
        };
        const { nodes } = this.state;
        this.setState({
            selectedNodes: getRandomElements(
                Object.keys(nodes),
                count
            ),
            ...dataToReset
        });
    }

    onClusterNodes(num) {
        this.setState({
            clusters: null,
            dendrogram: null,
            nodeColors: null,
            loading: true
        });

        clusterNodes(this.state.selectedNodes, num)
            .then(
                (data) => this.setState({
                    ...data,
                    nodeColors: getNodeColors(data.clusters),
                    loading: false
                })
            );
    }

    onSubclusterSelected(height, id) {
        console.log("Selected at height", height);
        const { dendrogram, selectedNodes } = this.state;
        const subclusters = Boolean(height)
            ? getSubclusters(dendrogram, selectedNodes, height)
            : [[id]];

        const nodeColors = {};

        selectedNodes.forEach(
            (nodeId) => {
                nodeColors[nodeId] = {
                    color: "gray",
                    opacity: 0.5
                };
            }
        );

        subclusters[0].forEach(
            (nodeId) => {
                nodeColors[nodeId] = {
                    color: "rgb(255, 150, 20)",
                    opacity: 1
                };
            }
        );

        if (subclusters.length > 1) {
            subclusters[1].forEach(
                (nodeId) => {
                    nodeColors[nodeId] = {
                        color: "rgb(20, 255, 150)",
                        opacity: 1
                    };
                }
            );
        }

        this.setState({
            nodeColors
        });
    }

    onSubclusterLeft() {
        this.setState({
            nodeColors: getNodeColors(this.state.clusters)
        });
    }

    onNodeFocus(nodeId) {
        this.setState({
            focused: nodeId
        });
    }

    onNodeLeave() {
        this.setState({
            focused: null
        });
    }

    onFindSPT(treeType) {
        const { objects, selectedObject, selectedNodes, clusters } = this.state;

        this.setState({
            sptData: null,
            loading: true
        });

        if (treeType === "shortest") {
            findSPT(objects[selectedObject].ref, selectedNodes)
                .then(
                    (data) => this.setState({
                        sptData: data,
                        loading: false
                    })
                );
        }
        else {
            const clustersData = clusters.map(
                ({ centroid, members }) => ({ centroid, members })
            );
            findCBT(objects[selectedObject].ref, clustersData)
                .then(
                    (data) => this.setState({
                        sptData: data,
                        loading: false
                    })
                );
        }
    }

    onFindOptimal(criterion, metrics) {
        const { selectedNodes } = this.state;
        this.setState({
            optimal: null,
            loading: true
        });
        findOptimal(selectedNodes, criterion, metrics).then(
            (data) => this.setState({
                optimal: data,
                loading: false
            })
        );
    }

    onFindInRadius(radius, metrics) {
        const { selectedNodes } = this.state;
        this.setState({
            inRadius: null,
            loading: true
        });
        findInRadius(selectedNodes, radius, metrics).then(
            (data) => this.setState({
                inRadius: data,
                loading: false
            })
        );
    }

    onFindClosest(metrics) {
        const { selectedNodes } = this.state;
        this.setState({
            closest: null,
            loading: true
        });
        findClosest(selectedNodes, metrics).then(
            (data) => this.setState({
                closest: data,
                loading: false
            })
        );
    }

    onToggleShowRoads() {
        this.setState({
            showRoads: !this.state.showRoads
        });
    }

    onToggleShouldClusterNodes() {
        this.setState({
            shouldClusterNodes: !this.state.shouldClusterNodes
        });
    }

    onToggleShouldClusterObjects() {
        this.setState({
            shouldClusterObjects: !this.state.shouldClusterObjects
        });
    }

    onToggleShowObjects() {
        this.setState({
            showObjects: !this.state.showObjects
        });
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
            loading,
            // customization
            shouldClusterObjects,
            shouldClusterNodes,
            showObjects,
            showRoads,
            // map interaction
            selectedObject,
            selectedNodes,
            nodeColors,
            focused,
            // data from backend
            closest,
            inRadius,
            optimal,
            clusters,
            dendrogram,
            sptData
        } = this.state;

        const position = [lat, lng];

        const maxBounds = [
            [lat + latDelta, lng + lngDelta],
            [lat - latDelta, lng - lngDelta]
        ];

        const highlightObject = closest && focused && closest[focused];
        console.log("Updating map");
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
                            {
                                openedTab !== "clustering" && showObjects &&
                                <ObjectsLayer
                                    objects={objects}
                                    onObjectSelected={this.onObjectSelected}
                                    clusterObjects={shouldClusterObjects}
                                />
                            }
                            {
                                zoom > 15 &&
                                <NodesLayer
                                    nodes={nodes}
                                    bounds={bounds}
                                    clusterNodes={shouldClusterNodes}
                                    onNodeSelected={this.onNodeSelected}
                                />
                            }
                            {
                                showRoads && roads && zoom > 15 &&
                                <RoadsLayer
                                    nodes={nodes}
                                    adjList={roads}
                                    bounds={bounds}
                                    color="#5af"
                                />
                            }

                            <SelectedNodesLayer
                                nodes={nodes}
                                selectedNodes={selectedNodes}
                                onNodeSelected={this.onNodeSelected}
                                clusters={clusters}
                                onNodeFocus={this.onNodeFocus}
                                onNodeLeave={this.onNodeLeave}
                                nodeColors={nodeColors}
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
                                    bounds={bounds}
                                />
                            }
                            {
                                clusters &&
                                <CentroidsLayer
                                    centroids={
                                        clusters
                                            .map(
                                                ({ centroid, members }, i) => members.length > 1 && {
                                                    center: nodes[centroid.id],
                                                    style: {
                                                        color: `rgb(${rainbowGradient(i / clusters.length).join(",")})`
                                                    }
                                                }
                                            )
                                            .filter(
                                                (c) => Boolean(c)
                                            )
                                    }
                                />
                            }
                        </>
                    }
                </Map>
                <div className="toolbar-container">
                    <div>
                        <h2>Отображение</h2>
                        <CheckboxGroup
                            items={[
                                {
                                    type: "show-roads",
                                    checked: showRoads,
                                    label: "Показать дороги (вблизи)",
                                    onChange: this.onToggleShowRoads
                                },
                                {
                                    type: "cluster-nodes",
                                    checked: shouldClusterNodes,
                                    label: "Кластеризовывать узлы",
                                    onChange: this.onToggleShouldClusterNodes
                                },
                                {
                                    type: "cluster-objects",
                                    checked: shouldClusterObjects,
                                    label: "Кластеризовывать объекты",
                                    onChange: this.onToggleShouldClusterObjects
                                },
                                {
                                    type: "show-objects",
                                    checked: showObjects,
                                    label: "Отобразить объекты",
                                    onChange: this.onToggleShowObjects
                                }
                            ]}
                        />
                    </div>
                    <h2>Выбранно узлов: {selectedNodes.length}</h2>
                    <SelectRandomMenu
                        disabled={!nodes}
                        onChange={this.onSelectRandom}
                        max={nodes && Object.keys(nodes).length}
                    />
                    <CollapsableList
                        onChange={this.onTabChanged}
                        opened={openedTab}
                        items={[
                            {
                                id: "find-closest",
                                title: "Поиск ближайших объектов",
                                content: <FindClosestMenu
                                    onFindClosest={this.onFindClosest}
                                    disabled={selectedNodes.length === 0}
                                    alreadyFound={Boolean(closest)}
                                />,
                                loading
                            },
                            {
                                id: "find-in-radius",
                                title: "Найти объекты в радиусе",
                                content: <FindInRadiusMenu
                                    onFindInRadius={this.onFindInRadius}
                                    disabled={selectedNodes.length === 0}
                                    alreadyFound={Boolean(inRadius)}
                                />,
                                loading
                            },
                            {
                                id: "find-optimal",
                                title: "Поиск оптимально расположенного объекта",
                                content: <FindOptimalMenu
                                    onFindOptimal={this.onFindOptimal}
                                    onNavigate={
                                        () => this.setState({
                                            lat: nodes[optimal][0],
                                            lng: nodes[optimal][1]
                                        })
                                    }
                                    disabled={selectedNodes.length === 0}
                                    alreadyFound={Boolean(optimal)}
                                />,
                                loading
                            },
                            {
                                id: "shortest-paths-tree",
                                title: "Дерево кратчайших путей",
                                content: <ShortestPathsTreeMenu
                                    onFindShortestPathsTree={this.onFindSPT}
                                    disabled={!selectedObject || selectedNodes.length === 0}
                                    info={sptData}
                                    clusteringDone={Boolean(clusters)}
                                />,
                                loading
                            },
                            {
                                id: "clustering",
                                title: "Кластеризация узлов",
                                content: <ClusteringMenu
                                    onClusterNodes={this.onClusterNodes}
                                    disabled={selectedNodes.length === 0}
                                    dendrogram={dendrogram}
                                    clusters={clusters}
                                    nodes={selectedNodes}
                                    onSubclusterSelected={this.onSubclusterSelected}
                                    onSubclusterLeft={this.onSubclusterLeft}
                                    maxNodes={nodes ? Object.keys(nodes).length : 0}
                                />,
                                loading
                            }
                        ]}
                    />
                </div>
            </div>
        );
    }
}
