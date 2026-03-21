import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReactComponent as Tick } from '../assets/icons/tick.svg';


function OrderConfirmationPage() {
  const orders = useSelector(state => state.orders.orders);
  const latestOrder = orders[0]; // Most recent order

  if (!latestOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] px-4 pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-serif italic mb-6">No order found</h2>
          <Link
            to="/homepage"
            className="inline-block bg-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Calculate estimated delivery (e.g., 3-5 days from now)
  const orderDate = new Date(latestOrder.created_at);
  const deliveryStart = new Date(orderDate);
  deliveryStart.setDate(orderDate.getDate() + 3);
  const deliveryEnd = new Date(orderDate);
  deliveryEnd.setDate(orderDate.getDate() + 5);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-24 pb-20 px-4">
      <div className="max-w-xl mx-auto">
        {/* Success Header */}
        <div className="bg-green-50 text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <Tick className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-5xl md:text-6xl font-serif italic mb-4 text-green-800">Success!</h1>
          <p className="text-gray-500 text-sm tracking-wide uppercase">
            Order #{latestOrder.id.toString().slice(-8).toUpperCase()} has been placed successfully
          </p>
        </div>

        {/* Expected Delivery Section */}
        <div className="bg-white border border-zinc-100 p-8 rounded-sm mb-8 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="var(--mint-green)"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6,22H18a3,3,0,0,0,3-3V7a2,2,0,0,0-2-2H17V3a1,1,0,0,0-2,0V5H9V3A1,1,0,0,0,7,3V5H5A2,2,0,0,0,3,7V19A3,3,0,0,0,6,22ZM5,12.5a.5.5,0,0,1,.5-.5h13a.5.5,0,0,1,.5.5V19a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1Z" />
            </svg>
            <p className="text-sm uppercase tracking-widest text-zinc-400">Arrives between</p>
          </div>
          <p className="text-2xl font-serif italic text-emerald-800">
            {formatDate(deliveryStart)} — {formatDate(deliveryEnd)}
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="bg-white border border-zinc-100 p-8 rounded-sm mb-8 shadow-sm">
          <h2 className="text-lg font-bold mb-8 border-b border-zinc-50 pb-4">Order Summary</h2>

          <div className="space-y-8 mb-10">
            {(latestOrder.order_items || []).map(item => (
              <div key={item.id || item.product_id} className="flex gap-6">
                <div className="w-20 h-24 bg-zinc-50 rounded-sm overflow-hidden flex-shrink-0">
                  {item.image && item.image.startsWith('http') ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-100 h-100 object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">
                      {item.image}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-[10px] uppercase tracking-tighter text-gray-700 font-semibold mb-1">
                    {item.category || 'Luxury Collection'}
                  </p>
                  <h3 className="text-sm font-medium text-zinc-800 mb-1">{item.title}</h3>
                  <p className="text-[11px] text-zinc-400">Qty: {item.quantity}</p>
                </div>
                <div className="flex flex-col justify-center items-end text-sm font-semibold text-zinc-900">
                  ${Number(item.unit_price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-zinc-100 pt-6 space-y-3">
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Subtotal</span>
              <span>${Number(latestOrder.total_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Shipping</span>
              <span className="uppercase text-[10px] tracking-widest text-emerald-700 font-semibold tracking-wide">Complimentary</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-zinc-900 pt-2">
              <span>Total</span>
              <span>${Number(latestOrder.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-zinc-100 p-6 rounded-sm shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-4 h-4 text-emerald-700"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16,6v9a2,2,0,0,0-2,2H10a2,2,0,0,0-4,0H4a1,1,0,0,1-1-1V6A1,1,0,0,1,4,5H15A1,1,0,0,1,16,6Z" fill="var(--mint-green)" opacity="0.2" />
                <path d="M16,15V6a1,1,0,0,0-1-1H4A1,1,0,0,0,3,6V16a1,1,0,0,0,1,1H6" stroke="var(--mint-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18,17h2a1,1,0,0,0,1-1V12L19.28,8.55a1,1,0,0,0-.9-.55H16" stroke="var(--mint-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14,17H10M8,15a2,2,0,1,0,2,2A2,2,0,0,0,8,15Zm10,2a2,2,0,1,1-2-2A2,2,0,0,1,18,17Z" stroke="var(--mint-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="text-xs uppercase tracking-widest text-black font-bold">Shipping Address</h3>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed font-medium">
              {latestOrder.shipping_address?.fullName}<br />
              {latestOrder.shipping_address?.address}<br />
              {latestOrder.shipping_address?.city}, {latestOrder.shipping_address?.state} - {latestOrder.shipping_address?.pincode}
            </p>
          </div>
          <div className="bg-white border border-zinc-100 p-6 rounded-sm shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-4 h-4"
                viewBox="0 0 30 30"
                fill="var(--mint-green)"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M26,5H4C3.4,5,3,5.4,3,6v12c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1V6C27,5.4,26.6,5,26,5z M5.5,14  c-0.2,0-0.4,0-0.5,0.1V9.9C5.1,10,5.3,10,5.5,10C6.9,10,8,8.9,8,7.5C8,7.3,8,7.1,7.9,7h14.1C22,7.1,22,7.3,22,7.5  c0,1.4,1.1,2.5,2.5,2.5c0.2,0,0.4,0,0.5-0.1v4.1c-0.1,0-0.3-0.1-0.5-0.1c-1.4,0-2.5,1.1-2.5,2.5c0,0.2,0,0.4,0.1,0.5H7.9  C8,16.9,8,16.7,8,16.5C8,15.1,6.9,14,5.5,14z M12,12c0-1.7,1.3-3,3-3s3,1.3,3,3s-1.3,3-3,3S12,13.7,12,12z M5,22v-1h20v1  c0,0.6-0.4,1-1,1H6C5.4,23,5,22.6,5,22z M7.4,26v-1h15v1c0,0.6-0.4,1-1,1h-13C7.8,27,7.4,26.6,7.4,26z" />
              </svg>
              <h3 className="text-xs uppercase tracking-widest text-black font-bold">Delivery Method</h3>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed font-medium capitalize">
              {latestOrder.shipping_method?.name || 'Standard Shipping'}<br />
              <span className="text-xs text-zinc-400 font-normal">
                {latestOrder.shipping_method?.time || 'Delivered in 3-5 business days'}
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 text-center">
          <Link
            to="/homepage"
            className="block w-full bg-black text-white py-4 rounded-sm text-sm font-semibold uppercase tracking-widest hover:bg-zinc-800 transition-all duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="inline-block text-zinc-400 text-sm font-bold uppercase tracking-widest hover:text-black transition-colors py-2 border-b border-zinc-200"
          >
            View Order Status
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
