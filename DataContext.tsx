import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Room, BanquetVenue, TourPackage, MenuCategory, DiningPackage, GalleryImage, Booking, Inquiry, GeneralInfo, FeatureIconMapping, AdminUser, PaymentConfig, VaranasiSpot, Coupon } from '../types';

interface DataContextType {
  // Content State
  rooms: Room[];
  banquets: BanquetVenue[];
  tours: TourPackage[];
  varanasiSpots: VaranasiSpot[];
  menu: MenuCategory[];
  diningPackages: DiningPackage[];
  gallery: GalleryImage[];
  generalInfo: GeneralInfo;
  featureIcons: FeatureIconMapping[];
  coupons: Coupon[];

  // Admin & Config State
  admins: AdminUser[];
  paymentConfig: PaymentConfig;

  // Transaction State
  bookings: Booking[];
  inquiries: Inquiry[];

  // Actions
  updateRoom: (room: Room) => void;
  addRoom: (room: Omit<Room, 'id'>) => void;
  deleteRoom: (id: string) => void;

  updateBanquet: (venue: BanquetVenue) => void;
  updateTour: (tour: TourPackage) => void;
  updateVaranasiSpot: (spot: VaranasiSpot) => void;
  addVaranasiSpot: (spot: Omit<VaranasiSpot, 'id'>) => void;
  deleteVaranasiSpot: (id: string) => void;
  
  updateMenuCategory: (index: number, category: MenuCategory) => void;
  updateDiningPackage: (pkg: DiningPackage) => void;
  updateGalleryImage: (img: GalleryImage) => void;
  addGalleryImage: (img: GalleryImage) => void;
  deleteGalleryImage: (id: string) => void;
  updateGeneralInfo: (info: GeneralInfo) => void;

  addFeatureIconMap: (mapping: Omit<FeatureIconMapping, 'id'>) => void;
  deleteFeatureIconMap: (id: string) => void;
  
  // Admin Actions
  addAdmin: (admin: AdminUser) => boolean;
  removeAdmin: (id: string) => void;
  updatePaymentConfig: (config: PaymentConfig) => void;
  
  // Master-only Coupon Actions
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  deleteCoupon: (id: string) => void;

