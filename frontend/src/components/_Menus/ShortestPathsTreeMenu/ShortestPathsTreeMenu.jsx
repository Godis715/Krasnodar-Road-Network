import React from "react";
import RadioGroup from "../../RadioGroup/RadioGroup";

class ShortestPathsTreeMenu extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            treeType: "shortest"
        };

        this.onTreeTypeChanged = this.onTreeTypeChanged.bind(this);
        this.onFindPathsTree = this.onFindPathsTree.bind(this);
    }

    onTreeTypeChanged(treeType) {
        this.setState({ treeType });
    }

    onFindPathsTree() {
        this.props.onFindShortestPathsTree(this.state.treeType);
    }

    render() {
        const { treeType } = this.state;
        const { disabled, info, clusteringDone } = this.props;
        console.log(clusteringDone);
        return (
            <div>
                <div className="block_margin-b_s">Тип:</div>
                <RadioGroup
                    value={treeType}
                    name="tree-type"
                    items={[
                        ["shortest", "Кратчайших путей"],
                        ["cluster-based", "На основе кластеров"]
                    ]}
                    onChange={this.onTreeTypeChanged}
                />
                <button
                    className="block_margin-t_m"
                    onClick={this.onFindPathsTree}
                    disabled={disabled || (treeType === "cluster-based" && !clusteringDone)}
                >
                    Найти
                </button>
                {
                    disabled &&
                    <div className="block_margin-t_s hint">Выберите узлы и объект инфраструктуры.</div>
                }
                {
                    treeType === "cluster-based" && !clusteringDone &&
                    <div className="block_margin-t_s hint">Прежде чем начать, выполните кластеризацию.</div>
                }
                {
                    info &&
                    <div>
                        <div className="block_margin-t_s hint hint_type_success">
                            Дерево кратчайших путей было найдено.
                        </div>
                        <div className="block_margin-t_s">
                            Суммарная длина всех путей {info.paths_weight}м
                        </div>
                        <div className="block_margin-t_s">
                            Вес дерева (длина всех дорог) {info.tree_weight}м
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default ShortestPathsTreeMenu;
