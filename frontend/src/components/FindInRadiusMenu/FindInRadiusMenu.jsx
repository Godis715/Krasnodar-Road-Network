import React from "react";
import RadioGroup from "../RadioGroup/RadioGroup";

function strIsValidNumber(str) {
    return true;
}

class FindInRadiusMenu extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            metrics: "to",
            radius: "500"
        };

        this.onMetricsChanged = this.onMetricsChanged.bind(this);
        this.onRadiusChanged = this.onRadiusChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onMetricsChanged(metrics) {
        this.setState({ metrics });
    }

    onRadiusChanged(ev) {
        const radius = ev.target.value;
        if (!radius) {
            this.setState({
                radius: ""
            });
        }
        else if (strIsValidNumber(radius)) {
            this.setState({ radius });
        }
    }

    onSubmit() {
        const { metrics, radius } = this.state;
        const radiusFloat = parseFloat(radius);
        this.props.onFindInRadius(radiusFloat, metrics);
    }

    render() {
        const { metrics, radius } = this.state;
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
                    <input id="radius-input" type="text" value={radius} onChange={this.onRadiusChanged} />
                    <span>м</span>
                </div>
                <button
                    onClick={this.onSubmit}
                >
                    Найти
                </button>
                {
                    this.props.disabled &&
                    <div>
                        Объекты найдены. Наведите на значок здания, чтобы посмотреть результат.
                    </div>
                }
            </div>
        );
    }
}

export default FindInRadiusMenu;
