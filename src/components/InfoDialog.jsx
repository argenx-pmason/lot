import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  Button,
} from "@mui/material";
import { PropTypes } from "prop-types";

export function InfoDialog(props) {
  const { openInfo, setOpenInfo, href } = props;
  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      onClose={() => setOpenInfo(false)}
      open={openInfo}
      title={"Info about this screen"}
    >
      <DialogTitle>Info about this screen</DialogTitle>
      <DialogContent>
        <ul>
          <li>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://argenxbvba.sharepoint.com/:w:/r/sites/Biostatistics/_layouts/15/Doc.aspx?sourcedoc=%7B61C04304-8E39-4E4E-834F-B3E43B508DC5%7D&file=Fill%20in%20LOT%20sheet.docx&action=default&mobileredirect=true"
            >
              Open document about filling in the LOT
            </a>
          </li>
        </ul>
        <Tooltip title={"Email technical programmers"}>
          <Button
            sx={{
              color: "blue",
              border: 1,
              borderColor: "blue",
              borderRadius: 1,
              padding: 0.4,
              float: "right",
            }}
            onClick={() => {
              window.open(
                "mailto:qs_tech_prog@argenx.com?subject=Question&body=This email was sent from: " +
                  encodeURIComponent(href) +
                  "%0D%0A%0D%0AMy question is:",
                "_blank"
              );
            }}
          >
            Email
          </Button>
        </Tooltip>
      </DialogContent>
    </Dialog>
  );
}
// validate the props for info dialog
InfoDialog.propTypes = {
  openInfo: PropTypes.bool.isRequired,
  setOpenInfo: PropTypes.func.isRequired,
  href: PropTypes.string.isRequired,
};
