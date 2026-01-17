import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Clock, MapPin, Utensils, BellRing, Crown, Sparkles, ChefHat, Tag, User, Phone, Wine, Check, ShoppingCart } from 'lucide-react';
import { sendReceptionNotification } from '../services/emailService';

export type DiningTab = 'reserve' | 'in-room' | 'packages' | 'menu';

const BUFFET_TIERS = [
  { name: 'Silver', price: 1500, desc: '3 Starters, 4 Mains, 2 Desserts' },
  { name: 'Gold', price: 2500, desc: '5 Starters, 6 Mains, 4 Desserts' },
  { name: 'Platinum', price: 4000, desc: 'Unlimited Starters, 8 Mains, 6 Desserts' },
];

const CUISINES = [
  { name: 'Authentic Indian', surcharge: 0 },
  { name: 'Pure Veg Satvik', surcharge: 0 },
  { name: 'Non-Veg Royal', surcharge: 350 },
  { name: 'Continental', surcharge: 500 }
];

interface DiningProps {
  initialTab?: DiningTab;
}

export const Dining: React.FC<DiningProps> = ({ initialTab = 'reserve' }) => {
  const { menu, diningPackages, addBooking, coupons } = useData();
  const [activeTab, setActiveTab] = useState<DiningTab>(initialTab);
  
  // Table Reservation Form
  const [reserveForm, setReserveForm] = useState({ date: '', time: '19:00', guests: 2, name: '', phone: '' });
  const [reserveStatus, setReserveStatus] = useState<'idle' | 'success'>('idle');

  // Package Booking Form
  const [pkgForm, setPkgForm] = useState({ packageId: 'rose', tier: 'Silver', cuisine: 'Authentic Indian', guests: 2, date: '', name: '', email: '' });
  const [pkgStatus, setPkgStatus] = useState<'idle' | 'success'>('idle');

  // In-Room Service Mockup
  const [roomNumber, setRoomNumber] = useState('');
  const [orderItems, setOrderItems] = useState<string[]>([]);

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const calculatePackagePrice = () => {
    const pkg = diningPackages.find(p => p.id === pkgForm.packageId);
    const tier = BUFFET_TIERS.find(t => t.name === pkgForm.tier);
    const cuisine = CUISINES.find(c => c.name === pkgForm.cuisine);
    if (!pkg || !tier || !cuisine) return 0;
    
    const base = (pkg.basePrice + tier.price + cuisine.surcharge) * pkgForm.guests;
    if (!appliedCoupon) return base;
    if (appliedCoupon.type === 'PERCENT') return base * (1 - appliedCoupon.value / 100);
    return Math.max(0, base - appliedCoupon.value);
  };

  const applyCoupon = () => {
    const found = coupons.find(c => c.code === couponInput.toUpperCase());
    setAppliedCoupon(found || null);
  };

  const handleReserveSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setReserveStatus('success');
      // Notify Reception
      await sendReceptionNotification({
          type: 'DINING_BOOKING',
          guestName: reserveForm.name,
          details: `Table Reservation for ${reserveForm.guests} guests on ${reserveForm.date} at ${reserveForm.time}`,
          contact: reserveForm.phone
      });
      setTimeout(() => {
          setReserveStatus('idle');
          setReserveForm({ date: '', time: '19:00', guests: 2, name: '', phone: '' });
      }, 3000);
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = calculatePackagePrice();
    const bookingDetails = `Royal Package: ${pkgForm.packageId} (${pkgForm.tier}, ${pkgForm.cuisine}) for ${pkgForm.guests} guests.`;
    
    addBooking({
        customerName: pkgForm.name,
        type: 'Dining',
        date: pkgForm.date,
        amount: price,
        details: bookingDetails,
        couponUsed: appliedCoupon?.code
    });

    await sendReceptionNotification({
      type: 'DINING_BOOKING',
      guestName: pkgForm.name,
      details: bookingDetails,
      amount: price,
      contact: pkgForm.email
    });

    setPkgStatus('success');
    setTimeout(() => setPkgStatus('idle'), 4000);
  };

  const labelClass = "block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2";
  const inputClass = "w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-600/20 transition-all";

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="relative h-[30vh] bg-rose-950 flex flex-col items-center justify-center text-center p-4">
          <Utensils className="text-amber-500 w-10 h-10 mb-4" />
          <h2 className="font-serif text-5xl text-white mb-2">The Darbar</h2>
          <p className="text-stone-300 font-light">Fine Dining & Royal Hospitality</p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center space-x-6 mb-12 border-b overflow-x-auto pb-4 scrollbar-hide">
           {['reserve', 'in-room', 'packages', 'menu'].map(t => (
               <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'text-amber-600 border-b-2 border-amber-600' : 'text-stone-400 hover:text-stone-600'}`}>{t.replace('-', ' ')}</button>
           ))}
        </div>

        {activeTab === 'reserve' && (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-stone-100 animate-fade-in">
                <h3 className="font-serif text-2xl text-rose-950 mb-6">Reserve a Table</h3>
                {reserveStatus === 'success' ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="text-green-600" /></div>
                        <h4 className="font-serif text-xl">Table Reserved!</h4>
                        <p className="text-stone-500 text-sm mt-2">A confirmation has been sent to the staff.</p>
                    </div>
                ) : (
                    <form onSubmit={handleReserveSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={labelClass}>Date</label><input type="date" required className={inputClass} value={reserveForm.date} onChange={e => setReserveForm({...reserveForm, date: e.target.value})} /></div>
                            <div><label className={labelClass}>Time</label><input type="time" required className={inputClass} value={reserveForm.time} onChange={e => setReserveForm({...reserveForm, time: e.target.value})} /></div>
                        </div>
                        <div><label className={labelClass}>No. of Guests</label><input type="number" min="1" className={inputClass} value={reserveForm.guests} onChange={e => setReserveForm({...reserveForm, guests: Number(e.target.value)})} /></div>
                        <div><label className={labelClass}>Name</label><input type="text" required className={inputClass} placeholder="Full Name" value={reserveForm.name} onChange={e => setReserveForm({...reserveForm, name: e.target.value})} /></div>
                        <div><label className={labelClass}>Phone</label><input type="tel" required className={inputClass} placeholder="Phone Number" value={reserveForm.phone} onChange={e => setReserveForm({...reserveForm, phone: e.target.value})} /></div>
                        <button type="submit" className="w-full py-4 bg-rose-950 text-white font-bold uppercase tracking-widest rounded-lg shadow-lg">Confirm Table</button>
                    </form>
                )}
            </div>
        )}

        {activeTab === 'in-room' && (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow border border-stone-100">
                        <h3 className="font-serif text-2xl mb-6">In-Room Dining</h3>
                        <p className="text-sm text-stone-500 mb-6">Exclusively for guests staying at the palace. Order from our quick-service menu below.</p>
                        <div className="space-y-4">
                            <input className={inputClass} placeholder="Enter Room Number" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} />
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <h4 className="font-bold text-xs uppercase mb-3">Popular Items</h4>
                                {['Palace Club Sandwich', 'Heritage Thali', 'Classic Cold Coffee', 'Dal Tadka & Naan'].map(item => (
                                    <label key={item} className="flex items-center gap-3 py-2 cursor-pointer border-b border-stone-200 last:border-0">
                                        <input type="checkbox" className="w-4 h-4 text-amber-600 rounded" onChange={(e) => {
                                            if (e.target.checked) setOrderItems([...orderItems, item]);
                                            else setOrderItems(orderItems.filter(i => i !== item));
                                        }} />
                                        <span className="text-sm text-stone-700">{item}</span>
                                    </label>
                                ))}
                            </div>
                            <button onClick={async () => {
                                if (!roomNumber || orderItems.length === 0) return alert('Please enter room and select items');
                                await sendReceptionNotification({ type: 'DINING_BOOKING', guestName: 'In-Room Guest', details: `Room ${roomNumber} ordered: ${orderItems.join(', ')}` });
                                alert('Order sent to the kitchen!');
                                setOrderItems([]);
                            }} className="w-full py-4 bg-amber-600 text-white font-bold uppercase rounded flex items-center justify-center gap-2">
                                <BellRing size={18} /> Call Room Service
                            </button>
                        </div>
                    </div>
                    <div className="bg-stone-900 rounded-2xl p-8 flex flex-col justify-center text-white">
                        <ChefHat className="text-amber-500 w-12 h-12 mb-6" />
                        <h4 className="font-serif text-2xl mb-4">Royal Kitchen at your service</h4>
                        <p className="text-stone-400 text-sm leading-relaxed">Our chefs are available 24/7 to cater to your palate. From traditional Satvik meals to global classics, enjoy a royal feast in the comfort of your suite.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'packages' && (
           <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 animate-fade-in">
              <div className="space-y-4">
                 <h3 className="font-serif text-2xl text-rose-900 mb-6">Select Experience</h3>
                 {diningPackages.map(pkg => (
                    <div 
                        key={pkg.id} 
                        onClick={() => setPkgForm({...pkgForm, packageId: pkg.id})}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${pkgForm.packageId === pkg.id ? 'border-amber-500 bg-amber-50' : 'border-stone-100 hover:border-amber-200'}`}
                    >
                        <h4 className="font-bold">{pkg.name}</h4>
                        <p className="text-xs text-stone-500">{pkg.location}</p>
                    </div>
                 ))}
                 {diningPackages.length === 0 && <p className="text-stone-400 italic">No packages configured by admin yet.</p>}
              </div>

              <div className="bg-white p-8 rounded-xl shadow-xl border border-stone-100">
                 {pkgStatus === 'success' ? (
                     <div className="text-center py-10">
                        <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h4 className="text-xl font-bold">Booking Sent!</h4>
                     </div>
                 ) : (
                    <form onSubmit={handlePackageSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <select className={inputClass} value={pkgForm.tier} onChange={e => setPkgForm({...pkgForm, tier: e.target.value})}>
                               {BUFFET_TIERS.map(t => <option key={t.name} value={t.name}>{t.name} (₹{t.price})</option>)}
                           </select>
                           <input type="number" min="1" className={inputClass} value={pkgForm.guests} onChange={e => setPkgForm({...pkgForm, guests: Number(e.target.value)})} />
                        </div>
                        
                        <div className="bg-stone-50 p-4 rounded-xl">
                            <label className={labelClass}>Coupon</label>
                            <div className="flex gap-2">
                                <input className="flex-1 px-3 py-2 border rounded uppercase text-xs" value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Code" />
                                <button type="button" onClick={applyCoupon} className="bg-stone-800 text-white px-3 py-1 rounded text-[10px] font-bold">Apply</button>
                            </div>
                        </div>

                        <div className="bg-rose-950 text-white p-4 rounded-lg flex justify-between items-center">
                            <span className="text-xs uppercase">Estimate</span>
                            <span className="text-xl font-bold">₹{calculatePackagePrice().toLocaleString()}</span>
                        </div>
                        
                        <input required className={inputClass} placeholder="Your Name" value={pkgForm.name} onChange={e => setPkgForm({...pkgForm, name: e.target.value})} />
                        <input required type="date" className={inputClass} value={pkgForm.date} onChange={e => setPkgForm({...pkgForm, date: e.target.value})} />
                        
                        <button type="submit" className="w-full py-4 bg-amber-600 text-white font-bold uppercase rounded shadow-lg">Reserve Package</button>
                    </form>
                 )}
              </div>
           </div>
        )}

        {activeTab === 'menu' && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                {menu.length > 0 ? menu.map((cat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                        <h3 className="font-serif text-xl text-rose-900 border-b pb-2 mb-4">{cat.category}</h3>
                        <div className="space-y-4">
                            {cat.items.map((item, j) => (
                                <div key={j} className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm flex items-center gap-2">
                                            {item.name}
                                            {item.veg ? <span className="w-2 h-2 rounded-full bg-green-500"></span> : <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                                        </h4>
                                        <p className="text-xs text-stone-500 mt-1">{item.desc}</p>
                                    </div>
                                    <span className="font-serif font-bold text-rose-900">₹{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl">
                        <ShoppingCart className="mx-auto text-stone-200 mb-4" size={48} />
                        <p className="text-stone-400 font-serif text-xl">The Digital Menu is currently under renovation.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
