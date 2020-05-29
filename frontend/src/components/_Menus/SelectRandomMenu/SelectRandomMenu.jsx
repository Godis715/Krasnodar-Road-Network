import React from "react";
import "./selectRandomMenu.css";

class SelectRandomMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            randomCount: 10
        };

        this.onCountChanged = this.onCountChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onErase = this.onErase.bind(this);
    }

    onCountChanged(ev) {
        this.setState({
            randomCount: parseInt(ev.target.value)
        });
    }

    onSubmit() {
        this.props.onChange(
            this.state.randomCount
        );
    }

    onErase() {
        this.props.onChange(0);
    }

    render() {
        const { randomCount } = this.state;
        const { max, disabled } = this.props;
        return (
            <div className="select-random-menu-cont">
                <button
                    onClick={this.onSubmit}
                    className="inline_space-end_s"
                    disabled={disabled}
                >
                    Выбрать
                </button>
                <input
                    className="inline_space-end_s"
                    type="number"
                    value={randomCount}
                    min={0}
                    max={max}
                    onChange={this.onCountChanged}
                />
                <span className="block_margin-t_s inline_space-end_s">случайных узлов (всего {max || "-"})</span>
                <button onClick={this.onErase}>Сбросить</button>
            </div>
        );
    }
}

export default SelectRandomMenu;
