import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  TrendingUp, 
  Plus,
  Check,
  X,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/firebase';
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    revenue: 0,
    pending: 0
  });
  const { t } = useTranslation();

  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
      
      const revenue = data.reduce((acc, curr: any) => acc + (curr.status === 'confirmed' ? curr.totalPrice : 0), 0);
      const pending = data.filter((b: any) => b.status === 'pending').length;
      
      setStats({
        totalBookings: data.length,
        revenue,
        pending
      });
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
      toast.success(t('admin.updateSuccess'));
    } catch (error) {
      toast.error(t('admin.updateError'));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif text-luxury-black mb-2">{t('admin.title')}</h1>
          <p className="text-luxury-black/60">{t('admin.subtitle')}</p>
        </div>
        <Button className="bg-gold hover:bg-gold/90 text-white rounded-full px-6">
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.addRoom')}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: t('admin.revenue'), value: `${stats.revenue} TND`, icon: TrendingUp, color: 'text-green-600' },
          { label: t('admin.totalBookings'), value: stats.totalBookings, icon: CalendarCheck, color: 'text-blue-600' },
          { label: t('admin.pending'), value: stats.pending, icon: Clock, color: 'text-orange-600' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={`p-4 rounded-2xl bg-gray-50 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-luxury-black/40 mb-1">{stat.label}</p>
                <p className="text-3xl font-serif text-luxury-black">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Table */}
      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="p-8 border-b border-gray-50">
          <CardTitle className="font-serif text-2xl">{t('admin.recent')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-black/40">
                  <th className="px-8 py-4">{t('admin.guest')}</th>
                  <th className="px-8 py-4">{t('admin.room')}</th>
                  <th className="px-8 py-4">{t('admin.dates')}</th>
                  <th className="px-8 py-4">{t('admin.total')}</th>
                  <th className="px-8 py-4">{t('admin.status')}</th>
                  <th className="px-8 py-4 text-right">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-medium text-luxury-black">{booking.userEmail}</div>
                      <div className="text-xs text-luxury-black/40">{booking.guests} {t('rooms.guests')}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-serif">{booking.roomName}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs text-luxury-black/60">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-luxury-black">
                      {booking.totalPrice} TND
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {booking.status === 'confirmed' ? t('admin.confirmed') : 
                         booking.status === 'cancelled' ? t('admin.cancelled') : 
                         t('admin.pendingStatus')}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="w-8 h-8 rounded-full border-green-200 text-green-600 hover:bg-green-50"
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="w-8 h-8 rounded-full border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => updateStatus(booking.id, 'cancelled')}
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
    </div>
  );
}
