import axios from "axios";
import roads from "./roads.json";

export function clusterNodes(nodes, clustersNumber, metrics) {
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

export function fetchNodes() {
    return axios
        .get("http://localhost:5000/api/nodes/info")
        .then(
            ({ data }) => Object.entries(data).reduce(
                (acc, [key, [lng, lat]]) => {
                    acc[key] = [lat, lng];
                    return acc;
                },
                {}
            )
        );
}

export function fetchObjects() {
    return axios
        .get("http://localhost:5000/api/objects/info")
        .then(
            ({ data }) => data
        );
}

export function fetchRoads() {
    const visited = {};
    const uniqueRoads = roads.filter(
        ([n1, n2]) => {
            if (!visited[n2]) {
                visited[n2] = { [n1]: true };
            }
            else {
                visited[n2][n1] = true;
            }

            if (!visited[n1]) {
                visited[n1] = { [n2]: true };
                return true;
            }

            if (!visited[n1][n2]) {
                visited[n1][n2] = true;
                return true;
            }

            return false;
        }
    );

    return Promise.resolve(uniqueRoads);
}

export function findClosest(nodes, metrics) {
    return axios
        .post("http://localhost:5000/api/objects/find/closest", { nodes, metrics })
        .then(
            ({ data }) => data
        );
}

export function findInRadius(nodes, radius, metrics) {
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

export function findOptimal(nodes, criterion, metrics) {
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

export function findSPT(objectNodeRef, nodes) {
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
