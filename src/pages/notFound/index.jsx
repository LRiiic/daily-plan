import { React } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="mainContainer">
            <h1>Página não encontrada</h1>
            <button style={{ backgroundColor: "#ee2737", color: "#FFFFFF" }} onClick={() => navigate('/')}>Voltar</button>
        </div>
    );
}

export default NotFound;