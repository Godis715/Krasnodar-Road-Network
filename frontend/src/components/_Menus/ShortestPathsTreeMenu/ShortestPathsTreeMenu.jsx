import React from "react";

class ShortestPathsTreeMenu extends React.PureComponent {
    render() {
        return (
            <div>
                <button
                    onClick={this.props.onFindShortestPathsTree}
                >
                    Найти
                </button>
                {
                    this.props.disabled &&
                    <div>
                        <div>Дерево кратчайших путей было найдено.</div>
                        <div>Суммарная длина всех путей {this.props.info.paths_weight}м</div>
                        <div>Вес дерева (длина всех дорог) {this.props.info.tree_weight}м</div>
                    </div>
                }
            </div>
        );
    }
}

export default ShortestPathsTreeMenu;
