export type CampaignStatus = 'active' | 'ended' | 'upcoming';

export interface Campaign {
  id: number;
  name: string;
  type: string;
  start: string;
  end: string;
  status: CampaignStatus;
  discount: string;
  desc: string;
  chains: string[];
}

export const campaigns: Campaign[] = [
  {
    id: 1,
    name: 'Sommarkampanj 2026',
    type: 'Nationell',
    start: '1 apr',
    end: '30 apr',
    status: 'active',
    discount: '15%',
    desc: 'Bred sommarsatsning på hela sortimentet.',
    chains: ['ICA', 'Coop', 'Willys'],
  },
  {
    id: 2,
    name: 'Hyllpris Kampanj',
    type: 'Selektiv',
    start: '8 apr',
    end: '21 apr',
    status: 'active',
    discount: '20%',
    desc: 'Riktat mot utvalda butiker i Stockholm.',
    chains: ['Willys'],
  },
  {
    id: 3,
    name: 'Påskerbjudande',
    type: 'Nationell',
    start: '15 mar',
    end: '7 apr',
    status: 'ended',
    discount: '10%',
    desc: 'Avslutad påskspecial.',
    chains: ['ICA', 'Coop'],
  },
];
