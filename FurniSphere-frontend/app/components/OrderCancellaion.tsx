import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cancelOrder } from '../services/orderServices';

interface Order {
  id: number;
  status: string;
  total_amount: number | string;
  created_at: string;
}

interface OrderCancellationProps {
  order: Order;
  onOrderCancelled: () => void;
}

export default function OrderCancellation({ order, onOrderCancelled }: OrderCancellationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setIsLoading(true);
    try {
      await cancelOrder(order.id);
      toast.success('Order cancelled successfully');
      onOrderCancelled();
    } catch (error) {
      toast.error('Failed to cancel order. Please try again.');
      console.error('Error cancelling order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isCancellable = ['pending', 'processing'].includes(order.status.toLowerCase());

  const formatAmount = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(numAmount) ? 'N/A' : numAmount.toFixed(2);
  };

  return (
    <div className="mt-4">
      <ToastContainer />
      <h3 className="text-lg font-semibold mb-2">Order #{order.id}</h3>
      <p className="mb-2">Status: <span className="font-medium">{order.status}</span></p>
      <p className="mb-2">Total: <span className="font-medium">${formatAmount(order.total_amount)}</span></p>
      <p className="mb-4">Date: <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span></p>
      {isCancellable ? (
        <button
          onClick={handleCancelOrder}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cancelling...
            </span>
          ) : (
            'Cancel Order'
          )}
        </button>
      ) : (
        <p className="text-gray-600 italic">This order cannot be cancelled.</p>
      )}
    </div>
  );
}