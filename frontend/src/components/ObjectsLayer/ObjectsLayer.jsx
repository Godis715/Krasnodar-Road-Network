import React from "react";
import { CircleMarker, LayerGroup } from "react-leaflet";

class ObjectsLayer extends React.Component {
    render() {
        const { objects } = this.props;
        return (
            <LayerGroup>{
				Object.entries(objects)
					.filter(
						([_, { type }]) => type === "infrastructure"
					)
                    .map(
                        ([key, { location }]) => (
                            <CircleMarker
                                center={[location[1], location[0]]}
                                color="#f99"
								key={key}
								radius={3}
                            />
                        )
                	)
            }</LayerGroup>
        );
    }
}

export default ObjectsLayer;
