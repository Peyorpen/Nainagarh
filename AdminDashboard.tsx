import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Users, Calendar, DollarSign, Bed, LogOut, Edit, Trash2, Check, X, Image as ImageIcon, Briefcase, Coffee, Layout, Plus, Save, Minus, BedDouble, Wifi, Mountain, Bath, Waves, Wind, Tv, Car, Shield, Sun, Wine, UserCog, CreditCard, Utensils, Map, Tag, Filter, ChevronDown } from 'lucide-react';
import { Room, BanquetVenue, TourPackage, DiningPackage, GalleryImage, AdminUser, Booking, VaranasiSpot, Coupon, GeneralInfo, PaymentConfig } from '../types';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
}

type Tab = 'overview' | 'bookings' | 'inquiries' | 'orders-restaurant' | 'orders-tours' | 
           'cms-rooms' | 'cms-banquets' | 'cms-dining' | 'cms-tours' | 'cms-gallery' | 'cms-general' | 'cms-guide' |
           'master-admins' | 'master-payment' | 'master-coupons';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const { 
    bookings, inquiries, rooms, banquets, tours, varanasiSpots, diningPackages, gallery, generalInfo, admins, paymentConfig, coupons,
    updateRoom, addRoom, deleteRoom, updateBanquet, updateTour, updateVaranasiSpot, addVaranasiSpot, deleteVaranasiSpot, updateDiningPackage, updateGalleryImage, addGalleryImage, deleteGalleryImage, updateGeneralInfo,
    updateBookingStatus, updateInquiryStatus, addAdmin, removeAdmin, updatePaymentConfig, addBooking, addCoupon, deleteCoupon
  } = useData();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  
  // Overview Sorting State
  const [filterMonth, setFilterMonth] = useState<number | 'all'>('all');
  const [filterYear, setFilterYear] = useState<number>(2024);
  const [sortBy, setSortBy] = useState<'amount' | 'date'>('date');

  // Master Forms
  const [generalEdit, setGeneralEdit] = useState<GeneralInfo>(generalInfo);
  const [paymentEdit, setPaymentEdit] = useState<PaymentConfig>(paymentConfig);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const filteredBookings = bookings.filter(b => {
    const monthMatch = filterMonth === 'all' || b.month === filterMonth;
    const yearMatch = b.year === filterYear;
    return monthMatch && yearMatch;
  }).sort((a, b) => {
    if (sortBy === 'amount') return b.amount - a.amount;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const totalRevenue = filteredBookings.filter(b => b.status === 'Confirmed').reduce((sum, b) => sum + b.amount, 0);
  const totalBookingsCount = filteredBookings.length;

  const handleEdit = (item: any) => {
    setIsNewItem(false);
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleAddNew = (type: string) => {
    setIsNewItem(true);
    let defaults = {};
    if (type === 'room') defaults = { name: 'New Room', description: '', price: 0, image: '', features: [], inventory: 0 };
    if (type === 'spot') defaults = { name: 'New Spot', category: 'Ghats & Temples', description: '', image: '', location: '' };
    if (type === 'banquet') defaults = { name: 'New Banquet', capacity: '100 Guests', description: '', image: '' };
    if (type === 'tour') defaults = { name: 'New Tour', price: 0, duration: '1 Day', description: '', image: '', shuttle: '', places: [], shopping: [], itinerary: [] };
    if (type === 'dining') defaults = { name: 'New Package', location: 'Garden', basePrice: 0, image: '' };
    if (type === 'gallery') defaults = { src: '', title: '', category: 'Architecture' };
    setEditingItem(defaults);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingItem) return;
    switch (activeTab) {
      case 'cms-rooms': isNewItem ? addRoom(editingItem) : updateRoom(editingItem); break;
      case 'cms-guide': isNewItem ? addVaranasiSpot(editingItem) : updateVaranasiSpot(editingItem); break;
      case 'cms-banquets': updateBanquet(editingItem); break;
      case 'cms-tours': updateTour(editingItem); break;
      case 'cms-dining': updateDiningPackage(editingItem); break;
      case 'cms-gallery': isNewItem ? addGalleryImage({ ...editingItem, id: Date.now().toString() }) : updateGalleryImage(editingItem); break;
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const SidebarItem = ({ id, label, icon: Icon, masterOnly = false }: { id: Tab, label: string, icon: any, masterOnly?: boolean }) => {
    if (masterOnly && user.role !== 'MASTER') return null;
    return (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${
          activeTab === id ? 'bg-rose-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'
        }`}
      >
        <Icon size={18} /> {label}
      </button>
    );
  };

  const labelClass = "block text-xs font-bold uppercase text-stone-500 mb-1.5";
  const inputClass = "w-full px-3 py-2 bg-white text-stone-900 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm";

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-stone-200 p-6 flex-shrink-0 flex flex-col h-screen sticky top-0 overflow-y-auto">
         <div className="mb-8 px-2">
            <h2 className="font-serif text-xl text-rose-950 font-bold">Nainagarh Admin</h2>
            <div className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded inline-block font-bold mt-2">
                {user.role} : {user.name}
            </div>
         </div>

         <div className="space-y-4 flex-grow">
           <div>
             <p className="px-4 text-[10px] font-bold text-stone-400 uppercase mb-2">Reports</p>
             <SidebarItem id="overview" label="Overview & Stats" icon={Layout} />
             <SidebarItem id="bookings" label="All Bookings" icon={Calendar} />
             <SidebarItem id="inquiries" label="Guest Inquiries" icon={Briefcase} />
           </div>

           <div>
             <p className="px-4 text-[10px] font-bold text-stone-400 uppercase mb-2">CMS Management</p>
             <SidebarItem id="cms-general" label="Branding & Hero" icon={Layout} />
             <SidebarItem id="cms-rooms" label="Royal Rooms" icon={Bed} />
             <SidebarItem id="cms-banquets" label="Banquet Venues" icon={Users} />
             <SidebarItem id="cms-dining" label="Dining Packages" icon={Coffee} />
             <SidebarItem id="cms-tours" label="Tour Packages" icon={Briefcase} />
             <SidebarItem id="cms-guide" label="Varanasi Guide" icon={Map} />
             <SidebarItem id="cms-gallery" label="Media Gallery" icon={ImageIcon} />
           </div>

           {user.role === 'MASTER' && (
             <div>
               <p className="px-4 text-[10px] font-bold text-stone-400 uppercase mb-2">Master Controls</p>
               <SidebarItem id="master-admins" label="Manage Staff" icon={UserCog} masterOnly />
               <SidebarItem id="master-payment" label="Payment Settings" icon={CreditCard} masterOnly />
               <SidebarItem id="master-coupons" label="Discount Coupons" icon={Tag} masterOnly />
             </div>
           )}
         </div>

         <button onClick={onLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg transition-colors text-sm font-medium mt-auto">
             <LogOut size={18} /> Logout
         </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-rose-950">Overview & Statistics</h2>
                <div className="flex gap-4">
                    <select className={inputClass} value={filterMonth} onChange={e => setFilterMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
                        <option value="all">All Months</option>
                        {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select className={inputClass} value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                        <option value="date">Sort by Date</option>
                        <option value="amount">Sort by Revenue</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <p className="text-stone-500 text-xs font-bold uppercase">Total Transactions</p>
                    <h4 className="text-3xl font-bold">{totalBookingsCount}</h4>
                </div>
                {user.role === 'MASTER' && (
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm bg-green-50/30 border-green-100">
                        <p className="text-stone-500 text-xs font-bold uppercase">Total Revenue</p>
                        <h4 className="text-3xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</h4>
                    </div>
                )}
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                    <p className="text-stone-500 text-xs font-bold uppercase">New Inquiries</p>
                    <h4 className="text-3xl font-bold text-amber-600">{inquiries.filter(i => i.status === 'New').length}</h4>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
                <div className="p-4 border-b bg-stone-50 flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase text-stone-500">Filtered Transactions</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 text-stone-500 text-xs uppercase border-b">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => (
                        <tr key={b.id} className="border-b last:border-0">
                            <td className="p-4 font-bold">{b.customerName}</td>
                            <td className="p-4"><span className="px-2 py-0.5 bg-stone-100 rounded text-[10px]">{b.type}</span></td>
                            <td className="p-4 text-stone-500">{b.date}</td>
                            <td className="p-4 font-bold">₹{b.amount.toLocaleString()}</td>
                            <td className="p-4 text-xs text-stone-400">{b.details}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        )}

        {activeTab === 'cms-general' && (
            <div className="animate-fade-in max-w-2xl">
                <h2 className="text-2xl font-serif text-rose-950 mb-6">General Website Branding</h2>
                <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm space-y-6">
                    <div>
                        <label className={labelClass}>Hero Title</label>
                        <input className={inputClass} value={generalEdit.heroTitle} onChange={e => setGeneralEdit({...generalEdit, heroTitle: e.target.value})} />
                    </div>
                    <div>
                        <label className={labelClass}>Hero Subtitle</label>
                        <input className={inputClass} value={generalEdit.heroSubtitle} onChange={e => setGeneralEdit({...generalEdit, heroSubtitle: e.target.value})} />
                    </div>
                    <div>
                        <label className={labelClass}>Hero Background Image URL</label>
                        <input className={inputClass} value={generalEdit.heroImage} onChange={e => setGeneralEdit({...generalEdit, heroImage: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Logo Main Title</label>
                            <input className={inputClass} value={generalEdit.logoTitle} onChange={e => setGeneralEdit({...generalEdit, logoTitle: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelClass}>Logo Subtitle</label>
                            <input className={inputClass} value={generalEdit.logoSubtitle} onChange={e => setGeneralEdit({...generalEdit, logoSubtitle: e.target.value})} />
                        </div>
                    </div>
                    <button onClick={() => { updateGeneralInfo(generalEdit); alert('General Branding Updated!'); }} className="w-full bg-rose-950 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                        <Save size={18} /> Save Global Changes
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'master-payment' && user.role === 'MASTER' && (
            <div className="animate-fade-in max-w-4xl">
                <h2 className="text-2xl font-serif text-rose-950 mb-6">Payment Configuration</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm space-y-6">
                        <div>
                            <label className={labelClass}>Merchant UPI ID</label>
                            <input className={inputClass} value={paymentEdit.upiId} onChange={e => setPaymentEdit({...paymentEdit, upiId: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelClass}>Account Name</label>
                            <input className={inputClass} value={paymentEdit.accountName} onChange={e => setPaymentEdit({...paymentEdit, accountName: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelClass}>Payment Gateway Link (Razorpay/Instamojo)</label>
                            <input className={inputClass} value={paymentEdit.gatewayLink} onChange={e => setPaymentEdit({...paymentEdit, gatewayLink: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelClass}>Bank Details (Manual)</label>
                            <textarea className={inputClass} rows={3} value={paymentEdit.bankDetails} onChange={e => setPaymentEdit({...paymentEdit, bankDetails: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelClass}>QR Code Image URL</label>
                            <input className={inputClass} value={paymentEdit.qrCode} onChange={e => setPaymentEdit({...paymentEdit, qrCode: e.target.value})} />
                        </div>
                        <button onClick={() => { updatePaymentConfig(paymentEdit); alert('Payment Config Saved!'); }} className="w-full bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                            <Save size={18} /> Update Payment Settings
                        </button>
                    </div>
                    
                    <div className="bg-stone-900 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                        <h3 className="text-white font-serif text-xl mb-4">Guest Checkout Preview</h3>
                        <div className="bg-white p-4 rounded-lg mb-4">
                            {paymentEdit.qrCode ? (
                                <img src={paymentEdit.qrCode} alt="QR Preview" className="w-40 h-40 object-contain" />
                            ) : (
                                <div className="w-40 h-40 bg-stone-100 flex items-center justify-center"><ImageIcon className="text-stone-300" /></div>
                            )}
                        </div>
                        <p className="text-stone-400 text-xs mb-1">UPI: {paymentEdit.upiId}</p>
                        <p className="text-amber-500 font-bold">{paymentEdit.accountName}</p>
                        <div className="mt-8 pt-8 border-t border-stone-800 w-full">
                            <button className="w-full py-2 border border-white/20 text-white text-xs rounded hover:bg-white/5">Test Gateway Link</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* CMS SECTION - GENERIC LISTING */}
        {activeTab.startsWith('cms-') && activeTab !== 'cms-general' && (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif text-rose-950 capitalize">{activeTab.replace('cms-', 'Manage ')}</h2>
                    <button onClick={() => handleAddNew(activeTab.replace('cms-', '').replace('guide', 'spot').replace('banquets', 'banquet').replace('tours', 'tour').replace('dining', 'dining').replace('rooms', 'room').replace('gallery', 'gallery'))} className="bg-amber-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-amber-700">
                        <Plus size={16} /> Add New Content
                    </button>
                </div>
                <div className="grid gap-4">
                    {activeTab === 'cms-rooms' && rooms.map(room => (
                        <div key={room.id} className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex items-center justify-between">
                            <div className="flex gap-4 items-center">
                                <img src={room.image} className="w-16 h-16 object-cover rounded" />
                                <div><h4 className="font-bold">{room.name}</h4><p className="text-xs text-stone-500">₹{room.price} • {room.inventory} units</p></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(room)} className="p-2 text-stone-500 hover:text-amber-600"><Edit size={18} /></button>
                                <button onClick={() => deleteRoom(room.id)} className="p-2 text-stone-500 hover:text-red-600"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                    {activeTab === 'cms-banquets' && banquets.map(b => (
                        <div key={b.id} className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex items-center justify-between">
                            <div className="flex gap-4 items-center">
                                <img src={b.image} className="w-16 h-16 object-cover rounded" />
                                <div><h4 className="font-bold">{b.name}</h4><p className="text-xs text-stone-500">{b.capacity}</p></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(b)} className="p-2 text-stone-500 hover:text-amber-600"><Edit size={18} /></button>
                            </div>
                        </div>
                    ))}
                    {activeTab === 'cms-tours' && tours.map(t => (
                        <div key={t.id} className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex items-center justify-between">
                            <div className="flex gap-4 items-center">
                                <img src={t.image} className="w-16 h-16 object-cover rounded" />
                                <div><h4 className="font-bold">{t.name}</h4><p className="text-xs text-stone-500">₹{t.price} • {t.duration}</p></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(t)} className="p-2 text-stone-500 hover:text-amber-600"><Edit size={18} /></button>
                            </div>
                        </div>
                    ))}
                    {activeTab === 'cms-dining' && diningPackages.map(p => (
                        <div key={p.id} className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex items-center justify-between">
                            <div className="flex gap-4 items-center">
                                <img src={p.image} className="w-16 h-16 object-cover rounded" />
                                <div><h4 className="font-bold">{p.name}</h4><p className="text-xs text-stone-500">Base: ₹{p.basePrice}</p></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(p)} className="p-2 text-stone-500 hover:text-amber-600"><Edit size={18} /></button>
                            </div>
                        </div>
                    ))}
                    {activeTab === 'cms-gallery' && gallery.map(img => (
                        <div key={img.id} className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex items-center justify-between">
                            <div className="flex gap-4 items-center">
                                <img src={img.src} className="w-16 h-16 object-cover rounded" />
                                <div><h4 className="font-bold">{img.title}</h4><p className="text-xs text-stone-500">{img.category}</p></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(img)} className="p-2 text-stone-500 hover:text-amber-600"><Edit size={18} /></button>
                                <button onClick={() => deleteGalleryImage(img.id)} className="p-2 text-stone-500 hover:text-red-600"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Modal for CMS Edits */}
        {isModalOpen && editingItem && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-stone-200">
                    <div className="bg-rose-900 p-4 text-white flex justify-between">
                        <h3 className="font-bold">CMS Editor</h3>
                        <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {Object.keys(editingItem).map(key => {
                            if (key === 'id' || key === 'itinerary' || Array.isArray(editingItem[key])) return null;
                            const isImage = key === 'image' || key === 'src';
                            return (
                                <div key={key}>
                                    <label className={labelClass}>{key}</label>
                                    {isImage && editingItem[key] && <img src={editingItem[key]} className="w-20 h-20 object-cover mb-2 rounded" />}
                                    <input className={inputClass} value={editingItem[key]} onChange={e => setEditingItem({...editingItem, [key]: e.target.value})} />
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-4 border-t flex justify-end gap-2 bg-stone-50">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-amber-600 text-white rounded">Save</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};