  addBooking: (booking: Omit<Booking, 'id' | 'status'> & { status?: Booking['status'] }) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'status' | 'date'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_ROOMS: Room[] = [
  {
    id: 'deluxe',
    name: 'Heritage Deluxe',
    description: 'Elegant rooms with traditional decor, overlooking the lush palace gardens.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop',
    features: ['King Size Bed', 'Garden View', 'Free Wi-Fi', 'Breakfast Included'],
    inventory: 3 // Should show specific count
  },
  {
    id: 'royal',
    name: 'Royal Suite',
    description: 'Spacious suites featuring a private jharokha balcony and opulent Rajasthani interiors.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop',
    features: ['Private Balcony', 'Living Area', 'Butler Service', 'Jacuzzi'],
    inventory: 8 // Should show "Low Stock"
  },
  {
    id: 'maharaja',
    name: 'Maharaja Presidential',
    description: 'The ultimate luxury experience. A sprawling 3-bedroom suite with a private infinity pool and personal chef.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
    features: ['Private Pool', 'Personal Chef', 'Exclusive Terrace', 'Luxury Transfers'],
    inventory: 12 // Sufficient stock
  }
];

const INITIAL_TOURS: TourPackage[] = [
  {
    id: 'silver',
    name: 'Silver Kashi Darshan',
    duration: '1 Day (8 Hours)',
    price: 3500,
    description: 'A comprehensive guided tour covering the essential spiritual landmarks of Varanasi.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2076&auto=format&fit=crop',
    shuttle: 'Premium Shared AC Coach',
    places: ['Kashi Vishwanath Temple', 'Dashashwamedh Ghat'],
    shopping: ['Godowlia Market'],
    itinerary: [
      { time: '09:00 AM', activity: 'Departure from Nainagarh Palace' },
      { time: '11:00 AM', activity: 'Kashi Vishwanath Temple Darshan' },
      { time: '02:00 PM', activity: 'Traditional Lunch at local heritage home' },
      { time: '05:00 PM', activity: 'Evening Ganga Aarti at Dashashwamedh Ghat' }
    ]
  },
  {
    id: 'gold',
    name: 'Gold Heritage Trail',
    duration: '2 Days / 1 Night',
    price: 9500,
    description: 'Explore the hidden alleys and historical forts of Kashi with expert historians.',
    image: 'https://images.unsplash.com/photo-1591523311894-3e91eb737031?q=80&w=2070&auto=format&fit=crop',
    shuttle: 'Private Luxury Sedan',
    places: ['Ramnagar Fort', 'Sarnath', 'Manikarnika Ghat'],
    shopping: ['Weaver\'s Village'],
    itinerary: [
      { time: 'Day 1', activity: 'Historical Walk through Ramnagar Fort' },
      { time: 'Day 2', activity: 'Spiritual tour of Sarnath and Buddhist Stupas' }
    ]
  }
];

const INITIAL_BANQUETS: BanquetVenue[] = [
  { id: 'durbar', name: "The Grand Durbar Hall", capacity: "500 - 1000 Guests", description: "Our flagship indoor ballroom featuring pillar-less architecture and grand crystal chandeliers.", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop" },
  { id: 'bageecha', name: "Royal Bageecha", capacity: "1000 - 2500 Guests", description: "Expansive lush green lawns set against the backdrop of the illuminated palace facade.", image: "https://images.unsplash.com/photo-1587271407850-8d4389188465?q=80&w=2070&auto=format&fit=crop" }
];

const INITIAL_DINING_PACKAGES: DiningPackage[] = [
  { id: 'rose', name: 'Gulab Bagh (Rose Petal)', location: 'Private Garden Gazebo', basePrice: 1000, image: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=2070&auto=format&fit=crop' },
  { id: 'roof', name: 'Shikhar (Rooftop Dining)', location: 'Palace Terrace', basePrice: 2000, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop' }
];

const INITIAL_SPOTS: VaranasiSpot[] = [
  {
    id: 'kashi-vishwanath',
    name: 'Kashi Vishwanath Temple',
    category: 'Ghats & Temples',
    description: 'The spiritual heart of Kashi, dedicated to Lord Shiva, the city\'s patron deity.',
    image: 'https://images.unsplash.com/photo-1598977123418-45455531714e?q=80&w=2070&auto=format&fit=crop',
    location: 'Lahori Tola'
  }
];

const INITIAL_GENERAL: GeneralInfo = {
  heroTitle: "Royal Heritage Meets Divine Serenity",
  heroSubtitle: "Welcome to Varanasi's Crown Jewel",
  heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
  logoTitle: "NAINAGARH",
  logoSubtitle: "Palace & Resort"
};

const INITIAL_PAYMENT_CONFIG: PaymentConfig = {
  upiId: 'nainagarh@sbi',
  accountName: 'Nainagarh Palace Hospitality',
  gatewayLink: 'https://razorpay.me/@nainagarhpalace',
  bankDetails: 'SBI, Varanasi Branch, AC: XXXXXX9988, IFSC: SBIN0001234',
  qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=nainagarh@sbi'
};

const INITIAL_BOOKINGS: Booking[] = [
  { id: '#BK-101', customerName: 'Rajesh Sharma', date: '2024-01-15', month: 0, year: 2024, type: 'Room', status: 'Confirmed', amount: 8500, details: 'Heritage Deluxe (2 Guests)', paymentMethod: 'Gateway' },
  { id: '#BK-102', customerName: 'Amit Verma', date: '2024-02-10', month: 1, year: 2024, type: 'Dining', status: 'Confirmed', amount: 3000, details: 'Gold Buffet', paymentMethod: 'UPI' }
];

export const DataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [featureIcons, setFeatureIcons] = useState([]);
  const [banquets, setBanquets] = useState(INITIAL_BANQUETS);
  const [tours, setTours] = useState(INITIAL_TOURS);
  const [varanasiSpots, setVaranasiSpots] = useState(INITIAL_SPOTS);
  const [coupons, setCoupons] = useState([]);
  const [menu, setMenu] = useState([]);
  const [diningPackages, setDiningPackages] = useState(INITIAL_DINING_PACKAGES);
  const [gallery, setGallery] = useState([]);
  const [generalInfo, setGeneralInfo] = useState(INITIAL_GENERAL);
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: 'Mishra@Suresh', password: 'Suresh@durgakund1971', name: 'Suresh Mishra', role: 'MASTER' },
    { id: 'ritickmishra', password: 'ritick2001', name: 'Ritick Mishra', role: 'ADMIN' }
  ]);
  const [paymentConfig, setPaymentConfig] = useState(INITIAL_PAYMENT_CONFIG);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [inquiries, setInquiries] = useState([]);

