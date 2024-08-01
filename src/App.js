import "./App.css";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
// import lot from "./1802_final_sap_lot.json";
import {
  Box,
  Button,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Autocomplete,
  TextField,
  Tooltip,
  IconButton,
  Popper,
  Paper,
  Toolbar,
} from "@mui/material";
import {
  LicenseInfo,
  GridRowModes,
  DataGridPro,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid-pro";
import {
  Add,
  Edit,
  Remove,
  Delete,
  Save,
  Cancel,
  Info,
  // FileDownload,
  FolderCopy,
} from "@mui/icons-material";
// import { useDropzone } from "react-dropzone";
// import Papa from "papaparse";
import { InfoDialog } from "./components/InfoDialog";
import userInfo from "./users.json";
import local_test from "./local_test.json";

function App() {
  LicenseInfo.setLicenseKey(
    "6b1cacb920025860cc06bcaf75ee7a66Tz05NDY2MixFPTE3NTMyNTMxMDQwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
  );
  function EditToolbar(props) {
    const {
        setRows1,
        setRowModesModel1,
        setRows2,
        setRowModesModel2,
        setRows3,
        setRowModesModel3,
        setRows4,
        setRowModesModel4,
        setRows5,
        setRowModesModel5,
      } = props,
      setRows = setRows1 || setRows2 || setRows3 || setRows4 || setRows5,
      setRowModesModel =
        setRowModesModel1 ||
        setRowModesModel2 ||
        setRowModesModel3 ||
        setRowModesModel4 ||
        setRowModesModel5,
      handleClick = () => {
        const id = uuidv4();
        setRows((oldRows) => [
          ...oldRows,
          { id, name: "", age: "", isNew: true },
        ]);
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
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const { href } = window.location,
    mode = href.startsWith("http://localhost") ? "local" : "remote",
    [openInfo, setOpenInfo] = useState(false),
    types = ["Dataset", "Figure", "Listing", "Other", "Table"],
    users = userInfo
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((user) => {
        return user.name;
      }),
    [fontSize, setFontSize] = useState(10),
    adjustment = 160,
    reportingEvents = [
      { id: "2009-adam", label: "113-bp-2009 Adam" },
      { id: "2009-patient-profiles", label: "113-bp-2009 Patient Profiles" },
      { id: "2009-tlf", label: "113-bp-2009  TLF" },
      { id: "2301-data-review", label: "113-cms-2301 Data Review" },
    ],
    // CROs = [
    //   { id: "sgs", label: "SGS" },
    //   { id: "cytel", label: "Cytel" },
    //   { id: "celerion", label: "Celerion" },
    // ],
    [tabValue, setTabValue] = useState(0),
    renderCellExpand = (params) => {
      return (
        <GridCellExpand
          value={params.value || ""}
          width={params.colDef.computedWidth}
        />
      );
    },
    valueGetter = (row) => {
      return row && new Date(row.value);
    },
    qc_status = ["Not yet started", "Not needed", "In progress", "Complete"],
    [rows1, setRows1] = useState([]),
    cols1 = [
      {
        field: "type",
        headerName: "Type",
        width: 120,
        editable: true,
        type: "singleSelect",
        valueOptions: types,
        cellClassName: (params) => {
          if (!params.value) return "required";
        },
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
        cellClassName: (params) => {
          if (
            !params.value &&
            ["Table", "Listing", "Figure"].includes(params.row.type)
          )
            return "required";
        },
      },
      {
        field: "title",
        headerName: "Title",
        editable: true,
        width: 400,
        flexGrow: 1,
        cellClassName: (params) => {
          if (
            !params.value &&
            ["Table", "Listing", "Figure"].includes(params.row.type)
          )
            return "required";
        },
        renderCell: renderCellExpand,
      },
      {
        field: "population",
        headerName: "Population",
        editable: true,
        width: 80,
        cellClassName: (params) => {
          if (
            (!params.value &&
              ["Table", "Listing", "Figure"].includes(params.row.type)) ||
            (params.value && ["Dataset"].includes(params.row.type))
          )
            return "required";
        },
      },
      {
        field: "program",
        headerName: "Program",
        editable: true,
        width: 120,
        cellClassName: (params) => {
          if (!params.value) return "required";
        },
      },
      {
        field: "dataset",
        headerName: "Dataset",
        editable: true,
        width: 120,
        cellClassName: (params) => {
          if (!params.value && params.row.type === "Dataset") return "required";
        },
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
        cellClassName: (params) => {
          if (!params.value) return "required";
        },
      },
      {
        field: "path",
        headerName: "LSAF Path",
        width: 240,
        editable: true,
        type: "text",
        cellClassName: (params) => {
          if (!params.value) return "required";
        },
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
        cellClassName: (params) => {
          if (!params.value) return "required";
        },
      },
      {
        field: "path",
        headerName: "LSAF Path",
        width: 240,
        editable: true,
        type: "text",
        cellClassName: (params) => {
          if (!params.value) return "required";
        },
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
    [rows4, setRows4] = React.useState([]),
    cols4 = [
      {
        field: "num",
        headerName: "Num",
        editable: true,
        width: 120,
        cellClassName: (params) => {
          if (
            !params.value &&
            ["Table", "Listing", "Figure"].includes(params.row.type)
          )
            return "required";
        },
      },
      {
        field: "qc_program",
        headerName: "QC Program",
        editable: true,
        width: 120,
      },
      {
        field: "qc",
        headerName: "QC",
        editable: true,
        width: 80,
        renderCell: (params) => {
          const value = params.value,
            isPass = [1, "1"].includes(value),
            isFail = [0, "0"].includes(value);
          return isPass ? "Pass" : isFail ? "Fail" : "?";
        },
      },
      {
        field: "qc_programmer",
        headerName: "QC Programmer",
        editable: true,
        width: 200,
        type: "singleSelect",
        valueOptions: users,
      },
      {
        field: "due_date",
        headerName: "QC Due date",
        editable: true,
        width: 120,
        type: "date",
        valueGetter: valueGetter,
      },
      {
        field: "qc_status",
        headerName: "QC Status",
        editable: true,
        width: 120,
        type: "singleSelect",
        valueOptions: qc_status,
      },
      {
        field: "qc_comments",
        headerName: "QC Comments",
        editable: true,
        width: 300,
        renderCell: renderCellExpand,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel4[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<Save />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick4(id)}
              />,
              <GridActionsCellItem
                icon={<Cancel />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick4(id)}
                color="inherit"
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick4(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              onClick={handleDeleteClick4(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    [rows5, setRows5] = React.useState([]),
    cols5 = [
      {
        field: "num",
        headerName: "Num",
        editable: true,
        width: 120,
        cellClassName: (params) => {
          if (
            !params.value &&
            ["Table", "Listing", "Figure"].includes(params.row.type)
          )
            return "required";
        },
      },
      {
        field: "programmer",
        headerName: "Programmer",
        editable: true,
        width: 200,
        type: "singleSelect",
        valueOptions: users,
      },
      {
        field: "priority",
        headerName: "Priority",
        editable: true,
        type: "number",
        width: 80,
      },
      {
        field: "topline",
        headerName: "Topline Results",
        editable: true,
        type: "boolean",
        width: 80,
      },
      {
        field: "comments",
        headerName: "Comments",
        editable: true,
        width: 300,
        renderCell: renderCellExpand,
      },
      {
        field: "parameters",
        headerName: "Parameters",
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
          const isInEditMode = rowModesModel5[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<Save />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick5(id)}
              />,
              <GridActionsCellItem
                icon={<Cancel />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick5(id)}
                color="inherit"
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick5(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              onClick={handleDeleteClick5(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    [rowModesModel1, setRowModesModel1] = React.useState({}),
    [rowModesModel2, setRowModesModel2] = React.useState({}),
    [rowModesModel3, setRowModesModel3] = React.useState({}),
    [rowModesModel4, setRowModesModel4] = React.useState({}),
    [rowModesModel5, setRowModesModel5] = React.useState({}),
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
    handleEditClick4 = (id) => () => {
      setRowModesModel4({
        ...rowModesModel4,
        [id]: { mode: GridRowModes.Edit },
      });
    },
    handleEditClick5 = (id) => () => {
      setRowModesModel5({
        ...rowModesModel5,
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
    handleSaveClick4 = (id) => () => {
      setRowModesModel4({
        ...rowModesModel4,
        [id]: { mode: GridRowModes.View },
      });
    },
    handleSaveClick5 = (id) => () => {
      setRowModesModel5({
        ...rowModesModel5,
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
    handleDeleteClick4 = (id) => () => {
      setRows4(rows4.filter((row) => row.id !== id));
    },
    handleDeleteClick5 = (id) => () => {
      setRows5(rows5.filter((row) => row.id !== id));
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
    handleCancelClick4 = (id) => () => {
      setRowModesModel4({
        ...rowModesModel4,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      const editedRow = rows4.find((row) => row.id === id);
      if (editedRow.isNew) {
        setRows4(rows4.filter((row) => row.id !== id));
      }
    },
    handleCancelClick5 = (id) => () => {
      setRowModesModel5({
        ...rowModesModel5,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      const editedRow = rows5.find((row) => row.id === id);
      if (editedRow.isNew) {
        setRows5(rows5.filter((row) => row.id !== id));
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
    processRowUpdate4 = (newRow) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows4(rows4.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    },
    processRowUpdate5 = (newRow) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows5(rows5.map((row) => (row.id === newRow.id ? updatedRow : row)));
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
    handleRowModesModelChange4 = (newRowModesModel) => {
      setRowModesModel4(newRowModesModel);
    },
    handleRowModesModelChange5 = (newRowModesModel) => {
      setRowModesModel5(newRowModesModel);
    },
    [columnInfo, setColumnInfo] = useState("hover over a column to get help"),
    [purpose, setPurpose] = useState(""),
    getJsonFile = (fileName) => {
      fetch(fileName).then(function (response) {
        console.log(response);
        if (response.ok) {
          response.text().then(function (text) {
            console.log(`${text.length} characters read from file ${fileName}`);
            const obj = JSON.parse(text);
            setRows1(obj["outputs"].map((row) => ({ id: uuidv4(), ...row })));
            setRows2(obj["libname"].map((row) => ({ id: uuidv4(), ...row })));
            setRows3(obj["filename"].map((row) => ({ id: uuidv4(), ...row })));
            setRows4(obj["qc"].map((row) => ({ id: uuidv4(), ...row })));
            setRows5(obj["manage"].map((row) => ({ id: uuidv4(), ...row })));
            setPurpose(obj["purpose"]);
          });
        } else {
          console.log("HTTP-Error: " + response.status);
          setRows1([]);
        }
      });
    },
    saveToLsaf = () => {
      //TODO: save the data to LSAF
      const toSave = {
        purpose: purpose,
        outputs: rows1,
        libname: rows2,
        filename: rows3,
        qc: rows4,
        manage: rows5,
      };
      console.log("toSave", toSave);
    },
    isOverflown = (element) => {
      return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
      );
    },
    openPopper = (event) => {
      const ct = event.currentTarget,
        col = ct.getAttribute("data-field"),
        helpText = help[col] || "no help available for this column";
      setColumnInfo(helpText);
    },
    closePopper = (event) => {
      setColumnInfo("hover over a column to get help");
    },
    help = {
      libname: "Libname of source data, e.g. cro, sdtm, adam, rdata, crordata",
      filename: "The filename of the source data",
      path: "The path to the source data",
      type: "“Type” column is mandatory and must be filled for TLF outputs (only the first letter is required).",
      section:
        "“Section” column is optional, could be used to separate different types of outputs e.g. “ADaM” vs “Tables” vs “Listings” vs “Figures”, or “Safety” vs “Efficacy” vs “Demography” vs “Disposition” ",
      num: "“Num” column is optional for datasets and mandatory for TLF outputs, and should contain the output type followed by the output number, as they should appear in the output title. ",
      title:
        "“Title” column is mandatory for TLF outputs, and should contain the description to appear in the output title (after output type and number).  For datasets it is optional, can be left empty or set to the dataset label. ",
      population:
        "Population column is mandatory and must be filled for TLF outputs, should be left blank for datasets.",
      program:
        "“SAS Program” column is mandatory, it should contain the program name (the ‘.sas’ extension is optional).  The column could also be used to specify a non-SAS program (e.g. an R program with its extension .R or .Rmd can be specified here). ",
      dataset:
        "“Dataset” column is optional for TLF outputs and mandatory for datasets (should contain the output dataset name without libname)",
      parameters: "Parameters to be used in automation, e.g. for multi macro",
      assignedTo: "The user assigned to program the output",
      comments: "Comments about the output",
      Col_A: "Extra column A",
      Col_B: "Extra column B",
      qc_program: "name of program used for QC",
      qc: "?",
      qc_programmer: "Name of person doing QC",
      due_date: "Due date for QC to be completed",
      qc_status:
        "Status of QC: Not yet started, Not needed, In progress, Complete",
      qc_comments: "Comments about the QC that was done - key points",
      programmer: "Name of programmer assigned to this output number",
      priority: "Relative priority compared to other programming tasks",
      topline: "Part of topline results? Yes or No",
    },
    GridCellExpand = React.memo(function GridCellExpand(props) {
      const { width, value } = props;
      const wrapper = React.useRef(null);
      const cellDiv = React.useRef(null);
      const cellValue = React.useRef(null);
      const [anchorEl, setAnchorEl] = React.useState(null);
      const [showFullCell, setShowFullCell] = React.useState(false);
      const [showPopper, setShowPopper] = React.useState(false);

      const handleMouseEnter = () => {
        const isCurrentlyOverflown = isOverflown(cellValue.current);
        setShowPopper(isCurrentlyOverflown);
        setAnchorEl(cellDiv.current);
        setShowFullCell(true);
      };

      const handleMouseLeave = () => {
        setShowFullCell(false);
      };

      useEffect(() => {
        if (!showFullCell) {
          return undefined;
        }

        function handleKeyDown(nativeEvent) {
          if (nativeEvent.key === "Escape") {
            setShowFullCell(false);
          }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
          document.removeEventListener("keydown", handleKeyDown);
        };
      }, [setShowFullCell, showFullCell]);

      return (
        <Box
          ref={wrapper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            alignItems: "center",
            lineHeight: "24px",
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
          }}
        >
          <Box
            ref={cellDiv}
            sx={{
              height: "100%",
              width,
              display: "block",
              position: "absolute",
              top: 0,
            }}
          />
          <Box
            ref={cellValue}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </Box>
          {showPopper && (
            <Popper
              open={showFullCell && anchorEl !== null}
              anchorEl={anchorEl}
              style={{ width, marginLeft: -17 }}
            >
              <Paper
                elevation={1}
                style={{ minHeight: wrapper.current.offsetHeight - 3 }}
              >
                <Typography variant="body2" style={{ padding: 8 }}>
                  {value}
                </Typography>
              </Paper>
            </Popper>
          )}
        </Box>
      );
    });
  //   onDrop = (e) => {
  //     console.log("onDrop", e);
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       Papa.parse(reader.result, (err, data) => {
  //         console.log('data',data);
  //       });
  //     };
  //     reader.readAsBinaryString(e[0]);
  //   },
  //   { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
  //     // Disable click and keydown behavior
  //     noClick: true,
  //     noKeyboard: true,
  //     onDrop: onDrop,
  //   });
  // useEffect(() => {
  //   console.log("acceptedFiles", acceptedFiles);
  // }, [acceptedFiles]);

  useEffect(() => {
    setFontSize(Number(localStorage.getItem("fontSize")) || 10);
  }, []);

  return (
    <Box
      sx={{
        height: window.innerHeight - adjustment,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <AppBar position="fixed">
        <Toolbar variant="dense" sx={{ backgroundColor: "#cccccc" }}>
          <Box
            sx={{
              backgroundColor: "#eeeeee",
              color: "green",
              fontWeight: "bold",
              boxShadow: 3,
              fontSize: fontSize + 2,
              mr: 2,
            }}
          >
            &nbsp;&nbsp;LOT Editor&nbsp;&nbsp;
          </Box>
          <Autocomplete
            options={reportingEvents}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{
              m: 0.5,
              mt: 1,
              width: 300,
              backgroundColor: "##f0f0f0",
              fontSize: fontSize + 2,
            }}
            renderInput={(params) => (
              <TextField {...params} label="Reporting Event" />
            )}
            onChange={(event, reason) => {
              console.log("event", event, "reason", reason);
              if (reason === null) return;
              const jsonFile = reason.id + ".json",
                localUrl = `./${jsonFile}`;
              if (mode === "remote") {
                getJsonFile(localUrl);
              } else {
                console.log(`using local_test.json`);
                const obj = local_test;
                setRows1(
                  obj["outputs"].map((row) => ({ id: uuidv4(), ...row }))
                );
                setRows2(
                  obj["libname"].map((row) => ({ id: uuidv4(), ...row }))
                );
                setRows3(
                  obj["filename"].map((row) => ({
                    id: uuidv4(),
                    ...row,
                  }))
                );
                setRows4(obj["qc"].map((row) => ({ id: uuidv4(), ...row })));
                setRows5(
                  obj["manage"].map((row) => ({ id: uuidv4(), ...row }))
                );
                setPurpose(obj["purpose"]);
              }
            }}
          />
          <TextField
            sx={{
              m: 0.5,
              mt: 1,
              width: 600,
              flexGrow: 1,
              backgroundColor: "#f0f0f0",
              fontSize: fontSize + 2,
            }}
            label="Purpose (A1 cell)"
            variant="outlined"
            value={purpose}
            onChange={(event) => {
              setPurpose(event.target.value);
            }}
          />
          {/* <Autocomplete
            options={CROs}
            sx={{ m: 0.5, width: 300, backgroundColor: "#ffffe6" }}
            renderInput={(params) => <TextField {...params} label="CRO" />}
          /> */}
          <Box sx={{ flexGrow: 1 }}> </Box>
          <Tooltip title="Smaller font">
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                setFontSize(fontSize - 1);
                localStorage.setItem("fontSize", fontSize - 1);
              }}
            >
              <Remove />
            </IconButton>
          </Tooltip>
          &nbsp;{fontSize}&nbsp;
          <Tooltip title="Larger font">
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                setFontSize(fontSize + 1);
                localStorage.setItem("fontSize", fontSize + 1);
              }}
            >
              <Add />
            </IconButton>
          </Tooltip>
          {/* <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here</p>
            <button type="button" onClick={open}>
              Open File Dialog
            </button>
          </div>
          <Tooltip title="Load a CSV">
            <IconButton
              sx={{ color: "blue" }}
              size="large"
              edge="end"
              onClick={() => {
                setRows1(lot.map((row) => ({ id: uuidv4(), ...row })));
              }}
            >
              <FileDownload />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Save changes to LSAF">
            <IconButton
              color="info"
              size="large"
              edge="end"
              onClick={() => {
                saveToLsaf();
              }}
            >
              <Save />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save to a new Reporting Event on LSAF">
            <IconButton
              color="info"
              size="large"
              edge="end"
              onClick={() => {
                setOpenInfo(true);
              }}
            >
              <FolderCopy />
            </IconButton>
          </Tooltip>
          <Tooltip title="Information about this screen">
            <IconButton
              color="info"
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
      <Tabs
        value={tabValue}
        onChange={(event, newValue) => {
          setTabValue(newValue);
        }}
        variant="scrollable"
        scrollButtons="auto"
        textColor="secondary"
        sx={{ mt: 8 }}
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
        <Tab label="QC" id={"tab3"} sx={{ fontSize: 12 }} />
        <Tab label="Manage" id={"tab4"} sx={{ fontSize: 12 }} />
      </Tabs>
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
          componentProps
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows1, setRowModesModel1 },
            cell: {
              onMouseEnter: openPopper,
              onMouseLeave: closePopper,
            },
          }}
          onCellEditStart={(params) => {
            console.log("cell", params);
          }}
          onRowEditStart={(params) => {
            console.log("row", params);
          }}
          getRowHeight={() => "auto"}
          pageSizeOptions={[25, 100, 1000]}
          pagination
          sx={{
            width: window.innerWidth,
            height: window.innerHeight - adjustment,
            fontWeight: `fontSize=5`,
            fontSize: { fontSize },
            padding: 1,
            "& .MuiDataGrid-cell:hover": {
              backgroundColor: "#e6fff2",
            },
            "& .Mui-focused": {
              backgroundColor: "#e6fff2",
            },
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
            cell: {
              onMouseEnter: openPopper,
              onMouseLeave: closePopper,
            },
          }}
          getRowHeight={() => "auto"}
          sx={{
            width: window.innerWidth,
            height: window.innerHeight - adjustment,
            fontWeight: `fontSize=5`,
            fontSize: { fontSize },
            padding: 1,
            "& .MuiDataGrid-cell:hover": {
              backgroundColor: "#e6fff2",
            },
            "& .Mui-focused": {
              backgroundColor: "#e6fff2",
            },
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
            cell: {
              onMouseEnter: openPopper,
              onMouseLeave: closePopper,
            },
          }}
          getRowHeight={() => "auto"}
          sx={{
            width: window.innerWidth,
            height: window.innerHeight - adjustment,
            fontWeight: `fontSize=5`,
            fontSize: { fontSize },
            padding: 1,
            "& .MuiDataGrid-cell:hover": {
              backgroundColor: "#e6fff2",
            },
            "& .Mui-focused": {
              backgroundColor: "#e6fff2",
            },
          }}
        />
      )}
      {rows4 && cols4 && tabValue === 3 && (
        <DataGridPro
          rows={rows4}
          columns={cols4}
          density={"compact"}
          editMode="row"
          rowModesModel={rowModesModel4}
          onRowModesModelChange={handleRowModesModelChange4}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate4}
          componentProps
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows4, setRowModesModel4 },
            cell: {
              onMouseEnter: openPopper,
              onMouseLeave: closePopper,
            },
          }}
          onCellEditStart={(params) => {
            console.log("cell", params);
          }}
          onRowEditStart={(params) => {
            console.log("row", params);
          }}
          getRowHeight={() => "auto"}
          sx={{
            width: window.innerWidth,
            height: window.innerHeight - adjustment,
            fontWeight: `fontSize=5`,
            fontSize: { fontSize },
            padding: 1,
            "& .MuiDataGrid-cell:hover": {
              backgroundColor: "#e6fff2",
            },
            "& .Mui-focused": {
              backgroundColor: "#e6fff2",
            },
          }}
        />
      )}{" "}
      {rows5 && cols5 && tabValue === 4 && (
        <DataGridPro
          rows={rows5}
          columns={cols5}
          density={"compact"}
          editMode="row"
          rowModesModel={rowModesModel5}
          onRowModesModelChange={handleRowModesModelChange5}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate5}
          componentProps
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows5, setRowModesModel5 },
            cell: {
              onMouseEnter: openPopper,
              onMouseLeave: closePopper,
            },
          }}
          onCellEditStart={(params) => {
            console.log("cell", params);
          }}
          onRowEditStart={(params) => {
            console.log("row", params);
          }}
          getRowHeight={() => "auto"}
          sx={{
            width: window.innerWidth,
            height: window.innerHeight - adjustment,
            fontWeight: `fontSize=5`,
            fontSize: { fontSize },
            padding: 1,
            "& .MuiDataGrid-cell:hover": {
              backgroundColor: "#e6fff2",
            },
            "& .Mui-focused": {
              backgroundColor: "#e6fff2",
            },
          }}
        />
      )}
      <Box sx={{ color: "blue", flexGrow: 0.5 }}>{columnInfo}</Box>
      <InfoDialog openInfo={openInfo} setOpenInfo={setOpenInfo} href={href} />
    </Box>
  );
}
export default App;
