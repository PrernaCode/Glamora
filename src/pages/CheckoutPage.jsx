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
import './CheckoutPage.css';

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
      <div className="co-page flex items-center justify-center">
        <div className="text-center">
          <h2 className="co-section-title">Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="co-btn-primary" style={{ maxWidth: '250px' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = shippingMethod === 'express' ? 25 : 0;
  const finalTotal = totalAmount + shippingCost;

  return (
    <div className="co-page">
      <div className="co-container">
        <div className="co-layout">
          
          {/* ── Left Side: Steps ── */}
          <div className="co-main">
            
            {/* Stepper */}
            <div className="co-stepper">
              <div className={`co-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="co-step-dot">{currentStep > 1 ? '✓' : '1'}</div>
                <span className="co-step-label">Shipping</span>
              </div>
              <div className={`co-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="co-step-dot">{currentStep > 2 ? '✓' : '2'}</div>
                <span className="co-step-label">Delivery</span>
              </div>
              <div className={`co-step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="co-step-dot">3</div>
                <span className="co-step-label">Payment</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onFinalSubmit)}>
              
              {/* Step 1: Shipping Details */}
              {currentStep === 1 && (
                <div className="co-form-section animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        fill-rule="evenodd" 
                        clip-rule="evenodd" 
                        d="M4 6V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V6H14V16H2V6H4ZM6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4V6H6V4ZM7 13V9H9V13H7Z" 
                        fill="var(--mint-green)"
                      />
                    </svg>
                    <h2 className="co-section-title mb-0">Shipping Details</h2>
                  </div>
                  
                  <div className="co-input-group">
                    <label className="co-label">Full Name</label>
                    <input {...register('fullName')} className={`co-input ${errors.fullName ? 'error' : ''}`} placeholder="Enter your full name" />
                    {errors.fullName && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.fullName.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="co-input-group">
                      <label className="co-label">Email Address</label>
                      <input {...register('email')} className={`co-input ${errors.email ? 'error' : ''}`} placeholder="Email" />
                      {errors.email && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.email.message}</p>}
                    </div>
                    <div className="co-input-group">
                      <label className="co-label">Phone Number</label>
                      <input {...register('phone')} className={`co-input ${errors.phone ? 'error' : ''}`} placeholder="Phone" />
                      {errors.phone && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="co-input-group">
                    <label className="co-label">Shipping Address</label>
                    <input {...register('address')} className={`co-input ${errors.address ? 'error' : ''}`} placeholder="Street, building, etc." />
                    {errors.address && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.address.message}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="co-input-group">
                      <label className="co-label">City</label>
                      <input {...register('city')} className={`co-input ${errors.city ? 'error' : ''}`} placeholder="City" />
                    </div>
                    <div className="co-input-group">
                      <label className="co-label">State</label>
                      <input {...register('state')} className={`co-input ${errors.state ? 'error' : ''}`} placeholder="State" />
                    </div>
                    <div className="co-input-group">
                      <label className="co-label">Pincode</label>
                      <input {...register('pincode')} className={`co-input ${errors.pincode ? 'error' : ''}`} placeholder="Zip" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <input type="checkbox" id="saveToProfile" {...register('saveToProfile')} className="accent-black w-4 h-4" />
                    <label htmlFor="saveToProfile" className="text-[12px] text-gray-500 cursor-pointer">Save details for next time</label>
                  </div>

                  <button type="button" onClick={nextStep} className="co-btn-primary">
                    Continue to Delivery
                  </button>
                </div>
              )}

              {/* Step 2: Delivery Method */}
              {currentStep === 2 && (
                <div className="co-form-section animate-in slide-in-from-right-4 duration-500">
                  <h2 className="co-section-title">Delivery Method</h2>
                  
                  <div 
                    className={`co-delivery-option ${shippingMethod === 'standard' ? 'active' : ''}`}
                    onClick={() => setShippingMethod('standard')}
                  >
                    <div className="co-delivery-radio" />
                    <div className="co-delivery-info">
                      <span className="co-delivery-name">Standard Delivery</span>
                      <span className="co-delivery-time">3-5 business days</span>
                    </div>
                    <span className="co-delivery-price">Free</span>
                  </div>

                  <div 
                    className={`co-delivery-option ${shippingMethod === 'express' ? 'active' : ''}`}
                    onClick={() => setShippingMethod('express')}
                  >
                    <div className="co-delivery-radio" />
                    <div className="co-delivery-info">
                      <span className="co-delivery-name">Express Shipping</span>
                      <span className="co-delivery-time">1-2 business days</span>
                    </div>
                    <span className="co-delivery-price">$25.00</span>
                  </div>

                  <div className="flex flex-col gap-2 mt-8">
                    <button type="button" onClick={nextStep} className="co-btn-primary">
                      Continue to Payment
                    </button>
                    <button type="button" onClick={prevStep} className="co-btn-secondary">
                      <img src={arrowLeft} alt="" width="14" /> Return to Shipping
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment (UI ONLY) */}
              {currentStep === 3 && (
                <div className="co-form-section animate-in slide-in-from-right-4 duration-500">
                  <h2 className="co-section-title">Secure Payment</h2>
                  
                  <div className="co-input-group">
                    <label className="co-label">Card Number</label>
                    <input className="co-input" placeholder="0000 0000 0000 0000" disabled />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="co-input-group">
                      <label className="co-label">Expiry Date</label>
                      <input className="co-input" placeholder="MM / YY" disabled />
                    </div>
                    <div className="co-input-group">
                      <label className="co-label">CVC / CVV</label>
                      <input className="co-input" placeholder="000" disabled />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center mt-4">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest">Credit Card Simulation Only</p>
                  </div>

                  <div className="flex flex-col gap-2 mt-8">
                    <button type="submit" disabled={loading} className="co-btn-primary">
                      {loading ? 'Processing...' : `Place Order • $${finalTotal.toFixed(2)}`}
                    </button>
                    <button type="button" onClick={prevStep} className="co-btn-secondary">
                      <img src={arrowLeft} alt="" width="14" /> Back to Delivery
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* ── Right Side: Order Summary ── */}
          <div className="co-summary-sidebar">
            <h2 className="co-summary-title">Order Summary</h2>
            
            <div className="co-items-list max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => (
                <div key={item.id} className="co-cart-item">
                  <div className="co-item-img">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="co-item-info">
                    <h3 className="co-item-title">{item.title || item.name}</h3>
                    <div className="flex justify-between items-end mt-2">
                       <span className="co-item-qty">Qty: {item.quantity}</span>
                       <span className="co-item-price">${item.totalPrice.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="co-breakdown">
              <div className="co-line-item">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(0)}</span>
              </div>
              <div className="co-line-item">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
              </div>
              <div className="co-line-item">
                <span>Estimated Tax (18%)</span>
                <span>$0</span>
              </div>
              <div className="co-line-item total">
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