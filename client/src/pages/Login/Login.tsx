import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { StyleWrapper, AlertMessage } from "../../utils";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { LoginAPI } from "../../apis/UserAPI";

interface LoginProps {
    change: (bool: boolean, username: string, id: string) => void;
}

export const Login = ({ change }: LoginProps) => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null);
    const [validated, setValidated] = useState(false);
    const [credential, setCredential] = useState({
        username: "",
        password: "",
        email: "",
    });

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setCredential((currData) => {
            return {
                ...currData,
                [evt.target.name]: evt.target.value,
            };
        });
    };
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidated(true);
        const response = await LoginAPI(credential);
        setCredential({
            username: "",
            password: "",
            email: "",
        });
        if (response.auth) {
            change(true, response.username, response.id);
            // return navigate(`/${response.username}`, { replace: true });
            return navigate(`/content`, { replace: true });
        }
        setAlert({
            ...alert,
            type: "danger",
            message: response.msg,
            show: true,
        });
        return navigate("/login");
    };
    const closeAlert = () => {
        setAlert({
            ...alert,
            type: null,
            message: null,
            show: false,
        });
    };

    return (
        <StyleWrapper>
            {alert && (
                <AlertMessage
                    type={alert.type}
                    message={alert.message}
                    show={alert.show}
                    handleClose={closeAlert} // Add an onClose handler to clear the alert
                />
            )}
            <h1>Login Form</h1>
            <Form noValidate validated={validated} onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        required
                        type="username"
                        placeholder="Username"
                        name="username"
                        onChange={handleChange}
                        value={credential.username}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={credential.password}
                        autoComplete="off"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </StyleWrapper>
    );
};
