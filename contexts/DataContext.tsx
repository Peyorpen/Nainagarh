import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, BanquetVenue, TourPackage, MenuCategory, DiningPackage, GalleryImage, Booking, Inquiry, GeneralInfo, FeatureIconMapping, AdminUser, PaymentConfig, VaranasiSpot, Coupon } from '../types';
import { db } from '../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc, writeBatch } from 'firebase/firestore';

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

  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// --- INITIAL DATA CONSTANTS (Used for Seeding) ---
const INITIAL_ROOMS: Room[] = [
  {
    id: 'deluxe',
    name: 'Heritage Deluxe',
    description: 'Elegant rooms with traditional decor, overlooking the lush palace gardens.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop',
    features: ['King Size Bed', 'Garden View', 'Free Wi-Fi', 'Breakfast Included'],
    inventory: 3 
  },
  {
    id: 'royal',
    name: 'Royal Suite',
    description: 'Spacious suites featuring a private jharokha balcony and opulent Rajasthani interiors.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop',
    features: ['Private Balcony', 'Living Area', 'Butler Service', 'Jacuzzi'],
    inventory: 8 
  },
  {
    id: 'maharaja',
    name: 'Maharaja Presidential',
    description: 'The ultimate luxury experience. A sprawling 3-bedroom suite with a private infinity pool and personal chef.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
    features: ['Private Pool', 'Personal Chef', 'Exclusive Terrace', 'Luxury Transfers'],
    inventory: 12 
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
  { id: 'BK-101', customerName: 'Rajesh Sharma', date: '2024-01-15', month: 0, year: 2024, type: 'Room', status: 'Confirmed', amount: 8500, details: 'Heritage Deluxe (2 Guests)', paymentMethod: 'Gateway' },
  { id: 'BK-102', customerName: 'Amit Verma', date: '2024-02-10', month: 1, year: 2024, type: 'Dining', status: 'Confirmed', amount: 3000, details: 'Gold Buffet', paymentMethod: 'UPI' }
];

const INITIAL_ADMINS: AdminUser[] = [
    { id: 'Mishra@Suresh', password: 'Suresh@durgakund1971', name: 'Suresh Mishra', role: 'MASTER' },
    { id: 'ritickmishra', password: 'ritick2001', name: 'Ritick Mishra', role: 'ADMIN' }
];

export const DataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [banquets, setBanquets] = useState<BanquetVenue[]>([]);
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [varanasiSpots, setVaranasiSpots] = useState<VaranasiSpot[]>([]);
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [diningPackages, setDiningPackages] = useState<DiningPackage[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [featureIcons, setFeatureIcons] = useState<FeatureIconMapping[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  // Singletons
  const [generalInfo, setGeneralInfoState] = useState<GeneralInfo>(INITIAL_GENERAL);
  const [paymentConfig, setPaymentConfigState] = useState<PaymentConfig>(INITIAL_PAYMENT_CONFIG);

  // --- FETCH & SEED DATA ---
  useEffect(() => {
    const initData = async () => {
        try {
            // Check if DB is initialized (check rooms)
            const roomSnapshot = await getDocs(collection(db, 'rooms'));
            
            if (roomSnapshot.empty) {
                console.log("Database empty. Seeding initial data...");
                const batch = writeBatch(db);

                // Seed Collections
                INITIAL_ROOMS.forEach(r => batch.set(doc(db, 'rooms', r.id), r));
                INITIAL_BANQUETS.forEach(b => batch.set(doc(db, 'banquets', b.id), b));
                INITIAL_TOURS.forEach(t => batch.set(doc(db, 'tours', t.id), t));
                INITIAL_SPOTS.forEach(s => batch.set(doc(db, 'varanasiSpots', s.id), s));
                INITIAL_DINING_PACKAGES.forEach(p => batch.set(doc(db, 'diningPackages', p.id), p));
                INITIAL_BOOKINGS.forEach(b => batch.set(doc(db, 'bookings', b.id), b)); // Using manual ID for seed
                INITIAL_ADMINS.forEach(a => batch.set(doc(db, 'admins', a.id), a));
                
                // Seed Singletons
                batch.set(doc(db, 'settings', 'generalInfo'), INITIAL_GENERAL);
                batch.set(doc(db, 'settings', 'paymentConfig'), INITIAL_PAYMENT_CONFIG);

                await batch.commit();
                console.log("Seeding complete.");
                
                // Set Local State from Initial (optimistic)
                setRooms(INITIAL_ROOMS);
                setBanquets(INITIAL_BANQUETS);
                setTours(INITIAL_TOURS);
                setVaranasiSpots(INITIAL_SPOTS);
                setDiningPackages(INITIAL_DINING_PACKAGES);
                setBookings(INITIAL_BOOKINGS);
                setAdmins(INITIAL_ADMINS);
                setGeneralInfoState(INITIAL_GENERAL);
                setPaymentConfigState(INITIAL_PAYMENT_CONFIG);
            } else {
                // Fetch All Data
                const roomsData = (await getDocs(collection(db, 'rooms'))).docs.map(d => ({ ...d.data(), id: d.id } as Room));
                setRooms(roomsData);

                const banquetsData = (await getDocs(collection(db, 'banquets'))).docs.map(d => ({ ...d.data(), id: d.id } as BanquetVenue));
                setBanquets(banquetsData);

                const toursData = (await getDocs(collection(db, 'tours'))).docs.map(d => ({ ...d.data(), id: d.id } as TourPackage));
                setTours(toursData);

                const spotsData = (await getDocs(collection(db, 'varanasiSpots'))).docs.map(d => ({ ...d.data(), id: d.id } as VaranasiSpot));
                setVaranasiSpots(spotsData);
                
                const diningData = (await getDocs(collection(db, 'diningPackages'))).docs.map(d => ({ ...d.data(), id: d.id } as DiningPackage));
                setDiningPackages(diningData);
                
                const galleryData = (await getDocs(collection(db, 'gallery'))).docs.map(d => ({ ...d.data(), id: d.id } as GalleryImage));
                setGallery(galleryData);

                const bookingsData = (await getDocs(collection(db, 'bookings'))).docs.map(d => ({ ...d.data(), id: d.id } as Booking));
                setBookings(bookingsData);

                const inquiryData = (await getDocs(collection(db, 'inquiries'))).docs.map(d => ({ ...d.data(), id: d.id } as Inquiry));
                setInquiries(inquiryData);

                const couponData = (await getDocs(collection(db, 'coupons'))).docs.map(d => ({ ...d.data(), id: d.id } as Coupon));
                setCoupons(couponData);

                const adminData = (await getDocs(collection(db, 'admins'))).docs.map(d => ({ ...d.data(), id: d.id } as AdminUser));
                setAdmins(adminData);

                // Fetch Settings
                const generalDoc = await getDocs(collection(db, 'settings')); // simplified fetch for now
                generalDoc.forEach(doc => {
                    if (doc.id === 'generalInfo') setGeneralInfoState(doc.data() as GeneralInfo);
                    if (doc.id === 'paymentConfig') setPaymentConfigState(doc.data() as PaymentConfig);
                });
            }
        } catch (e) {
            console.error("Error initializing data:", e);
        } finally {
            setLoading(false);
        }
    };
    initData();
  }, []);

  // --- ACTIONS WITH FIRESTORE persistence ---

  // Rooms
  const addRoom = async (room: Omit<Room, 'id'>) => {
    const docRef = await addDoc(collection(db, 'rooms'), room);
    setRooms(prev => [...prev, { ...room, id: docRef.id }]);
  };
  const updateRoom = async (room: Room) => {
    await setDoc(doc(db, 'rooms', room.id), room);
    setRooms(prev => prev.map(r => r.id === room.id ? room : r));
  };
  const deleteRoom = async (id: string) => {
    await deleteDoc(doc(db, 'rooms', id));
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  // Banquets
  const updateBanquet = async (venue: BanquetVenue) => {
    await setDoc(doc(db, 'banquets', venue.id), venue);
    setBanquets(prev => prev.map(v => v.id === venue.id ? venue : v));
  };

  // Tours
  const updateTour = async (tour: TourPackage) => {
    await setDoc(doc(db, 'tours', tour.id), tour);
    setTours(prev => prev.map(t => t.id === tour.id ? tour : t));
  };

  // Spots
  const addVaranasiSpot = async (spot: Omit<VaranasiSpot, 'id'>) => {
    const docRef = await addDoc(collection(db, 'varanasiSpots'), spot);
    setVaranasiSpots(prev => [...prev, { ...spot, id: docRef.id }]);
  };
  const updateVaranasiSpot = async (spot: VaranasiSpot) => {
    await setDoc(doc(db, 'varanasiSpots', spot.id), spot);
    setVaranasiSpots(prev => prev.map(s => s.id === spot.id ? spot : s));
  };
  const deleteVaranasiSpot = async (id: string) => {
    await deleteDoc(doc(db, 'varanasiSpots', id));
    setVaranasiSpots(prev => prev.filter(s => s.id !== id));
  };

  // Menu (Simplification: Storing menu locally for now as structure is complex in 'menu' array)
  const updateMenuCategory = (index: number, category: MenuCategory) => {
      setMenu(prev => {
         const newMenu = [...prev];
         newMenu[index] = category;
         return newMenu;
      });
  };

  // Dining Packages
  const updateDiningPackage = async (pkg: DiningPackage) => {
    await setDoc(doc(db, 'diningPackages', pkg.id), pkg);
    setDiningPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p));
  };

  // Gallery
  const addGalleryImage = async (img: GalleryImage) => {
    // Note: img already has an ID passed from dashboard, or we generate one
    const newId = img.id || Date.now().toString();
    const newImg = { ...img, id: newId };
    await setDoc(doc(db, 'gallery', newId), newImg);
    setGallery(prev => [...prev, newImg]);
  };
  const updateGalleryImage = async (img: GalleryImage) => {
    await setDoc(doc(db, 'gallery', img.id), img);
    setGallery(prev => prev.map(i => i.id === img.id ? img : i));
  };
  const deleteGalleryImage = async (id: string) => {
    await deleteDoc(doc(db, 'gallery', id));
    setGallery(prev => prev.filter(i => i.id !== id));
  };

  // Settings
  const updateGeneralInfo = async (info: GeneralInfo) => {
    await setDoc(doc(db, 'settings', 'generalInfo'), info);
    setGeneralInfoState(info);
  };
  const updatePaymentConfig = async (config: PaymentConfig) => {
    await setDoc(doc(db, 'settings', 'paymentConfig'), config);
    setPaymentConfigState(config);
  };

  // Features
  const addFeatureIconMap = (mapping: Omit<FeatureIconMapping, 'id'>) => setFeatureIcons(prev => [...prev, { ...mapping, id: Date.now().toString() }]);
  const deleteFeatureIconMap = (id: string) => setFeatureIcons(prev => prev.filter(f => f.id !== id));

  // Admins
  const addAdmin = (admin: AdminUser) => {
    if (admins.length >= 5) return false;
    // Persist
    setDoc(doc(db, 'admins', admin.id), admin);
    setAdmins(prev => [...prev, admin]);
    return true;
  };
  const removeAdmin = (id: string) => {
    deleteDoc(doc(db, 'admins', id));
    setAdmins(prev => prev.filter(a => a.id !== id));
  };

  // Coupons
  const addCoupon = async (coupon: Omit<Coupon, 'id'>) => {
    const docRef = await addDoc(collection(db, 'coupons'), coupon);
    setCoupons(prev => [...prev, { ...coupon, id: docRef.id }]);
  };
  const deleteCoupon = async (id: string) => {
    await deleteDoc(doc(db, 'coupons', id));
    setCoupons(prev => prev.filter(c => c.id !== id));
  };
  
  // Bookings
  const addBooking = async (booking: Omit<Booking, 'id' | 'status'> & { status?: Booking['status'] }) => {
    const d = new Date(booking.date);
    const newBookingBase = {
        ...booking,
        status: booking.status || 'Pending',
        month: d.getMonth(),
        year: d.getFullYear()
    };
    
    // Add to Firestore to get ID
    const docRef = await addDoc(collection(db, 'bookings'), newBookingBase);
    
    // Create local object with the ID
    const newBooking: Booking = { ...newBookingBase, id: docRef.id };
    
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    await updateDoc(doc(db, 'bookings', id), { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  // Inquiries
  const addInquiry = async (inquiry: Omit<Inquiry, 'id' | 'status' | 'date'>) => {
    const newInquiryBase = {
        ...inquiry,
        status: 'New' as const,
        date: new Date().toISOString().split('T')[0]
    };
    const docRef = await addDoc(collection(db, 'inquiries'), newInquiryBase);
    
    const newInquiry: Inquiry = { ...newInquiryBase, id: docRef.id };
    setInquiries(prev => [...prev, newInquiry]);
  };

  const updateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    await updateDoc(doc(db, 'inquiries', id), { status });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  return (
    <DataContext.Provider value={{
      rooms, banquets, tours, varanasiSpots, menu, diningPackages, gallery, generalInfo, featureIcons, bookings, inquiries, admins, paymentConfig, coupons,
      updateRoom, addRoom, deleteRoom, updateBanquet, updateTour, updateVaranasiSpot, addVaranasiSpot, deleteVaranasiSpot, updateMenuCategory, updateDiningPackage, updateGalleryImage, addGalleryImage, deleteGalleryImage, updateGeneralInfo,
      addFeatureIconMap, deleteFeatureIconMap, addAdmin, removeAdmin, updatePaymentConfig, addCoupon, deleteCoupon, addBooking, updateBookingStatus, addInquiry, updateInquiryStatus, loading
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
