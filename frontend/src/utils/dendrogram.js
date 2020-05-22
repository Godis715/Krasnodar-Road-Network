export function dendrogramToTreeData(dendrogram, nodes) {
    const includings = unfoldDendrogram(dendrogram);

    const subtrees = nodes.reduce(
        (acc, nodeId) => {
            acc[nodeId] = { nodeId };
            return acc;
        },
        {}
    );

    includings.forEach(
        ([h, c1, c2]) => {
            subtrees[c1] = {
                height: h,
                name: h,
                nodeId: c1,
                children: [
                    subtrees[c1],
                    subtrees[c2]
                ]
            };
            delete subtrees[c2];
        }
    );

    const clusteringTree = {
        name: "Кластеры",
        children: Object.values(subtrees)
    };

    return clusteringTree;
}

export function getSubclusters(dendrogram, nodes, h) {
    const treeData = dendrogramToTreeData(dendrogram, nodes);
    const queue = [...treeData.children];
    let subtree;
    while(queue.length > 0) {
        subtree = queue.shift();
        if (subtree.height === h) {
            break;
        }
        if(subtree.children) {
            queue.push(...subtree.children);
        }
    }
    return subtree.children.map(
        (ch) => {
            if (!ch.children) {
                return [ch.nodeId];
            }
            const q = [...ch.children];
            const visited = [];
            while(q.length > 0) {
                const s = q.shift();
                if (s.children) {
                    q.push(...s.children);
                }
                else {
                    visited.push(s.nodeId);
                }
            }
            return visited;
        }
    );
}

function unfoldDendrogram(dendrogram) {
    const arrOfIncludings = Object
        .entries(dendrogram)
        .map(
            ([root, includings]) => includings.map(
                ({ cluster, height }) => [height, root, cluster]
            )
        );

    return []
        .concat(...arrOfIncludings)
        .sort(
            ([a], [b]) =>
                a > b
                    ? 1
                    : a < b
                        ? -1
                        : 0
        );
}
