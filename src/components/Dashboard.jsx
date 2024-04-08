import { useContext, useState, useEffect } from "react";
import { useJwt } from "react-jwt";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import "./style/Dashboard.css"
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import Charts from "./Charts";
import { MenuItem, InputLabel, FormControl, Select } from "@mui/material";
import { Container, Box, Typography, LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";

import IconBills from '@mui/icons-material/LocalAtm';
import IconCommunication from '@mui/icons-material/AddCircle';
import IconEatingOut from '@mui/icons-material/Dining';
import IconEducation from '@mui/icons-material/School';
import IconEntertainment from '@mui/icons-material/Attractions';
import IconGroceries from '@mui/icons-material/LocalGroceryStore';
import IconInsurance from '@mui/icons-material/Security';
import IconMedicine from '@mui/icons-material/MedicationLiquid';
import IconOthers from '@mui/icons-material/ExpandCircleDownOutlined';
import IconPets from '@mui/icons-material/PetsOutlined';
import IconRent from '@mui/icons-material/HomeWorkOutlined';
import IconRepairs from '@mui/icons-material/HandymanOutlined';
import IconTransportation from '@mui/icons-material/CommuteOutlined';
import IconWork from '@mui/icons-material/WorkOutlined';


export default function Dashboard() {
    const [filter, setFilter] = useState("month");
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState(Date);
    const [endDate, setEndDate] = useState(Date);
    const [spentBar, setSpentBar] = useState(0);
    const [budgetBar, setBudgetBar] = useState(0);

    const { token } = useContext(AuthContext);
    const { decodedToken } = useJwt(token);
    const [isLoading, setIsLoading] = useState(false);

    const {
        categories,
        setCategories,
        categoriesObj,
        budgetData,
        setBudgetData,
        tranData,
        setTranData,
    } = useContext(DataContext);

    const { styling } = useContext(ThemeContext);

//===========================
//  Library Initialization
//===========================

// init Swiper:
    const swiper = new Swiper(".swiper", {
        direction: "horizontal",
        loop: true,
        scrollbar: {
            el: ".swiper-scrollbar",
            draggable: true,
        },
    });

// =========================================================================
//  Filter Data
// ========================================================================

    useEffect(() => {
        const now = new Date();

        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        ).getTime();
    
        setEndDate(today);

        const last5Years = new Date(
            now.getFullYear() - 5,
            now.getMonth(),
            now.getDate()
        ).getTime();

        setStartDate(last5Years);

    }, []);

    useEffect(() => {
        const now = new Date();

        if (filter === "week") {
            const lastWeek = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 7
            ).getTime();
            setStartDate(lastWeek);
        }

        if (filter === "month") {
            const lastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
            ).getTime();
            setStartDate(lastMonth);
        }

        if (filter === "3months") {
            const last3Months = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            now.getDate()
            ).getTime();
            setStartDate(last3Months);
        }

        if (filter === "6months") {
            const last6Months = new Date(
            now.getFullYear(),
            now.getMonth() - 6,
            now.getDate()
            ).getTime();
            setStartDate(last6Months);
        }

        if (filter === "year") {
            const lastYear = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate()
            ).getTime();
            setStartDate(lastYear);
        }

        if (filter === "all") {
            const last5Years = new Date(
            now.getFullYear() - 5,
            now.getMonth(),
            now.getDate()
            ).getTime();
            setStartDate(last5Years);
        }

    }, [filter]);

    useEffect(() => {
        console.log("started useEffect(); started to filter tranData", tranData);
    
        const filtered = tranData?.filter((data) => {
            const timestampDate = new Date(data.tran_date).getTime();
            return timestampDate < endDate && timestampDate > startDate;
        });
    
        setFilteredData(filtered);
        console.log("ended useEffect(); filtered is", filtered);

    }, [tranData, endDate, startDate]);

    const creditTrans = filteredData?.filter((trans) => trans.tran_sign === "CR");
    console.log("creditTrans is", creditTrans);

// setCreditTrans(creditTrans);
    const debitTrans = filteredData?.filter((trans) => trans.tran_sign === "DR");
    console.log("debitTrans is", debitTrans);

// setDebitTrans(debitTrans);
    const incomeSum = creditTrans
    .reduce(
    (accumulator, currentValue) =>
        accumulator + Number(currentValue.tran_amount),
    0
    )
    .toFixed(2);

    const expensesSum = debitTrans
    .reduce(
    (accumulator, currentValue) =>
        accumulator + Number(currentValue.tran_amount),
    0
    )
    .toFixed(2);

    let expensesSumBudgets = 0;

    categories.map((category) => {

        if (category.limit > 0) {
        expensesSumBudgets = Number(expensesSumBudgets + category.spent).toFixed(2);
        }

    });

