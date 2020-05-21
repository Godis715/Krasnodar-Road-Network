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
                    <label htmlFor="radius-input">В радиусе</label>
                    <input
                        id="radius-input"
                        type="number"
                        step="any"
                        value={radius}
                        onChange={this.onRadiusChanged}
                    />
                    <span>м</span>
                </div>
                {
                    disabled &&
                    <div>Выберите узлы и укажите радиус поиска.</div>
                }
                <button
                    onClick={this.onSubmit}
                    disabled={disabled}
                >
                    Найти
                </button>
                {
                    alreadyFound &&
                    <div>
                        Объекты найдены. Наведите на значок здания, чтобы посмотреть результат.
                    </div>
                }
            </div>
        );
    }
}

export default FindInRadiusMenu;
