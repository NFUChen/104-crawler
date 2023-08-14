import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

export const MuiSnakeBar = ({ text }: { text: string }) => {
  const [open, setOpen] = useState(false);
  const [snakBarText, setSnakBarText] = useState(text);
  useEffect(() => {
    if (text) {
      setOpen(true);
      setSnakBarText(text);
    }
  }, []);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
        {snakBarText}
      </Alert>
    </Snackbar>
  );
};
