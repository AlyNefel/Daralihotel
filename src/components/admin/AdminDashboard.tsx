import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  TrendingUp, 
  Plus,
  Check,
  X,
  Clock,
  ChevronRight,
  LogOut,
  Settings,
  Search,
  Mail,
  Phone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';

type Tab = 'dashboard' | 'rooms' | 'bookings' | 'clients';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    revenue: 0,
    pending: 0,
    occupancy: 0
  });
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, roomsRes, clientsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/rooms'),
        fetch('/api/auth/clients')
      ]);

      const bookingsData = await bookingsRes.json();
      const roomsData = await roomsRes.json();
      const clientsData = await clientsRes.json();

      setBookings(bookingsData);
      setRooms(roomsData);
      setClients(clientsData);

      const revenue = bookingsData.reduce((acc: number, curr: any) => acc + (curr.status === 'confirmed' ? curr.totalPrice : 0), 0);
      const pending = bookingsData.filter((b: any) => b.status === 'pending').length;
      
      setStats({
        totalBookings: bookingsData.length,
        revenue,
        pending,
        occupancy: Math.round((bookingsData.filter((b: any) => b.status === 'confirmed').length / (roomsData.length || 1)) * 100)
      });
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success('Booking updated');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-gold text-white shadow-lg shadow-gold/20' 
          : 'text-luxury-black/60 hover:bg-luxury-cream hover:text-luxury-black'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      {activeTab === id && (
        <motion.div layoutId="active-pill" className="ml-auto">
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F7F4]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-luxury-black/5 p-6 flex flex-col fixed h-full z-30">
        <div className="mb-10 px-4">
          <span className="text-2xl font-serif font-bold tracking-tighter text-luxury-black">
            DAR <span className="text-gold">ALI</span>
          </span>
          <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-black/40 mt-1 font-bold">Management</p>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="bookings" icon={CalendarCheck} label="Reservations" />
          <SidebarItem id="rooms" icon={BedDouble} label="Rooms" />
          <SidebarItem id="clients" icon={Users} label="Clients" />
        </nav>

        <div className="pt-6 border-t border-luxury-black/5 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-luxury-black/60 hover:bg-luxury-cream transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif text-luxury-black capitalize">{activeTab}</h1>
            <p className="text-luxury-black/40 text-sm">Welcome back to your dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-black/30" />
              <Input placeholder="Search..." className="pl-10 rounded-full bg-white border-none shadow-sm w-64 focus-visible:ring-gold" />
            </div>
            <Button className="bg-gold hover:bg-gold/90 text-white rounded-full px-6 shadow-lg shadow-gold/20">
              <Plus className="w-4 h-4 mr-2" />
              New Action
            </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'Occupancy', value: `${stats.occupancy}%`, icon: BedDouble, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/30">{stat.label}</p>
                        <p className="text-2xl font-serif text-luxury-black">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Bookings */}
              <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                <CardHeader className="p-8 border-b border-luxury-black/5 flex flex-row justify-between items-center">
                  <CardTitle className="font-serif text-xl">Recent Reservations</CardTitle>
                  <Button variant="ghost" className="text-gold text-sm font-medium">View All</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-luxury-cream/30 text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-black/40">
                          <th className="px-8 py-4">Guest</th>
                          <th className="px-8 py-4">Room</th>
                          <th className="px-8 py-4">Dates</th>
                          <th className="px-8 py-4">Total</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-luxury-black/5">
                        {bookings.slice(0, 5).map((booking) => (
                          <tr key={booking._id} className="hover:bg-luxury-cream/20 transition-colors">
                            <td className="px-8 py-5">
                              <div className="font-medium text-luxury-black">{booking.clientName}</div>
                              <div className="text-xs text-luxury-black/40">{booking.clientEmail}</div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="text-sm font-serif">{booking.roomId?.name || 'Standard Room'}</div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="text-xs text-luxury-black/60">
                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-8 py-5 font-bold text-luxury-black">
                              {formatPrice(booking.totalPrice)}
                            </td>
                            <td className="px-8 py-5">
                              <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {booking.status}
                              </Badge>
                            </td>
                            <td className="px-8 py-5 text-right space-x-2">
                              {booking.status === 'pending' && (
                                <>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="w-8 h-8 rounded-full border-green-200 text-green-600 hover:bg-green-50"
                                    onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="w-8 h-8 rounded-full border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'clients' && (
            <motion.div
              key="clients"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {clients.map((client) => (
                <Card key={client._id} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-lg">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-luxury-black">{client.name}</h3>
                        <p className="text-xs text-luxury-black/40 uppercase tracking-widest font-bold">Premium Client</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-luxury-black/60">
                        <Mail className="w-4 h-4 text-gold" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-luxury-black/60">
                        <Phone className="w-4 h-4 text-gold" />
                        +216 XX XXX XXX
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-luxury-black/5 flex justify-between items-center">
                      <div className="text-xs text-luxury-black/40">Joined {new Date(client.createdAt).toLocaleDateString()}</div>
                      <Button variant="ghost" size="sm" className="text-gold hover:bg-gold/5">View History</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {activeTab === 'rooms' && (
            <motion.div
              key="rooms"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {rooms.map((room) => (
                <Card key={room._id} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden group">
                  <div className="h-48 overflow-hidden relative">
                    <img src={room.images?.[0] || 'https://picsum.photos/seed/room/800/600'} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-luxury-black backdrop-blur-md border-none rounded-full px-3 py-1 text-[10px] uppercase tracking-widest">
                        {room.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-serif text-xl text-luxury-black">{room.name}</h3>
                      <p className="text-gold font-bold">{formatPrice(room.price)}<span className="text-[10px] text-luxury-black/40 font-normal">/night</span></p>
                    </div>
                    <p className="text-sm text-luxury-black/60 line-clamp-2 mb-6">{room.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {room.amenities?.slice(0, 3).map((a: string, i: number) => (
                          <div key={i} className="w-8 h-8 rounded-lg bg-luxury-cream flex items-center justify-center text-luxury-black/40">
                            {/* Placeholder for amenity icons */}
                            <div className="w-4 h-4 rounded-full border border-current" />
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full border-gold text-gold hover:bg-gold hover:text-white">Edit Room</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <button className="border-2 border-dashed border-gold/20 rounded-2xl flex flex-col items-center justify-center gap-4 p-8 hover:bg-gold/5 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-serif text-lg text-luxury-black">Add New Room</p>
                  <p className="text-xs text-luxury-black/40">Expand your inventory</p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
