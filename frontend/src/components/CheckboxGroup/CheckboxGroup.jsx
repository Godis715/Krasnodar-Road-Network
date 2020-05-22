import React from "react";
import deepEqual from "deep-equal";

class CheckboxGroup extends React.Component {
    shouldComponentUpdate(newProps) {
        const shouldUpdate = newProps.items.some(
            (item, i) => !deepEqual(this.props.items[i], item)
        );

        return shouldUpdate;
    }

    render() {
        console.log("Checkbox updating");
        const { items } = this.props;
        return (
            <div>{
                items.map(
                    ({ type, label, checked, onChange }) => (
                        <div key={`checkboxgroup-${type}`}>
                            <input
                                id={`checkboxgroup-${type}`}
                                type="checkbox"
                                value={type}
                                checked={checked}
                                onChange={onChange}
                            />
                            <label htmlFor={`checkboxgroup-${type}`}>{label}</label>
                        </div>
                    )
                )
            }</div>
        );
    }
}

export default CheckboxGroup;
