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
                <h3>Критерий</h3>
                <RadioGroup
                    value={criterion}
                    name="criterion"
                    items={[
                        ["closest-furthest", "Расстояние до дальнего узла"],
                        ["min-dist-sum", "Сумма расстояния до узлов"],
                        ["min-tree-weight", "Вес дерева путей (кратчайшее дерево или д. кратчайших путей?)"]
                    ]}
                    onChange={this.onCriterionChanged}
                />
                {
                    disabled &&
                    <div>Выберите узлы.</div>
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
                        <span>Объекты найдены. Наведите на значок здания, чтобы посмотреть результат.</span>
                        <button onClick={onNavigate}>
                            Показать
                        </button>
                    </div>
                }
            </div>
        );
    }
}

export default FindOptimalMenu;
