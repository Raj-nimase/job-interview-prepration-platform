import { Egg, Rocket, Gem, Crown } from "lucide-react";

export const SETUP_ROLE_CHIPS = [
  "Software Engineer",
  "Product Manager",
  "UX Designer",
  "Data Scientist",
  "Marketing Manager",
  "Project Manager",
  "Financial Analyst",
];

export const SETUP_EXPERIENCE_LEVELS = [
  {
    value: "Fresher / Entry-Level",
    title: "Junior",
    subtitle: "0–2 years equivalent",
    Icon: Egg,
  },
  {
    value: "1-3 Years",
    title: "Mid-Level",
    subtitle: "2–5 years equivalent",
    Icon: Rocket,
  },
  {
    value: "3-5 Years",
    title: "Senior",
    subtitle: "5–10 years equivalent",
    Icon: Gem,
  },
  {
    value: "5+ Years",
    title: "Executive",
    subtitle: "10+ years equivalent",
    Icon: Crown,
  },
];

export const SETUP_SESSION_BULLETS = [
  {
    icon: "verified_user",
    text: "Structured feedback after each of your five answers.",
  },
  {
    icon: "timer",
    text: "Typical session: about 15–25 minutes at your pace.",
  },
  {
    icon: "smart_toy",
    text: "AI scoring tuned to your role and experience level.",
  },
];
