import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { ThemeContext } from "../context/ThemeContext";
import { Container, Box } from "@mui/material";
import { MenuItem, InputLabel, FormControl, Select } from "@mui/material";
import "./style/Report.css";

//importing SVG -------------------
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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Reports() {
    const { categories, tranData } = useContext(DataContext);
    const { styling } = useContext(ThemeContext);
    const [filter, setFilter] = useState("month");
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

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

    // filter data by date
    useEffect(() => {
    
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        setEndDate(tomorrow);
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
    
        const filteredData = tranData?.filter((data) => {
            const timestampDate = new Date(data.tran_date).getTime();
            return timestampDate < endDate && timestampDate > startDate;
        });
    
        setFilteredData(filteredData);

    }, [tranData, endDate, startDate]);

    const getTxnSummaryByCategory = (category, txns) =>
        txns.filter(txn => txn.category_name === category)
            .reduce((accum, txn) => {
                return {
                    total: accum.total + Number(txn.tran_amount),
                    count: accum.count +1,
                }
            }, { total: 0, count: 0 })

return (
    <Container
        sx={{
        paddingTop: "100px",
        maxWidth: "sm",
        minHeight: "100vh",
        }}
        style={{
        background: styling.backgroundColor,
        paddingBottom: "100px",
        }}
    >
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
            <Box>-</Box>
        <div className="dash-topSpending">
            {categories?.map((category) => {
                const IconComponent = categoryIcons[category.name]
                ? categoryIcons[category.name]
                : categoryIcons["others"];
                const categorySum = getTxnSummaryByCategory(category.name, filteredData )
                return (
                    <Accordion
                        sx={{
                        width: "100%",
                        borderRadius: "15px",
                        alignItems: "center",
                        border: "1px solid var( --gray-3);",
                        }}
                        style={{
                        backgroundColor: styling.backgroundBoard,
                        border: styling.borders,
                        }}
                    >
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                            <div className="spending-container">
                                <IconComponent />
                                <Box className="spending-box">
                                <p
                                    className="rep-title"
                                    style={{ color: styling.txtColor }}
                                >
                                    {category.name.replace(/^[\w]/, (c) => c.toUpperCase())}
                                </p>
                                <p style={{ color: styling.txtColor }} className="rep-tran">
                                    {categorySum.count}{" "}
                                    {categorySum.count > 1
                                    ? "Transactions"
                                    : "Transaction"}
                                </p>
                                </Box>
                                <span
                                className="rep-total-spent"
                                style={{ color: styling.txtColor }}
                                >
                                {categorySum.total.toFixed(2)} €
                                </span>
                            </div>
                        </AccordionSummary>

                        <AccordionDetails>
                        {filteredData
                            .filter((data) => data.category_name === category.name)
                            .map((data) => (
                                <div key={data.id} className="rep-trans-accordion">
                                    <p className="rep-trans-accordion-amount">
                                    {data.tran_amount} €
                                    </p>
                                    <p>{data.tran_description}</p>
                                    <p>
                                    {new Date(data.tran_date)
                                        .toLocaleDateString("en-GB")
                                        .replace(/[/]/g, ".")}
                                    </p>
                                </div>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    </Container>
    );
}