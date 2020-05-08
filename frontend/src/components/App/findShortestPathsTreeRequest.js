import axios from "axios";

export default function findShortestPathsTreeRequest(objectNodeRef, nodes) {
    return axios
        .post(
            "http://localhost:5000/api/shortest_paths_tree",
            {
                nodes,
                object: objectNodeRef
            }
        )
        .then(
            ({ data }) => data
        );
}
