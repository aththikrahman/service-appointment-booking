import { BusinessConfig, Appointment } from '../types/booking';

export const BUSINESS_CONFIGS: Record<string, BusinessConfig> = {
  salon: {
    id: 'salon',
    name: 'Lumière Salon & Aesthetic Atelier',
    tagline: 'Artisanal hair design, bespoke color chemistry, and restorative scalp rituals.',
    industry: 'Hair & Aesthetic Atelier',
    address: '42 Berkeley Square, Mayfair, London W1J 5AW',
    phone: '+44 (0) 20 7946 0880',
    email: 'atelier@lumiere-london.com',
    depositPercentage: 20,
    heroImage: '/src/assets/images/hero_salon_interior_1792741160917.jpg',
    brandAccent: '#1c1917',
    currency: 'USD',
    currencySymbol: '$',
    services: [
      {
        id: 'salon-1',
        name: 'Bespoke Balayage & Glossing Ritual',
        category: 'Color Chemistry',
        price: 285,
        durationMinutes: 120,
        description: 'Hand-painted dimensional contouring paired with customized organic botanical gloss and bond fortifier.',
        longDescription: 'Our signature multi-dimensional color service. Includes bespoke consultation, customized micro-section clay balayage, scalp protection application, custom gloss formulation, and deep bond conditioning.',
        prepNotes: [
          'Arrive with clean, dry hair free of heavy root touch-up sprays or waxes.',
          'Bring 2–3 reference photos highlighting tones you adore and tones you wish to avoid.',
          'Allow 2 to 2.5 hours for thorough artisan processing and customized blowout.'
        ],
        recommendedAddons: [
          {
            id: 'addon-1',
            name: 'Olaplex Molecular Bond Reconstruction',
            price: 45,
            durationMinutes: 15,
            description: 'Patented bi-active bond rebuilding treatment to preserve elasticity and mirror shine.'
          },
          {
            id: 'addon-2',
            name: 'Japanese Botanical Scalp Micro-Exfoliation',
            price: 55,
            durationMinutes: 20,
            description: 'Purifying sea kelp and camellia seed oil massage stimulating microcirculation.'
          }
        ]
      },
      {
        id: 'salon-2',
        name: 'Sculptural Haircut & Kerastase Fusio-Dose',
        category: 'Cut & Sculpt',
        price: 165,
        durationMinutes: 60,
        description: 'Dry and wet architectural cutting tailored to your facial geometry, followed by custom concentrated booster.',
        longDescription: 'An intentional haircutting experience. Begins with ergonomic texture analysis, cleansing wash with acupressure massage, custom Fusio-Dose concentrate, precision dry tailoring, and runway blowout finish.',
        prepNotes: [
          'Wear everyday attire to help our stylist analyze your silhouette and collar line.',
          'Let us know if you prefer a silent restorative appointment without chatter.'
        ],
        recommendedAddons: [
          {
            id: 'addon-3',
            name: 'Silk Press & Infrared Thermal Seal',
            price: 40,
            durationMinutes: 15,
            description: 'Infrared iron sealing locking in hydration and humidity resistance.'
          }
        ]
      },
      {
        id: 'salon-3',
        name: 'Japanese Zen Scalp Head Spa & Trichology Detox',
        category: 'Scalp & Wellness',
        price: 195,
        durationMinutes: 75,
        description: 'Microscopic 200x trichoscopy assessment, cascading warm water halo, herbal steam bath, and shiatsu head massage.',
        longDescription: 'A holistic restorative journey for the scalp and mind. Utilizing certified organic botanicals, an ultrasonic deep pore cleanser, warm water ring immersion, and cranial acupressure.',
        prepNotes: [
          'Avoid washing hair within 12 hours of appointment for accurate scalp camera diagnostics.',
          'Complimentary herbal tea and essential oil inhalation included.'
        ],
        recommendedAddons: [
          {
            id: 'addon-4',
            name: 'High-Frequency Violet Ray Therapy',
            price: 35,
            durationMinutes: 10,
            description: 'Antimicrobial ozone microcurrent therapy stimulating dormant follicles.'
          }
        ]
      },
      {
        id: 'salon-4',
        name: 'Brazilian Keratin Silk Smoothing Infusion',
        category: 'Texture & Finish',
        price: 320,
        durationMinutes: 150,
        description: 'Formaldehyde-free amino acid silk infusion eliminating frizz and reducing blow-dry time by 70%.',
        longDescription: 'Zero downtime smoothing treatment enriched with argan and pracaxi oils. Delivers humidity defiance and silky manageability lasting up to 4 months.',
        prepNotes: [
          'Please notify stylist if you have had recent bleach or henna application.',
          'Hair can be washed 24 hours post-service.'
        ]
      }
    ],
    specialists: [
      {
        id: 'spec-1',
        name: 'Camille Laurent',
        title: 'Master Creative Director & Balayage Specialist',
        role: 'Master Stylist',
        bio: '14 years across Paris and London fashion weeks. Renowned for effortless, sun-bleached French balayage and architectural dry cutting.',
        experienceYears: 14,
        rating: 4.98,
        reviewCount: 312,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        specialties: ['Balayage Chemistry', 'French Cut', 'Bridal Styling'],
        availableDays: [1, 2, 3, 4, 5],
        availableHours: { start: '09:30', end: '18:00' }
      },
      {
        id: 'spec-2',
        name: 'Julian Vance',
        title: 'Principal Trichologist & Texture Specialist',
        role: 'Trichologist',
        bio: 'Certified trichologist trained in Tokyo and Zurich. Specializes in advanced scalp rejuvenation, curly hair sculpting, and bond preservation.',
        experienceYears: 11,
        rating: 4.95,
        reviewCount: 248,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        specialties: ['Scalp Trichology', 'Curly Texture', 'Silk Press'],
        availableDays: [2, 3, 4, 5, 6],
        availableHours: { start: '10:00', end: '19:00' }
      },
      {
        id: 'spec-3',
        name: 'Elena Rostova',
        title: 'Senior Colorist & Gloss Artisan',
        role: 'Color Artisan',
        bio: 'Specialist in high-contrast blondes, glossing rituals, and restorative keratin infusions with a warm, attentive bedside manner.',
        experienceYears: 8,
        rating: 4.92,
        reviewCount: 189,
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        specialties: ['Platinum & Blonde', 'Keratin Infusion', 'Gloss Toning'],
        availableDays: [1, 3, 4, 5, 6],
        availableHours: { start: '09:00', end: '17:30' }
      }
    ]
  },

  repair: {
    id: 'repair',
    name: 'Apex Precision Horology & Tech Lab',
    tagline: 'Certified mechanical watch restoration, micro-soldering, and optical calibration.',
    industry: 'Precision Repair & Lab',
    address: '18 Hatton Garden, Holborn, London EC1N 8AT',
    phone: '+44 (0) 20 7404 1120',
    email: 'bench@apex-precision.com',
    depositPercentage: 25,
    heroImage: '/src/assets/images/repair_lab_bench_1792741177941.jpg',
    brandAccent: '#0f172a',
    currency: 'USD',
    currencySymbol: '$',
    services: [
      {
        id: 'repair-1',
        name: 'Mechanical Calibre Overhaul & Timing Regulation',
        category: 'Horology Bench',
        price: 340,
        durationMinutes: 90,
        description: 'Complete ultrasonic ultrasonic bath teardown, synthetic jewel relubrication (Moebius 9010), and Witschi timing regulation.',
        longDescription: 'Comprehensive workshop overhaul for Swiss and Japanese automatic movements. Includes amplitude check, beat error correction, new gaskets, and 48-hour power reserve verification.',
        prepNotes: [
          'Bring the timepiece along with any original warranty cards or previous service logs.',
          'Diagnostic intake inspection takes 15 minutes alongside our master horologist.'
        ],
        recommendedAddons: [
          {
            id: 'addon-r1',
            name: 'Laser Weld Scratch Removal & Case Polish',
            price: 90,
            durationMinutes: 30,
            description: 'Micro-laser filler wire restoration for deep bezel gouges preserving factory bevels.'
          },
          {
            id: 'addon-r2',
            name: '10-Bar Hydrostatic Pressure Certification',
            price: 45,
            durationMinutes: 15,
            description: 'Dry vacuum and wet pressure testing with printed vacuum decay chart.'
          }
        ]
      },
      {
        id: 'repair-2',
        name: 'Sapphire Crystal Replacement & Case Re-Sealing',
        category: 'Horology Bench',
        price: 180,
        durationMinutes: 60,
        description: 'OEM grade anti-reflective sapphire crystal replacement with precision pneumatic bezel press and helium escape inspection.',
        longDescription: 'Restores crystal clarity and preserves dial integrity. Includes ultrasonic case cleaning and UV-cured optical seal.',
        prepNotes: [
          'If crystal shattered, do not operate movement to prevent debris entering train wheel.'
        ]
      },
      {
        id: 'repair-3',
        name: 'Micro-Soldering Logic Board Diagnostic & Repair',
        category: 'Precision Electronics',
        price: 210,
        durationMinutes: 60,
        description: 'Thermal imaging short-circuit diagnosis, MOSFET replacement, trace rebuilding, and ultrasonic flux cleaning under 40x microscope.',
        longDescription: 'Specialist board-level repair for Apple Silicon MacBooks, premium audio DACs, and micro-controllers. Avoids costly motherboard replacements.',
        prepNotes: [
          'Backup your device if possible prior to arrival.',
          'Provide passcode or test user access for functional peripheral verification.'
        ],
        recommendedAddons: [
          {
            id: 'addon-r3',
            name: 'Thermal Interface Material (TIM) Liquid Metal Refresh',
            price: 40,
            durationMinutes: 15,
            description: 'Thermal Grizzly Kryonaut high-conductivity repaste lowering die thermals by 12°C.'
          }
        ]
      }
    ],
    specialists: [
      {
        id: 'spec-r1',
        name: 'Marcus Kroll, CW21',
        title: 'Master Horologist & Certified WOSTEP Watchmaker',
        role: 'Master Horologist',
        bio: '18 years Swiss horology bench experience. Specialized in chronographs, escapement adjustments, and historical timepiece preservation.',
        experienceYears: 18,
        rating: 4.99,
        reviewCount: 420,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        specialties: ['Swiss Movements', 'Chronograph Timing', 'Laser Case Restoration'],
        availableDays: [1, 2, 3, 4, 5],
        availableHours: { start: '09:00', end: '17:30' }
      },
      {
        id: 'spec-r2',
        name: 'Tariq Al-Mansoor',
        title: 'Principal Micro-Electronics Specialist',
        role: 'SMD Engineer',
        bio: 'IPC-7711/7721 certified rework specialist. Expert in microscope BGA reballing, trace reconstruction, and optical alignment.',
        experienceYears: 12,
        rating: 4.96,
        reviewCount: 290,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        specialties: ['SMD Micro-Soldering', 'Thermal Diagnostics', 'Board Reconstruction'],
        availableDays: [2, 3, 4, 5, 6],
        availableHours: { start: '09:30', end: '18:00' }
      }
    ]
  },

  consultancy: {
    id: 'consultancy',
    name: 'Vanguard Advisory & Executive Strategy',
    tagline: 'Private client strategic counsel, enterprise AI roadmap, and M&A advisory.',
    industry: 'Executive Consultancy',
    address: 'One Canada Square, Canary Wharf, London E14 5AA',
    phone: '+44 (0) 20 8123 9940',
    email: 'partners@vanguard-advisory.com',
    depositPercentage: 30,
    heroImage: '/src/assets/images/consultancy_boardroom_1792741193230.jpg',
    brandAccent: '#18181b',
    currency: 'USD',
    currencySymbol: '$',
    services: [
      {
        id: 'consult-1',
        name: 'Executive AI Architecture & Capability Audit',
        category: 'Technology Advisory',
        price: 750,
        durationMinutes: 90,
        description: 'Comprehensive review of proprietary workflows, LLM orchestration readiness, and secure deployment governance.',
        longDescription: 'In-depth advisory session examining infrastructure feasibility, ROI modeling, vendor selection, and data privacy frameworks for enterprise deployments.',
        prepNotes: [
          'A mutual NDA will be digitally executed 24h prior to the session.',
          'Submit existing workflow architecture diagrams or operational bottlenecks in advance.'
        ],
        recommendedAddons: [
          {
            id: 'addon-c1',
            name: 'Written 15-Page Strategic Executive Brief & Roadmap',
            price: 350,
            durationMinutes: 0,
            description: 'Custom tailored deliverable with executive presentation deck delivered in 48h.'
          }
        ]
      },
      {
        id: 'consult-2',
        name: 'Growth Capital & Pre-Series B Readiness Review',
        category: 'Financial Strategy',
        price: 600,
        durationMinutes: 60,
        description: 'Unit economics stress-testing, cohort churn analysis, valuation positioning, and data room audit.',
        longDescription: 'Tailored for founders and CFOs preparing for institutional financing rounds. Led by former venture general partners.',
        prepNotes: [
          'Bring past 12-month P&L, forward projections, and cap table overview.'
        ]
      },
      {
        id: 'consult-3',
        name: 'Cross-Border Entity Structuring & Tax Governance',
        category: 'Legal & Corporate',
        price: 520,
        durationMinutes: 60,
        description: 'Holding company architectures, intellectual property licensing corridors, and compliance across US/UK/EU.',
        longDescription: 'Private counsel on tax treaty optimization, substance requirements, and dual-jurisdiction operational structuring.',
        prepNotes: [
          'Prepare summary of current operational entities and target expansion markets.'
        ]
      }
    ],
    specialists: [
      {
        id: 'spec-c1',
        name: 'Dr. Alistair Sterling',
        title: 'Senior Partner, Enterprise AI & Systems Strategy',
        role: 'Senior Partner',
        bio: 'Ex-McKinsey Principal and Cambridge PhD. Advises FTSE 100 boards and Series B/C startups on AI deployment and operational scaling.',
        experienceYears: 16,
        rating: 4.99,
        reviewCount: 164,
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
        specialties: ['Enterprise AI Strategy', 'Board Advisory', 'Systems Architecture'],
        availableDays: [1, 2, 3, 4],
        availableHours: { start: '10:00', end: '17:00' }
      },
      {
        id: 'spec-c2',
        name: 'Siddharth Mehta',
        title: 'Managing Director, M&A & Growth Financing',
        role: 'Managing Director',
        bio: 'Former Goldman Sachs VP with $1.4B in closed venture and buyout transactions across fintech, SaaS, and advanced materials.',
        experienceYears: 13,
        rating: 4.97,
        reviewCount: 142,
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        specialties: ['Venture Capital', 'M&A Valuation', 'Financial Modeling'],
        availableDays: [2, 3, 4, 5],
        availableHours: { start: '09:00', end: '16:30' }
      }
    ]
  }
};

