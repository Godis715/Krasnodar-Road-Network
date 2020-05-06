import roads from "./roads.json";

export default function fetchNodes() {
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

    console.log(roads.length, uniqueRoads.length);
    return Promise.resolve(uniqueRoads);
}
