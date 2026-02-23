import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function OrderConfirmationPage() {
  const orders = useSelector(state => state.orders.orders);
  const latestOrder = orders[0]; // Most recent order

  if (!latestOrder) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No order found</h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-green-700">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono font-semibold">{latestOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-semibold">
                {new Date(latestOrder.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-lg">
                ${Number(latestOrder.total_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {latestOrder.status}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-700">
              {latestOrder.shipping_address?.fullName}<br />
              {latestOrder.shipping_address?.address}<br />
              {latestOrder.shipping_address?.city}, {latestOrder.shipping_address?.state} - {latestOrder.shipping_address?.pincode}<br />
              Phone: {latestOrder.shipping_address?.phone}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {(latestOrder.order_items || []).map(item => {
              const itemTotal = item.unit_price * item.quantity;
              return (
                <div key={item.id || item.product_id} className="flex items-center gap-4 border-b pb-3">
                  {item.image && item.image.startsWith('http') ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <div className="text-3xl">{item.image}</div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-xs text-gray-400">${Number(item.unit_price).toFixed(2)} each</p>
                  </div>
                  <div className="font-bold">
                    ${itemTotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to="/"
            className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="flex-1 border-2 border-black text-black py-3 rounded-lg hover:bg-gray-100 transition font-semibold text-center"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;