  // Actions
  const updateRoom = (room: Room) => setRooms(prev => prev.map(r => r.id === room.id ? room : r));
  const addRoom = (room: Omit<Room, 'id'>) => setRooms(prev => [...prev, { ...room, id: Date.now().toString() }]);
  const deleteRoom = (id: string) => setRooms(prev => prev.filter(r => r.id !== id));
  const updateVaranasiSpot = (spot: VaranasiSpot) => setVaranasiSpots(prev => prev.map(s => s.id === spot.id ? spot : s));
  const addVaranasiSpot = (spot: Omit<VaranasiSpot, 'id'>) => setVaranasiSpots(prev => [...prev, { ...spot, id: Date.now().toString() }]);
  const deleteVaranasiSpot = (id: string) => setVaranasiSpots(prev => prev.filter(s => s.id !== id));
  const updateBanquet = (venue: BanquetVenue) => setBanquets(prev => prev.map(v => v.id === venue.id ? venue : v));
  const updateTour = (tour: TourPackage) => setTours(prev => prev.map(t => t.id === tour.id ? tour : t));
  const updateMenuCategory = (index: number, category: MenuCategory) => setMenu(prev => {
     const newMenu = [...prev];
     newMenu[index] = category;
     return newMenu;
  });
  const updateDiningPackage = (pkg: DiningPackage) => setDiningPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p));
  const updateGalleryImage = (img: GalleryImage) => setGallery(prev => prev.map(i => i.id === img.id ? img : i));
  const addGalleryImage = (img: GalleryImage) => setGallery(prev => [...prev, img]);
  const deleteGalleryImage = (id: string) => setGallery(prev => prev.filter(i => i.id !== id));
  const updateGeneralInfo = (info: GeneralInfo) => setGeneralInfo(info);
  const addFeatureIconMap = (mapping: Omit<FeatureIconMapping, 'id'>) => setFeatureIcons(prev => [...prev, { ...mapping, id: Date.now().toString() }]);
  const deleteFeatureIconMap = (id: string) => setFeatureIcons(prev => prev.filter(f => f.id !== id));
  const addAdmin = (admin: AdminUser) => {
    if (admins.length >= 5) return false;
    setAdmins(prev => [...prev, admin]);
    return true;
  };
  const removeAdmin = (id: string) => setAdmins(prev => prev.filter(a => a.id !== id));
  const updatePaymentConfig = (config: PaymentConfig) => setPaymentConfig(config);
  const addCoupon = (coupon: Omit<Coupon, 'id'>) => setCoupons(prev => [...prev, { ...coupon, id: Date.now().toString() }]);
  const deleteCoupon = (id: string) => setCoupons(prev => prev.filter(c => c.id !== id));
  
  const addBooking = (booking: Omit<Booking, 'id' | 'status'> & { status?: Booking['status'] }) => {
    const d = new Date(booking.date);
    const newBooking: Booking = {
        ...booking,
        id: `#BK-${Math.floor(Math.random() * 10000)}`,
        status: booking.status || 'Pending',
        month: d.getMonth(),
        year: d.getFullYear()
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const addInquiry = (inquiry: Omit<Inquiry, 'id' | 'status' | 'date'>) => {
    const newInquiry: Inquiry = {
        ...inquiry,
        id: `#IQ-${Math.floor(Math.random() * 10000)}`,
        status: 'New',
        date: new Date().toISOString().split('T')[0]
    };
    setInquiries(prev => [...prev, newInquiry]);
  };

  const updateInquiryStatus = (id: string, status: Inquiry['status']) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  return (
    <DataContext.Provider value={{
      rooms, banquets, tours, varanasiSpots, menu, diningPackages, gallery, generalInfo, featureIcons, bookings, inquiries, admins, paymentConfig, coupons,
      updateRoom, addRoom, deleteRoom, updateBanquet, updateTour, updateVaranasiSpot, addVaranasiSpot, deleteVaranasiSpot, updateMenuCategory, updateDiningPackage, updateGalleryImage, addGalleryImage, deleteGalleryImage, updateGeneralInfo,
      addFeatureIconMap, deleteFeatureIconMap, addAdmin, removeAdmin, updatePaymentConfig, addCoupon, deleteCoupon, addBooking, updateBookingStatus, addInquiry, updateInquiryStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};