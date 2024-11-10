import axios from "axios";

// const base_url = "http://localhost:5000/api"
const base_url = "https://drag-drop-backend-ones.onrender.com/api"

export const publicRequest = axios.create({
    baseURL: base_url
})