export const teams = [
  {
    id: 'argentina',
    name: 'Argentina',
    shortName: 'ARG',
    colors: { primary: '#6CACE4', secondary: '#FFD700', text: '#1a1a3e' },
    shield: '/escudos/argentina.svg',
    category: 'seleccion',
    worldCups: 3
  },
  {
    id: 'brazil',
    name: 'Brasil',
    shortName: 'BRA',
    colors: { primary: '#009739', secondary: '#FFD700', text: '#1a1a3e' },
    shield: '/escudos/brazil.svg',
    category: 'seleccion',
    worldCups: 5
  },
  {
    id: 'river',
    name: 'River Plate',
    shortName: 'CARP',
    colors: { primary: '#D42A2A', secondary: '#FFD700', text: '#1a1a3e' },
    shield: '/escudos/river.svg',
    category: 'argentina',
    foundation: 1901
  },
  {
    id: 'boca',
    name: 'Boca Juniors',
    shortName: 'CABJ',
    colors: { primary: '#1B4F9C', secondary: '#FFD700', text: '#1a1a3e' },
    shield: '/escudos/boca.svg',
    category: 'argentina',
    foundation: 1905
  },
  {
    id: 'sanlorenzo',
    name: 'San Lorenzo',
    shortName: 'CASLA',
    colors: { primary: '#E31E24', secondary: '#1B4F9C', text: '#1a1a3e' },
    shield: '/escudos/sanlorenzo.svg',
    category: 'argentina',
    foundation: 1908
  },
  {
    id: 'racing',
    name: 'Racing Club',
    shortName: 'RACING',
    colors: { primary: '#1E90FF', secondary: '#FFD700', text: '#1a1a3e' },
    shield: '/escudos/racing.svg',
    category: 'argentina',
    foundation: 1903
  },
  {
    id: 'independiente',
    name: 'Independiente',
    shortName: 'CAI',
    colors: { primary: '#E31E24', secondary: '#FFD700', text: '#1a1a3e' },
    shield: '/escudos/independiente.svg',
    category: 'argentina',
    foundation: 1905
  },
  {
    id: 'realmadrid',
    name: 'Real Madrid',
    shortName: 'RMA',
    colors: { primary: '#FFFFFF', secondary: '#FFD700', text: '#1a1a3e' },
    shield: '/escudos/realmadrid.svg',
    category: 'internacional',
    foundation: 1902
  },
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'FCB',
    colors: { primary: '#1B4F9C', secondary: '#E31E24', text: '#1a1a3e' },
    shield: '/escudos/barcelona.svg',
    category: 'internacional',
    foundation: 1899
  }
];

export const getTeamById = (id) => teams.find(t => t.id === id);

export const getTeamsByCategory = (category) => teams.filter(t => t.category === category);
{
  id: 'gimnasiajujuy',
  name: 'Gimnasia Jujuy',
  shortName: 'GyE',
  colors: { primary: '#2E7D32', secondary: '#FFD700', text: '#1a1a3e' },
  shield: '/escudos/gimnasiajujuy.svg',
  category: 'argentina',
  foundation: 1931
}