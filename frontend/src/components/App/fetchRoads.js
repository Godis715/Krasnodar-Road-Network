import roads from "./roads.json";

export default function fetchNodes() {
    return Promise.resolve(roads);
}
