import React from "react";

class RadioGroup extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(ev) {
        this.props.onChange(ev.target.value);
    }

    render() {
        const { value, items, groupName } = this.props;
        return (
            <div onChange={this.onChange}>{
                items.map(
                    ([type, label]) =>
                        <div key={`radiogroup-${type}`}>
                            <input
                                id={`radiogroup-${type}`}
                                type="radio"
                                name={groupName}
                                value={type}
                                checked={value === type}
                            />
                            <label htmlFor={`radiogroup-${type}`}>{label}</label>
                        </div>
                )
            }</div>
        );
    }
}

export default RadioGroup;
