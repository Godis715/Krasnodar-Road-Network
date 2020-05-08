import React from "react";
import RadioGroup from "../../RadioGroup/RadioGroup";

class FindClosestMenu extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            metrics: "to"
        };

        this.onMetricsChanged = this.onMetricsChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onMetricsChanged(metrics) {
        this.setState({ metrics });
    }

    onSubmit() {
        const { metrics } = this.state;
        this.props.onFindClosest(metrics);
    }

    render() {
        const { metrics } = this.state;
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
                <button
                    onClick={this.onSubmit}
                >
                    Найти
                </button>
                {
                    this.props.disabled &&
                    <div>
                        Ближайшие объекты найдены. Чтобы увидеть результат, наведите на значок здания.
                    </div>
                }

            </div>
        );
    }
}

export default FindClosestMenu;
