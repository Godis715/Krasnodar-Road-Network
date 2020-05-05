import axios from "axios";

export default function fetchObjects() {
    return axios.get("localhost:3000/objects/info");
}
