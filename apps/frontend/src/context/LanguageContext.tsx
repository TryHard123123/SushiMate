import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'en' | 'ar';

export interface Translations {
  nav: {
    home: string; menu: string; orders: string; profile: string;
  };
  hero: {
    slide1Title: string; slide1Sub: string; slide1Btn: string;
    slide2Title: string; slide2Sub: string; slide2Btn: string;
    slide3Title: string; slide3Sub: string; slide3Btn: string;
  };
  perks: {
    delivery: string; freshness: string; halal: string; crafted: string;
  };
  home: {
    bestSellers: string; promoTitle: string; promoSub: string; promoCta: string;
    stat1: string; stat2: string; stat3: string; stat4: string;
  };
  menu: {
    title: string; search: string;
    all: string; rolls: string; sets: string; sides: string; drinks: string;
    results: string; noResults: string;
  };
  product: {
    addToCart: string; inCart: string; aed: string; pieces: string;
  };
  cart: {
    title: string; empty: string; subtotal: string; checkout: string; remove: string;
  };
  checkout: {
    title: string; name: string; phone: string; email: string;
    address: string; building: string; pay: string;
  };
  footer: {
    tagline: string; menu: string; legal: string; contact: string;
    privacy: string; terms: string; allRights: string;
  };
}

const translations: Record<Lang, Translations> = {
  en: {
    nav: {
      home: 'HOME', menu: 'MENU', orders: 'ORDERS', profile: 'PROFILE',
    },
    hero: {
      slide1Title: 'Precision. Craft. Sushi.',
      slide1Sub:   'Free delivery across Dubai on orders above 100 AED',
      slide1Btn:   'Order Now',
      slide2Title: "Chef's Seasonal Signatures",
      slide2Sub:   'Norwegian salmon · Premium bluefin tuna · Daily catch',
      slide2Btn:   'Explore Menu',
      slide3Title: 'Exclusive Omakase Sets',
      slide3Sub:   'Handpicked for the Dubai connoisseur · Limited daily',
      slide3Btn:   'View Sets',
    },
    perks: {
      delivery:  'Dubai-wide delivery',
      freshness: '24h freshness guarantee',
      halal:     '100% Halal certified',
      crafted:   'Master chef crafted',
    },
    home: {
      bestSellers: 'BEST SELLERS',
      promoTitle:  'First Order? Get 10% Off',
      promoSub:    'Use code SUSHI10 at checkout · valid on all orders above 120 AED',
      promoCta:    'Order Now',
      stat1: 'Unique Rolls', stat2: 'Happy Customers',
      stat3: 'Delivery Min', stat4: 'Halal Certified',
    },
    menu: {
      title:     'Our Menu',
      search:    'Search dishes…',
      all:       'All', rolls: 'Rolls', sets: 'Sets', sides: 'Sides', drinks: 'Drinks',
      results:   'dishes',
      noResults: 'No dishes match your search.',
    },
    product: {
      addToCart: 'Add to Cart', inCart: 'Added to Cart ✓',
      aed: 'AED', pieces: 'pcs',
    },
    cart: {
      title:    'Your Cart', empty: 'Your cart is empty',
      subtotal: 'Subtotal', checkout: 'Proceed to Checkout', remove: 'Remove',
    },
    checkout: {
      title: 'Checkout', name: 'Full Name', phone: 'Phone Number',
      email: 'Email', address: 'Street Address', building: 'Building / Apt',
      pay: 'Proceed to Payment',
    },
    footer: {
      tagline:   'Premium Japanese sushi, delivered across Dubai',
      menu:      'MENU', legal: 'LEGAL', contact: 'CONTACT',
      privacy:   'Privacy Policy', terms: 'Terms & Conditions',
      allRights: 'All rights reserved.',
    },
  },

  ar: {
    nav: {
      home: 'الرئيسية', menu: 'القائمة', orders: 'طلباتي', profile: 'حسابي',
    },
    hero: {
      slide1Title: 'دقة. حرفة. سوشي.',
      slide1Sub:   'توصيل مجاني في دبي للطلبات فوق ١٠٠ درهم',
      slide1Btn:   'اطلب الآن',
      slide2Title: 'توقيعات الشيف الموسمية',
      slide2Sub:   'سلمون نرويجي · تونة زعنفة زرقاء · صيد يومي طازج',
      slide2Btn:   'استكشف القائمة',
      slide3Title: 'أطباق أوماكاسي الحصرية',
      slide3Sub:   'مختارة بعناية لذواقة دبي · كميات محدودة يومياً',
      slide3Btn:   'عرض الأطقم',
    },
    perks: {
      delivery:  'توصيل لكل دبي',
      freshness: 'ضمان النضارة ٢٤ ساعة',
      halal:     '١٠٠٪ حلال معتمد',
      crafted:   'من يد شيف محترف',
    },
    home: {
      bestSellers: 'الأكثر طلباً',
      promoTitle:  'أول طلب؟ احصل على خصم ١٠٪',
      promoSub:    'استخدم الكود SUSHI10 عند الدفع · صالح للطلبات فوق ١٢٠ درهم',
      promoCta:    'اطلب الآن',
      stat1: 'رول فريد', stat2: 'عميل سعيد',
      stat3: 'دقيقة توصيل', stat4: 'حلال معتمد',
    },
    menu: {
      title:     'قائمتنا',
      search:    'ابحث عن الأطباق…',
      all:       'الكل', rolls: 'رولز', sets: 'أطقم', sides: 'مقبلات', drinks: 'مشروبات',
      results:   'طبق',
      noResults: 'لا توجد أطباق تطابق بحثك.',
    },
    product: {
      addToCart: 'أضف إلى السلة', inCart: 'تمت الإضافة ✓',
      aed: 'د.إ', pieces: 'قطعة',
    },
    cart: {
      title:    'سلة التسوق', empty: 'سلتك فارغة',
      subtotal: 'المجموع الفرعي', checkout: 'إتمام الطلب', remove: 'حذف',
    },
    checkout: {
      title: 'إتمام الطلب', name: 'الاسم الكامل', phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني', address: 'العنوان', building: 'المبنى / الشقة',
      pay: 'المتابعة للدفع',
    },
    footer: {
      tagline:   'سوشي ياباني فاخر يُوصَّل إلى جميع أنحاء دبي',
      menu:      'القائمة', legal: 'القانونية', contact: 'تواصل معنا',
      privacy:   'سياسة الخصوصية', terms: 'الشروط والأحكام',
      allRights: 'جميع الحقوق محفوظة.',
    },
  },
};

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('sushimate_lang') as Lang) || 'en';
  });

  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir  = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('sushimate_lang', lang);
  }, [lang, isRTL]);

  const setLang    = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState(prev => prev === 'en' ? 'ar' : 'en');

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang, toggleLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
};
