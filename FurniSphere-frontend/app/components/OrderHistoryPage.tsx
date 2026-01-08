"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getOrderHistory, cancelOrder } from "../services/orderServices";
import { Order } from "@/types/order";
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Clock, 
  ShoppingCart, 
  XCircle, 
  CheckCircle, 
  Loader,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, orderId }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">Confirm Cancellation</h3>
        <p className="mb-6">Are you sure you want to cancel Order #{orderId}?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
          >
            No, Keep Order
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
          >
            Yes, Cancel Order
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const OrderCard = ({ order, onCancelOrder }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-green-100 text-green-800",
    delivered: "bg-purple-100 text-purple-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    pending: <Clock className="mr-2" size={16} />,
    processing: <Loader className="mr-2 animate-spin" size={16} />,
    shipped: <Package className="mr-2" size={16} />,
    delivered: <CheckCircle className="mr-2" size={16} />,
    cancelled: <XCircle className="mr-2" size={16} />,
  };

  return (
    <motion.div
      layout
      className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-colors duration-300"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Order #{order.id}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${statusColors[order.status.toLowerCase()]}`}>
            {statusIcons[order.status.toLowerCase()]}
            {order.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-500" size={20} />
            <span className="text-sm text-gray-600">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-2 text-gray-500" size={20} />
            <span className="text-sm font-semibold">
              ${Number(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="border-t pt-4 mt-4">
                <h4 className="text-lg font-semibold mb-2 flex items-center">
                  <ShoppingCart className="mr-2 text-gray-500" size={20} />
                  Items:
                </h4>
                <ul className="space-y-2">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span className="text-gray-600">{item.quantity} x {item.product.name}</span>
                      <span className="font-semibold">${Number(item.price).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:text-primary transition duration-200 flex items-center"
        >
          {isExpanded ? <ChevronUp className="mr-1" size={20} /> : <ChevronDown className="mr-1" size={20} />}
          {isExpanded ? "Hide Details" : "Show Details"}
        </button>
        {['pending', 'processing'].includes(order.status.toLowerCase()) && (
          <button
            onClick={() => onCancelOrder(order.id)}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
            data-tooltip-id="cancel-tooltip"
            data-tooltip-content="Cancel this order"
          >
            <XCircle className="mr-2" size={20} />
            Cancel Order
          </button>
        )}
      </div>
      <Tooltip id="cancel-tooltip" />
    </motion.div>
  );
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmCancel, setConfirmCancel] = useState<{ isOpen: boolean; orderId: number | null }>({
    isOpen: false,
    orderId: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchOrders = async () => {
    try {
      const orderData = await getOrderHistory();
      setOrders(orderData.orders);
    } catch (error) {
      console.error("Failed to load order history:", error);
      toast.error("Failed to load order history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = (orderId: number) => {
    setConfirmCancel({ isOpen: true, orderId });
  };

  const confirmCancelOrder = async () => {
    if (confirmCancel.orderId) {
      try {
        await cancelOrder(confirmCancel.orderId);
        toast.success("Order cancelled successfully");
        fetchOrders(); // Refresh the order list
      } catch (error) {
        console.error("Failed to cancel order:", error);
        toast.error("Failed to cancel order. Please try again.");
      } finally {
        setConfirmCancel({ isOpen: false, orderId: null });
      }
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    return orders
      .filter((order) => 
        (statusFilter === "all" || order.status.toLowerCase() === statusFilter) &&
        (order.id.toString().includes(searchTerm) || 
         order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.order_items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase())))
      )
      .sort((a, b) => {
        if (sortBy === "date") {
          return sortOrder === "asc" 
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortBy === "total") {
          return sortOrder === "asc"
            ? a.total_amount - b.total_amount
            : b.total_amount - a.total_amount;
        }
        return 0;
      });
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader className="animate-spin text-primary mb-4" size={48} />
        <p className="text-xl font-semibold text-gray-700">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Package className="text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h2>
        <p className="text-gray-600">Looks like you haven't placed any orders.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <ToastContainer />
      <ConfirmModal
        isOpen={confirmCancel.isOpen}
        onClose={() => setConfirmCancel({ isOpen: false, orderId: null })}
        onConfirm={confirmCancelOrder}
        orderId={confirmCancel.orderId}
      />
      <h2 className="text-3xl font-bold mb-8 text-center">Your Order History</h2>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto pl-4 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="relative w-full md:w-auto">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="w-full md:w-auto pl-4 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="total-desc">Highest Total</option>
              <option value="total-asc">Lowest Total</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredAndSortedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancelOrder={handleCancelOrder}
            />
          ))}
        </AnimatePresence>
      </div>
      {filteredAndSortedOrders.length === 0 && (
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
          <p className="text-xl font-semibold text-gray-700">No orders found</p>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;