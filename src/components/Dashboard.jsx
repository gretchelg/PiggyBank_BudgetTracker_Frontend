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

import { ReactComponent as IconBills } from "./svgCategories/bills.svg";
import { ReactComponent as IconCommunication } from "./svgCategories/communication.svg";
import { ReactComponent as IconEatingOut } from "./svgCategories/eating-out.svg";
import { ReactComponent as IconEducation } from "./svgCategories/education.svg";
import { ReactComponent as IconEntertainment } from "./svgCategories/entertainment.svg";
import { ReactComponent as IconGroceries } from "./svgCategories/groceries.svg";
import { ReactComponent as IconInsurance } from "./svgCategories/insurance.svg";
import { ReactComponent as IconMedicine } from "./svgCategories/medicine.svg";
import { ReactComponent as IconOthers } from "./svgCategories/others.svg";
import { ReactComponent as IconPets } from "./svgCategories/pets.svg";
import { ReactComponent as IconRent } from "./svgCategories/rent.svg";
import { ReactComponent as IconRepairs } from "./svgCategories/repairs.svg";
import { ReactComponent as IconTransportation } from "./svgCategories/transportation.svg";
import { ReactComponent as IconWork } from "./svgCategories/work.svg";

export default function Dashboard() {
    const [filter, setFilter] = useState("month");
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [spentBar, setSpentBar] = useState(0);
    const [budgetBar, setBudgetBar] = useState(0);
    const { token } = useContext(AuthContext);
    const { decodedToken } = useJwt(token);

    const {
        categories,
        categoriesObj,
        budgetData,
        tranData,
    } = useContext(DataContext);

    const { styling } = useContext(ThemeContext);

    // init Swiper:
    const swiper = new Swiper(".swiper", {
        direction: "horizontal",
        loop: true,
        scrollbar: {
            el: ".swiper-scrollbar",
            draggable: true,
        },
    });

    // filter data by date
    useEffect(() => {

        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        setEndDate(tomorrow);

    }, []);

    useEffect(() => {
        const now = new Date();

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
    
        const filtered = tranData?.filter((data) => {
            const timestampDate = new Date(data.tran_date).getTime();
            return timestampDate < endDate && timestampDate > startDate;
        });
    
        setFilteredData(filtered);

    }, [tranData, endDate, startDate]);

    const creditTrans = filteredData?.filter((trans) => trans.tran_sign === "CR");

// setCreditTrans(creditTrans);
    const debitTrans = filteredData?.filter((trans) => trans.tran_sign === "DR");

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

    //  Calculate budgets
    const budgetSum = budgetData
    ?.reduce(
    (accumulator, currentValue) =>
        accumulator + Number(currentValue.limit_amount),0)
    .toFixed(2);

    //  Expected savings
    const toDebit = budgetSum
    if (expensesSum > budgetSum) {
        toDebit = expensesSum
    }

    const savings = incomeSum - toDebit;

    //  Calculate remaining balance
    let expensesSumBudgets = 0;
    let remainingBudget = 0

    categories.map((category) => {
        expensesSumBudgets = Number(expensesSumBudgets + category.spent);
    });

    remainingBudget = budgetSum - expensesSumBudgets

    //  Graph Bar
    useEffect(() => {
        if (expensesSum !== 0) {
            setSpentBar((expensesSum * 100) / incomeSum);
        }
    }, [expensesSum]);

    useEffect(() => {
        if (expensesSumBudgets !== 0) {
          setBudgetBar(((remainingBudget * 100) / budgetSum));
        }
    }, [expensesSumBudgets]);



    //  select category icon
    const categoryIcons = {
        bills: IconBills,
        communication: IconCommunication,
        education: IconEducation,
        entertainment: IconEntertainment,
        food: IconGroceries,
        insurance: IconInsurance,
        health: IconMedicine,
        pets: IconPets,
        home: IconRent,
        repairs: IconRepairs,
        transport: IconTransportation,
        work: IconWork,
        eatingout: IconEatingOut,
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

                {/* FILTER BY DATE DROPDOWN */}
                <Grid item xs={12}>
                    <Box component="div" className="transaction-filter">
                        <FormControl fullWidth>
                            {/* Filter dashboard info by date */}
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
                                
                                {/* <MenuItem value={"week"} sx={{ fontSize: "14px" }}>
                                    Last Week
                                </MenuItem> */}
                                
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

                {/* BALANCE OVERVIEW */}
                <Link
                    to="/transactions"
                    className="dash-progress"
                    style={{
                        border: styling.borders,
                        backgroundColor: styling.backgroundBoard,
                    }}
                >

                    {/* CURRENT BALANCE */}
 
                    <p style={{ color: styling.txtColor }} className="current-balance">
                        Current Balance
                    </p>

                    <h2 style={{ color: styling.txtColor }} className="dash-balance">
                        {" "}
                        {(incomeSum - expensesSum).toFixed(2)} €
                    </h2>

                    {/* EXPECTED SAVINGS */}
  
                    <p style={{ color: styling.txtColor }} className="dash-expected">
                        Expected savings: {savings.toFixed(2)} €
                    </p>

                    <p style={{ color: styling.txtColor }} className="spent-title">
                        Spent
                    </p>

                    <Box className="linear-progress-container1">

                        {/* TOTAL SPENT - LEFT PROGRESS BAR */}
                        <Typography
                            style={spentBar > 10 ? { color: "white" } : { color: "black" }}
                            className="progress-left"
                            variant="h5"
                        >
                            {expensesSum} €
                        </Typography>

                        {/* TOTAL INCOME - RIGHT PROGRESS BAR */}

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

                    {/* REMAINING BUDGET - LEFT PROGRESS BAR */}

                    <p style={{ color: styling.txtColor }} className="spent-title">
                        Remaining Budget
                    </p>

                    <Box className="linear-progress-container2">
                        <Typography
                            style={budgetBar > 10 ? { color: "white" } : { color: "black" }}
                            className="progress-left"
                            variant="h5"
                        >
                            {remainingBudget.toFixed(2)} €
                        </Typography>

                        {/* TOTAL BUDGET ALLOCATION - RIGHT PROGRESS BAR */}

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


                {/* CHART REPRESENTATION OF TOP SPENDINGS */}

                <Charts />


                {/* CONSUMED BUDGET MONITORING OVERVIEW */}

                <Grid
                    item
                    xs={12}
                    sx={{
                        textAlign: "center",
                    }}
                    style={{ cursor: "grab" }}
                >
                    <Box className="swiper">
                        <Box className="swiper-wrapper">

                        {budgetData?.map((each) => {
                            
                                const categoryObjField = categoriesObj[each.category_name]
                                let remainingBudgetBar = 0;

                                // CALCULATE REMAINING BUDGET PER CATEGORY

                                if (categoryObjField) {
                                    const {limit, spent} = categoryObjField
                                    remainingBudgetBar = ((limit - spent) / limit) * 100;
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
                                        {
                                        (() => {
                                            //  CORRESPONDING CATEGORY ICON
                                            var selection = each.category_name ? each.category_name : "others"
                                            const Icon = categoryIcons[selection]
                                            return <Icon className="dash-icon-title" />;
                                        })()
                                        }

                                        <Box className="dash-budget-wrapper">

                                            <p
                                                style={{ color: styling.txtColor }}
                                                className="dash-budget-title"
                                            >
                                                {each.category_name.replace(/^[\w]/, (c) =>
                                                    c.toUpperCase()
                                            )}
                                            </p>

                                            <Typography
                                                style={{ color: styling.txtColor }}
                                                className="dash-budget-info"
                                            >
                                                {categoriesObj?.hasOwnProperty(each.category_name)
                                                ? `${categoriesObj[each.category_name].spent.toFixed(2)}  € spent`
                                                : "0  € spent"}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <p style={{ color: styling.txtColor }} className="spent-title">
                                        Remaining Budget
                                    </p>

                                    <Box className="linear-progress-container2">
                                        <Typography
                                            style={

                                            remainingBudgetBar > 8
                                                ? { color: "white" }
                                                : { color: "black" }
                                            }
                                            className="progress-left"
                                            variant="h5"
                                        >

                                            {categoriesObj[each.category_name]
                                            ? (Number(each.limit_amount) -
                                            categoriesObj[each.category_name].spent).toFixed(2)
                                            : (Number(each.limit_amount)).toFixed(2)}
                                            €
                                        </Typography>

                                        <Typography
                                            style={
                                            remainingBudgetBar > 90
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
                                            value={remainingBudgetBar}
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