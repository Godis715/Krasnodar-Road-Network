import React from "react";
import rainbowGradient from "../../../utils/rainbowGradient";
import { dendrogramToTreeData } from "../../../utils/dendrogram";
import Tree from "react-d3-tree";

const svgSquare = {
    shape: "rect",
    shapeProps: {
        width: 10,
        height: 10,
        x: -5,
        y: -5
    }
};

class CenteredTree extends React.PureComponent {
    state = {}

    componentDidMount() {
        const dimensions = this.treeContainer.getBoundingClientRect();
        this.setState({
            translate: {
                x: dimensions.width / 2,
                y: dimensions.height / 4
            }
        });
    }

    render() {
        const { containerProps, treeProps } = this.props;
        return (
            <div
                {...containerProps}
                ref={
                    (tc) => {
                        this.treeContainer = tc;
                    }
                }
            >
                <Tree
                    {...treeProps}
                    translate={this.state.translate}
                />
            </div>
        );
    }
}

class ClusteringMenu extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            metrics: "to",
            clustersNumber: 3
        };

        this.onClustersNumberChanged = this.onClustersNumberChanged.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onClustersNumberChanged(ev) {
        const clustersNumber = parseInt(ev.target.value);
        this.setState({ clustersNumber });
    }

    onMouseOver(nodeData) {
        if (!nodeData.parent) {
            return;
        }
        this.props.onSubclusterSelected(nodeData.height, nodeData.nodeId);
    }
    onSubmit() {
        const { clustersNumber } = this.state;
        this.props.onClusterNodes(clustersNumber);
    }

    render() {
        const { clustersNumber } = this.state;
        const { dendrogram, disabled, clusters, nodes, onSubclusterLeft, maxNodes } = this.props;

        const treeData = dendrogram && dendrogramToTreeData(dendrogram, nodes);
        if (dendrogram) {
            treeData.children.forEach(
                ({ nodeId }, i) => {
                    const ci = clusters.findIndex(
                        ({ members }) => members.includes(nodeId)
                    );
                    treeData.children[i].nodeSvgShape = {
                        shape: "circle",
                        shapeProps: {
                            r: 10,
                            fill: `rgb(${
                                rainbowGradient(ci / clusters.length).join(",")
                            })`
                        }
                    };
                }
            );
        }

        return (
            <>
                <div>
                    <label
                        htmlFor="clusters-n-input"
                        className="inline_space-end_s"
                    >
                        Количество кластеров
                    </label>
                    <input
                        id="clusters-n-input"
                        type="number"
                        value={clustersNumber}
                        onChange={this.onClustersNumberChanged}
                        min={0}
                        max={maxNodes}
                    />
                </div>
                <button
                    className="block_margin-t_s"
                    onClick={this.onSubmit}
                    disabled={disabled}
                >
                    Найти
                </button>
                {
                    disabled &&
                    <div className="block_margin-t_s hint">Выберите узлы.</div>
                }
                {
                    clusters &&
                    <div className="block_margin-t_s hint hint_type_success">
                        Кластеры были найдены. Нажмите на узел дендрограммы, чтобы раскрыть поддерево узла.
                    </div>
                }
                {
                    dendrogram &&
                    <CenteredTree
                        containerProps={{
                            className: "block_margin-t_s abc",
                            style: { width: "100%", height: "25em", border: "1px solid black" },
                            onScroll: (e) => e.preventDefault()
                        }}
                        treeProps={{
                            orientation: "vertical",
                            pathFunc: "step",
                            transitionDuration: 0,
                            scaleExtent: {
                                min: 1,
                                max: 1
                            },
                            depthFactor: 50,
                            nodeSvgShape: svgSquare,
                            separation: {
                                siblings: 0.25,
                                nonSiblings: 0.25
                            },
                            onMouseOver: this.onMouseOver,
                            onMouseOut: onSubclusterLeft,
                            data: [
                                treeData
                            ]
                        }}
                    />
                }
            </>
        );
    }
}

export default ClusteringMenu;
