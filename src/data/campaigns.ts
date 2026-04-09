export type CampaignStatus = 'active' | 'ended' | 'upcoming';
export type CampaignKind = 'sampling' | 'volume' | 'multiprice';

export interface CampaignProduct {
  title: string;
  sku: string;
}

export interface Campaign {
  id: number;
  name: string;
  kind: CampaignKind;
  type: string;         // Nationell | Selektiv
  start: string;
  end: string;
  status: CampaignStatus;
  storeDiscount: string; // discount passed to store
  desc: string;
  purpose: string;       // business objective
  stimuli: string;       // shopper activation mechanic
  material: string[];    // POS / in-store materials
  products: CampaignProduct[];
  chains: string[];
}

export const campaigns: Campaign[] = [
  {
    id: 1,
    name: 'Smakprovning – Sommarnytt',
    kind: 'sampling',
    type: 'Selektiv',
    start: '1 maj',
    end: '31 maj',
    status: 'upcoming',
    storeDiscount: '15%',
    desc: 'Driva provsmakningar av våra nya limited editions för att öka kännedom och trial hos konsument.',
    purpose: 'Bygga varumärkeskännedom och driva trial på nya produkter i butik.',
    stimuli: 'Gratis provsmakningsglas i butik – konsumenten får smaka innan köp.',
    material: [
      'Provsmakningsstation med loggad duk',
      'Portionsmuggar 4 cl (500 st/butik)',
      'A4-skylt med produktbild och QR-kod',
      'Shelf-wobbler',
    ],
    products: [
      { title: 'Limited Edition Clementine/Orange 1,5 liter', sku: '0114' },
      { title: 'Limited Edition Äpple & Smultron Lemonad 1,5 liter', sku: '0110' },
    ],
    chains: ['ICA', 'Coop'],
  },
  {
    id: 2,
    name: 'Volymlyft – Bag-In-Box',
    kind: 'volume',
    type: 'Nationell',
    start: '8 apr',
    end: '30 apr',
    status: 'active',
    storeDiscount: '20%',
    desc: 'Driva volymförsäljning av Bag-In-Box-sortimentet med prissänkning och exponering på väg ut ur butiken.',
    purpose: 'Öka genomsnittlig orderkvantitet per besök och röra på lagret inför sommarsäsongen.',
    stimuli: 'Sänkt hyllpris + ändpallsexponering – tydlig prisjämförelse mot tidigare pris.',
    material: [
      'Ändpallsdisplay (kan beställas via KAM)',
      'Prisskyltar A5 med "Från X kr"-markering',
      'Hyllkantsetikett med kampanjpris',
      'Digitalt material till butikens sociala medier',
    ],
    products: [
      { title: 'Päron/Äpple Bag-In-Box 3L', sku: '0087' },
      { title: 'Äppelmust Bag-In-Box 3L', sku: '0080' },
      { title: 'Limited Edition Citrus Lemonade Bag-In-Box 3L', sku: '0109' },
    ],
    chains: ['ICA', 'Coop', 'Willys'],
  },
  {
    id: 3,
    name: 'Multipris – 3 för 2',
    kind: 'multiprice',
    type: 'Selektiv',
    start: '15 apr',
    end: '15 maj',
    status: 'active',
    storeDiscount: '33%',
    desc: 'Köp 3 förpackningar, betala för 2. Aktiveras på flasksortimentet för att öka köpdjup per kund.',
    purpose: 'Höja medelkvitto och exponera fler SKU:er per shoppingtillfälle.',
    stimuli: 'Multipris-erbjudande i hyllan – "Köp 3 betala för 2" tydligt kommunicerat med prisgilla.',
    material: [
      'Prisgilla med multipristext',
      'Hylltejp med erbjudandetext',
      'Kampanjskyltar A3 för gondolkant',
      'Kassalapp för kassapersonal',
    ],
    products: [
      { title: 'Limited Edition Clementine/Orange 1,5 liter', sku: '0114' },
      { title: 'Limited Edition Äpple & Smultron Lemonad 1,5 liter', sku: '0110' },
      { title: 'Ingefära/Citron Bag-In-Box 3L', sku: '0081' },
    ],
    chains: ['Willys', 'Hemköp'],
  },
];
