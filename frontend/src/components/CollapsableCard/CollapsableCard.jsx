import React from "react";
import "./collapsableCard.css";

class CollapsableCard extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onToggled(this.props.value);
    }

    render() {
        const { title, content, isOpen, loading } = this.props;
        return (
            <div className={`collapsable-card ${isOpen ? "" : "collapsable-card__collapsed"}`}>
                <div className={`collapsable-card__title  ${loading ? "collapsable-card_status_loading" : "" }`} onClick={this.onClick}>
                    {title}
                </div>
                <div className="collapsable-card__content">
                    {content}
                </div>
            </div>
        );
    }
}

export default CollapsableCard;
