import React from "react";
import { Polyline, withLeaflet } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";

class PolylineDecorator extends React.PureComponent {
    constructor(props) {
        super(props);
        this.polyRef = React.createRef();
    }

    removePolylineDecorator() {
        this.polylineDecorator.remove();
    }

    drawPolylineDecorator() {
        const polyline = this.polyRef.current.leafletElement;
        const { map } = this.polyRef.current.props.leaflet;

        this.polylineDecorator = L.polylineDecorator(polyline, {
            patterns: this.props.patterns
        }).addTo(map);
    }

    componentDidMount() {
        this.drawPolylineDecorator();
    }

    componentDidUpdate() {
        this.removePolylineDecorator();
        this.drawPolylineDecorator();
    }

    componentWillUnmount() {
        this.removePolylineDecorator();
    }

    render() {
        return <Polyline ref={this.polyRef} {...this.props} />;
    }
}

export default withLeaflet(PolylineDecorator);
