import React from "react";
import { useRouteError } from "react-router-dom";

interface ErrorObject {
    statusText?: string;
    message?: string;
}

export const ErrorHandler: React.FC = () => {
    const error = useRouteError() as ErrorObject;
    console.error(error);

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
};
