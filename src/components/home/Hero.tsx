import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Play, Calendar as CalendarIcon, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  const scrollToRooms = () => {
    const element = document.getElementById('rooms');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-luxury-black pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070" 
          alt="Luxury Hotel"
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/40 via-transparent to-luxury-black/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block text-gold uppercase tracking-[0.3em] text-sm font-medium mb-6">
            {t('hero.subtitle')}
          </span>
          <h1 className="text-5xl md:text-8xl text-white font-serif mb-8 leading-[1.1] tracking-tight">
            {t('hero.title')}
            <br />
            <span className="text-3xl md:text-5xl opacity-90">{t('hero.arabicTitle')}</span>
          </h1>
          
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button 
              size="lg" 
              onClick={scrollToRooms}
              className="bg-gold hover:bg-gold/90 text-white rounded-full px-10 py-7 text-lg group border-none"
            >
              {t('hero.bookNow')}
              <ArrowRight className={`ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180' : ''}`} />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full px-10 py-7 text-lg bg-transparent"
            >
              <Play className={`mr-2 w-5 h-5 fill-current ${isAr ? 'ml-2 mr-0' : ''}`} />
              {t('hero.watchVideo')}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Availability Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-20 w-full max-w-6xl px-6"
      >
        <div className="bg-white/95 backdrop-blur-md p-4 md:p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-4 border border-white/20">
          {/* Check In */}
          <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-luxury-black/40 mb-1">{t('search.checkIn')}</label>
            <Popover>
              <PopoverTrigger className="flex items-center gap-2 text-luxury-black font-medium w-full text-left cursor-pointer">
                <CalendarIcon className="w-4 h-4 text-gold" />
                {checkIn ? format(checkIn, 'MMM dd, yyyy') : t('search.checkIn')}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(date) => date < new Date()} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check Out */}
          <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-luxury-black/40 mb-1">{t('search.checkOut')}</label>
            <Popover>
              <PopoverTrigger className="flex items-center gap-2 text-luxury-black font-medium w-full text-left cursor-pointer">
                <CalendarIcon className="w-4 h-4 text-gold" />
                {checkOut ? format(checkOut, 'MMM dd, yyyy') : t('search.checkOut')}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(date) => date < (checkIn || new Date())} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Room Type */}
          <div className="flex-1 px-6 py-3">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-luxury-black/40 mb-1">{t('search.roomType')}</label>
            <Select>
              <SelectTrigger className="border-none p-0 h-auto bg-transparent shadow-none focus:ring-0 text-luxury-black font-medium">
                <SelectValue placeholder={t('search.allTypes')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">{t('search.allTypes')}</SelectItem>
                <SelectItem value="suite">{t('search.suite')}</SelectItem>
                <SelectItem value="deluxe">{t('search.deluxe')}</SelectItem>
                <SelectItem value="double">{t('search.double')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button 
            onClick={scrollToRooms}
            className="bg-luxury-black hover:bg-gold text-white rounded-xl md:rounded-full px-10 py-8 md:py-6 transition-all"
          >
            <Search className="w-5 h-5 mr-2" />
            {t('search.search')}
          </Button>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 hidden md:flex`}
      >
        <span className="text-white/40 text-[10px] uppercase tracking-[0.4em] vertical-text">{t('hero.scroll')}</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
}
