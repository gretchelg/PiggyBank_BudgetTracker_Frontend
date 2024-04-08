import { useNavigate } from "react-router-dom";
import {Button, Container, Box, } from "@mui/material";
import "../components/style/Landingpage.css";

// import Cornerleft from "../assets/Cornerleft";
// import Cornerright from "../assets/Cornerright";
import Logo from "../assets/PiggyLogo";

export default function Landingpage () {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate("/signup");
    };

    const handleLogin = () => {
        navigate("/login");
    }

    return (
        <Container
        className="landingPage"
        sx={{
            maxWidth: "sm",
            minHeight: "100vh",
        }}
        >

        {/* <Cornerright className="cornerright" /> */}

        <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap="20px"
        >
            <Box
            sx={{
                marginBottom: "1.5em",
            }}
            >
                <Logo />
                <h1 className="logo-title">
                    <span>Piggy</span>Bank
                </h1>
            </Box>

            <Button className="btn-landingPage" onClick={handleRegister}>
                REGISTER
            </Button>

            <Button className="btn-landingPage" onClick={handleLogin}>
                LOGIN
            </Button>
        </Box>

        {/* <Cornerleft className="cornerleft" /> */}

        </Container>
    )
}