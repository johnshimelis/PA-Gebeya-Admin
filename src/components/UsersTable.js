import React, { useState, useEffect } from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Pagination,
  Button,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon } from "../icons"; // Ensure these icons exist
import response from "../utils/demo/usersData"; // Your data source

const UsersTable = ({ resultsPerPage }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [deactivatedUsers, setDeactivatedUsers] = useState({});

  // Pagination setup
  const totalResults = response.length;

  // Pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // Toggle user activation for each row separately
  const toggleDeactivate = (id) => {
    const confirmDeactivate = window.confirm(
      `Are you sure you want to ${deactivatedUsers[id] ? "activate" : "deactivate"} this user?`
    );
    if (confirmDeactivate) {
      setDeactivatedUsers((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  // Delete user confirmation
  const handleDelete = (id, name) => {
    console.log("Attempting to delete user:", id, name); // Debugging line

    if (!id) {
      console.error("User ID is undefined, cannot delete!");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name} with ID ${id}?`
    );
    if (confirmDelete) {
      const updatedData = data.filter((user) => user.id !== id);
      setData(updatedData);

      // Adjust page if the last item on the current page is deleted
      const lastPage = Math.ceil(updatedData.length / resultsPerPage);
      if (page > lastPage) {
        setPage(lastPage);
      }
    }
  };

  // Load paginated data
  useEffect(() => {
    console.log("Response Data:", response); // Log the raw response data
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page, resultsPerPage]);

  return (
    <div>
      {/* Table */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Index</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Joined on</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Deactivate</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, index) => {
              console.log("User object:", user); // Log the full user object here
              return (
                <TableRow key={user.id}> {/* Ensure user.id is unique */}
                  <TableCell>
                    <span className="text-sm">
                      {(page - 1) * resultsPerPage + index + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Avatar
                        className="hidden mr-3 md:block"
                        src={user.avatar}
                        alt="User image"
                      />
                      <div>
                        <p className="font-semibold">{user.first_name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.last_name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(user.joined_on).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button layout="link" size="small">
                      <EditIcon className="w-4 h-4 text-blue-500" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      layout="link"
                      size="small"
                      onClick={() => handleDelete(user.id, user.first_name)} // Ensure ID is passed here
                    >
                      <TrashIcon className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleDeactivate(user.id)}
                      className={`relative w-8 h-4 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                        deactivatedUsers[user.id] ? "bg-red-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          deactivatedUsers[user.id] ? "translate-x-4" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default UsersTable;
