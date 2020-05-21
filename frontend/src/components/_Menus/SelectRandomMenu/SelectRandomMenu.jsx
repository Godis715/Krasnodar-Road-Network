import React from "react";

class SelectRandomMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            randomCount: 10
        };

        this.onCountChanged = this.onCountChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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

    render() {
        const { randomCount } = this.state;
        const { max } = this.props;
        return (
            <div>
                <button onClick={this.onSubmit}>Выбрать</button>
                <input
                    type="number"
                    value={randomCount}
                    min={0}
                    max={max}
                    onChange={this.onCountChanged}
                />
                <span>случайных узлов (всего {max || "-"})</span>
            </div>
        );
    }
}

export default SelectRandomMenu;
