import React from 'react';
import {
  ShoppingCart,
  Car,
  Home,
  Film,
  HeartPulse,
  BookOpen,
  ShoppingBag,
  MoreHorizontal,
  Briefcase,
  TrendingUp,
  Laptop,
  Gift,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryType } from '@/types/category.types';

const ICON_MAP: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  'car': Car,
  'home': Home,
  'film': Film,
  'heart-pulse': HeartPulse,
  'book-open': BookOpen,
  'shopping-bag': ShoppingBag,
  'more-horizontal': MoreHorizontal,
  'briefcase': Briefcase,
  'trending-up': TrendingUp,
  'laptop': Laptop,
  'gift': Gift,
  'dollar-sign': DollarSign,
};

interface CategoryIconProps {
  readonly icon?: string | null;
  readonly type: CategoryType;
  readonly className?: string;
}

export function CategoryIcon({
  icon,
  type,
  className = 'w-4 h-4',
}: CategoryIconProps): React.ReactElement {
  const IconComponent =
    (icon && ICON_MAP[icon]) || (type === 'INCOME' ? ArrowDownLeft : ArrowUpRight);

  return <IconComponent className={className} />;
}
