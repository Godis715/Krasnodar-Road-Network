import React from "react";
import RadioGroup from "../../RadioGroup/RadioGroup";

function strIsValidNumber(str) {
    return true;
}

class FindInRadiusMenu extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            metrics: "to",
            radius: 500
        };

        this.onMetricsChanged = this.onMetricsChanged.bind(this);
        this.onRadiusChanged = this.onRadiusChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onMetricsChanged(metrics) {
        this.setState({ metrics });
    }

    onRadiusChanged(ev) {
        this.setState({
            radius: parseFloat(ev.target.value)
        });
    }

    onSubmit() {
        const { metrics, radius } = this.state;
        this.props.onFindInRadius(radius, metrics);
    }

    render() {
        const { metrics, radius } = this.state;
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
                <div className="block_margin-t_m">
                    <label
                        htmlFor="radius-input"
                        className="inline_space-end_s"
                    >
                        В радиусе
                    </label>
                    <input
                        id="radius-input"
                        type="number"
                        step="any"
                        value={radius}
                        onChange={this.onRadiusChanged}
                    />
                    <span>м</span>
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
                    <div className="block_margin-t_s hint">Выберите узлы и укажите радиус поиска.</div>
                }
                {
                    alreadyFound &&
                    <div className="block_margin-t_s hint hint_type_success">
                        Объекты найдены. Наведите на значок здания, чтобы посмотреть результат.
                    </div>
                }
            </div>
        );
    }
}

export default FindInRadiusMenu;
