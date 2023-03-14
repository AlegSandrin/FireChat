import { Alert, AlertTitle, Slide, Snackbar, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export default function ShowAlert ({showAlert}) {
    const [open, setOpen] = useState(false)
    
    useEffect(() => {
        setOpen(showAlert.setOpen)
    },[showAlert])

    function SlideTransition(props) {
        return <Slide {...props} direction="right" />;
      }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false)
    }

    return(
    <div className={`${open ? 'block' : 'hidden'}`}>
        <Stack spacing={2} sx={{width: '100%'}}>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} TransitionComponent={SlideTransition}>
        <Alert severity={showAlert.severity} onClose={handleClose}> <AlertTitle>{showAlert.title}</AlertTitle> {showAlert.message} </Alert>
        </Snackbar>
        </Stack>
    </div>
    )
}
