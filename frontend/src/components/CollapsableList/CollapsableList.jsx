import React from "react";
import CollapsableCard from "../CollapsableCard/CollapsableCard";
import "./collapsableList.css";

class CollapsableList extends React.Component {
    constructor(props) {
        super(props);
        this.onToggled = this.onToggled.bind(this);
    }

    onToggled(id) {
        this.props.onChange(
            this.props.opened === id
                ? null
                : id
        );
    }

    render() {
        const { items, opened } = this.props;
        return (
            <div className="collapsable-list">
                {
                    items.map(
                        (item) => (
                            <CollapsableCard
                                key={item.title}
                                title={item.title}
                                content={item.content}
                                isOpen={opened === item.id}
                                value={item.id}
                                onToggled={this.onToggled}
                                loading={item.loading}
                            />
                        )
                    )
                }
            </div>
        );
    }
}

export default CollapsableList;
