import {
  Shirt,
  GraduationCap,
  Laptop,
  UtensilsCrossed,
  HeartPulse,
  Gamepad2,
  Car,
  Lightbulb,
  ShoppingBag,
  Home,
  Plane,
  Gift,
  Dumbbell,
  Tag,
} from 'lucide-react';

// Matched against the lower-cased category name, so custom categories like
// "Groceries" or "Gym membership" also get a fitting icon
const ICON_RULES = [
  [/cloth|fashion|apparel/, Shirt],
  [/educat|school|course|book|tuition/, GraduationCap],
  [/electronic|gadget|tech|phone|computer/, Laptop],
  [/food|grocer|restaurant|dining|eat|coffee|lunch|dinner/, UtensilsCrossed],
  [/health|medic|doctor|pharma|hospital/, HeartPulse],
  [/leisure|entertain|game|movie|fun|hobby/, Gamepad2],
  [/transport|car|fuel|gas|uber|taxi|bus|train/, Car],
  [/utilit|electric|water|internet|bill/, Lightbulb],
  [/shop/, ShoppingBag],
  [/hous|rent|home|mortgage/, Home],
  [/travel|holiday|vacation|flight|hotel/, Plane],
  [/gift|donat|charity/, Gift],
  [/gym|fitness|sport/, Dumbbell],
];

export const getCategoryIcon = (categoryName = '') => {
  const name = categoryName.toLowerCase();
  const match = ICON_RULES.find(([pattern]) => pattern.test(name));
  return match ? match[1] : Tag;
};
