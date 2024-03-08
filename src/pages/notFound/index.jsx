import { React } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/navBar";
import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="mainContainer">
            <h1>Página não encontrada</h1>
        </div>
    );
}

export default NotFound;