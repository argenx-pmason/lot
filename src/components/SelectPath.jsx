import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  Button,
  TextField,
} from "@mui/material";
import { FolderCopy } from "@mui/icons-material";
import { PropTypes } from "prop-types";

export function SelectPath(props) {
  const { openInfo, setOpenInfo, saveToLsafNew } = props,
    [path, setPath] = useState("");
  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      onClose={() => setOpenInfo(false)}
      open={openInfo}
      title={"Info about this screen"}
    >
      <DialogTitle>Save to a Specific Reporting Event</DialogTitle>
      <DialogContent>
        <TextField
          label="File path to Reporting Event (there should be a documents directory under this)"
          value={path}
          sx={{ width: "100%", mt: 2 }}
          onChange={(event) => {
            setPath(event.target.value);
          }}
        />
        <Tooltip title="Save to a new Reporting Event on LSAF">
          <Button
            variant="outlined"
            color="info"
            size="large"
            onClick={() => {
              saveToLsafNew(path);
            }}
            sx={{ float: "right", mt: 2 }}
            startIcon={<FolderCopy />}
          >
            Save
          </Button>
        </Tooltip>
      </DialogContent>
    </Dialog>
  );
}
// validate the props for info dialog
SelectPath.propTypes = {
  openInfo: PropTypes.bool.isRequired,
  setOpenInfo: PropTypes.func.isRequired,
  saveToLsafNew: PropTypes.string.isRequired,
};
