import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

if (!apiUrl) {
    throw new Error("REACT_APP_API_URL must be provided as an env variable");
}

const axiosInstance = axios.create({
    baseURL: `${apiUrl}/api`
});

export function clusterNodes(nodes, clustersNumber, metrics) {
    return axiosInstance
        .post(
            "/clustering",
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
    return axiosInstance
        .get("/nodes/info")
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
    return axiosInstance
        .get("/objects/info")
        .then(
            ({ data }) => data
        );
}

export function fetchRoads() {
    return axiosInstance
        .get("/roads/info")
        .then(
            ({ data: roads }) => {
                const visited = {};
                let notUniqueCount = 0;
                const uniqueRoads = roads.filter(
                    (roadNodes) => {
                        const sorted = [...roadNodes].sort(
                            (a, b) =>
                                a > b
                                    ? 1
                                    : a < b
                                        ? -1
                                        : 0
                        );
                        const roadId = sorted.join("-");
                        if (!visited[roadId]) {
                            visited[roadId] = true;
                            return true;
                        }
                        notUniqueCount++;
                        return false;
                    }
                );
                console.log("Duplicate road count", notUniqueCount);
                return uniqueRoads;
            }
        );
}

export function findClosest(nodes, metrics) {
    return axiosInstance
        .post("/objects/find/closest", { nodes, metrics })
        .then(
            ({ data }) => data
        );
}

export function findInRadius(nodes, radius, metrics) {
    return axiosInstance
        .post(
            "/objects/find/in_radius",
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
    return axiosInstance
        .post(
            "/objects/find/optimal",
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

// SPT = shortest paths tree
export function findSPT(objectNodeRef, nodes) {
    return axiosInstance
        .post(
            "/shortest_paths_tree",
            {
                nodes,
                object: objectNodeRef
            }
        )
        .then(
            ({ data }) => data
        );
}

// CBT - cluster-based tree
export function findCBT(objectNodeRef, clusters) {
    return axiosInstance
        .post(
            "/clustering/shortest_paths_tree",
            {
                object: objectNodeRef,
                clusters
            }
        )
        .then(
            ({ data }) => data
        );
}