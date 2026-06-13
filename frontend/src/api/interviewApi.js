import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});

export const uploadResumeApi = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    return API.post(
        "/api/resumes/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export default API;