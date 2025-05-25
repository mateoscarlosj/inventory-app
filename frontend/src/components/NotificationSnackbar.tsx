import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface NotificationSnackbarProps {
    open: boolean;
    message: string;
    severity: AlertColor; 
    onClose: () => void;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
    open,
    message,
    severity,
    onClose,
}) => {
    const alertStyles: Record<AlertColor, React.CSSProperties> = {
        success: {
        backgroundColor: "#4caf50",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "1rem",
        },
        error: {
        backgroundColor: "#d32f2f",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "1rem",
        },
        warning: {
        backgroundColor: "#ed6c02",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "1rem",
        },
        info: {
        backgroundColor: "#0288d1",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "1rem",
        },
    };

    return (
        <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
        <Alert
            onClose={onClose}
            severity={severity}
            sx={{
            ...alertStyles[severity],
            boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
            borderRadius: "8px",
            minWidth: "300px",
            textAlign: "center",
            letterSpacing: "0.05em",
            }}
            variant="filled"
        >
            {message}
        </Alert>
        </Snackbar>
    );
};

export default NotificationSnackbar;
