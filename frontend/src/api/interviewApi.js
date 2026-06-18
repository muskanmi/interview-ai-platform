import axios from "axios";

const API = axios.create({
    baseURL: "https://interview-ai-platform-production-2f91.up.railway.app/api/v1",
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