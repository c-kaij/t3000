export type Priority = 'high' | 'medium' | 'low';

export interface Store {
  id: number;
  name: string;
  chain: string;
  contact: string;
  phone: string;
  email: string;
  lastVisit: string;
  nextVisit: string;
  priority: Priority;
  address: string;
  orders: number;
  revenue: string;
  lat: number;
  lng: number;
}

export const stores: Store[] = [
  {
    id: 1,
    name: 'Willys Södermalm',
    chain: 'Willys',
    contact: 'Anna Lindqvist',
    phone: '070-123 45 67',
    email: 'anna.l@willys.se',
    lastVisit: '2 apr',
    nextVisit: '9 apr',
    priority: 'high',
    address: 'Hornsgatan 134, Stockholm',
    orders: 3,
    revenue: '42 500',
    lat: 59.3163,
    lng: 18.0480,
  },
  {
    id: 2,
    name: 'ICA Maxi Flemingsberg',
    chain: 'ICA',
    contact: 'Björn Ek',
    phone: '073-456 78 90',
    email: 'bjorn.ek@ica.se',
    lastVisit: '5 apr',
    nextVisit: '12 apr',
    priority: 'high',
    address: 'Flemingsbergsliden 2, Huddinge',
    orders: 5,
    revenue: '78 200',
    lat: 59.2170,
    lng: 17.9450,
  },
  {
    id: 3,
    name: 'Coop Forum Nacka',
    chain: 'Coop',
    contact: 'Maria Svensson',
    phone: '072-987 65 43',
    email: 'maria.s@coop.se',
    lastVisit: '1 apr',
    nextVisit: '8 apr',
    priority: 'medium',
    address: 'Värmdövägen 90, Nacka',
    orders: 2,
    revenue: '31 000',
    lat: 59.3119,
    lng: 18.1700,
  },
  {
    id: 4,
    name: 'Hemköp Östermalm',
    chain: 'Hemköp',
    contact: 'Lars Johansson',
    phone: '070-111 22 33',
    email: 'lars.j@hemkop.se',
    lastVisit: '7 apr',
    nextVisit: '14 apr',
    priority: 'low',
    address: 'Storgatan 12, Stockholm',
    orders: 1,
    revenue: '12 300',
    lat: 59.3358,
    lng: 18.0830,
  },
  {
    id: 5,
    name: 'Willys Kungsholmen',
    chain: 'Willys',
    contact: 'Sofia Berg',
    phone: '073-222 33 44',
    email: 'sofia.b@willys.se',
    lastVisit: '3 apr',
    nextVisit: '10 apr',
    priority: 'medium',
    address: 'Scheelegatan 7, Stockholm',
    orders: 4,
    revenue: '55 700',
    lat: 59.3330,
    lng: 18.0270,
  },
];

export interface Meeting {
  id: number;
  time: string;
  store: string;
  contact: string;
  type: string;
  duration: number;
}

export const meetings: Meeting[] = [
  { id: 1, time: '09:00', store: 'Coop Forum Nacka', contact: 'Maria Svensson', type: 'Kundbesök', duration: 45 },
  { id: 2, time: '11:30', store: 'Willys Södermalm', contact: 'Anna Lindqvist', type: 'Ordermöte', duration: 60 },
  { id: 3, time: '14:00', store: 'ICA Maxi Flemingsberg', contact: 'Björn Ek', type: 'Kampanjgenomgång', duration: 30 },
  { id: 4, time: '16:00', store: 'Hemköp Östermalm', contact: 'Lars Johansson', type: 'Uppföljning', duration: 45 },
];

export const weekMeetings: Record<number, Meeting[]> = {
  6: [],
  7: [{ id: 10, time: '10:00', store: 'Willys Kungsholmen', contact: 'Sofia Berg', type: 'Orderbesök', duration: 45 }],
  8: meetings,
  9: [
    { id: 20, time: '09:30', store: 'ICA Maxi Flemingsberg', contact: 'Björn Ek', type: 'Uppföljning', duration: 30 },
    { id: 21, time: '13:00', store: 'Coop Forum Nacka', contact: 'Maria Svensson', type: 'Kampanjgenomgång', duration: 60 },
  ],
  10: [{ id: 30, time: '11:00', store: 'Hemköp Östermalm', contact: 'Lars Johansson', type: 'Kundbesök', duration: 45 }],
};
