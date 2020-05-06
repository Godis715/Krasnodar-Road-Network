import axios from "axios";

export default function fetchObjects() {
    return axios
        .get("http://localhost:5000/api/objects/info")
        .then(
            ({ data }) => data
        );
}