//==============================================================
//  Calculate budgets
//===============================================================

    const budgetSum = budgetData
    ?.reduce(
    (accumulator, currentValue) =>
        accumulator + Number(currentValue.limit_amount),0)
    .toFixed(2);

//  Expected to save

    const savings = incomeSum - budgetSum - expensesSum;

//  Graph Bar
    useEffect(() => {
        if (expensesSum !== 0) {
            setSpentBar((expensesSum * 100) / incomeSum);
        }
    }, [expensesSum]);

    useEffect(() => {
        if (expensesSumBudgets !== 0) {
          setBudgetBar((expensesSumBudgets * 100) / budgetSum);
        }
    }, [expensesSumBudgets]);

// =========================================================================
//  FILTER BY CATEGORY
// ========================================================================
    console.log("start Date", startDate);
    console.log("end Date", endDate);

    const categoryIcons = {
        bills: IconBills,
        communication: IconCommunication,
        eatingOut: IconEatingOut,
        education: IconEducation,
        entertainment: IconEntertainment,
        groceries: IconGroceries,
        insurance: IconInsurance,
        medicine: IconMedicine,
        others: IconOthers,
        pets: IconPets,
        rent: IconRent,
        repairs: IconRepairs,
        transport: IconTransportation,
        work: IconWork,
        food: IconEatingOut,
        others: IconOthers,
    };


    return (
        <Container
        sx={{
            paddingTop: "100px",
            maxWidth: "sm",
            minHeight: "100vh",
        }}
        style={{
            background: styling.backgroundColor,
            paddingBottom: styling.paddingBottom,
        }}
        >
            <Grid container className="dash-container">

{/* ===============================================
                FILTER
    ============================================= */}
                <Grid item xs={12}>
                    <Box component="div" className="transaction-filter">
                        <FormControl fullWidth>
                            <InputLabel
                                sx={{ fontSize: " 20px" }}
                                id="demo-simple-select-label"
                            >
                                Filter
                            </InputLabel>

                            <Select
                                style={{
                                backgroundColor: styling.backgroundBoard,
                                borderRadius: "15px",
                                }}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filter}
                                label="Filter"
                                onChange={(e) => setFilter(e.target.value)}
                                sx={{
                                textAlign: "left",
                                "& fieldset": {
                                    borderRadius: "15px",
                                },
                                fontSize: "15px",
                                }}
                            >
                                <MenuItem value={"all"} sx={{ fontSize: "14px" }}>
                                    All
                                </MenuItem>
                                
                                <MenuItem value={"week"} sx={{ fontSize: "14px" }}>
                                    Last Week
                                </MenuItem>
                                
                                <MenuItem value={"month"} sx={{ fontSize: "14px" }}>
                                    Last Month
                                </MenuItem>
                                
                                <MenuItem value={"3months"} sx={{ fontSize: "14px" }}>
                                    Last 3 Months
                                </MenuItem>
                                
                                <MenuItem value={"6months"} sx={{ fontSize: "14px" }}>
                                    Last 6 Months
                                </MenuItem>
                                
                                <MenuItem value={"year"} sx={{ fontSize: "14px" }}>
                                    Last Year
                                </MenuItem>

                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

{/* =========================================
                BALANCE
    ====================================== */}
                <Link
                    to="/transactions"
                    className="dash-progress"
                    style={{
                        border: styling.borders,
                        backgroundColor: styling.backgroundBoard,
                    }}
                >
                    <p style={{ color: styling.txtColor }} className="current-balance">
                        Current Balance
                    </p>

                    <h2 style={{ color: styling.txtColor }} className="dash-balance">
                        {" "}
                        {(incomeSum - expensesSum).toFixed(2)} €
                    </h2>

                    <p style={{ color: styling.txtColor }} className="dash-expected">
                        Expected savings: {savings.toFixed(2)} €
                    </p>

                    <p style={{ color: styling.txtColor }} className="spent-title">
                        Spent
                    </p>

                    <Box className="linear-progress-container1">

                        <Typography
                            style={spentBar > 10 ? { color: "white" } : { color: "black" }}
                            className="progress-left"
                            variant="h5"
                        >
                            {expensesSum} €
                        </Typography>

                        <Typography
                            style={spentBar > 90 ? { color: "white" } : { color: "black" }}
                            className="progress-right"
                            variant="h5"
                        >
                            {incomeSum} €
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value={spentBar == 0 ? 0 : spentBar > 100 ? 100 : spentBar}
                        />

                    </Box>

                    <p style={{ color: styling.txtColor }} className="spent-title">
                        Budget
                    </p>

                    <Box className="linear-progress-container2">
                        <Typography
                            style={budgetBar > 10 ? { color: "white" } : { color: "black" }}
                            className="progress-left"
                            variant="h5"
                        >
                            {expensesSumBudgets} €
                        </Typography>

                        <Typography
                            style={budgetBar > 90 ? { color: "white" } : { color: "black" }}
                            className="progress-right"
                            variant="h5"
                        >
                            {budgetSum} €
                        </Typography>

                        <LinearProgress
                        variant="determinate"
                        value={budgetBar === 0 ? 0 : budgetBar > 100 ? 100 : budgetBar}
                        />

                    </Box>

                </Link>

