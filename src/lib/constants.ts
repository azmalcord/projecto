export const SITE = {
  name: "AORTIC EDU",
  brand: "HAIDER SCIENCE LAB",
  tagline: "Explore Science. Understand Life.",
  description:
    "Explore science — physics, chemistry, biology, astronomy and more — with educational playlists and research-based knowledge from AORTIC EDU and HAIDER SCIENCE LAB.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://aorticedu.example").replace(
    /\/+$/,
    ""
  ),
  year: 2026,
} as const;

export const NAV_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "science", label: "Science" },
  { id: "playlists", label: "Playlists" },
  { id: "latest", label: "Latest Videos" },
  { id: "creator", label: "Creator" },
  { id: "about", label: "About" },
] as const;

export const YOUTUBE_CHANNEL_HANDLE =
  process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_HANDLE ||
  "@aorticedu_haidersciencelabs";

export const YOUTUBE_CHANNEL_URL = `https://youtube.com/${YOUTUBE_CHANNEL_HANDLE}`;

export const YOUTUBE_PLAYLISTS = [
  {
    number: "01",
    id: "PLUKHR_5MBz-CWiyL90v4GH_otg6f3Rp2_",
    url: "https://youtube.com/playlist?list=PLUKHR_5MBz-CWiyL90v4GH_otg6f3Rp2_",
  },
  {
    number: "02",
    id: "PLUKHR_5MBz-A3J0Y7ljLxdm0lHRNw-fz3",
    url: "https://youtube.com/playlist?list=PLUKHR_5MBz-A3J0Y7ljLxdm0lHRNw-fz3",
  },
  {
    number: "03",
    id: "PLUKHR_5MBz-An-1avpsMsKROZQ-VBEdBi",
    url: "https://youtube.com/playlist?list=PLUKHR_5MBz-An-1avpsMsKROZQ-VBEdBi",
  },
  {
    number: "04",
    id: "PLUKHR_5MBz-CZZw6P0sjpExjQTc-ms0vf",
    url: "https://youtube.com/playlist?list=PLUKHR_5MBz-CZZw6P0sjpExjQTc-ms0vf",
  },
  {
    number: "05",
    id: "PLUKHR_5MBz-D_KYeuKcxMVOWkZJuOJDAX",
    url: "https://youtube.com/playlist?list=PLUKHR_5MBz-D_KYeuKcxMVOWkZJuOJDAX",
  },
] as const;

export const SCIENCE_CATEGORIES = [
  {
    name: "Physics",
    description:
      "The study of matter, energy, motion, and the fundamental forces that shape the universe.",
  },
  {
    name: "Chemistry",
    description:
      "Exploring the composition, structure, properties, and transformations of matter.",
  },
  {
    name: "Biology",
    description:
      "The study of life — cells, organisms, genetics, and the systems that sustain living things.",
  },
  {
    name: "Astronomy",
    description:
      "The science of stars, planets, galaxies, and the vast cosmos beyond our atmosphere.",
  },
  {
    name: "Genetics",
    description:
      "How genes work, how traits are inherited, and the molecular basis of heredity.",
  },
  {
    name: "Neuroscience",
    description:
      "The study of the nervous system — how the brain produces thought, sensation, and behavior.",
  },
  {
    name: "Microbiology",
    description:
      "The invisible world of bacteria, viruses, fungi, and other microscopic organisms.",
  },
  {
    name: "Ecology",
    description:
      "How organisms interact with each other and their environment in complex ecosystems.",
  },
  {
    name: "Biotechnology",
    description:
      "Applying biology and engineering to develop technologies and products for human benefit.",
  },
  {
    name: "Earth Science",
    description:
      "The study of our planet — its climate, geology, oceans, and the forces that shape it.",
  },
] as const;

export const OVERVIEW_CARDS = [
  {
    title: "Science Learning",
    description:
      "Structured lessons across physics, chemistry, biology and more — making complex concepts clear and approachable.",
  },
  {
    title: "Scientific Research",
    description:
      "Exploration grounded in scientific method, evidence, and credible sources.",
  },
  {
    title: "Learning Playlists",
    description:
      "Curated video sequences designed for progressive, focused learning.",
  },
  {
    title: "Latest Discoveries",
    description:
      "New lessons and scientific content released regularly from the lab.",
  },
] as const;

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/19WPoD143c/",
  youtube: "https://youtube.com/@aorticedu_haidersciencelabs?si=cLVgZOKd6YFcutih",
  instagram:
    "https://www.instagram.com/edu_aortic_haidersciencelabs?vrfl=eXdmeHQ0NmptZGV1",
  whatsapp: "https://chat.whatsapp.com/DCAgtlP6rFKCtwkkuxl4iu",
  email: "mailto:eduaortic@gmail.com",
} as const;

export const SOCIAL_LABELS = {
  facebook: "Facebook",
  youtube: "YouTube",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  email: "Email",
} as const;