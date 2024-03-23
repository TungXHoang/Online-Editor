import { useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
import { RegisterAPI } from "../../apis/UserAPI";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { StyleWrapper, AlertMessage } from "../../utils";

interface RegisterProps {
    change: (bool: boolean, username: string, id: string) => void;
}

export const Register = ({ change }: RegisterProps) => {
    const [validated, setValidated] = useState(false);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const [credential, setCredential] = useState({
        username: "",
        password: "",
        email: "",
        image: null,
    });
    const fileInputRef = useRef(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredential((currData) => {
            if (e.target.name === "image") {
                return {
                    ...currData,
                    image: e.target.files[0],
                };
            }
            return {
                ...currData,
                [e.target.name]: e.target.value,
            };
        });
    };

    const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        setValidated(true);
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.preventDefault();
            const formData = new FormData();
            for (const [key, value] of Object.entries(credential)) {
                formData.append(`${key}`, value);
            }
            try {
                const response = await RegisterAPI(formData);
                setCredential({
                    username: "",
                    password: "",
                    email: "",
                    image: null,
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                } //reser input field
                if (response.auth) {
                    change(true, credential.username, response.id);
                    return navigate("/content"); //pass username
                } else {
                    // console.log(response.msg);
                    setAlert({
                        ...alert,
                        type: "danger",
                        message: response.msg,
                        show: true,
                    });
                }
            } catch (e) {
                console.log(e);
            }
        }
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
            <h1>Register Form</h1>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleRegistration}
                encType="multipart/form-data"
            >
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        required
                        type="username"
                        placeholder="Username"
                        name="username"
                        // id="username"
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
                        // id=""
                        onChange={handleChange}
                        value={credential.password}
                        autoComplete="off"
                    />
                </Form.Group>

                <Form.Group controlId="image" className="mb-3">
                    <Form.Label>Default file input example</Form.Label>
                    <Form.Control
                        type="file"
                        className="form-file-input prevent-validation"
                        name="image"
                        ref={fileInputRef}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        onChange={handleChange}
                        value={credential.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide valid email address.
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </StyleWrapper>
    );
};
