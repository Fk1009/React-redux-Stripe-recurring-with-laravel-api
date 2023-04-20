import NavBar from "../layouts/NavBar";
import MUIDataTable from "mui-datatables";
import React, { useState, useEffect,Fragment} from "react";
import { useSelector, useDispatch } from "react-redux";
import { userListSelector } from "../../features/slice/UserListSlice";
import { fetchUserBytoken } from "../../features/slice/UserSlice";
import { fetchUserList } from "../../features/slice/UserListSlice";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";

const Users = () => {
  const token = localStorage.getItem("token");
  const { isFetching } = useSelector(userListSelector);
  const userList = useSelector(userListSelector);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [selectedRowData, setSelectedRowData] = useState({});
  const [deleteModalOpen, setdeleteModalOpen] = useState(false);

  const handleEditModalOpen = (rowData) => {
    setSelectedRowData(rowData);
    setName(rowData[1]);
    setEmail(rowData[2]);
    setOpen(true);
  };

  const handleEditModalClose = () => {
    setOpen(false);
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    console.log(email, name);
  };

  const handleDeleteClick = () => {
    setdeleteModalOpen(true);
  };

  const handleDeleteModalClose = (confirmed) => {
    if (confirmed) {
      console.log("yes i am in");
    }
    setdeleteModalOpen(false);
  };

  useEffect(() => {
    if (token != null) {
      dispatch(fetchUserBytoken({ token: token }));
    }
  }, []);

  useEffect(() => {
    if (token != null) {
      dispatch(fetchUserList({ token: token }));
    }
  }, []);

  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "name",
      label: "name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "email",
      label: "email",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "pm_type",
      label: "pm_type",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <EditIcon
                variant="outlined"
                onClick={() => {
                  // console.log(tableMeta.rowData);
                  handleEditModalOpen(tableMeta.rowData);
                }}
              >
                Edit
              </EditIcon>
              <DeleteIcon
                onClick={() => {
                  console.log(tableMeta.rowData);
                  handleDeleteClick(tableMeta.rowData);
                }}
              ></DeleteIcon>
            </div>
          );
        },
      },
    },
  ];
  const options = {
    filterType: "dropdown",
    downloadOptions: { filename: "users.csv", separator: "," },
    searchPlaceholder: "users",
    rowsPerPageOptions: [2, 5, 10],
    sortOrder: { name: "id", direction: "asc" },
  };

  return (
    <div>
      <NavBar />
      {isFetching ? (
        <div className="loading">
          <div className="loader"></div>
        </div>
      ) : (
        <Fragment>
          <MUIDataTable
            title={"Users List"}
            data={userList.data}
            columns={columns}
            options={options}
          />

          <Dialog open={open} onClose={handleEditModalClose}>
            <DialogTitle>Edit User</DialogTitle>
            <form onSubmit={handleEditFormSubmit}>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  name="name"
                  label="Name"
                  type="text"
                  value={name}
                  fullWidth
                  variant="standard"
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  fullWidth
                  variant="standard"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditModalClose}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogActions>
            </form>
          </Dialog>

          <Dialog
            open={deleteModalOpen}
            onClose={() => handleDeleteModalClose(false)}
          >
            <DialogTitle>Delete item?</DialogTitle>
            <DialogContent>Do you want to delete?</DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleDeleteModalClose(true)}
                color="primary"
              >
                Yes
              </Button>
              <Button
                onClick={() => handleDeleteModalClose(false)}
                color="primary"
                autoFocus
              >
                No
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </div>
  );
};

export default Users;
