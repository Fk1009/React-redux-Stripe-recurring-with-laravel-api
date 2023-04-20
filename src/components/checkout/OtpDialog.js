import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function OtpDialog({ open, onClose, onVerify, loading }) {
  const [otp, setOtp] = useState("");
  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleVerifyClick = () => {
    onVerify(otp);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter OTP</DialogTitle>
      <DialogContent>
        <TextField
          label="OTP"
          variant="outlined"
          value={otp}
          onChange={handleOtpChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleVerifyClick} color="primary">
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OtpDialog;
