import axios from "axios";

export default function findInRadius(nodes, radius, metrics) {
    return axios
        .post(
            "http://localhost:5000/api/objects/find/in_radius",
            {
                nodes,
                metrics,
                max_dist: radius
            }
        )
        .then(
            ({ data }) => data
        );
}
