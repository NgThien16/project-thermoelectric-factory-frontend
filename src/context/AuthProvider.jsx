import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { AuthService } from "../service/auth/AuthService";
import {useNavigate} from "react-router-dom";


export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const loadUser = async () => {

            const token =
                localStorage.getItem("token");

            if (!token) {

                setLoading(false);

                return;
            }

            try {

                const data =
                    await AuthService.getCurrentUser();

                setUser(data);

            } catch {

                localStorage.removeItem("token");

            } finally {

                setLoading(false);
            }
        };

        loadUser();

    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}