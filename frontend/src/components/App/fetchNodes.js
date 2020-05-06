import axios from "axios";

export default function fetchNodes() {
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
