import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { DataContext } from "../context/DataContext";
import { ThemeContext } from "../context/ThemeContext";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {Box, TextField, MenuItem, InputLabel, Alert, OutlinedInput,} from "@mui/material";
import {Button, Container, InputAdornment, CircularProgress} from "@mui/material";
import { FormControl, Select} from "@mui/material";
import "./style/AddIncome.css";

export default function AddIncome() {
    const [category_name, setCatgeroy] = useState("");
    const [tran_date, setDate] = useState(null);
    const [tran_description, setDescription] = useState("");
    const [tran_amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [user, setUser] = useState("");
    const { token } = useContext(AuthContext);
    const { refresh, setRefresh } = useContext(DataContext);
    const { styling } = useContext(ThemeContext);

    const handleAddIncomesChange = async (e) => {
        e.preventDefault();

        if (
            category_name === "" ||
            tran_date === null ||
            tran_description === "" ||
            tran_amount === ""
        ) {
            setAlert(<Alert severity="warning">Please fill all the fields !</Alert>);
        } else {
            setIsLoading(true);

            try {
                const response = await fetch(
                    // `http://localhost:8080/transaction`,
                    `https://piggybank-api-jwhz.onrender.com/transaction`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                    },
        
                        body: JSON.stringify({
                            category_name, // HOUSE, TRANSPORTATION
                            tran_description,
                            tran_amount,
                            tran_sign: "CR", //DR (income) or CR(expense)
                            tran_currency: "US",
                            tran_date,
                            user,
                        }),
                    }
                );
    
                const data = await response.json();
    
                if (!response.ok) {
                    throw new Error("Failed to add income");
                }

                setIsLoading(false);
                setCatgeroy("");
                setDate(null);
                setDescription("");
                setAmount("");
                setAlert(<Alert severity="success">Your income has been saved</Alert>);
                setRefresh(!refresh);

            } catch (error) {
            console.log(error);
            }
        }
    };

    const handlecategoryChange = (event) => {
        setCatgeroy(event.target.value);
    };

    const handleDateChange = (date) => {
        setDate(date);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
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
                    <CircularProgress />
                </Box>

            ) : (

                <Box sx={{ borderRadius: "20px" }} className="income_container">
                    <FormControl fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
        
                        <Select
                            required
                            className="addincome-textfield background_grey"
                            label="Category"
                            value={category_name}
                            onChange={handlecategoryChange}
                            sx={{
                            textAlign: "left",
                            borderRadius: "31px",
                            fontSize: "16px",
                            }}
                        >
                            <MenuItem value="Salary" sx={{ fontSize: "16px" }}>
                                Salary{" "}
                            </MenuItem>

                            <MenuItem value="Deposits" sx={{ fontSize: "16px" }}>
                            {" "}
                                Deposits
                            </MenuItem>

                            <MenuItem value="Savings" sx={{ fontSize: "16px" }}>
                            {" "}
                                Savings
                            </MenuItem>

                            <MenuItem value="Others" sx={{ fontSize: "16px" }}>
                            {" "}
                                Others
                            </MenuItem>

                        </Select>
                
                    </FormControl>

                    <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateTimePicker"]}>
                                <DatePicker
                                    disableFuture
                                    label="Date"
                                    value={tran_date}
                                    className="background_grey"
                                    onChange={handleDateChange}
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
                            </DemoContainer>
                        </LocalizationProvider>
                    </FormControl>

        
                    <FormControl fullWidth>
                        <TextField
                            className="addincome-textfield"
                            label="Description"
                            value={tran_description}
                            onChange={handleDescriptionChange}
                            sx={{
                            borderRadius: "31px",
                            "& fieldset": {
                                borderRadius: "30px",
                            },
                            "& input": {
                                fontSize: "16px", 
                            },
                            }}
                        ></TextField>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel htmlFor="outlined-adornment-amount">Amount </InputLabel>
                        
                        <OutlinedInput
                            className="addincome-textfield background_grey"
                            label=" add your amount"
                            type="number"
                            startAdornment={
                            <InputAdornment position="start">€</InputAdornment>
                            }
                            value={tran_amount}
                            onChange={handleAmountChange}
                            sx={{ borderRadius: "31px", fontSize: "16px" }}
                        ></OutlinedInput>

                    </FormControl>
        
                    <Button
                        variant="outlined"
                        onClick={handleAddIncomesChange}
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
                </Box>
            )}
        </Container>
    );
}