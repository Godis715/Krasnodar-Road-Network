import React from "react";
import RadioGroup from "../../RadioGroup/RadioGroup";
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

class ClusteringMenu extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            metrics: "to",
            clustersNumber: 2
        };

        this.onMetricsChanged = this.onMetricsChanged.bind(this);
        this.onClustersNumberChanged = this.onClustersNumberChanged.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onMetricsChanged(metrics) {
        this.setState({ metrics });
    }

    onClustersNumberChanged(ev) {
        const clustersNumber = parseInt(ev.target.value);
        console.log("Cluster number", typeof clustersNumber);
        this.setState({ clustersNumber });
    }

    onMouseOver(nodeData) {
        console.log("Selected", nodeData);
        this.props.onSubclusterSelected(nodeData.height, nodeData.nodeId);
    }
    onSubmit() {
        const { metrics, clustersNumber } = this.state;
        this.props.onClusterNodes(clustersNumber, metrics);
    }

    render() {
        const { metrics, clustersNumber } = this.state;
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
                <RadioGroup
                    value={metrics}
                    name="metrics"
                    items={[
                        ["to", "Туда"],
                        ["from", "Обратно"],
                        ["to-from", "Туда-обратно"]
                    ]}
                    onChange={this.onMetricsChanged}
                />
                <div>
                    <label
                        htmlFor="clusters-n-input"
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
                    onClick={this.onSubmit}
                    disabled={disabled}
                >
                    Найти
                </button>
                {
                    clusters &&
                    <div>
                        Кластеры были найдены.
                    </div>
                }
                {
                    dendrogram &&
                    <div
                        style={{ width: "100%", height: "100%", border: "1px solid black" }}
                    >
                        <Tree
                            orientation="vertical"
                            pathFunc="step"
                            transitionDuration={0}
                            scaleExtent={{
                                min: 1,
                                max: 1
                            }}
                            depthFactor={50}
                            translate={{
                                x: 100,
                                y: 20
                            }}
                            nodeSvgShape={svgSquare}
                            separation={{
                                siblings: 0.25,
                                nonSiblings: 0.25
                            }}
                            onMouseOver={this.onMouseOver}
                            onMouseOut={onSubclusterLeft}
                            data={[
                                treeData
                            ]}
                        />
                    </div>
                }
            </>
        );
    }
}

export default ClusteringMenu;
