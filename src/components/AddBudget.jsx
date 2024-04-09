import { useState, useContext} from "react";
import { useJwt } from "react-jwt";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Box, InputLabel, MenuItem, FormControl} from "@mui/material";
import { Select, Container, Button, TextField } from "@mui/material";
import { OutlinedInput, InputAdornment, CircularProgress} from "@mui/material";
import { Alert } from "@mui/material";
import "./style/AddBudget.css";


export default function Addbudget() {
    const { refresh, setRefresh } = useContext(DataContext);
    const { token } = useContext(AuthContext);
    const { styling } = useContext(ThemeContext);
    const [alert, setAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const { decodedToken } = useJwt(token);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(null);
    const [amount, setAmount] = useState(""); //last
    const [category, setCategory] = useState("");

    const handleSubmit = async () => {
        if (
            category === "" ||
            date === null ||
            description === "" ||
            amount === ""
        ) {

            setAlert(<Alert severity="warning">Please fill in all the fields</Alert>);
        
        } else {
        
            setIsLoading(true);
            try {
                //Get existing budgets
                const res = await fetch(
                    `http://localhost:8080/user/${decodedToken._id}`,
                    {
                    method: "GET", 
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    }
                );

                const data = await res.json();
                const currentBudgets = data || []; // Get the current budgets array

                const budgets = [
                    ...currentBudgets,
                    {
                    category_name: category,
                    budget_description: description,
                    budget_date: date,
                    limit_amount: amount,
                    },
                ];

                // Append the new object to the existing array

                const resPut = await fetch(
                    `http://localhost:8080/user/${decodedToken._id}`,
                    {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        budgets,
                    }),
                    }
                );

                setIsLoading(false);
                setCategory("");
                setDate(null);
                setDescription("");
                setAmount("");
                setAlert(
                    <Alert severity="success">Your Budget Limit has been saved</Alert>
                );
                setRefresh(!refresh);
                
            } catch (error) {
                setIsLoading(false);
                setAlert(
                    <Alert severity="error">
                    Couldn't post the Budget Limit, take a look at the console for more
                    information about the error!
                    </Alert>
                );
                console.log("Here is the Error with more Info:", error);
            }
        }
    };

    return (
    <Container
        sx={{
        paddingTop: "100px",
        paddingBottom: "100px",
        maxWidth: "sm",
        minHeight: "100vh",
        }}
        style={{
        background: styling.backgroundColor,
        paddingBottom: styling.paddingBottom,
        }}
    >
        {isLoading ? (
            <Box
                sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                }}
            >
                <CircularProgress sx={{ mt: 2 }} />
            </Box>

            ) : (

            <Box sx={{ minWidth: 120, p: 2 }} className="addexp_box">
                <form>
                {/*Category */}
            
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel id="category-label">Category</InputLabel>
                            <Select
                            required
                            labelId="category-label"
                            id="category"
                            value={category}
                            label="Category"
                            className="background_grey"
                            onChange={(e) => setCategory(e.target.value)}
                            sx={{
                                textAlign: "left",
                                borderRadius: "31px",
                                fontSize: "16px",
                            }}
                            >
                                <MenuItem value={"education"}>
                                    Education
                                </MenuItem>

                                <MenuItem value={"communication"}>
                                    Communication
                                </MenuItem>

                                <MenuItem value={"bills"}>
                                    Bills
                                </MenuItem>

                                <MenuItem value={"home"}>
                                    Home
                                </MenuItem>

                                <MenuItem value={"transport"}>
                                    Transport
                                </MenuItem>

                                <MenuItem value={"health"}>
                                    Health
                                </MenuItem>

                                <MenuItem value={"food"}>
                                    Food
                                </MenuItem>

                                <MenuItem value={"eatingout"}>
                                    Eating Out
                                </MenuItem>

                                <MenuItem value={"entertainment"}>
                                    Entertainment
                                </MenuItem>

                                <MenuItem value={"pets"}>
                                    Pets
                                </MenuItem>

                                <MenuItem value={"repairs"}>
                                    Repairs
                                </MenuItem>

                                <MenuItem value={"work"}>
                                    Work
                                </MenuItem>

                                <MenuItem value={"insurance"}>
                                    Insurance
                                </MenuItem>

                                <MenuItem value={"others"}>
                                    Others
                                </MenuItem>

                            </Select>
                    </FormControl>

                    {/*Date*/}

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                disableFuture
                                label="Date"
                                className="background_grey"
                                // inputFormat="DD/MM/YYYY"
                                value={date}
                                onChange={(selectedDate) => setDate(selectedDate)}
                                sx={{
                                borderRadius: "31px",
                                "& fieldset": {
                                    borderRadius: "30px",
                                },
                                "& .MuiInputBase-input": {
                                    fontSize: "16px",
                                },
                                }}
                            />
                        </LocalizationProvider>
                    </FormControl>

                    {/*Amount */}

                    <FormControl fullWidth sx={{ marginBottom: "1.5em" }}>
                        
                        <InputLabel htmlFor="outlined-adornment-amount">
                            Amount
                        </InputLabel>
                        
                        <OutlinedInput
                        id="outlined-adornment-amount"
                        type="number"
                        startAdornment={
                            <InputAdornment position="start">€</InputAdornment>
                        }
                        label="Amount"
                        className="background_grey"
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}
                        sx={{
                            borderRadius: "31px",
                            fontSize: "16px",
                        }}
                        />

                    </FormControl>

                    {/*Description */}
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <TextField
                        id="outlined-basic"
                        label="Description"
                        className="background_grey"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{
                            borderRadius: "31px",
                            "& fieldset": {
                            borderRadius: "30px",
                            },
                            "& .MuiInputBase-input": {
                            fontSize: "16px", // Set the desired font size
                            },
                        }}
                        />
                    </FormControl>

                    {/* Submit Button */}
                    <Button
                        variant="outlined"
                        onClick={handleSubmit}
                        sx={{
                        ":hover": { bgcolor: "#453f78", color: "white" },
                        borderRadius: "31px",
                        width: "250px",
                        height: "50px",
                        margin: "10px",
                        fontSize: "16px",
                        padding: "5px 8px",
                        textDecoration: "none",
                        }}
                    >
                        ADD
                    </Button>
                
                    {/* Alert Message */}
                    <Box sx={{ mt: 1 }}>
                        {alert && (
                        <Alert
                            severity="success"
                            sx={{
                            "& .MuiAlert-message": {
                                fontSize: "14px", 
                            },
                            }}
                        >
                            {alert}
                        </Alert>
                        )}
                    </Box>

                </form>
            </Box>
        )}
    </Container>
);
}