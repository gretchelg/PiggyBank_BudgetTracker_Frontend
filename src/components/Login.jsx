import "./style/Login.css";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box, Container } from "@mui/material";
import { TextField, FormControl, Button } from "@mui/material";
import { styled } from '@mui/system';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const response = await fetch(
            // "http://localhost:8080/user/login",
            `https://piggybank-api-jwhz.onrender.com/user/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(data.error);
        }

        if (response.ok) {
            localStorage.setItem("token", data.token);
            setIsLoading(false);
            login(data.token);
        }

        if (data.token !== null && data.token !== undefined) {
            navigate("/dashboard");
        }
    };

    const CustomButton = styled(Button)({
        '&:hover': {
            backgroundColor: '#ffa726',
            transform: 'scale(1.05)',
        },
    });

    return(
        <Container maxWidth="sm">
            {isLoading ? 
                (
                <Box
                    sx={{ display: "flex", justifyContent: "center", padding: "20px", paddingTop: "300px", }}
                >
                    <CircularProgress sx={{ color: "#b9b9b9" }} />
                </Box>

                ) : (

                <Box
                    sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                    minHeight: "100vh",
                    paddingTop: "50px",
                    }}
                >
                    <FormControl fullWidth className="login-container">
                        <TextField
                            id="login-emailinput"
                            type="email"
                            label="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="Please enter your Email"
                            sx={{
                            borderRadius: "31px",
                            "& fieldset": {
                                borderRadius: "30px",
                            },
                            "& input": {
                                fontSize: "16px", // Customize the font size here
                            },
                            }}
                        >
                            {" "}
                        </TextField>
                    </FormControl>
                    
                    <FormControl fullWidth>
                        <TextField
                            id="login-passwordinput"
                            type="password"
                            label="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Please enter your Password"
                            sx={{
                            borderRadius: "31px",
                            "& fieldset": {
                                borderRadius: "30px",
                            },
                            "& input": {
                                fontSize: "16px", // Customize the font size here
                            },
                            }}
                        ></TextField>

                        <Box
                            sx={{
                            padding: "10px",
                        }}
                        >
                            <CustomButton
                            sx={{
                                ":hover": { bgcolor: "#C42B0A" },
                                borderRadius: "31px",
                                background: "#c80048",
                                width: "150px",
                                height: "50px",
                                margin: "20px",
                                color: "white",
                                fontSize: "16px",
                                padding: "5px 50px",
                            }}
                            onClick={handleSubmit}
                            className="login"
                            >
                                Login
                            </CustomButton>
                        </Box>
                    </FormControl>

                    <p>Don't have an account?</p>
                    
                    <NavLink to="/signup" className="backtosignup">
                        Signup here
                    </NavLink>
                    
                    {error && <div className="error">{error}</div>}
                </Box>
                )
            }
        </Container>
    )
}