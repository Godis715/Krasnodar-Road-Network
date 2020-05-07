import React from "react";
import CollapsableCard from "../CollapsableCard/CollapsableCard";
import "./collapsableList.css";

class CollapsableList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: 0
        };

        this.onToggled = this.onToggled.bind(this);
    }

    onToggled(index) {
        if (this.state.opened === index) {
            this.setState({
                opened: -1
            });
        }
        else {
            this.setState({
                opened: index
            });
        }
    }

    render() {
        const { items } = this.props;
        return (
            <div className="collapsable-list">
                {
                    items.map(
                        (item, i) => (
                            <CollapsableCard
                                key={item.title}
                                title={item.title}
                                content={item.content}
                                isOpen={this.state.opened === i}
                                value={i}
                                onToggled={this.onToggled}
                            />
                        )
                    )
                }
            </div>
        );
    }
}

export default CollapsableList;
