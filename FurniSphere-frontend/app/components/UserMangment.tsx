"use client";

import React, { useEffect, useState } from "react";
import { fetchUsers, updateUser, deleteUser } from "../services/userServices";
import { User } from "@/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Search,
} from "lucide-react";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setEditUser(user);
  };

  const handleEditSave = async () => {
    if (editUser) {
      try {
        await updateUser(editUser.id, {
          name: editUser.name,
          email: editUser.email,
          role: editUser.role,
        });
        setUsers(
          users.map((user) => (user.id === editUser.id ? editUser : user))
        );
        setEditUser(null);
        toast.success("User updated successfully!");
      } catch (error) {
        toast.error("Failed to update user");
      }
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedUserId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUserId) {
      try {
        await deleteUser(selectedUserId);
        setUsers(users.filter((user) => user.id !== selectedUserId));
        setOpenDeleteDialog(false);
        toast.success("User deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-base-100">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-left mb-10 text-neutral">
          User Management
        </h1>
        <div className="bg-base-200 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 border-b border-base-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-neutral mr-2" />
                <span className="text-xl font-semibold text-neutral">
                  Users
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-base-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-base-200 text-neutral"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-base-300">
                <thead className="bg-base-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-neutral uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-base-200 divide-y divide-base-300">
                  {currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-base-300 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-neutral">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize text-neutral">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-primary hover:text-primary/80 mr-3 transition-colors duration-200"
                          aria-label={`Edit ${user.name}`}
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="text-error hover:text-error/80 transition-colors duration-200"
                          aria-label={`Delete ${user.name}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-base-300 px-6 py-4 flex items-center justify-between border-t border-base-300">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-base-300 text-sm font-medium rounded-md text-neutral bg-base-200 hover:bg-base-300 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastUser >= filteredUsers.length}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-base-300 text-sm font-medium rounded-md text-neutral bg-base-200 hover:bg-base-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredUsers.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-base-300 bg-base-200 text-sm font-medium text-neutral hover:bg-base-300 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({
                    length: Math.ceil(filteredUsers.length / usersPerPage),
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === index + 1
                          ? "z-10 bg-primary border-primary text-base-200"
                          : "bg-base-200 border-base-300 text-neutral hover:bg-base-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastUser >= filteredUsers.length}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-base-300 bg-base-200 text-sm font-medium text-neutral hover:bg-base-300 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-200 p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-neutral">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-base-200 text-neutral"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-base-200 text-neutral"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-neutral mb-1"
                >
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-base-200 text-neutral"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 bg-base-300 text-neutral rounded-md hover:bg-base-300/80 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-primary text-base-200 rounded-md hover:bg-primary/90 transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {openDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-200 p-8 rounded-lg w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-neutral">
              Confirm Delete
            </h2>
            <p className="mb-6 text-neutral">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseDeleteDialog}
                className="px-4 py-2 bg-base-300 text-neutral rounded-md hover:bg-base-300/80 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-error text-base-200 rounded-md hover:bg-error/90 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
