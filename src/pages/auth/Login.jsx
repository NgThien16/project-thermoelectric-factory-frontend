import { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../context/useAuth";

import { AuthService } from "../../service/auth/AuthService";
import "../../styles/Login.css";
import {FaArrowLeft} from "react-icons/fa";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const { setUser } = useAuth();
    const submit = async () => {

        try {

            setLoading(true);

            const res = await AuthService.login(form);

            localStorage.setItem(
                "token",
                res.token
            );

            setUser({
                username: res.username,
                roles: res.roles
            });

            toast.success(
                "Đăng nhập thành công"
            );

            navigate("/");

        } catch (e) {

            toast.error(
                e.response?.data?.message ||
                e.response?.data ||
                "Đăng nhập thất bại"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="login-page">

            <Card className="login-card border-0 shadow-lg">

                <Card.Body>

                    <div className="text-center mb-4">

                        <h2 className="fw-bold text-primary">
                            CMMS Nhiệt Điện
                        </h2>

                        <p className="text-muted">
                            Hệ thống quản lý bảo trì nhà máy nhiệt điện
                        </p>

                    </div>

                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            submit();
                        }}
                    >

                        <Form.Control
                            className="mb-3"
                            placeholder="Tên đăng nhập"
                            value={form.username}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    username: e.target.value
                                })
                            }
                        />

                        <Form.Control
                            type="password"
                            className="mb-4"
                            placeholder="Mật khẩu"
                            value={form.password}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password: e.target.value
                                })
                            }
                        />

                        <div className="d-grid gap-2">

                            <Button
                                type="submit"
                                size="lg"
                                disabled={loading}
                            >
                                {
                                    loading
                                        ? "Đang đăng nhập..."
                                        : "Đăng nhập"
                                }
                            </Button>

                            <Button
                                variant="outline-dark"
                                onClick={() => navigate("/")}
                            >
                                <FaArrowLeft className="me-2" />
                                Quay lại trang chủ
                            </Button>

                        </div>

                    </Form>

                </Card.Body>

            </Card>

        </div>
    );
}