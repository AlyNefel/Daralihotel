import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FEATURED_ROOMS } from '@/components/home/FeaturedRooms';
import { Button } from '@/components/ui/Button';
import { Star, Users, Maximize, ArrowLeft, Check, Wifi, Coffee, Tv, Wind } from 'lucide-react';
import { useState } from 'react';
import BookingModal from '@/components/booking/BookingModal';
import { useTranslation } from 'react-i18next';

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const room = FEATURED_ROOMS.find(r => r.id === id);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-cream">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">Room not found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-cream pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-8 hover:bg-luxury-black/5 rounded-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={room.image} 
                alt={room.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-md opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src={room.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 text-gold mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                <span className="text-luxury-black/40 text-sm ml-2 uppercase tracking-widest font-bold">{room.type}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif text-luxury-black mb-6">{room.name}</h1>
              <p className="text-luxury-black/60 text-lg leading-relaxed">
                {room.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 border-y border-gold/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Users className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Capacity</p>
                  <p className="text-luxury-black font-medium">{room.capacity} {t('rooms.guests')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Maximize className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Room Size</p>
                  <p className="text-luxury-black font-medium">{room.size}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-serif text-luxury-black">Amenities & Features</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Wifi, label: 'High-speed WiFi' },
                  { icon: Coffee, label: 'Coffee Maker' },
                  { icon: Tv, label: 'Smart TV' },
                  { icon: Wind, label: 'Air Conditioning' },
                  ...room.amenities.map(a => ({ icon: Check, label: a }))
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-luxury-black/70">
                    <item.icon className="w-4 h-4 text-gold" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between gap-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40 mb-1">Price per night</p>
                <p className="text-4xl font-bold text-luxury-black">{room.price} <span className="text-lg font-normal text-luxury-black/40">{t('rooms.tnd')}</span></p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 max-w-xs bg-luxury-black hover:bg-gold text-white rounded-2xl py-8 text-xl font-serif transition-all shadow-xl shadow-luxury-black/10"
              >
                {t('rooms.bookNow')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <BookingModal 
        room={room} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
