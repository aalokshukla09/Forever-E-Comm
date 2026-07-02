import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

// Maps order status -> dot color + text color, so the badge always matches the state
const statusStyles = {
  'Order Placed': { dot: 'bg-blue-500', text: 'text-blue-600' },
  'Packing': { dot: 'bg-amber-500', text: 'text-amber-600' },
  'Shipped': { dot: 'bg-purple-500', text: 'text-purple-600' },
  'Out for delivery': { dot: 'bg-orange-500', text: 'text-orange-600' },
  'Delivered': { dot: 'bg-green-500', text: 'text-green-600' },
};

const getStatusStyle = (status) => statusStyles[status] || { dot: 'bg-gray-400', text: 'text-gray-600' };

const OrderSkeleton = () => (
  <div className="py-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-pulse">
    <div className="flex items-start gap-6">
      <div className="w-20 h-24 bg-gray-200 rounded-sm" />
      <div className="space-y-2 pt-1">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-56 bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="h-8 w-28 bg-gray-200 rounded-sm md:mr-4" />
  </div>
);

const Orders = () => {
  const { BackendUrl, token, currency } = useContext(ShopContext);
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      if (!token) {
        setIsLoading(false);
        return null;
      }
      setIsLoading(true);
      const response = await axios.post(
        BackendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        let allOrderItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrderItems.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
            });
          });
        });
        setOrderData(allOrderItems.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16 pb-24 min-h-[60vh]">
      <div className="text-2xl">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div>
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && orderData.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
          <p className="text-lg text-gray-700 font-medium">You haven't placed any orders yet</p>
          <p className="text-sm text-gray-400">When you do, they'll show up here so you can track them.</p>
        </div>
      )}

      {/* Orders list */}
      {!isLoading && orderData.length > 0 && (
        <div>
          {orderData.map((item, index) => {
            const { dot, text } = getStatusStyle(item.status);
            return (
              <div
                key={index}
                className="py-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <div className="flex items-start gap-6 text-sm">
                  <img
                    className="w-20 h-24 object-cover rounded-sm bg-gray-100 shrink-0"
                    src={item.images[0]}
                    alt={item.name}
                  />
                  <div className="flex flex-col gap-1.5">
                    <p className="text-base font-medium text-gray-800">{item.name}</p>
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-gray-600">
                      <span>{currency}{item.price}</span>
                      <span className="text-gray-300">|</span>
                      <span>Quantity: {item.quantity}</span>
                      <span className="text-gray-300">|</span>
                      <span>Size: {item.size}</span>
                    </div>
                    <p className="text-gray-500">
                      Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span>
                    </p>
                    <p className="text-gray-500">
                      Payment: <span className="text-gray-400">{item.paymentMethod}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-26 md:pl-0 md:flex-1 md:justify-center">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  <span className={`text-sm font-medium ${text}`}>{item.status}</span>
                </div>

                <div className="pl-26 md:pl-0 md:flex-1 flex md:justify-end">
                  <button
                    onClick={() =>
                      navigate(`/orders/${item.orderId}/${item._id}`, { state: { item } })
                    }
                    className="border border-gray-300 px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;