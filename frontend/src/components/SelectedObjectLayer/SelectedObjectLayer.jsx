import React from "react";
import { Marker, LayerGroup } from "react-leaflet";
import L from "leaflet";
import "./selectedObjectLayer.css";

const SELECTED_OBJECT_ICON = L.divIcon({
    className: "selected-object-icon"
});

class SelectedObjectLayer extends React.PureComponent {
    render() {
        const { selectedObject, objects, onObjectSelected } = this.props;
        const loc = selectedObject &&
            objects[selectedObject].location;
        console.log("Render selected object layer");
        return (
            <LayerGroup>{
                selectedObject &&
                <Marker
                    position={[loc[1], loc[0]]}
                    key={selectedObject}
                    icon={SELECTED_OBJECT_ICON}
                    onClick={
                        () => onObjectSelected(selectedObject)
                    }
                />
            }</LayerGroup>
        );
    }
}

export default SelectedObjectLayer;
