import React, { useState } from "react";
// import * as ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; //use .min for production
import "bootstrap/dist/js/bootstrap.bundle";
import "./assets/index.css";

import { Navbar } from "./layout/Navbar";

import * as page from "./pages";
import { ProtectedRoutes } from "./utils";

import { isLoggedIn, fetchUserData } from "./apis/UserAPI";

interface UserState {
    login: boolean;
    username: string | null;
    id: string | null;
}

const App = () => {
    const [userState, setUserState] = useState<UserState>(() => {
        const initializeUserState = async () => {
            const res = await isLoggedIn();
            setUserState({
                login: res.auth,
                username: res.username,
                id: res.id,
            });
        };

        initializeUserState();

        // Return an initial value for userState
        return {
            login: false,
            username: "",
            id: "",
        };
    });

    const handleLoginState = (bool: boolean, username: string, id: string) => {
        const newState = {
            ...userState,
            login: bool,
            username: username,
            id: id,
        };
        setUserState(newState);
    };

    const fetchUser = (thumbSize: number) => {
        //currying function
        return async () => {
            if (userState.id) {
                const res = await fetchUserData(userState.id, thumbSize);
                return res;
            }
            return null;
        };
    };
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Navbar status={userState} change={handleLoginState} />,
            loader: fetchUser(50),
            children: [
                {
                    path: "/", // yes, again
                    element: <page.Root />,
                    errorElement: <page.ErrorHandler />,
                },
                {
                    path: "/register",
                    element: !userState.login ? (
                        <page.Register change={handleLoginState} />
                    ) : (
                        <Navigate to="/content" replace={true} />
                    ),
                },
                {
                    path: "/login",
                    element: !userState.login ? (
                        <page.Login change={handleLoginState} />
                    ) : (
                        <Navigate to="/content" replace={true} />
                    ),
                },
                {
                    path: "/content",
                    element: (
                        <ProtectedRoutes>
                            <page.Content />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: "/:username",
                    element: (
                        <ProtectedRoutes>
                            <page.UserInfo />
                        </ProtectedRoutes>
                    ),
                    loader: fetchUser(200),
                },
            ],
        },
    ]);

    return (
        <RouterProvider
            router={router}
            fallbackElement={<React.Fragment>Loading ...</React.Fragment>}
        ></RouterProvider>
    );
};

export default App;