{/* ===================================
                Charts
====================================== */}
                <Charts />

{/* ===================================
                Budget
====================================== */}
                <Grid
                    item
                    xs={12}
                    sx={{
                        // paddingTop: "1rem",
                        // paddingBottom: "1rem",
                        textAlign: "center",
                    }}
                    style={{ cursor: "grab" }}
                >
                     <Box className="swiper">
                        <Box className="swiper-wrapper">
                        {budgetData?.map((each) => {
                            let spentBudgetBar = 0;
                                if (
                                categoriesObj[each.category_name]?.spent <
                                categoriesObj[each.category_name]?.limit
                                ) {
                                spentBudgetBar =
                                    (categoriesObj[each.category_name].spent * 100) /
                                    categoriesObj[each.category_name].limit;
                                }
                                if (
                                categoriesObj[each.category_name]?.spent >
                                categoriesObj[each.category_name]?.limit
                                ) {
                                spentBudgetBar = 100;
                                }

                            return (
                                <Box
                                    style={{
                                    background: styling.backgroundBoard,
                                    border: styling.borders,
                                    }}
                                    className="swiper-slide"
                                >

                                    <Box className="dash-budget">
                                        {/* {
                                        (() => {
                                            var selection = each.category_name ? each.category_name : "others"
                                            // const selection = "food"
                                            // selection = String(selection)
                                            console.log("selection typeof: ", typeof selection)
                                            console.log("selection VALUE: ", selection)
                                            const Icon = categoryIcons[selection]
                                            // categoryIcons[
                                                // each.category_name ? each.category_name : "others"
                                            // ];
                                            console.log("ICON VALUE: ", Icon)

                                            // return <IconEatingOut/>
                                            return <Icon/>
                                            // return <Icon className="dash-icon-title" />;
                                        })()
                                        } */}

                                        <Box className="dash-budget-wrapper">

                                            <p
                                                style={{ color: styling.txtColor }}
                                                className="dash-budget-title"
                                            >
                                                {each.category_name.replace(/^[\w]/, (c) =>
                                                    c.toUpperCase()
                                            )}
                                            </p>

                                            <p
                                                style={{ color: styling.txtColor }}
                                                className="dash-budget-info"
                                            >
                                                {categoriesObj[each.category_name]
                                                    ? Number(each.limit_amount) -
                                                    categoriesObj[each.category_name].spent
                                                    : Number(each.limit_amount)}
                                                € Remaining
                                            </p>
                                        </Box>
                                    </Box>

                                    <Box className="linear-progress-container2">
                                        <Typography
                                            style={
                                            (categoriesObj[each.category_name]?.spent * 100) /
                                            categoriesObj[each.category_name]?.limit > 10
                                                ? { color: "white" }
                                                : { color: "black" }
                                            }
                                            className="progress-left"
                                            variant="h5"
                                        >
                                            {categoriesObj?.hasOwnProperty(each.category_name)
                                            ? `${categoriesObj[each.category_name].spent} $`
                                            : "0 $"}
                                        </Typography>

                                        <Typography
                                            style={
                                            (categoriesObj[each.category_name]?.spent * 100) /
                                                categoriesObj[each.category_name]?.limit > 90
                                                ? { color: "white" }
                                                : { color: "black" }
                                            }
                                            className="progress-right"
                                            variant="h5"
                                        >
                                            {each.limit_amount} €
                                        </Typography>

                                        <LinearProgress
                                            variant="determinate"
                                            value={spentBudgetBar}
                                        />
                                    </Box>
                                </Box>
                            );
                            })}
                        </Box>

                        <Box
                            class="swiper-pagination"
                            sx={{
                                padding: "15px",
                            }}
                        ></Box>

                        <Box
                        style={{ backgroundColor: styling.pagination }}
                        class="swiper-scrollbar"
                        ></Box>

                    </Box>

                </Grid>

        </Grid>
        </Container>
    );
}