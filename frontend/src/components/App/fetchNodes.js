import axios from "axios";

export default function fetchNodes() {
    return axios.get("localhost:3000/nodes/info");
}