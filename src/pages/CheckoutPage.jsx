import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../redux/slices/authSlice';
import { placeOrder } from '../redux/slices/ordersSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToast } from '../components/Toast';
// Icons
import arrowLeft from '../assets/icons/arrowLeft.svg';

// Validation schema
const schema = yup.object({
  fullName: yup.string().required('Full name is required').min(2, 'Name too short'),
  email: yup.string().required('Email is required').email('Invalid email'),
  phone: yup.string().required('Phone is required').matches(/^[0-9\s-()+]{10,15}$/, 'Invalid phone number'),
  address: yup.string().required('Address is required').min(5, 'Address too short'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup.string().required('Pincode is required'),
}).required();

function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const cartItems = useSelector(state => state.cart.items);
  const totalAmount = useSelector(state => state.cart.totalAmount);
  const user = useSelector(state => state.auth.user);
  const profile = useSelector(state => state.auth.profile);
  const { loading } = useSelector(state => state.orders);

  const { register, handleSubmit, reset, trigger, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    }
  });

  // Pre-fill form when profile or user is loaded
  useEffect(() => {
    if (user || profile) {
      reset({
        fullName: profile?.full_name || user?.user_metadata?.name || '',
        email: profile?.email || user?.email || '',
        phone: profile?.phone_number || '',
        address: profile?.address || '',
        city: profile?.city || '',
        state: profile?.state || '',
        pincode: profile?.pincode || '',
      });
    }
  }, [user, profile, reset]);

  // Order Placement logic (Step 3 final CTA)
  const onFinalSubmit = async (data) => {
    if (!user) {
      addToast('Please login to place an order', 'error');
      navigate('/login');
      return;
    }

    try {
      await dispatch(placeOrder({
        userId: user.id,
        items: cartItems,
        shippingAddress: data,
        totalAmount: totalAmount + (shippingMethod === 'express' ? 25 : 0),
      })).unwrap();

      if (data.saveToProfile) {
        await dispatch(updateProfile({
          id: user.id,
          full_name: data.fullName,
          email: data.email,
          phone_number: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        })).unwrap();
      }

      dispatch(clearCart());
      addToast('Order placed successfully!', 'success');
      navigate('/order-confirmation');
    } catch (err) {
      addToast(err || 'Failed to place order. Please try again.', 'error');
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger();
      if (!isValid) return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] pt-[100px] pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-[1.75rem] mb-8 italic">Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="bg-black text-white w-full p-[18px] uppercase tracking-widest text-[13px] font-semibold mt-8 transition-all duration-300 hover:bg-[#333]" style={{ maxWidth: '250px' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = shippingMethod === 'express' ? 25 : 0;
  const finalTotal = totalAmount + shippingCost;

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-[100px] pb-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-[1fr_420px] gap-[60px] items-start max-[1100px]:grid-cols-1 max-[1100px]:gap-10">

          {/* ── Left Side: Steps ── */}
          <div className="co-main">

            {/* Stepper */}
            <div className="flex justify-between mb-12 relative px-2.5 before:content-[''] before:absolute before:top-[15px] before:left-0 before:right-0 before:h-[1px] before:bg-[#eee] before:z-0">
              <div className={`relative z-1 flex flex-col items-center gap-2 bg-[#fcfcfc] px-[15px] ${currentStep >= 1 ? 'active' : ''}`}>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[13px] font-medium transition-all duration-300 ${currentStep >= 1 ? 'bg-[var(--mint-green)] border-[var(--mint-green)] text-white' : 'bg-white border-[#ddd] text-gray-400'}`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className={`text-[11px] uppercase tracking-[0.1em] font-semibold ${currentStep >= 1 ? 'text-[#111]' : 'text-[#9ca3af]'}`}>Shipping</span>
              </div>
              <div className={`relative z-1 flex flex-col items-center gap-2 bg-[#fcfcfc] px-[15px] ${currentStep >= 2 ? 'active' : ''}`}>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[13px] font-medium transition-all duration-300 ${currentStep >= 2 ? 'bg-[var(--mint-green)] border-[var(--mint-green)] text-white' : 'bg-white border-[#ddd] text-gray-400'}`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className={`text-[11px] uppercase tracking-[0.1em] font-semibold ${currentStep >= 2 ? 'text-[#111]' : 'text-[#9ca3af]'}`}>Delivery</span>
              </div>
              <div className={`relative z-1 flex flex-col items-center gap-2 bg-[#fcfcfc] px-[15px] ${currentStep >= 3 ? 'active' : ''}`}>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[13px] font-medium transition-all duration-300 ${currentStep >= 3 ? 'bg-[var(--mint-green)] border-[var(--mint-green)] text-white' : 'bg-white border-[#ddd] text-gray-400'}`}>
                  3
                </div>
                <span className={`text-[11px] uppercase tracking-[0.1em] font-semibold ${currentStep >= 3 ? 'text-[#111]' : 'text-[#9ca3af]'}`}>Payment</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onFinalSubmit)}>

              {/* Step 1: Shipping Details */}
              {currentStep === 1 && (
                <div className="bg-white p-10 rounded-sm border border-[#f0f0f0] animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4 6V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V6H14V16H2V6H4ZM6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4V6H6V4ZM7 13V9H9V13H7Z"
                        fill="var(--mint-green)"
                      />
                    </svg>
                    <h2 className="font-serif text-[1.75rem] mb-0 italic">Shipping Details</h2>
                  </div>

                  <div className="mb-5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2">Full Name</label>
                    <input {...register('fullName')} className={`w-full py-3 border-0 border-b border-[#eee] text-[15px] transition-colors duration-300 bg-transparent outline-none focus:border-black ${errors.fullName ? 'border-b-[#ef4444]' : ''}`} placeholder="Enter your full name" />
                    {errors.fullName && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.fullName.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="mb-5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2">Email Address</label>
                      <input {...register('email')} className={`w-full py-3 border-0 border-b border-[#eee] text-[15px] transition-colors duration-300 bg-transparent outline-none focus:border-black ${errors.email ? 'border-b-[#ef4444]' : ''}`} placeholder="Email" />
                      {errors.email && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.email.message}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2">Phone Number</label>
                      <input {...register('phone')} className={`w-full py-3 border-0 border-b border-[#eee] text-[15px] transition-colors duration-300 bg-transparent outline-none focus:border-black ${errors.phone ? 'border-b-[#ef4444]' : ''}`} placeholder="Phone" />
                      {errors.phone && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2">Shipping Address</label>
                    <input {...register('address')} className={`w-full py-3 border-0 border-b border-[#eee] text-[15px] transition-colors duration-300 bg-transparent outline-none focus:border-black ${errors.address ? 'border-b-[#ef4444]' : ''}`} placeholder="Street, building, etc." />
                    {errors.address && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.address.message}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="mb-5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2">City</label>
                      <input {...register('city')} className={`w-full py-3 border-0 border-b border-[#eee] text-[15px] transition-colors duration-300 bg-transparent outline-none focus:border-black ${errors.city ? 'border-b-[#ef4444]' : ''}`} placeholder="City" />
                    </div>
                    <div className="mb-5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2">State</label>
                      <input {...register('state')} className={`w-full py-3 border-0 border-b border-[#eee] text-[15px] transition-colors duration-300 bg-transparent outline-none focus:border-black ${errors.state ? 'border-b-[#ef4444]' : ''}`} placeholder="State" />
                    </div>
                    <div className="mb-5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2">Pincode</label>
                      <input {...register('pincode')} className={`w-full py-3 border-0 border-b border-[#eee] text-[15px] transition-colors duration-300 bg-transparent outline-none focus:border-black ${errors.pincode ? 'border-b-[#ef4444]' : ''}`} placeholder="Zip" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <input type="checkbox" id="saveToProfile" {...register('saveToProfile')} className="accent-black w-4 h-4" />
                    <label htmlFor="saveToProfile" className="text-[12px] text-gray-500 cursor-pointer">Save details for next time</label>
                  </div>

                  <button type="button" onClick={nextStep} className="bg-black text-white w-full p-[18px] uppercase tracking-widest text-[13px] font-semibold mt-8 transition-all duration-300 hover:bg-[#333]">
                    Continue to Delivery
                  </button>
                </div>
              )}

              {/* Step 2: Delivery Method */}
              {currentStep === 2 && (
                <div className="bg-white p-10 rounded-sm border border-[#f0f0f0] animate-in slide-in-from-right-4 duration-500">
                  <h2 className="font-serif text-[1.75rem] mb-8 italic">Delivery Method</h2>

                  <div
                    className={`flex items-center gap-4 p-5 border rounded-sm mb-3 cursor-pointer transition-all duration-200 ${shippingMethod === 'standard' ? 'border-[#111] bg-[#f9f9f9]' : 'border-[#eee]'}`}
                    onClick={() => setShippingMethod('standard')}
                  >
                    <div className="w-[18px] h-[18px] border border-[#ddd] rounded-full flex items-center justify-center relative">
                      {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <span className="block text-[14px] font-bold">Standard Delivery</span>
                      <span className="text-[12px] text-[#9ca3af]">3-5 business days</span>
                    </div>
                    <span className="text-[14px] font-bold">Free</span>
                  </div>

                  <div
                    className={`flex items-center gap-4 p-5 border rounded-sm mb-3 cursor-pointer transition-all duration-200 ${shippingMethod === 'express' ? 'border-[#111] bg-[#f9f9f9]' : 'border-[#eee]'}`}
                    onClick={() => setShippingMethod('express')}
                  >
                    <div className="w-[18px] h-[18px] border border-[#ddd] rounded-full flex items-center justify-center relative">
                      {shippingMethod === 'express' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <span className="block text-[14px] font-bold">Express Shipping</span>
                      <span className="text-[12px] text-[#9ca3af]">1-2 business days</span>
                    </div>
                    <span className="text-[14px] font-bold">$25.00</span>
                  </div>

                  <div className="flex flex-col gap-2 mt-8">
                    <button type="button" onClick={nextStep} className="bg-black text-white w-full p-[18px] uppercase tracking-widest text-[13px] font-semibold mt-8 transition-all duration-300 hover:bg-[#333]">
                      Continue to Payment
                    </button>
                    <button type="button" onClick={prevStep} className="bg-transparent text-[#666] text-[12px] flex items-center gap-2 mt-5 cursor-pointer">
                      <img src={arrowLeft} alt="" width="14" /> Return to Shipping
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment (UI ONLY) */}
              {currentStep === 3 && (
                <div className="bg-white p-10 rounded-sm border border-[#f0f0f0] animate-in slide-in-from-right-4 duration-500">
                  <h2 className="font-serif text-[1.75rem] mb-8 italic">Secure Payment</h2>

                  <div className="mb-5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2">Card Number</label>
                    <input className="w-full py-3 border-0 border-b border-[#eee] text-[15px] transition-colors duration-300 bg-transparent outline-none focus:border-black" placeholder="0000 0000 0000 0000" disabled />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="mb-5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2">Expiry Date</label>
                      <input className="w-full py-3 border-0 border-b border-[#eee] text-[15px] transition-colors duration-300 bg-transparent outline-none focus:border-black" placeholder="MM / YY" disabled />
                    </div>
                    <div className="mb-5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2">CVC / CVV</label>
                      <input className="w-full py-3 border-0 border-b border-[#eee] text-[15px] transition-colors duration-300 bg-transparent outline-none focus:border-black" placeholder="000" disabled />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center mt-4">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest">Credit Card Simulation Only</p>
                  </div>

                  <div className="flex flex-col gap-2 mt-8">
                    <button type="submit" disabled={loading} className="bg-black text-white w-full p-[18px] uppercase tracking-widest text-[13px] font-semibold mt-8 transition-all duration-300 hover:bg-[#333]">
                      {loading ? 'Processing...' : `Place Order • $${finalTotal.toFixed(2)}`}
                    </button>
                    <button type="button" onClick={prevStep} className="bg-transparent text-[#666] text-[12px] flex items-center gap-2 mt-5 cursor-pointer">
                      <img src={arrowLeft} alt="" width="14" /> Back to Delivery
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* ── Right Side: Order Summary ── */}
          <div className="bg-white border border-[#f0f0f0] p-8 rounded-sm sticky top-[120px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <h2 className="font-serif text-2xl font-medium mb-6 text-[#111]">Order Summary</h2>

            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 mb-5 pb-5 border-b border-[#f9f9f9]">
                  <div className="w-[70px] h-[80px] bg-[#f7f7f7] rounded-sm overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[13px] font-medium text-[#333] mb-1 leading-[1.4]">{item.title || item.name}</h3>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-[11px] text-[#9ca3af]">Qty: {item.quantity}</span>
                      <span className="text-[13px] font-semibold text-[#111]">${item.totalPrice.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex justify-between text-[14px] text-[#666]">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-[14px] text-[#666]">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-[14px] text-[#666]">
                <span>Estimated Tax (18%)</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between mt-3 pt-4 border-t border-[#eee] text-[18px] font-bold text-[#111] ">
                <span>Order Total</span>
                <span>${finalTotal.toFixed(0)}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 italic text-[11px] text-gray-400 text-center">
              All transactions are secure and encrypted.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