// Seed sample existing appointments so the calendar and booking lookup feel alive
export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-seed-1',
    referenceNumber: 'LMR-89241',
    businessType: 'salon',
    service: BUSINESS_CONFIGS.salon.services[0],
    addons: [BUSINESS_CONFIGS.salon.services[0].recommendedAddons![0]],
    specialist: BUSINESS_CONFIGS.salon.specialists[0],
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    startTime: '11:00',
    endTime: '13:15',
    totalDurationMinutes: 135,
    customer: {
      fullName: 'Genevieve Dupré',
      email: 'rahmanaththik2@gmail.com',
      phone: '+44 7700 900382',
      notes: 'Prefers quiet appointment with sparkling water and lemon.',
      preferences: {
        quietAppointment: true,
        beverageChoice: 'Sparkling mineral water with mint',
        allergiesOrSensitivities: 'Slight sensitivity to artificial fragrances'
      }
    },
    payment: {
      method: 'card',
      schedule: 'deposit',
      cardBrand: 'visa',
      cardLast4: '4242',
      cardHolderName: 'Genevieve Dupré',
      amountCharged: 66,
      remainingBalance: 264,
      transactionId: 'txn_lumiere_89241',
      timestamp: new Date().toISOString(),
      status: 'paid'
    },
    totalPrice: 330,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'apt-seed-2',
    referenceNumber: 'LMR-34109',
    businessType: 'salon',
    service: BUSINESS_CONFIGS.salon.services[1],
    addons: [],
    specialist: BUSINESS_CONFIGS.salon.specialists[1],
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '14:30',
    endTime: '15:30',
    totalDurationMinutes: 60,
    customer: {
      fullName: 'Sebastian Ross',
      email: 's.ross@architectural.co',
      phone: '+44 7700 900114',
      notes: 'Consultation on new textured fringe shape.'
    },
    payment: {
      method: 'apple_pay',
      schedule: 'full',
      cardBrand: 'mastercard',
      cardLast4: '8812',
      cardHolderName: 'Sebastian Ross',
      amountCharged: 165,
      remainingBalance: 0,
      transactionId: 'txn_lumiere_34109',
      timestamp: new Date().toISOString(),
      status: 'paid'
    },
    totalPrice: 165,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];
