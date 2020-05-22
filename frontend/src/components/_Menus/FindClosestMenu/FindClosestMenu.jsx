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
        const { disabled, alreadyFound } = this.props;
        return (
            <div>
                <div className="block_margin-b_s">Способ измерения расстояния:</div>
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
                    className="block_margin-t_m"
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
                    alreadyFound &&
                    <div className="block_margin-t_s hint hint_type_success">
                        Ближайшие объекты найдены. Чтобы увидеть результат, наведите на значок здания.
                    </div>
                }

            </div>
        );
    }
}

export default FindClosestMenu;
