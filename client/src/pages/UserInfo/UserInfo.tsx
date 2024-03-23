import React from "react";
import { useLoaderData } from "react-router-dom";
import "../../assets/UserInfo.css";

interface UserInfoProps {}

interface userInfo {
    auth?: boolean;
    username?: string;
    id?: string;
    avatar?: string;
    thumbnail?: string;
}

export const UserInfo: React.FC<UserInfoProps> = () => {
    const info: userInfo = useLoaderData();

    if (info) {
        const { username, id, thumbnail } = info;
        return (
            <>
                <div>
                    <h1>Welcome {username || ""}</h1>
                    <h1>Your id is {id || ""}</h1>
                </div>
                <img className="image" src={thumbnail} alt="" />
            </>
        );
    }

    return null; // Return null if info is not available
};
