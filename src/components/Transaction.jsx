import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import "./style/Transaction.css";

import {Box, Backdrop, SpeedDial, SpeedDialAction } from "@mui/material";
import {Container, Select, FormControl, Tab, Tabs} from "@mui/material";
import {Typography, Button, MenuItem, InputLabel } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ScanReceipt from '@mui/icons-material/FlipOutlined';
import LinkAccount from '@mui/icons-material/DatasetLinkedOutlined';
import ManualEntry from '@mui/icons-material/EditNoteOutlined';
import Trash from '@mui/icons-material/DeleteOutlineOutlined';
import DialogDeleteTransaction from "./DialogDeleteTransaction";

  const actions = [
    { icon: <LinkAccount />, name: "Link", route: "/link" },
    { icon: <ManualEntry />, name: "Expense", route: "/addexpense" },
    { icon: <ManualEntry />, name: "Income", route: "/addincome" },
    { icon: <ScanReceipt />, name: "Scan", route: "/scan" },
  ];

//Date Filtering in Transaction Component

export default function Transactions() {
    //state
    const [transaction, setTransaction] = useState("expenses");
    const [filter, setFilter] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tranDeleteName, setTranDeleteName] = useState("false");
    const [tranDeleteId, setTranDeleteId] = useState(null);
    const [filteredTran, setFilteredTran] = useState([]);
    //navigate
    const navigate = useNavigate();
    //context
    const { tranData, refresh, setRefresh } = useContext(DataContext);
    const { token } = useContext(AuthContext);
    const { styling } = useContext(ThemeContext);

    //handlers
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const handleActionClick = (route) => {
      navigate(route);
      handleClose();
    };

    //transactions functions
    const handleChange = (event, newValue) => {
      setTransaction(newValue);
    };

    const paperStyles = {
      // Customize the background color here
      background: "linear-gradient(#c80048, #961c48)",
      size: "large",
    };

    //Currency Format
  
    let euro = Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: "EUR",
    });

    //useEffect for Date Filtering
    useEffect(() => {

      // set the end date filter
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      setEndDate(tomorrow.getTime());

      // set start date of the filter
      setFilter("month")
    }, []);

    useEffect(() => {
      const now = new Date();
      var updatedStartDate = startDate

      if (filter === "week") {
        const lastWeek = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        ).getTime();
        updatedStartDate = lastWeek
      }
      if (filter === "month") {
        const lastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        ).getTime();
        updatedStartDate = lastMonth
      }
      if (filter === "3months") {
        const last3Months = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        ).getTime();
        updatedStartDate = last3Months
      }
      if (filter === "6months") {
        const last6Months = new Date(
          now.getFullYear(),
          now.getMonth() - 6,
          now.getDate()
        ).getTime();
        updatedStartDate = last6Months
      }
      if (filter === "year") {
        const lastYear = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        ).getTime();
        updatedStartDate = lastYear
      }
      if (filter === "all") {
        const last5Years = new Date(
          now.getFullYear() - 5,
          now.getMonth(),
          now.getDate()
        ).getTime();
        updatedStartDate = last5Years
      }

      const filteredData = tranData.filter((el) => {
        const tran_date_timestamp = new Date(el.tran_date)
        const end = new Date(endDate)
        const start = new Date(updatedStartDate)
  
        const result = tran_date_timestamp <= end &&
        tran_date_timestamp >= start
  
        return result
      })
      setFilteredTran(filteredData)
      setStartDate(updatedStartDate);

    }, [filter]);


    return (
      <Container
        maxWidth="sm"
        id="transactions-container-id"
        className="transactions-container"
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
        {dialogOpen ? (
          <DialogDeleteTransaction
            setDialogOpen={setDialogOpen}
            tranDeleteName={tranDeleteName}
            tranDeleteId={tranDeleteId}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        ) : null
        }

        <Box
          sx={{
            transform: "translateZ(0px)",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            textDecoration: "none",
          }}
        >
          <Tabs
            value={transaction}
            onChange={handleChange}
            centered
            className="tabs-div"
            sx={{ "& .MuiTabs-indicator": { display: "none" } }}
            style={{ background: "snow" }}
          >

            <Tab
              label="expenses"
              value="expenses"
              style={{ fontSize: "16px" }}
              className={transaction === "expenses" ? "active tab" : "tab"}
            />

            <Tab
              label="income"
              value="income"
              style={{ fontSize: "16px" }}
              className={transaction === "income" ? "active tab" : "tab"}
            />

          </Tabs>

        {/* Filtering by Date */}
          <Box component="div" className="transaction-filter" sx={{ m: 2 }}>
            <FormControl fullWidth>
              
              <InputLabel id="demo-simple-select-label" sx={{ fontSize: "12px" }}>
                Filter
              </InputLabel>
              
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter}
                label="Filter"
                onChange={(e) => setFilter(e.target.value)}
                sx={{
                  textAlign: "left",
                  "& fieldset": {
                    borderRadius: "31px",
                  },
                  fontSize: "14px",
                }}
                style={{
                  backgroundColor: styling.backgroundBoard,
                  borderRadius: "31px",
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

        {/* Expenses */}
        {transaction === "expenses" && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                ml: 0.5,
              }}
            >
              <Typography
                style={{ color: styling.txtColor }}
                sx={{ fontSize: "16px", fontWeight: "bold", mb: 1 }}
              >
                Spent
              </Typography>
            </Box>

            {filteredTran
              .filter((element) => element.tran_sign === "DR")
              .sort((a, b) => new Date(b.tran_date) - new Date(a.tran_date))
              .map((element) => {
                const origDate = element.tran_date;
                const newDate = new Date(origDate);
                const newLocalDate = newDate
                  .toLocaleDateString("en-GB") //ADD different Country code here to format it
                  .replace(/[/]/g, ".");
                let capitalizedDesc = "Others";
                if (element.tran_description) {
                  capitalizedDesc = element.tran_description.replace(/./, (c) =>
                    c.toUpperCase()
                  );
                }

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
                    style={{ backgroundColor: " var(--gray-0)" }}
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
                    
                    <Button
                      sx={{ p: 1 }}
                      onClick={() => {
                        setDialogOpen(true);
                        setTranDeleteName(element.tran_description);
                        setTranDeleteId(element._id);
                      }}
                    >
                      <Trash style={{ width: "20px", height: "20px" }} />
                    </Button>
                  </Box>
                );
              })}
          </Box>
        )}
        {/* Income */}
        {transaction === "income" && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                ml: 0.5,
              }}
            >
              <Typography
                style={{ color: styling.txtColor }}
                sx={{ fontSize: "16px", fontWeight: "bold", mb: 1 }}
              >
                {" "}
                Earned{" "}
              </Typography>
            </Box>

            {filteredTran
              .filter((element) => element.tran_sign === "CR")
              .sort((a, b) => new Date(b.tran_date) - new Date(a.tran_date))
              .map((element) => {
                const origDate = element.tran_date;
                const newDate = new Date(origDate);
                const newLocalDate = newDate
                  .toLocaleDateString("en-GB") //ADD different Country code here to format it
                  .replace(/[/]/g, ".");

                const capitalizedDesc = element.tran_description.replace(
                  /./,
                  (c) => c.toUpperCase()
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
                    style={{ backgroundColor: " var(--gray-0)" }}
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
                    
                    <Button
                      sx={{ p: 1 }}
                      onClick={() => {
                        setDialogOpen(true);
                        setTranDeleteName(element.tran_description);
                        setTranDeleteId(element._id);
                      }}
                    >
                      <Trash style={{ width: "20px", height: "20px" }} />
                    </Button>

                  </Box>
                );
              })}
          </Box>
        )}
      </Box>

      <Backdrop open={open} />

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
            width: "64px", 
            height: "64px", 
          },
        }}
        icon={<AddIcon sx={{ color: "#FFFF", fontSize: "30px" }} />}
        onClose={handleClose}
        onOpen={handleOpen}
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

    </Container>
  );
}