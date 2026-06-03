import { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../context/useAuth";

import { AuthService } from "../../service/auth/AuthService";

export default function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const { setUser } = useAuth();
    const submit = async () => {
        try {
            const res = await AuthService.login(form);

            localStorage.setItem("token", res.token);

            // 👉 QUAN TRỌNG: set user ngay lập tức
            setUser({
                username: res.username,
                roles: res.roles
            });

            toast.success("Đăng nhập thành công");

            navigate("/");
        } catch (e) {
            toast.error(
                e.response?.data?.message ||
                e.response?.data ||
                "Đăng nhập thất bại"
            );
        }
    };

    return (
        <div className="container mt-5">

            <Card className="p-4">

                <h3 className="mb-4">
                    Đăng nhập hệ thống
                </h3>

                <Form.Control
                    className="mb-3"
                    placeholder="Tên đăng nhập"
                    value={form.username}
                    onChange={(e)=>
                        setForm({
                            ...form,
                            username:e.target.value
                        })
                    }
                />

                <Form.Control
                    type="password"
                    className="mb-3"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={(e)=>
                        setForm({
                            ...form,
                            password:e.target.value
                        })
                    }
                />

                <Button
                    onClick={submit}
                >
                    Đăng nhập
                </Button>

            </Card>

        </div>
    );
}