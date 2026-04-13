import Hero from '@/components/home/Hero';
import FeaturedRooms from '@/components/home/FeaturedRooms';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main>
      <Hero />
      <FeaturedRooms />
      
      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000" 
              alt="About Dar Ali"
              className="rounded-3xl shadow-2xl z-10 relative"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gold/10 rounded-3xl -z-0" />
          </div>
          <div>
            <span className="text-gold uppercase tracking-widest text-sm font-medium mb-4 block">{t('about.subtitle')}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-luxury-black mb-8 leading-tight">
              {t('about.title')} <br /><span className="italic text-gold">{t('about.titleItalic')}</span>
            </h2>
            <p className="text-luxury-black/70 text-lg leading-relaxed mb-8">
              {t('about.p1')}
            </p>
            <p className="text-luxury-black/70 text-lg leading-relaxed mb-12">
              {t('about.p2')}
            </p>
            <Button variant="outline" className="border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-white rounded-full px-8">
              {t('about.learnMore')}
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-luxury-black text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-serif mb-8">{t('contact.title')} <span className="italic text-gold">{t('contact.titleItalic')}</span> {t('contact.titleEnd')}</h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto mb-12">
            {t('contact.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-gold font-serif text-xl mb-2">{t('contact.callUs')}</h3>
              <p className="text-2xl">+216 71 000 000</p>
            </div>
            <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-gold font-serif text-xl mb-2">{t('contact.emailUs')}</h3>
              <p className="text-2xl">reservations@darali.tn</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
