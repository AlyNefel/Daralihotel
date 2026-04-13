import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, CreditCard, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils.ts"

interface BookingModalProps {
  room: {
    id: string;
    name: string;
    price: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ room, isOpen, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Guest fields
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: ''
  });

  const calculateTotal = () => {
    if (!date.from || !date.to || !room) return 0;
    const days = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24));
    return days * room.price;
  };

  const handleBooking = async () => {
    if (!date.from || !date.to) {
      toast.error(t('booking.dateError') || "Please select check-in and check-out dates");
      return;
    }

    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        roomId: room?.id,
        roomName: room?.name,
        userId: user?.uid || 'guest',
        userEmail: guestInfo.email,
        userName: `${guestInfo.firstName} ${guestInfo.lastName}`,
        userPhone: guestInfo.phone,
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
        totalPrice: calculateTotal(),
        guests,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setIsSuccess(true);
      toast.success(t('booking.successToast') || "Booking request sent successfully!");
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setDate({ from: undefined, to: undefined });
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(t('booking.errorToast') || "Failed to process booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-luxury-cream border-gold/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-serif text-luxury-black">{t('booking.title')} {room.name}</DialogTitle>
          <DialogDescription className="text-luxury-black/60">
            {t('booking.description')}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-serif mb-2">{t('booking.successTitle')}</h3>
              <p className="text-luxury-black/60">{t('booking.successDesc')}</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 py-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dates Selection */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs uppercase tracking-widest font-bold">{t('booking.selectDates')}</Label>
                  <Popover>
                    <PopoverTrigger 
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        `w-full justify-start text-left font-normal border-gold/20 h-12 rounded-xl cursor-pointer ${!date.from && "text-muted-foreground"}`
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gold" />
                      {date.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>{t('booking.checkIn')} - {t('booking.checkOut')}</span>
                      )}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date.from}
                        selected={{ from: date.from, to: date.to }}
                        onSelect={(range: any) => setDate(range || { from: undefined, to: undefined })}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guest Info Fields */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-bold">{t('booking.firstName')} *</Label>
                  <Input 
                    placeholder={t('booking.firstName')}
                    value={guestInfo.firstName}
                    onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                    className="h-12 border-gold/20 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-bold">{t('booking.lastName')} *</Label>
                  <Input 
                    placeholder={t('booking.lastName')}
                    value={guestInfo.lastName}
                    onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                    className="h-12 border-gold/20 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-bold">{t('booking.email')} *</Label>
                  <Input 
                    type="email"
                    placeholder={t('booking.email')}
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                    className="h-12 border-gold/20 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest font-bold">{t('booking.phone')} *</Label>
                  <Input 
                    placeholder={t('booking.phone')}
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                    className="h-12 border-gold/20 rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-bold">{t('booking.guests')}</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                      <Input 
                        type="number" 
                        min={1} 
                        max={4} 
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="pl-10 h-12 border-gold/20 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-bold">{t('booking.totalPrice')}</Label>
                    <div className="h-12 flex items-center px-4 bg-luxury-black text-white rounded-xl font-bold">
                      {calculateTotal()} {t('rooms.tnd')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gold/10">
                <Button 
                  onClick={handleBooking} 
                  disabled={isSubmitting}
                  className="w-full h-14 bg-luxury-black hover:bg-gold text-white rounded-xl text-lg font-serif transition-all"
                >
                  {isSubmitting ? t('booking.processing') : t('booking.confirm')}
                </Button>
                <p className="text-[10px] text-center mt-4 text-luxury-black/40 uppercase tracking-widest">
                  {t('booking.noPayment')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
