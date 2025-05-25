import axios from "axios";
import { API_URI } from "../config";

const apiInstance = axios.create({
    baseURL: API_URI,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
});

export default apiInstance;
