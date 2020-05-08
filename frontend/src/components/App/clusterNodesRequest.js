import axios from "axios";

export default function clusterNodes(nodes, clustersNumber, metrics) {
    return axios
        .post(
            "http://localhost:5000/api/clustering",
            {
                nodes,
                metrics,
                clusters_n: clustersNumber
            })
        .then(
            ({ data }) => data
        );
}
