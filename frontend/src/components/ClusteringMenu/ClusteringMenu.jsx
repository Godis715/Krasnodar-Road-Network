import React from "react";
import RadioGroup from "../RadioGroup/RadioGroup";

function strIsValidNumber(str) {
    return true;
}

class ClusteringMenu extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            metrics: "to",
            clustersNumber: "2"
        };

        this.onMetricsChanged = this.onMetricsChanged.bind(this);
        this.onClustersNumberChanged = this.onClustersNumberChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onMetricsChanged(metrics) {
        this.setState({ metrics });
    }

    onClustersNumberChanged(ev) {
        const clustersNumber = ev.target.value;
        if (!clustersNumber) {
            this.setState({
                clustersNumber: ""
            });
        }
        else if (strIsValidNumber(clustersNumber)) {
            this.setState({ clustersNumber });
        }
    }

    onSubmit() {
        const { metrics, clustersNumber } = this.state;
        const clustersNumberInt = parseInt(clustersNumber);
        this.props.onClusterNodes(clustersNumberInt, metrics);
    }

    render() {
        const { metrics, clustersNumber } = this.state;
        return (
            <div>
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
                    <label htmlFor="clusters-n-input">Количество кластеров</label>
                    <input id="clusters-n-input" type="text" value={clustersNumber} onChange={this.onClustersNumberChanged} />
                </div>
                <button
                    onClick={this.onSubmit}
                >
                    Найти
                </button>
                {
                    this.props.disabled &&
                    <div>
                        Кластеры были найдены.
                    </div>
                }
            </div>
        );
    }
}

export default ClusteringMenu;
