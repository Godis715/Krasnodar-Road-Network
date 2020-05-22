import React from "react";
import RadioGroup from "../../RadioGroup/RadioGroup";

class FindOptimalMenu extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            metrics: "to",
            criterion: "closest-furthest"
        };

        this.onMetricsChanged = this.onMetricsChanged.bind(this);
        this.onCriterionChanged = this.onCtriterionChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onMetricsChanged(metrics) {
        this.setState({ metrics });
    }

    onCtriterionChanged(criterion) {
        this.setState({ criterion });
    }

    onSubmit() {
        const { metrics, criterion } = this.state;
        this.props.onFindOptimal(criterion, metrics);
    }

    render() {
        const { metrics, criterion } = this.state;
        const { disabled, alreadyFound, onNavigate } = this.props;
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
                <div className="block_margin-t_m block_margin-b_s">Критерий:</div>
                <RadioGroup
                    value={criterion}
                    name="criterion"
                    items={[
                        ["closest-furthest", "Расстояние до дальнего узла"],
                        ["min-dist-sum", "Сумма расстояния до узлов"],
                        ["min-tree-weight", "Вес дерева путей"]
                    ]}
                    onChange={this.onCriterionChanged}
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
                    <div>
                        <span className="block_margin-t_s hint hint_type_success">
                            Объекты найдены. Наведите на значок здания, чтобы посмотреть результат.
                        </span>
                        <button
                            onClick={onNavigate}
                            className="block_margin-t_s"
                        >
                            Показать
                        </button>
                    </div>
                }
            </div>
        );
    }
}

export default FindOptimalMenu;
