import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../apis/UserAPI";

interface ProtectedRoutesProps {
    children: ReactNode;
}

export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
    children,
}): React.JSX.Element => {
    const navigate = useNavigate();

    useEffect(() => {
        async function checkAuthentication() {
            const res = await isLoggedIn();
            if (!res.auth) {
                return navigate("/login", { replace: true });
            }
        }
        checkAuthentication();
    }, [navigate]);

    return <React.Fragment>{children}</React.Fragment>;
};
