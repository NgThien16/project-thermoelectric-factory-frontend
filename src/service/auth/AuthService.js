import axiosInstance from "../../api/axiosInstance";

export const AuthService = {

    login: (data) =>
        axiosInstance
            .post("/auth/login", data)
            .then(res => res.data),

    getCurrentUser: () =>
        axiosInstance
            .get("/auth/me")
            .then(res => res.data),

    logout: () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
};