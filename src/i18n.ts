import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        rooms: "Rooms",
        about: "About",
        contact: "Contact",
        admin: "Admin",
        exitAdmin: "Exit Admin",
        signIn: "Sign In",
        logout: "Logout"
      },
      hero: {
        subtitle: "Experience Tunisia's Finest",
        title: "Welcome to Dar Ali",
        arabicTitle: "تجربة فاخرة في قلب تونس",
        description: "Where traditional Tunisian hospitality meets modern luxury. Discover an oasis of tranquility and elegance in the heart of the city.",
        bookNow: "Book Your Stay",
        watchVideo: "Watch Video",
        scroll: "Scroll"
      },
      rooms: {
        subtitle: "Our Accommodations",
        title: "Refined Living for the",
        titleItalic: "Discerning Traveler",
        viewAll: "View All Rooms",
        guests: "Guests",
        bookNow: "Book Now",
        night: "Night",
        tnd: "TND"
      },
      about: {
        subtitle: "Our Story",
        title: "A Heritage of",
        titleItalic: "Excellence",
        p1: "Dar Ali was born from a vision to create a sanctuary that honors Tunisia's rich cultural heritage while providing the world-class amenities expected by modern travelers.",
        p2: "Every corner of our hotel tells a story, from the hand-crafted tiles to the curated art pieces that adorn our walls. We invite you to be part of our journey.",
        learnMore: "Learn More"
      },
      contact: {
        title: "Ready for an",
        titleItalic: "Unforgettable",
        titleEnd: "Stay?",
        description: "Join us at Dar Ali and experience the pinnacle of Tunisian hospitality.",
        callUs: "Call Us",
        emailUs: "Email Us"
      },
      footer: {
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        cookies: "Cookie Policy",
        rights: "All rights reserved."
      },
      booking: {
        title: "Book",
        description: "Complete your reservation for an exceptional stay.",
        selectDates: "Select Dates",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Guests",
        totalPrice: "Total Price",
        confirm: "Confirm Reservation",
        processing: "Processing...",
        noPayment: "No payment required now. Pay at the hotel.",
        successTitle: "Reservation Received!",
        successDesc: "We'll send a confirmation email shortly.",
        signInError: "Please sign in to book a room",
        dateError: "Please select check-in and check-out dates",
        successToast: "Booking request sent successfully!",
        errorToast: "Failed to process booking. Please try again.",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone Number",
        viewDetails: "View Details"
      },
      search: {
        title: "Check Availability",
        checkIn: "Check In",
        checkOut: "Check Out",
        roomType: "Room Type",
        search: "Search",
        allTypes: "All Types",
        suite: "Suite",
        deluxe: "Deluxe",
        double: "Double"
      },
      admin: {
        title: "Admin Dashboard",
        subtitle: "Manage your luxury estate and reservations.",
        addRoom: "Add New Room",
        revenue: "Total Revenue",
        totalBookings: "Total Bookings",
        pending: "Pending Requests",
        recent: "Recent Reservations",
        guest: "Guest",
        room: "Room",
        dates: "Dates",
        total: "Total",
        status: "Status",
        actions: "Actions",
        confirmed: "Confirmed",
        cancelled: "Cancelled",
        pendingStatus: "Pending",
        updateSuccess: "Booking updated successfully",
        updateError: "Failed to update booking"
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        rooms: "Chambres",
        about: "À Propos",
        contact: "Contact",
        admin: "Admin",
        exitAdmin: "Quitter Admin",
        signIn: "Se Connecter",
        logout: "Déconnexion"
      },
      hero: {
        subtitle: "Le Meilleur de la Tunisie",
        title: "Bienvenue à Dar Ali",
        arabicTitle: "تجربة فاخرة في قلب تونس",
        description: "Où l'hospitalité tunisienne traditionnelle rencontre le luxe moderne. Découvrez une oasis de tranquillité et d'élégance au cœur de la ville.",
        bookNow: "Réserver Votre Séjour",
        watchVideo: "Voir la Vidéo",
        scroll: "Défiler"
      },
      rooms: {
        subtitle: "Nos Hébergements",
        title: "Un Art de Vivre pour le",
        titleItalic: "Voyageur Exigeant",
        viewAll: "Voir Toutes les Chambres",
        guests: "Personnes",
        bookNow: "Réserver",
        night: "Nuit",
        tnd: "TND"
      },
      about: {
        subtitle: "Notre Histoire",
        title: "Un Héritage d'",
        titleItalic: "Excellence",
        p1: "Dar Ali est né d'une vision de créer un sanctuaire qui honore le riche patrimoine culturel de la Tunisie tout en offrant les équipements de classe mondiale attendus par les voyageurs modernes.",
        p2: "Chaque coin de notre hôtel raconte une histoire, des carreaux artisanaux aux pièces d'art curatées qui ornent nos murs. Nous vous invitons à faire partie de notre voyage.",
        learnMore: "En Savoir Plus"
      },
      contact: {
        title: "Prêt pour un",
        titleItalic: "Inoubliable",
        titleEnd: "Séjour ?",
        description: "Rejoignez-nous à Dar Ali et découvrez le summum de l'hospitalité tunisienne.",
        callUs: "Appelez-nous",
        emailUs: "Écrivez-nous"
      },
      footer: {
        privacy: "Politique de Confidentialité",
        terms: "Conditions d'Utilisation",
        cookies: "Politique de Cookies",
        rights: "Tous droits réservés."
      },
      booking: {
        title: "Réserver",
        description: "Complétez votre réservation pour un séjour exceptionnel.",
        selectDates: "Sélectionner les Dates",
        checkIn: "Arrivée",
        checkOut: "Départ",
        guests: "Invités",
        totalPrice: "Prix Total",
        confirm: "Confirmer la Réservation",
        processing: "Traitement...",
        noPayment: "Aucun paiement requis maintenant. Payez à l'hôtel.",
        successTitle: "Réservation Reçue !",
        successDesc: "Nous vous enverrons un e-mail de confirmation sous peu.",
        signInError: "Veuillez vous connecter pour réserver une chambre",
        dateError: "Veuillez sélectionner les dates d'arrivée et de départ",
        successToast: "Demande de réservation envoyée avec succès !",
        errorToast: "Échec du traitement de la réservation. Veuillez réessayer.",
        firstName: "Prénom",
        lastName: "Nom",
        email: "E-mail",
        phone: "Numéro de Téléphone",
        viewDetails: "Voir Détails"
      },
      search: {
        title: "Vérifier la Disponibilité",
        checkIn: "Arrivée",
        checkOut: "Départ",
        roomType: "Type de Chambre",
        search: "Rechercher",
        allTypes: "Tous les Types",
        suite: "Suite",
        deluxe: "Deluxe",
        double: "Double"
      },
      admin: {
        title: "Tableau de Bord Admin",
        subtitle: "Gérez votre domaine de luxe et vos réservations.",
        addRoom: "Ajouter une Chambre",
        revenue: "Revenu Total",
        totalBookings: "Total des Réservations",
        pending: "Demandes en Attente",
        recent: "Réservations Récentes",
        guest: "Client",
        room: "Chambre",
        dates: "Dates",
        total: "Total",
        status: "Statut",
        actions: "Actions",
        confirmed: "Confirmé",
        cancelled: "Annulé",
        pendingStatus: "En attente",
        updateSuccess: "Réservation mise à jour avec succès",
        updateError: "Échec de la mise à jour de la réservation"
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        rooms: "الغرف",
        about: "حولنا",
        contact: "اتصل بنا",
        admin: "الإدارة",
        exitAdmin: "خروج من الإدارة",
        signIn: "تسجيل الدخول",
        logout: "تسجيل الخروج"
      },
      hero: {
        subtitle: "تجربة الأفضل في تونس",
        title: "مرحباً بكم في دار علي",
        arabicTitle: "تجربة فاخرة في قلب تونس",
        description: "حيث تلتقي الضيافة التونسية التقليدية بالفخامة الحديثة. اكتشف واحة من الهدوء والأناقة في قلب المدينة.",
        bookNow: "احجز إقامتك",
        watchVideo: "شاهد الفيديو",
        scroll: "مرر لأسفل"
      },
      rooms: {
        subtitle: "أماكن الإقامة لدينا",
        title: "حياة راقية لـ",
        titleItalic: "المسافر المتميز",
        viewAll: "عرض جميع الغرف",
        guests: "ضيوف",
        bookNow: "احجز الآن",
        night: "ليلة",
        tnd: "د.ت"
      },
      about: {
        subtitle: "قصتنا",
        title: "تراث من",
        titleItalic: "التميز",
        p1: "ولدت دار علي من رؤية لإنشاء ملاذ يكرم التراث الثقافي الغني لتونس مع توفير وسائل الراحة العالمية التي يتوقعها المسافرون العصريون.",
        p2: "كل ركن في فندقنا يحكي قصة، من البلاط المصنوع يدوياً إلى القطع الفنية المنسقة التي تزين جدراننا. ندعوكم لتكونوا جزءاً من رحلتنا.",
        learnMore: "تعرف على المزيد"
      },
      contact: {
        title: "هل أنت مستعد لـ",
        titleItalic: "إقامة لا تُنسى",
        titleEnd: "؟",
        description: "انضم إلينا في دار علي واختبر قمة الضيافة التونسية.",
        callUs: "اتصل بنا",
        emailUs: "راسلنا"
      },
      footer: {
        privacy: "سياسة الخصوصية",
        terms: "شروط الخدمة",
        cookies: "سياسة الكوكيز",
        rights: "جميع الحقوق محفوظة."
      },
      booking: {
        title: "حجز",
        description: "أكمل حجزك لإقامة استثنائية.",
        selectDates: "اختر التواريخ",
        checkIn: "تسجيل الوصول",
        checkOut: "تسجيل المغادرة",
        guests: "الضيوف",
        totalPrice: "السعر الإجمالي",
        confirm: "تأكيد الحجز",
        processing: "جاري المعالجة...",
        noPayment: "لا يلزم الدفع الآن. ادفع في الفندق.",
        successTitle: "تم استلام الحجز!",
        successDesc: "سنرسل لك رسالة تأكيد بالبريد الإلكتروني قريباً.",
        signInError: "يرجى تسجيل الدخول لحجز غرفة",
        dateError: "يرجى اختيار تواريخ تسجيل الوصول والمغادرة",
        successToast: "تم إرسال طلب الحجز بنجاح!",
        errorToast: "فشل في معالجة الحجز. يرجى المحاولة مرة أخرى.",
        firstName: "الاسم الأول",
        lastName: "اللقب",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        viewDetails: "عرض التفاصيل"
      },
      search: {
        title: "التحقق من التوفر",
        checkIn: "تسجيل الوصول",
        checkOut: "تسجيل المغادرة",
        roomType: "نوع الغرفة",
        search: "بحث",
        allTypes: "جميع الأنواع",
        suite: "جناح",
        deluxe: "ديلوكس",
        double: "مزدوجة"
      },
      admin: {
        title: "لوحة تحكم الإدارة",
        subtitle: "إدارة عقارك الفاخر والحجوزات.",
        addRoom: "إضافة غرفة جديدة",
        revenue: "إجمالي الإيرادات",
        totalBookings: "إجمالي الحجوزات",
        pending: "الطلبات المعلقة",
        recent: "أحدث الحجوزات",
        guest: "الضيف",
        room: "الغرفة",
        dates: "التواريخ",
        total: "الإجمالي",
        status: "الحالة",
        actions: "الإجراءات",
        confirmed: "مؤكد",
        cancelled: "ملغي",
        pendingStatus: "معلق",
        updateSuccess: "تم تحديث الحجز بنجاح",
        updateError: "فشل في تحديث الحجز"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
