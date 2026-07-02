import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Order fulfillment sequence — used to figure out which steps are "done"
// vs. "upcoming" relative to the item's current status.
const TRACKING_STEPS = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'];

const OrderDetails = () => {
    const { orderId, itemId } = useParams();
    const location = useLocation();
    const { BackendUrl, token, currency } = useContext(ShopContext);

    const [item, setItem] = useState(location.state?.item || null);
    const [isLoading, setIsLoading] = useState(!location.state?.item);

    // Fallback fetch: if someone lands here directly (e.g. page refresh, shared
    // link) there's no location.state, so re-fetch orders and find the match.
    const findItem = async () => {
        try {
            if (!token) return;
            setIsLoading(true);
            const response = await axios.post(
                BackendUrl + '/api/order/userorders',
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                let found = null;
                response.data.orders.forEach((order) => {
                    if (order._id !== orderId) return;
                    order.items.forEach((orderItem) => {
                        if (orderItem._id === itemId) {
                            found = {
                                ...orderItem,
                                status: order.status,
                                payment: order.payment,
                                paymentMethod: order.paymentMethod,
                                date: order.date,
                                orderId: order._id,
                            };
                        }
                    });
                });
                if (found) {
                    setItem(found);
                } else {
                    toast.error("We couldn't find that order");
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!item) {
            findItem();
        }
    }, [token]);

    if (isLoading) {
        return (
            <div className="border-t pt-16 pb-24 min-h-[60vh]">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-24 w-24 bg-gray-200 rounded-sm" />
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="border-t pt-16 pb-24 min-h-[60vh] flex flex-col items-center justify-center text-center gap-3">
                <p className="text-lg text-gray-700 font-medium">We couldn't find this order</p>
                <Link to="/orders" className="text-sm underline text-gray-600">
                    Back to your orders
                </Link>
            </div>
        );
    }

    const currentStepIndex = Math.max(TRACKING_STEPS.indexOf(item.status), 0);

    return (
        <div className="border-t pt-16 pb-24 min-h-[60vh]">
            <Link to="/orders" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                &larr; Back to orders
            </Link>

            <div className="mt-6 flex flex-col md:flex-row gap-8">
                <img
                    className="w-32 h-40 object-cover rounded-sm bg-gray-100 shrink-0"
                    src={item.images[0]}
                    alt={item.name}
                />

                <div className="flex-1">
                    <p className="text-xl font-medium text-gray-800">{item.name}</p>
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-gray-600 text-sm">
                        <span>{currency}{item.price}</span>
                        <span className="text-gray-300">|</span>
                        <span>Quantity: {item.quantity}</span>
                        <span className="text-gray-300">|</span>
                        <span>Size: {item.size}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Payment: <span className="text-gray-400">{item.paymentMethod}</span>
                    </p>
                </div>
            </div>

            {/* Status timeline */}
            <div className="mt-12 max-w-2xl">
                <p className="text-base font-medium text-gray-800 mb-8">Tracking status</p>
                <div className="flex">
                    {TRACKING_STEPS.map((step, index) => {
                        const isDone = index <= currentStepIndex;
                        const isLast = index === TRACKING_STEPS.length - 1;
                        return (
                            <div key={step} className="flex-1 flex flex-col items-start relative">
                                <div className="flex items-center w-full">
                                    <div
                                        className={`h-3 w-3 rounded-full shrink-0 z-10 ${isDone ? 'bg-gray-800' : 'bg-gray-200'
                                            }`}
                                    />
                                    {!isLast && (
                                        <div
                                            className={`h-0.5 flex-1 ${index < currentStepIndex ? 'bg-gray-800' : 'bg-gray-200'
                                                }`}
                                        />
                                    )}
                                </div>
                                <p
                                    className={`mt-2 text-xs pr-2 ${isDone ? 'text-gray-800 font-medium' : 'text-gray-400'
                                        }`}
                                >
                                    {step}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;