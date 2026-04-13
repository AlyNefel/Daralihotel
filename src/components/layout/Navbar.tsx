import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Shield, Globe } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils.ts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface NavbarProps {
  onToggleAdmin?: () => void;
  isAdminView?: boolean;
}

export default function Navbar({ onToggleAdmin, isAdminView }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navItems = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.rooms'), href: '#rooms' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      isScrolled || location.pathname !== '/' ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-serif font-bold tracking-tighter text-luxury-black">
              DAR <span className="text-gold">ALI</span>
            </span>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-sm font-medium uppercase tracking-widest text-luxury-black/70 hover:text-gold transition-colors"
            >
              {item.label}
            </a>
          ))}
          
          <div className="h-4 w-[1px] bg-luxury-black/10 mx-2" />

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-luxury-black/70 hover:text-gold cursor-pointer")}>
              <Globe className="w-4 h-4 mr-2" />
              <span className="uppercase">{i18n.language.split('-')[0]}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-gold/10">
              <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer hover:bg-luxury-cream">
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('fr')} className="cursor-pointer hover:bg-luxury-cream">
                Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ar')} className="cursor-pointer hover:bg-luxury-cream font-serif">
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onToggleAdmin}
                  className={`${isAdminView ? 'bg-gold/10 text-gold' : 'text-luxury-black/70'} hover:text-gold hover:bg-gold/10`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {isAdminView ? t('nav.exitAdmin') : t('nav.admin')}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={logout} className="text-luxury-black/70">
                <LogOut className="w-4 h-4 mr-2" />
                {t('nav.logout')}
              </Button>
            </div>
          ) : (
            <Button onClick={login} variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white rounded-full px-6">
              {t('nav.signIn')}
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
           <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-luxury-black/70 cursor-pointer")}>
              <Globe className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('fr')}>Français</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ar')}>العربية</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="text-luxury-black" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-luxury-black/5 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(e, item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-lg font-serif text-luxury-black"
                >
                  {item.label}
                </a>
              ))}
              {!user && (
                <Button onClick={login} className="bg-gold text-white rounded-full w-full">
                  {t('nav.signIn')}
                </Button>
              )}
              {user && (
                 <Button variant="ghost" onClick={logout} className="text-luxury-black/70 justify-start p-0">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('nav.logout')}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
