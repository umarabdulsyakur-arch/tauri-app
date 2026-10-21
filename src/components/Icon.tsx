import {
  Award,
  Banknote,
  Briefcase,
  Car,
  CircleDollarSign,
  Coffee,
  Coins,
  CreditCard,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  MoreHorizontal,
  PiggyBank,
  Receipt,
  Shirt,
  ShoppingBag,
  Smartphone,
  Tag,
  TrendingUp,
  Utensils,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  award: Award,
  banknote: Banknote,
  briefcase: Briefcase,
  car: Car,
  "circle-dollar-sign": CircleDollarSign,
  coffee: Coffee,
  coins: Coins,
  "credit-card": CreditCard,
  "gamepad-2": Gamepad2,
  gift: Gift,
  "graduation-cap": GraduationCap,
  "heart-pulse": HeartPulse,
  home: Home,
  landmark: Landmark,
  "more-horizontal": MoreHorizontal,
  "piggy-bank": PiggyBank,
  receipt: Receipt,
  shirt: Shirt,
  "shopping-bag": ShoppingBag,
  smartphone: Smartphone,
  tag: Tag,
  "trending-up": TrendingUp,
  utensils: Utensils,
  "utensils-crossed": UtensilsCrossed,
  wallet: Wallet,
};

interface AppIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function AppIcon({ name, size = 18, className }: AppIconProps) {
  const Icon = ICON_MAP[name] ?? CircleDollarSign;
  return <Icon size={size} className={className} />;
}
