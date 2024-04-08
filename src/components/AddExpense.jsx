import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { DataContext } from "../context/DataContext";
import { ThemeContext } from "../context/ThemeContext";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {Box, InputLabel, MenuItem, FormControl, Select} from "@mui/material";
import {Container, Button, TextField, OutlinedInput} from "@mui/material";
import {InputAdornment, CircularProgress, Alert} from "@mui/material";
import "./style/AddExpense.css";

export default function AddExpense() {
    const [category, setCategory] = useState("");
    const [recurrence, setRecurrence] = useState("");
    const [date, setDate] = useState(null);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [alert, setAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const { token } = useContext(AuthContext);
    const { refresh, setRefresh } = useContext(DataContext);
    const { styling } = useContext(ThemeContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                const res = await fetch(
                `http://localhost:8080/transaction`,
                    {
                        method: "POST",
                        headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                        category_name: category,
                        tran_description: description,
                        tran_amount: amount,
                        tran_sign: "DR", //DR (expense) or CR(income)
                        tran_currency: "US",
                        tran_date: date,
                        }),
                    }
                );

                setIsLoading(false);
                setCategory("");
                setRecurrence("");
                setDate(null);
                setDescription("");
                setAmount("");
                
                setAlert(
                    <Alert severity="success" sx={{ fontSize: "16px" }}>
                        Your expense has been saved
                    </Alert>
                );

                setRefresh(!refresh);

            } catch (error) {
                setIsLoading(false);
                setAlert(
                    <Alert severity="error">
                        Couldn't post the transaction, take a look at the console for more
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
            {isLoading ? 
            (
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
                        <FormControl fullWidth sx={{ marginBottom: "1.5em" }}>
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
                                    <MenuItem value={"education"} sx={{ fontSize: "16px" }}>
                                        Education
                                    </MenuItem>

                                    <MenuItem value={"communication"} sx={{ fontSize: "16px" }}>
                                        Communication
                                    </MenuItem>

                                    <MenuItem value={"bills"} sx={{ fontSize: "16px" }}>
                                        Bills
                                    </MenuItem>

                                    <MenuItem value={"rent"} sx={{ fontSize: "16px" }}>
                                        Rent
                                    </MenuItem>

                                    <MenuItem value={"medicine"} sx={{ fontSize: "16px" }}>
                                        Medicine
                                    </MenuItem>

                                    <MenuItem value={"groceries"} sx={{ fontSize: "16px" }}>
                                        Groceries
                                    </MenuItem>

                                    <MenuItem value={"eatingOut"} sx={{ fontSize: "16px" }}>
                                        Eating Out
                                    </MenuItem>

                                    <MenuItem value={"entertainment"} sx={{ fontSize: "16px" }}>
                                        Entertainment
                                    </MenuItem>

                                    <MenuItem value={"pets"} sx={{ fontSize: "16px" }}>
                                        Pets
                                    </MenuItem>

                                    <MenuItem value={"repairs"} sx={{ fontSize: "16px" }}>
                                        Repairs
                                    </MenuItem>

                                    <MenuItem value={"work"} sx={{ fontSize: "16px" }}>
                                        Work
                                    </MenuItem>

                                    <MenuItem value={"insurance"} sx={{ fontSize: "16px" }}>
                                        Insurance
                                    </MenuItem>

                                    <MenuItem value={"others"} sx={{ fontSize: "16px" }}>
                                        Others
                                    </MenuItem>
                                </Select>
                        </FormControl>
        
        
                        <FormControl fullWidth sx={{ marginBottom: "1.5em" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    disableFuture
                                    label="Date"
                                    className="background_grey"
                                    value={date}
                                    onChange={(selectedDate) => setDate(selectedDate)}
                                    sx={{
                                        borderRadius: "31px",
                                        "& fieldset": {
                                        borderRadius: "30px",
                                        fontSize: "16px",
                                        },
                                        "& .MuiInputBase-input": {
                                        fontSize: "16px", // Set the desired font size
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </FormControl>
            
            
                        <FormControl fullWidth sx={{ marginBottom: "1.5em" }}>
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
                                "& input": {
                                    fontSize: "16px", 
                                },
                                }}
                            />
                        </FormControl>

                        {/*Amount */}

                        <FormControl fullWidth sx={{ marginBottom: "1.5em" }}>
                            
                            <InputLabel htmlFor="outlined-adornment-amount">
                                Amount
                            </InputLabel>

                            <OutlinedInput
                                id="outlined-adornment-amount"
                                type="text"
                                inputmode="numeric"
                                startAdornment={
                                <InputAdornment position="start">€</InputAdornment>
                                }
                                label="Amount"
                                className="background_grey"
                                onChange={(e) => setAmount(e.target.value)}
                                value={amount}
                                sx={{ borderRadius: "31px", fontSize: "16px" }}
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
            
                        <Box sx={{ mt: 1 }}>{alert}</Box>
                    </form>
                </Box>
            )}
        </Container>
    );
}