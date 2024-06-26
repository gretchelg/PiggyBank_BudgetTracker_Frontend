import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext"; 
import { ThemeContext } from "../context/ThemeContext";
import DialogConfirm from "./DialogConfirm";

import { SpeedDial, SpeedDialAction} from "@mui/material";
import { Backdrop, Container, Box, LinearProgress } from "@mui/material";
import { Button, Card, CardContent, Typography} from "@mui/material";
import { Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import { MenuItem, InputLabel, FormControl, Select } from "@mui/material";

import ManualEntry from "@mui/icons-material/EditNoteOutlined";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
import { ReactComponent as IconTrash } from "./svgCategories/trash.svg";
    
export default function Budget() {
    const [expanded, setExpanded] = useState(false);
    const {
    categoriesObj,
    budgetData,
    tranData,
    refresh,
    setRefresh,
    } = useContext(DataContext);

    const { styling } = useContext(ThemeContext);
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [budgetDeleteName, setBudgetDeleteName] = useState("false");
    const [budgetDeleteId, setBudgetDeleteId] = useState(null);
    const [filter, setFilter] = useState("month");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [filteredData, setFilteredData] = useState([]);

    const navigate = useNavigate();
    
    const actions = [
        { icon: <ManualEntry />, name: "Add Budget", route: "/addbudget" },
    ];

    const handleActionClick = (route) => {
    navigate(route);
    setOpen(false);
    };
    const paperStyles = {
    // Customize the background color here
    background: "linear-gradient(#c80048, #961c48)",
    };

    const categoryIcons = {
        bills: IconBills,
        communication: IconCommunication,
        education: IconEducation,
        entertainment: IconEntertainment,
        food: IconGroceries,
        insurance: IconInsurance,
        health: IconMedicine,
        others: IconOthers,
        pets: IconPets,
        home: IconRent,
        repairs: IconRepairs,
        transport: IconTransportation,
        work: IconWork,
        eatingout: IconEatingOut,
    };

    let euro = Intl.NumberFormat("en-DE", {
        style: "currency",
        currency: "EUR",
    });


    const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    };

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

    const getTxnSummaryByCategory = (category, txns) =>
        txns.filter(txn => txn.category_name === category)
            .reduce((accum, txn) => {
                return {
                    total: accum.total + Number(txn.tran_amount),
                    count: accum.count +1,
                }
            }, { total: 0, count: 0 })
            
    const getLimitAmount = (category, budgetsObj) => {
        if (budgetsObj[category]) {
            return Number(budgetsObj[category].limit)
        } 

        return 0
    }

    // Calculate remaining budget for a given category
    const calcRemainingBudget = (category, txns) => {
        const spent = getTxnSummaryByCategory(category, txns).total
        const limitAmount = getLimitAmount(category, categoriesObj)

        return (limitAmount - spent).toFixed(2)
    }


    return (
    <Container
        sx={{
        paddingTop: "100px",
        }}
        style={{
        background: styling.backgroundColor,
        paddingBottom: styling.paddingBottom,
        }}
    >
        {/* Pop-up window to confirm delete */}
        {dialogOpen ? (
        <DialogConfirm
            setDialogOpen={setDialogOpen}
            budgetDeleteName={budgetDeleteName}
            budgetDeleteId={budgetDeleteId}
            refresh={refresh}
            setRefresh={setRefresh}
        />
        ) : null}

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
        
        <Box>-</Box>

        <Box
        sx={{
            height: 600,
            transform: "translateZ(0px)",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
        }}
        >
        {budgetData.length ? null : "You have not added a Budget Limit yet."}
        
        {/* Show total spent per budget category limit */}
        {budgetData?.map((element) => {
            let spentBudgetBar = 0;
            
            if (
            categoriesObj[element.category_name]?.spent <
            categoriesObj[element.category_name]?.limit
            ) {
            spentBudgetBar =
                (categoriesObj[element.category_name].spent * 100) /
                categoriesObj[element.category_name].limit;
            }
            if (
            categoriesObj[element.category_name]?.spent >
            categoriesObj[element.category_name]?.limit
            ) {
            spentBudgetBar = 100;
            }

            return (
            <Box>
                <Card
                sx={{
                    minWidth: 275,
                    mt: 1,
                    borderRadius: "15px",
                    display: "column",
                }}
                className="budget_card"
                style={{
                    backgroundColor: styling.backgroundBoard,
                    border: styling.borders,
                }}
                >
                <CardContent
                    sx={{
                    display: "flex",
                    flexDirection: "column",
                    paddingBottom: 0,
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        {
                            (() => {
                                const selection = element.category_name ? element.category_name : "others"
                                const Icon = categoryIcons[selection]
                                return <Icon style={{ marginRight: "0.5rem" }} />;
                            })()
                        }
                    <Box
                        sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        width: "80%",
                        }}
                    >
                        <Typography
                        sx={{ fontSize: 16, fontWeight: "700" }}
                        style={{ color: styling.txtColor }}
                        >
                        {element.category_name.replace(/^[\w]/, (c) =>
                            c.toUpperCase()
                        )}
                        </Typography>
                        <Typography
                        style={{ color: styling.txtColor }}
                        sx={{ fontSize: 14, fontWeight: "300" }}
                        color="text.secondary"
                        gutterBottom
                        >
                        {/* Show remaining budget */}
                        {calcRemainingBudget(element.category_name, filteredData)}{" "}
                        € remaining budget
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-start",
                        width: "20%",
                        }}
                    >
                        {/* Delete budget button  */}
                        <Button
                        style={{ color: styling.txtColor }}
                        sx={{ p: 1 }}
                        onClick={() => {
                            setBudgetDeleteName(element.category_name);
                            setBudgetDeleteId(element._id);
                            setDialogOpen(true);
                        }}
                        >
                        <IconTrash
                            style={{
                            width: "20px",
                            height: "20px",
                            fill: styling.txtColor,
                            }}
                        />
                        </Button>
                    </Box>
                </Box>

                    <div className="linear-progress-container1">
                    {/* Show the running spent amount in progress bar */}
                    <h6
                        className="progress-left"
                        style={
                        (categoriesObj[element.category_name]?.spent * 100) /
                            categoriesObj[element.category_name]?.limit >
                        10
                            ? { fontSize: "14px", color: "white" }
                            : { fontSize: "14px", color: "black" }
                        }
                    >
                        {categoriesObj?.hasOwnProperty(element.category_name)
                            ? `${getTxnSummaryByCategory(element.category_name, filteredData).total.toFixed(2)} € spent`
                            : "0 € spent"
                        }
                    </h6>
                    {/* Show the set limit amount in progress bar */}
                    <span
                        className="progress-right"
                        style={
                        (categoriesObj[element.category_name]?.spent * 100) /
                            categoriesObj[element.category_name]?.limit >
                        90
                            ? { fontSize: "14px", color: "white" }
                            : { fontSize: "14px", color: "black" }
                        }
                    >
                        {element.limit_amount} €
                    </span>

                    {/* Determine spent over budget limit in progress bar */}
                    <LinearProgress
                        variant="determinate"
                        // value={categoriesObj[element.category_name] ? 90 : 20}
                        value={spentBudgetBar}
                    />
                    </div>

                    <Accordion
                    expanded={expanded === element.category_name}
                    onChange={handleChange(element.category_name)}
                    sx={{ boxShadow: "none" }}
                    >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    ></AccordionSummary>
                    <AccordionDetails>
                        {/* Show detailed spent transaction per category */}
                        {filteredData
                        .filter(
                            (item) =>
                            item.tran_sign === "DR" &&
                            item.category_name === element.category_name
                        )
                        .sort(
                            (a, b) =>
                            new Date(b.tran_date) - new Date(a.tran_date)
                        )
                        .slice(0, 10)
                        .map((element) => {
                            const origDate = element.tran_date;
                            const newDate = new Date(origDate);
                            const newLocalDate = newDate
                            .toLocaleDateString("en-GB")
                            .replace(/[/]/g, ".");

                            const capitalizedDesc =
                            element.tran_description.replace(/./, (c) =>
                                c.toUpperCase()
                            );
                            return (
                            <Box
                                component="div"
                                className="transaction-div"
                                key={element._id}
                                sx={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                }}
                            >
                                <Typography
                                variant="p"
                                component="p"
                                className="transaction-item"
                                sx={{ fontWeight: "bold" }}
                                >
                                {euro.format(element.tran_amount)}
                                </Typography>
                                <Typography
                                variant="p"
                                component="p"
                                className="transaction-item"
                                >
                                {capitalizedDesc}
                                </Typography>
                                <Typography
                                variant="p"
                                component="p"
                                className="transaction-item"
                                >
                                {newLocalDate}
                                </Typography>
                            </Box>
                            );
                        })}
                    </AccordionDetails>
                    </Accordion>
                    
                </CardContent>
                </Card>
            </Box>
            );
        })}
        <Backdrop open={open} />

        {/* Speed dial button to add budget plan */}
        <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            style={{
            zIndex: 5,
            transform: "translateX(+40%)",
            }}
            sx={{
            position: "sticky",
            bottom: 90,
            "& .MuiFab-root": {
                width: "64px", // Increase the width
                height: "64px", // Increase the height
            },
            }}
            // icon={<SpeedDialIcon sx={{ color: "#FFFF"}} />}
            icon={<AddIcon sx={{ color: "#FFFF", fontSize: "30px" }} />}
            onClose={() => {
            setOpen(false);
            }}
            onOpen={() => {
            setOpen(true);
            }}
            open={open}
            FabProps={{
            style: paperStyles,
            }}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen
                    onClick={() => handleActionClick(action.route)}
                />
            ))}
            </SpeedDial>
        </Box>
    </Container>
    );
    }
