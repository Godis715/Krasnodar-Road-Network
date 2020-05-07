import axios from "axios";

export default function findClosest(nodes) {
    return axios
        .post("http://localhost:5000/api/objects/find/closest", { nodes, metrics: "from" })
        .then(
            ({ data }) => data
        );
}
