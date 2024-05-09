import "./App.css";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import lot from "./1802_final_sap_lot.json";
import {
  Box,
  Button,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Autocomplete,
  TextField,
  Grid,
  Tooltip,
  IconButton,
  Toolbar,
} from "@mui/material";
import { LicenseInfo } from "@mui/x-data-grid-pro";
import {
  GridRowModes,
  DataGridPro,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbarExport,
} from "@mui/x-data-grid-pro";
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Info,
  FileDownload,
  FileUpload,
  FolderCopy,
} from "@mui/icons-material";
import { InfoDialog } from "./components/InfoDialog";
import userInfo from "./users.json";

function EditToolbar(props) {
  const {
      setRows1,
      setRowModesModel1,
      setRows2,
      setRowModesModel2,
      setRows3,
      setRowModesModel3,
    } = props,
    setRows = setRows1 || setRows2 || setRows3,
    setRowModesModel =
      setRowModesModel1 || setRowModesModel2 || setRowModesModel3;
  const handleClick = () => {
    const id = uuidv4();
    setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<Add />} onClick={handleClick}>
        Add record
      </Button>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function App() {
  LicenseInfo.setLicenseKey(
    "369a1eb75b405178b0ae6c2b51263cacTz03MTMzMCxFPTE3MjE3NDE5NDcwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
  );
  const { href } = window.location,
    [openInfo, setOpenInfo] = useState(false),
    types = ["Table", "Listing", "Figure", "Dataset", "Other"],
    users = userInfo.map((user) => {
      return user.name;
    }),
    CROs = [
      { id: "sgs", label: "SGS" },
      { id: "cytel", label: "Cytel" },
      { id: "celerion", label: "Celerion" },
    ],
    reportingEvents = [
      { id: "re1", label: "113-bp-2010" },
      { id: "re2", label: "113-cidp-1902" },
      { id: "re3", label: "113-hv-2204" },
    ],
    [tabValue, changeTabValue] = useState(0),
    [rows1, setRows1] = useState([]),
    cols1 = [
      {
        field: "type",
        headerName: "Type",
        width: 120,
        editable: true,
        type: "singleSelect",
        valueOptions: types,
      },
      {
        field: "section",
        headerName: "Section",
        width: 400,
        editable: true,
      },
      {
        field: "num",
        headerName: "Num",
        editable: true,
        width: 120,
      },
      {
        field: "title",
        headerName: "Title",
        editable: true,
        width: 800,
        flexGrow: 1,
      },
      {
        field: "population",
        headerName: "Population",
        editable: true,
        width: 80,
      },
      {
        field: "Col_A",
        headerName: "Extra Col A",
        editable: true,
        width: 80,
      },
      {
        field: "Col_B",
        headerName: "Extra Col B",
        editable: true,
        width: 80,
      },
      {
        field: "program",
        headerName: "Program",
        editable: true,
        width: 120,
      },
      {
        field: "dataset",
        headerName: "Dataset",
        editable: true,
        width: 120,
        cellClassName: (params) => {
          console.log("params", params);
          if (params.row.type === "Dataset") return "required";
        },
      },
      {
        field: "parameters",
        headerName: "Parameters",
        editable: true,
        width: 120,
      },
      {
        field: "assignedTo",
        headerName: "Assigned to",
        editable: true,
        width: 200,
        type: "singleSelect",
        valueOptions: users,
      },
      {
        field: "comments",
        headerName: "Comments",
        editable: true,
        width: 120,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel1[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<Save />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick1(id)}
                key="S"
              />,
              <GridActionsCellItem
                icon={<Cancel />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick1(id)}
                color="inherit"
                key="C"
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick1(id)}
              color="inherit"
              key="E"
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              onClick={handleDeleteClick1(id)}
              color="inherit"
              key="D"
            />,
          ];
        },
      },
    ],
    [rows2, setRows2] = React.useState([]),
    cols2 = [
      {
        field: "libname",
        headerName: "Libname",
        width: 120,
        editable: true,
        type: "text",
      },
      {
        field: "path",
        headerName: "LSAF Path",
        width: 240,
        editable: true,
        type: "text",
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel2[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<Save />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick2(id)}
              />,
              <GridActionsCellItem
                icon={<Cancel />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick2(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick2(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              onClick={handleDeleteClick2(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    [rows3, setRows3] = React.useState([]),
    cols3 = [
      {
        field: "filename",
        headerName: "Filename",
        width: 120,
        editable: true,
        type: "text",
      },
      {
        field: "path",
        headerName: "LSAF Path",
        width: 240,
        editable: true,
        type: "text",
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel3[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<Save />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick3(id)}
              />,
              <GridActionsCellItem
                icon={<Cancel />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick3(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick3(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              onClick={handleDeleteClick3(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    [rowModesModel1, setRowModesModel1] = React.useState({}),
    [rowModesModel2, setRowModesModel2] = React.useState({}),
    [rowModesModel3, setRowModesModel3] = React.useState({}),
    handleRowEditStop = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
      }
    },
    handleEditClick1 = (id) => () => {
      setRowModesModel1({
        ...rowModesModel1,
        [id]: { mode: GridRowModes.Edit },
      });
    },
    handleEditClick2 = (id) => () => {
      setRowModesModel2({
        ...rowModesModel2,
        [id]: { mode: GridRowModes.Edit },
      });
    },
    handleEditClick3 = (id) => () => {
      setRowModesModel3({
        ...rowModesModel3,
        [id]: { mode: GridRowModes.Edit },
      });
    },
    handleSaveClick1 = (id) => () => {
      setRowModesModel1({
        ...rowModesModel1,
        [id]: { mode: GridRowModes.View },
      });
    },
    handleSaveClick2 = (id) => () => {
      setRowModesModel2({
        ...rowModesModel2,
        [id]: { mode: GridRowModes.View },
      });
    },
    handleSaveClick3 = (id) => () => {
      setRowModesModel3({
        ...rowModesModel3,
        [id]: { mode: GridRowModes.View },
      });
    },
    handleDeleteClick1 = (id) => () => {
      setRows1(rows1.filter((row) => row.id !== id));
    },
    handleDeleteClick2 = (id) => () => {
      setRows2(rows2.filter((row) => row.id !== id));
    },
    handleDeleteClick3 = (id) => () => {
      setRows3(rows3.filter((row) => row.id !== id));
    },
    handleCancelClick1 = (id) => () => {
      setRowModesModel1({
        ...rowModesModel1,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      const editedRow = rows1.find((row) => row.id === id);
      if (editedRow.isNew) {
        setRows1(rows1.filter((row) => row.id !== id));
      }
    },
    handleCancelClick2 = (id) => () => {
      setRowModesModel2({
        ...rowModesModel2,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      const editedRow = rows2.find((row) => row.id === id);
      if (editedRow.isNew) {
        setRows2(rows2.filter((row) => row.id !== id));
      }
    },
    handleCancelClick3 = (id) => () => {
      setRowModesModel3({
        ...rowModesModel3,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      const editedRow = rows3.find((row) => row.id === id);
      if (editedRow.isNew) {
        setRows3(rows3.filter((row) => row.id !== id));
      }
    },
    processRowUpdate1 = (newRow) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows1(rows1.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    },
    processRowUpdate2 = (newRow) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows2(rows2.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    },
    processRowUpdate3 = (newRow) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows3(rows3.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    },
    handleRowModesModelChange1 = (newRowModesModel) => {
      setRowModesModel1(newRowModesModel);
    },
    handleRowModesModelChange2 = (newRowModesModel) => {
      setRowModesModel2(newRowModesModel);
    },
    handleRowModesModelChange3 = (newRowModesModel) => {
      setRowModesModel3(newRowModesModel);
    },
    [showColumnInfo, setShowColumnInfo] = useState(false);
  console.log("lot", lot);

  return (
    <Box
      sx={{
        height: 800,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <Typography variant="h6" gutterBottom>
            LOT Editor
          </Typography>
          <Box sx={{ width: 100 }}> </Box>
          <Autocomplete
            options={reportingEvents}
            sx={{
              width: 300,
              backgroundColor: "primary.light",
            }}
            renderInput={(params) => (
              <TextField {...params} label="Reporting Event" />
            )}
          />
          <Autocomplete
            options={CROs}
            sx={{ width: 300, backgroundColor: "primary.light" }}
            renderInput={(params) => <TextField {...params} label="CRO" />}
          />
          <Box sx={{ flexGrow: 1 }}> </Box>
          <Tooltip title="Copy from another Reporting Event">
            <IconButton
              color="inherit"
              size="large"
              edge="end"
              onClick={() => {
                setOpenInfo(true);
              }}
            >
              <FolderCopy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Import data">
            <IconButton
              color="inherit"
              size="large"
              edge="end"
              onClick={() => {
                setRows1(lot.map((row) => ({ id: uuidv4(), ...row })));
              }}
            >
              <FileDownload />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export data">
            <IconButton
              color="inherit"
              size="large"
              edge="end"
              onClick={() => {
                setOpenInfo(true);
              }}
            >
              <FileUpload />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save changes">
            <IconButton
              color="inherit"
              size="large"
              edge="end"
              onClick={() => {
                setOpenInfo(true);
              }}
            >
              <Save />
            </IconButton>
          </Tooltip>
          <Tooltip title="Information about this screen">
            <IconButton
              color="inherit"
              size="large"
              edge="end"
              onClick={() => {
                setOpenInfo(true);
              }}
            >
              <Info />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            sx={{ width: 600, flexGrow: 1 }}
            label="Purpose (A1 cell)"
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Tabs
        value={tabValue}
        onChange={(event, newValue) => {
          changeTabValue(newValue);
        }}
        variant="scrollable"
        scrollButtons="auto"
        textColor="secondary"
      >
        <Tab
          label="Outputs"
          id={"tab0"}
          sx={{
            fontSize: 12,
          }}
        />
        <Tab label="Source Libname" id={"tab1"} sx={{ fontSize: 12 }} />
        <Tab label="Source Filename" id={"tab2"} sx={{ fontSize: 12 }} />
      </Tabs>
      {showColumnInfo && <p>Column info</p>}
      {rows1 && cols1 && tabValue === 0 && (
        <DataGridPro
          rows={rows1}
          columns={cols1}
          density={"compact"}
          editMode="row"
          rowModesModel={rowModesModel1}
          onRowModesModelChange={handleRowModesModelChange1}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate1}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows1, setRowModesModel1 },
          }}
          onCellEditStart={(params) => {
            console.log("cell", params);
            setShowColumnInfo(true);
          }}
          onRowEditStart={(params) => {
            console.log("row", params);
            setShowColumnInfo(true);
          }}
        />
      )}
      {rows2 && cols2 && tabValue === 1 && (
        <DataGridPro
          rows={rows2}
          columns={cols2}
          density={"compact"}
          editMode="row"
          rowModesModel={rowModesModel2}
          onRowModesModelChange={handleRowModesModelChange2}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate2}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows2, setRowModesModel2 },
          }}
        />
      )}
      {rows3 && cols3 && tabValue === 2 && (
        <DataGridPro
          rows={rows3}
          columns={cols3}
          density={"compact"}
          editMode="row"
          rowModesModel={rowModesModel3}
          onRowModesModelChange={handleRowModesModelChange3}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate3}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows3, setRowModesModel3 },
          }}
        />
      )}
      <InfoDialog openInfo={openInfo} setOpenInfo={setOpenInfo} href={href} />
    </Box>
  );
}
export default App;
