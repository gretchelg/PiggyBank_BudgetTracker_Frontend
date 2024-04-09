import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import DonutSmallOutlinedIcon from "@mui/icons-material/DonutSmallOutlined";
import { Container } from "@mui/material"

export default function Menu() {
const [value, setValue] = useState("home");
const navigate = useNavigate();
const handleChange = (event, newValue) => {
setValue(newValue);

if (newValue === "home") {
    navigate("/dashboard");
}

if (newValue === "planner") {
    navigate("/budget");
}

if (newValue === "transactions") {
    navigate("/transactions");
}

if (newValue === "reports") {
    navigate("/reports");
}
};

return (
<Container sx={{ maxWidth: "600px" }}>
    <Paper
        style={{
            maxWidth: "600px",
            position: "fixed",
            bottom: "0",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "5",
            width: "100%",
            padding: "5px",
            paddingBottom: "20px",
    }}
        sx={{ bottom: 0, left: 5, right: 5 }}
        elevation={5}
    >
        <BottomNavigation
            value={value}
            onChange={handleChange}
            showLabels
            sx={{
            "& .MuiBottomNavigationAction-root": {
                minWidth: 0, // Remove the minimum width
                padding: "2px", // Increase the padding
            },
            "& .MuiSvgIcon-root": {
                fontSize: "900px", // Increase the icon size
            },
            }}
        >
            <BottomNavigationAction
            label="Home"
            value="home"
            icon={
                <HomeOutlinedIcon style={{ color: "#453F78", fontSize: 40 }} />
            }
            />

            <BottomNavigationAction
            label="Planner"
            value="planner"
            icon={
                <ListAltOutlinedIcon style={{ color: "#453F78", fontSize: 40 }} />
            }
            />
            
            <BottomNavigationAction
            label="Transactions"
            value="transactions"
            icon={
                <SyncAltOutlinedIcon style={{ color: "#453F78", fontSize: 40 }} />
            }
            />

            <BottomNavigationAction
            label="Reports"
            value="reports"
            icon={
                <DonutSmallOutlinedIcon
                style={{ color: "#453F78", fontSize: 40 }}
                />
            }
            />
        </BottomNavigation>
    </Paper>
</Container>
);
}