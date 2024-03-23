import * as React from "react";
import "../../assets/StyleWrapper.css";

interface StyleWrapperProps {
    children: React.ReactNode;
}

export const StyleWrapper: React.FC<StyleWrapperProps> = ({ children }) => {
    return <div className="globalStyle">{children}</div>;
};
