"use client";

import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../services/orderServices";
import {
  Loader2,
  Edit,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  HourglassIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

interface Order {
  id: number;
  user_id: number;
  total_amount: number | string;
  status: string;
  address_line: string;
  city: string;
  comment: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "canceled",
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <HourglassIcon className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "canceled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders(currentPage);
        if (data && data.orders && Array.isArray(data.orders.data)) {
          setOrders(data.orders.data);
          setTotalPages(data.orders.last_page);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdateClick = (order: Order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setIsModalOpen(true);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus(selectedOrder.id, status);
      const data = await getAllOrders(currentPage);
      setOrders(data.orders.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatTotalAmount = (amount: number | string): string => {
    if (typeof amount === "number") {
      return amount.toFixed(2);
    } else if (typeof amount === "string") {
      const parsedAmount = parseFloat(amount);
      return isNaN(parsedAmount) ? amount : parsedAmount.toFixed(2);
    }
    return "N/A";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Order Management
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${formatTotalAmount(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                          {order.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.address_line}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.comment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleUpdateClick(order)}
                        className="text-primary hover:text-blue-900 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No orders available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Modal for Updating Order */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                isModalOpen ? "animate-modal-enter" : "animate-modal-leave"
              }`}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Update Order Status
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to update the status of order #
                        {selectedOrder?.id}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Select a new status:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {statuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        className={`flex items-center p-2 rounded-md transition-colors duration-200 ease-in-out ${
                          status === s
                            ? "bg-blue-100 text-blue-800"
                            : "hover:bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getStatusIcon(s)}
                        <span
                          className={`ml-2 text-sm ${
                            s === "canceled" ? "text-red-500" : ""
                          }`}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-150 ease-in-out transform hover:scale-105"
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Updating...
                    </>
                  ) : (
                    <>
                      {getStatusIcon(status)}
                      <span className="ml-2">Update Status</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-150 ease-in-out transform hover:scale-105"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
