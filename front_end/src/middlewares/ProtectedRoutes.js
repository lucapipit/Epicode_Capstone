import React, { useEffect } from "react";
import LogIn from "../pages/LogIn";
import { Outlet, useNavigate } from "react-router";
import jwtDecode from "jwt-decode";


const auth = () => {
    return localStorage.getItem("loginData")/* .split('"')[1] */;
};
const useSession = () => {
    const session = auth();

    const decodeSession = session ? jwtDecode(session, process.env.JWT_SECRET) : null;
    console.log(decodeSession);
    const navigate = useNavigate();

    useEffect(() => {
        if (!session) {
            navigate("/LogIn", { replace: true })
        }
    }, [navigate, session])

    return decodeSession

};


const ProtectedRoutes = () => {
    auth() ? null : localStorage.clear();
    const session = useSession();
    console.log(session);
    return session ? <Outlet /> : <LogIn />
}

export { ProtectedRoutes }