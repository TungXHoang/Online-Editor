import Alert from "react-bootstrap/Alert";
import React from "react";

interface AlertMessageProps {
    type: string;
    message: string;
    handleClose?: () => void;
    show: boolean;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
    type,
    message,
    handleClose,
    show,
}) => {
    const handleAlertClose = () => {
        if (handleClose) {
            handleClose(); // Call the onClose prop passed from the parent
        }
    };

    return (
        <Alert
            variant={type}
            onClose={handleAlertClose}
            show={show}
            transition={false}
            dismissible
        >
            <div>{message}</div>
        </Alert>
    );
};
