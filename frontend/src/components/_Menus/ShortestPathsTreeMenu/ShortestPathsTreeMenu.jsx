import React from "react";

class ShortestPathsTreeMenu extends React.PureComponent {
    render() {
        const { disabled, onFindShortestPathsTree, info } = this.props;
        return (
            <div>
                {
                    disabled &&
                    <div>Выберите узлы и объект инфраструктуры.</div>
                }
                <button
                    onClick={onFindShortestPathsTree}
                    disabled={disabled}
                >
                    Найти
                </button>
                {
                    info &&
                    <div>
                        <div>Дерево кратчайших путей было найдено.</div>
                        <div>Суммарная длина всех путей {info.paths_weight}м</div>
                        <div>Вес дерева (длина всех дорог) {info.tree_weight}м</div>
                    </div>
                }
            </div>
        );
    }
}

export default ShortestPathsTreeMenu;
