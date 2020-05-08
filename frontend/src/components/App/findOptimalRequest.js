import axios from "axios";

export default function findOptimalRequest(nodes, criterion, metrics) {
    return axios
        .post(
            "http://localhost:5000/api/objects/find/optimal",
            {
                nodes,
                metrics,
                criterion
            }
        )
        .then(
            ({ data }) => data.id_object
        );
}
