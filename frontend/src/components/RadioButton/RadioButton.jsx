import React from "react";
import "./radioButton.css";

class RadioButton extends React.Component {
    render() {
        const { label, name, value, checked, htmlId } = this.props;
        return (
            <div className="radio-container">
                <input
                    type="radio"
                    id={htmlId}
                    value={value}
                    name={name}
                />
                <label htmlFor={htmlId}>{label}</label>
            </div>
        );
    }
}

export default RadioButton;
