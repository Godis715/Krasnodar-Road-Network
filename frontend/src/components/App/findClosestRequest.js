import axios from "axios";

export default function findClosest(nodes, metrics) {
    return axios
        .post("http://localhost:5000/api/objects/find/closest", { nodes, metrics })
        .then(
            ({ data }) => data
        );
}
