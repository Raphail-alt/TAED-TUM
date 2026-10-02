const img = (seed) => `https://picsum.photos/seed/${seed}/900/560`

export const eventCategories = [
  'Symposium',
  'Workshop',
  'Hackathon',
  'Roundtable',
  'Storytelling',
  'Challenge',
  'Exchange',
  'Diani Day',
]

export const seedEvents = [
  {
    id: 'symposium',
    title: 'The TUM Tech & Engineering Symposium',
    description:
      'Kick off the week with keynotes from engineers and founders shaping East Africa\'s tech scene, panel debates on AI, blockchain and cloud, and the official launch of everything that follows.',
    date: '2026-11-09T09:00:00',
    venue: 'TUM Main Auditorium',
    category: 'Symposium',
    external_link: 'https://example.com/register',
    image: img('taed-symposium'),
    featured: true,
  },
  {
    id: 'ws-ai',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on session: train and deploy your first model, then learn how teams ship AI products in the real world.',
    date: '2026-11-09T14:00:00',
    venue: 'Computer Lab 2',
    category: 'Workshop',
    external_link: 'https://example.com/register',
    image: img('taed-ai'),
  },
  {
    id: 'ws-web3',
    title: 'Blockchain & Web3 Workshop',
    description: 'From wallets to smart contracts. Build and deploy a simple dApp with the Web3 Clubs-TUM team.',
    date: '2026-11-10T09:00:00',
    venue: 'Innovation Hub',
    category: 'Workshop',
    external_link: 'https://example.com/register',
    image: img('taed-web3'),
  },
  {
    id: 'ws-cloud',
    title: 'Cloud & Data Engineering Workshop',
    description: 'Spin up cloud infrastructure, build a data pipeline and see how modern companies scale.',
    date: '2026-11-10T14:00:00',
    venue: 'Computer Lab 1',
    category: 'Workshop',
    external_link: 'https://example.com/register',
    image: img('taed-cloud'),
  },
  {
    id: 'exchange',
    title: 'Inter-University Exchange Program',
    description: 'Students from universities across East Africa join TUM for shared projects, campus tours and lasting connections.',
    date: '2026-11-10T10:00:00',
    venue: 'TUM Campus',
    category: 'Exchange',
    external_link: 'https://example.com/register',
    image: img('taed-exchange'),
  },
  {
    id: 'night-code',
    title: 'Night of Code',
    description: 'An overnight coding marathon with music, snacks and mentors on hand. Bring a laptop and an idea.',
    date: '2026-11-10T20:00:00',
    venue: 'Innovation Hub',
    category: 'Hackathon',
    external_link: 'https://example.com/register',
    image: img('taed-night'),
  },
  {
    id: 'roundtable',
    title: 'Engineering Roundtable',
    description: 'Practicing engineers from civil, electrical, mechanical and software fields discuss careers, failure and building in Africa.',
    date: '2026-11-11T10:00:00',
    venue: 'Engineering Block, Hall A',
    category: 'Roundtable',
    external_link: 'https://example.com/register',
    image: img('taed-roundtable'),
  },
  {
    id: 'storytelling',
    title: 'Tech Storytelling Evening',
    description: 'Founders, students and mentors share the messy, honest stories behind what they built.',
    date: '2026-11-11T17:00:00',
    venue: 'TUM Amphitheatre',
    category: 'Storytelling',
    external_link: 'https://example.com/register',
    image: img('taed-story'),
  },
  {
    id: 'challenge',
    title: 'Innovation Challenge Finals',
    description: 'Student teams pitch their solutions to a panel of judges and companies. Winners take home prizes and mentorship.',
    date: '2026-11-12T13:00:00',
    venue: 'TUM Main Auditorium',
    category: 'Challenge',
    external_link: 'https://example.com/register',
    image: img('taed-challenge'),
  },
  {
    id: 'diani',
    title: 'Diani Day: The Mega Closing Gathering',
    description: 'We take the whole community to the beach. Music, food, awards and one unforgettable finale.',
    date: '2026-11-12T16:00:00',
    venue: 'Diani Beach',
    category: 'Diani Day',
    external_link: 'https://example.com/register',
    image: img('taed-diani'),
  },
]

import esaLogo from '../assets/logos/esa-tum.jpg';
import tisLogo from '../assets/logos/tum-tis.jpeg';
import web3Logo from '../assets/logos/web3clubs-tum.jpeg';
import ieeeLogo from '../assets/logos/ieee-tum.jpeg';
import cecLogo from '../assets/logos/cec.jpg';
import bmeLogo from '../assets/logos/bme.jpeg';
import awsLogo from '../assets/logos/aws-tum.png';

export const organizers = [
  { name: 'ESA-TUM', full: 'Engineering Students\' Association, TUM chapter', initials: 'ESA', logo: esaLogo },
  { name: 'TUM TIS', full: 'Technical University of Mombasa, Technology & Innovation Society', initials: 'TIS', logo: tisLogo },
  { name: 'Web3 Clubs-TUM', full: 'Blockchain and Web3 community at TUM', initials: 'W3', logo: web3Logo },
  { name: 'IEEE TUM', full: 'IEEE TECHNICAL UNIVERSITY OF MOMBASA', initials: 'IEEE TUM', logo: ieeeLogo },
  { name: 'CEC', full: 'CIVIL ENGINEERING CLUB -TUM', initials: 'CEC', logo: cecLogo },
  { name: 'BME', full: 'BIOMEDICAL ENGINEERING CLUB-TUM', initials: 'BME', logo: bmeLogo },
  { name: 'AWS TUM', full: 'AMAZON USER GROUP, TUM', initials: 'AWS-TUM', logo: awsLogo },
]


export const focusAreas = [
  { title: 'Engineering', text: 'Civil, electrical & electronics, mechanical and biomedical.' },
  { title: 'Technology', text: 'Blockchain,Cloud, Data,Security' },
  { title: 'AI', text: 'Models, tooling and how to ship them.' },
  { title: 'Community', text: 'Students, mentors, and companies, all in one room.' },
  { title: 'Innovation', text: 'From idea to prototype to pitch.' },
  {title: 'Design', text: 'Product thinking and user experience.' },
  {title: 'Entrepreneurship', text: 'Turning projects into ventures.'},
]

export const audiences = [
  { title: 'Students', text: 'Learn by building, meet the people hiring, and find your next mentor.' },
  { title: 'Mentors', text: 'Share your craft with the next generation and shape how they grow.' },
  { title: 'Companies', text: 'Meet ready-to-build Kenyan talent before everyone else does.' },
]

