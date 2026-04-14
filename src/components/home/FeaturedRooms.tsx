import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star, Users, Maximize, Info } from 'lucide-react';
import BookingModal from '../booking/BookingModal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (room: any) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/room/${id}`);
    window.scrollTo(0, 0);
  };

  if (loading) return null;

  return (
    <section id="rooms" className="py-24 bg-luxury-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-gold uppercase tracking-widest text-sm font-medium mb-4 block">{t('rooms.subtitle')}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-luxury-black leading-tight">
              {t('rooms.title')} <br /><span className="italic">{t('rooms.titleItalic')}</span>
            </h2>
          </div>
          <Button variant="link" className="text-gold hover:text-gold/80 p-0 text-lg font-serif italic">
            {t('rooms.viewAll')} →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.map((room, i) => (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group overflow-hidden border-none bg-white shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl">
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000'} 
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-luxury-black">
                    {room.type}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-1 text-gold">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-serif text-luxury-black">{room.name}</h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-luxury-black">{formatPrice(room.price)}</span>
                      <span className="text-xs text-luxury-black/50 block uppercase tracking-tighter">/ {t('rooms.night')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-8 text-luxury-black/60 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{room.capacity} {t('rooms.guests')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize className="w-4 h-4" />
                      <span>{room.size || '45m²'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {room.amenities?.map((amenity: string) => (
                      <span key={amenity} className="text-[10px] uppercase tracking-wider bg-luxury-cream px-3 py-1 rounded-full text-luxury-black/70">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => handleViewDetails(room._id)}
                      className="flex-1 border-luxury-black/10 hover:bg-luxury-black/5 rounded-xl py-6 transition-colors duration-300"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      {t('booking.viewDetails')}
                    </Button>
                    <Button 
                      onClick={() => handleBookClick(room)}
                      className="flex-1 bg-luxury-black hover:bg-gold text-white rounded-xl py-6 transition-colors duration-300"
                    >
                      {t('rooms.bookNow')}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <BookingModal 
        room={selectedRoom} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
