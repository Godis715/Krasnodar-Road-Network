import nodes from "./nodes.json";

export default function fetchNodes() {
    return Promise.resolve(
        Object.entries(nodes)
            .reduce(
                (newNodes, [key, [lng, lat]]) => {
                    newNodes[key] = [lat, lng];
                    return newNodes;
                },
                {}
            )
    );
}
