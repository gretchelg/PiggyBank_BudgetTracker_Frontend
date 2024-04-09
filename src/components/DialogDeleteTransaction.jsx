import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import {Button, Box, CircularProgress} from "@mui/material";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

export default function DialogDeleteTransaction({
    setDialogOpen,
    tranDeleteName,
    tranDeleteId,
    refresh,
    setRefresh,
    }) 
    {
    const [open, setOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(null);
    const { token } = useContext(AuthContext);

    const deleteTran = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(
                // `http://localhost:8080/transaction/${tranDeleteId}`,
                `https://piggybank-api-jwhz.onrender.com/transaction/${tranDeleteId}`,
                {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                }
            );

            if (response.ok) {
                // Transaction successfully deleted
                const deletedTransaction = await response.json();
                console.log(deletedTransaction);
                // Perform any necessary actions after deletion
            } else {
                // Transaction not found or other error occurred
                const errorData = await response.json();
                console.error(errorData.error);
            }

            setIsLoading(false);
            setRefresh(!refresh);

        } catch (error) {
            setIsLoading(false);
            setRefresh(!refresh);
            console.error("An error occurred while deleting the transaction:", error);
        }
    };

    const handleClose = (word) => {
        if (word === "delete") {
        deleteTran();
        }

        setIsLoading(false);
        setOpen(false);
        setDialogOpen(false);
    };

    return (
    <div>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Do you really want to delete the Transaction for{" "}
                {tranDeleteName.replace(/^[\w]/, (c) => c.toUpperCase())}?
            </DialogTitle>
            
            <DialogContent>
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
                ) : null}
            </DialogContent>
            
            <DialogActions>
                <Button onClick={() => handleClose("delete")} autoFocus>
                    Yes
                </Button>

                <Button onClick={handleClose}>
                    Cancel
                </Button>

            </DialogActions>

        </Dialog>
    </div>
    );
}