import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Check, Calendar, Utensils, AlertCircle, BedDouble, Wifi, Mountain, Bath, Coffee, Waves, Wind, Tv, Car, Shield, Sun, Wine, User, Mail, Phone as PhoneIcon, X, CreditCard, Link as LinkIcon, Tag, AlertTriangle } from 'lucide-react';
import { sendBookingConfirmation, sendReceptionNotification } from '../services/emailService';

interface RoomsProps {
  onNavigateToDiningPackages: () => void;
}

const getFeatureIcon = (feature: string) => {
  const text = feature.toLowerCase();
  if (text.includes('bed')) return <BedDouble size={16} />;
  if (text.includes('wifi')) return <Wifi size={16} />;
  if (text.includes('view')) return <Mountain size={16} />;
  if (text.includes('bath')) return <Bath size={16} />;
  if (text.includes('breakfast')) return <Coffee size={16} />;
  return <Check size={16} />;
};

export const Rooms: React.FC<RoomsProps> = ({ onNavigateToDiningPackages }) => {
  const { rooms, bookings, addBooking, paymentConfig, coupons } = useData();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Gateway' | 'Pay at Hotel'>('Pay at Hotel');
  const [isSending, setIsSending] = useState(false);

  // Coupon Logic
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  const room = rooms.find(r => r.id === selectedRoomId);
  const basePrice = room?.price || 0;
  
  let finalPrice = basePrice;
  if (appliedCoupon) {
      if (appliedCoupon.type === 'PERCENT') finalPrice = basePrice * (1 - appliedCoupon.value / 100);
      else finalPrice = Math.max(0, basePrice - appliedCoupon.value);
  }

  const validateCoupon = () => {
      const found = coupons.find(c => c.code === couponInput.toUpperCase());
      if (found) {
          setAppliedCoupon(found);
          setCouponError('');
      } else {
          setCouponError('Invalid Coupon Code');
          setAppliedCoupon(null);
      }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (room) {
        setIsSending(true);
        const bookingDetails = `${room.name} (${guests} Guests, ${checkIn} to ${checkOut})`;
        
        addBooking({
            customerName,
            type: 'Room',
            date: checkIn,
            amount: finalPrice,
            details: bookingDetails,
            paymentMethod,
            couponUsed: appliedCoupon?.code
        });

        // 1. Notify Guest
        await sendBookingConfirmation({ to: email, name: customerName, roomName: room.name, dates: `${checkIn} to ${checkOut}`, amount: finalPrice });
        
        // 2. Notify Reception
        await sendReceptionNotification({
          type: 'ROOM_BOOKING',
          guestName: customerName,
          details: bookingDetails,
          amount: finalPrice,
          contact: `${email} | ${phone}`
        });

        setIsSending(false);
    }
    setShowConfirmation(true);
    setTimeout(() => {
        setShowConfirmation(false);
        setSelectedRoomId(null);
        setAppliedCoupon(null);
        setCouponInput('');
    }, 5000);
  };

  const labelClass = "block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2";
  const inputClass = "w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all";

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      <div className="bg-rose-950 text-white py-16 text-center">
        <h2 className="font-serif text-4xl mb-4">Royal Accommodations</h2>
        <p className="text-stone-300 max-w-xl mx-auto">Sanctuaries of peace and luxury in the heart of Varanasi.</p>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {rooms.map((r) => {
            // Stock logic
            let stockBadge = null;
            if (r.inventory < 5) {
                stockBadge = (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase tracking-tighter shadow-lg">
                        <AlertTriangle size={12} /> Only {r.inventory} left!
                    </div>
                );
            } else if (r.inventory < 10) {
                stockBadge = (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-tighter shadow-lg">
                        <AlertCircle size={12} /> Low Stock
                    </div>
                );
            }

            return (
              <div key={r.id} className="bg-white rounded-xl shadow-xl overflow-hidden border border-stone-100 flex flex-col group relative">
                <div className="relative h-64 overflow-hidden">
                  <img src={r.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute top-4 right-4 z-10 animate-bounce">
                      {stockBadge}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <span className="text-white font-serif text-xl">₹{r.price.toLocaleString()} / night</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif text-2xl font-bold text-rose-900 mb-3">{r.name}</h3>
                  <p className="text-stone-600 text-sm mb-6 leading-relaxed">{r.description}</p>
                  <div className="grid grid-cols-2 gap-y-3 mb-6">
                    {r.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-stone-700">
                        {getFeatureIcon(f)} {f}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setSelectedRoomId(r.id)}
                    className="w-full py-3 bg-rose-950 text-white font-serif uppercase tracking-wider text-sm rounded-lg hover:bg-rose-800 transition-all shadow-md mt-auto"
                  >
                    Book Category
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedRoomId && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative my-8">
              <div className="bg-rose-900 p-6 text-white text-center relative">
                <button onClick={() => setSelectedRoomId(null)} className="absolute right-4 top-4 text-white/70 hover:text-white"><X size={20} /></button>
                <h3 className="font-serif text-2xl mb-1">Reservation Details</h3>
                <p className="text-rose-200 text-sm">{room?.name}</p>
              </div>
              
              {!showConfirmation ? (
                <form onSubmit={handleBook} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Check In</label>
                      <input type="date" required className={inputClass} value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                    </div>
                    <div>
                      <label className={labelClass}>Check Out</label>
                      <input type="date" required className={inputClass} value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                    </div>
                  </div>

                  {/* Coupon Section */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <label className={labelClass}>Coupon Code</label>
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-amber-500/20 uppercase" 
                            placeholder="Enter Code"
                            value={couponInput}
                            onChange={e => setCouponInput(e.target.value)}
                        />
                        <button type="button" onClick={validateCoupon} className="bg-stone-800 text-white px-4 py-2 rounded text-xs font-bold uppercase">Apply</button>
                    </div>
                    {couponError && <p className="text-red-500 text-[10px] mt-1 font-bold">{couponError}</p>}
                    {appliedCoupon && <p className="text-green-600 text-[10px] mt-1 font-bold">Coupon Applied: {appliedCoupon.code}</p>}
                  </div>

                  <div className="pt-4 border-t border-stone-100">
                    <h4 className="font-serif text-lg text-rose-900 mb-4">Guest Info</h4>
                    <input required type="text" placeholder="Full Name" className={`${inputClass} mb-4`} value={customerName} onChange={e => setCustomerName(e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                        <input required type="email" placeholder="Email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} />
                        <input required type="tel" placeholder="Phone" className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                  </div>

                  <div className="p-4 bg-rose-950 text-white rounded-xl flex justify-between items-center shadow-inner">
                    <div className="text-xs uppercase tracking-widest text-rose-300">Total Amount</div>
                    <div className="flex flex-col items-end">
                        {appliedCoupon && <span className="text-xs line-through text-rose-400">₹{basePrice.toLocaleString()}</span>}
                        <span className="text-2xl font-bold">₹{finalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    type="submit" disabled={isSending}
                    className="w-full py-4 bg-amber-600 text-white font-serif uppercase tracking-widest text-sm rounded-lg hover:bg-amber-700 transition-all shadow-lg"
                  >
                    {isSending ? 'Processing...' : 'Confirm Stay'}
                  </button>
                </form>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="text-green-600" /></div>
                  <h4 className="text-2xl font-serif text-rose-950 mb-3">Reservation Confirmed</h4>
                  <p className="text-stone-600 text-sm">We'll be expecting you!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};