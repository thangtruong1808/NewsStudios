// Component Info
// Description: Icon mapping utility for categories and subcategories using Lucide React with duplicate prevention.
// Date created: 2025-01-27
// Author: thangtruong

import { LucideIcon } from "lucide-react";
import {
  Newspaper,
  Laptop,
  Music,
  Film,
  Gamepad2,
  Heart,
  GraduationCap,
  Car,
  Plane,
  UtensilsCrossed,
  ShoppingBag,
  Home,
  Briefcase,
  FlaskConical,
  Paintbrush,
  BookOpen,
  Camera,
  Video,
  Mic,
  TrendingUp,
  Globe,
  Users,
  Tag,
  Sparkles,
  Zap,
  Compass,
  Palette,
  Code,
  Dumbbell,
  Stethoscope,
  School,
  Building2,
  Lightbulb,
  Image,
  Radio,
  DollarSign,
  MapPin,
  MessageSquare,
  Trophy,
} from "lucide-react";

// Icon pool for categories
const categoryIconPool: LucideIcon[] = [
  Newspaper, Laptop, Trophy, Music, Film, Gamepad2, Heart, GraduationCap,
  Car, Plane, UtensilsCrossed, ShoppingBag, Home, Briefcase, FlaskConical,
  Paintbrush, BookOpen, Camera, Video, Mic, TrendingUp, Globe, Users,
  Sparkles, Zap, Compass, Palette, Code, Dumbbell, Stethoscope, School,
  Building2, Lightbulb, Image, Radio, DollarSign, MapPin, MessageSquare,
];

// Icon pool for subcategories (different from categories to avoid duplicates)
const subcategoryIconPool: LucideIcon[] = [
  Tag, Sparkles, Zap, Compass, Palette, Code, Dumbbell, Stethoscope,
  School, Building2, Lightbulb, Image, Radio, DollarSign, MapPin,
  MessageSquare, Newspaper, Laptop, Trophy, Music, Film, Gamepad2,
  Heart, GraduationCap, Car, Plane, UtensilsCrossed, ShoppingBag,
  Home, Briefcase, FlaskConical, Paintbrush, BookOpen, Camera, Video,
  Mic, TrendingUp, Globe, Users,
];

// Icon mapping function for categories
export const getCategoryIcon = (categoryName: string, usedIcons: Set<LucideIcon> = new Set()): LucideIcon => {
  const name = categoryName.toLowerCase();
  const iconMap: Array<{ keywords: string[]; icon: LucideIcon }> = [
    { keywords: ["tech", "technology", "computer", "digital"], icon: Laptop },
    { keywords: ["sport", "fitness", "athletic"], icon: Trophy },
    { keywords: ["music", "audio", "sound"], icon: Music },
    { keywords: ["entertainment", "movie", "film", "cinema"], icon: Film },
    { keywords: ["game", "gaming", "play"], icon: Gamepad2 },
    { keywords: ["health", "medical", "wellness"], icon: Heart },
    { keywords: ["education", "school", "learn", "study"], icon: GraduationCap },
    { keywords: ["auto", "car", "vehicle"], icon: Car },
    { keywords: ["travel", "trip", "journey"], icon: Plane },
    { keywords: ["food", "restaurant", "cooking", "cuisine"], icon: UtensilsCrossed },
    { keywords: ["shopping", "retail", "store"], icon: ShoppingBag },
    { keywords: ["home", "house", "garden", "property"], icon: Home },
    { keywords: ["business", "finance", "economy", "market"], icon: Briefcase },
    { keywords: ["science", "research", "lab"], icon: FlaskConical },
    { keywords: ["art", "design", "creative"], icon: Paintbrush },
    { keywords: ["book", "literature", "reading"], icon: BookOpen },
    { keywords: ["photo", "image", "picture"], icon: Camera },
    { keywords: ["video", "youtube"], icon: Video },
    { keywords: ["podcast", "radio", "broadcast"], icon: Mic },
    { keywords: ["finance", "stock", "investment"], icon: TrendingUp },
    { keywords: ["world", "global", "international", "news"], icon: Globe },
    { keywords: ["social", "people", "community"], icon: Users },
  ];

  for (const { keywords, icon } of iconMap) {
    if (keywords.some((keyword) => name.includes(keyword)) && !usedIcons.has(icon)) {
      return icon;
    }
  }

  // Fallback: find first unused icon from pool
  for (const icon of categoryIconPool) {
    if (!usedIcons.has(icon)) {
      return icon;
    }
  }
  return Newspaper;
};

// Icon mapping function for subcategories
export const getSubcategoryIcon = (subcategoryName: string, usedIcons: Set<LucideIcon> = new Set()): LucideIcon => {
  const name = subcategoryName.toLowerCase();
  const iconMap: Array<{ keywords: string[]; icon: LucideIcon }> = [
    { keywords: ["tech", "technology", "computer"], icon: Code },
    { keywords: ["sport", "fitness"], icon: Dumbbell },
    { keywords: ["music", "audio"], icon: Radio },
    { keywords: ["entertainment", "movie"], icon: Sparkles },
    { keywords: ["game", "gaming"], icon: Zap },
    { keywords: ["health", "medical"], icon: Stethoscope },
    { keywords: ["education", "school"], icon: School },
    { keywords: ["auto", "car"], icon: Compass },
    { keywords: ["travel", "trip"], icon: MapPin },
    { keywords: ["food", "restaurant"], icon: UtensilsCrossed },
    { keywords: ["shopping", "retail"], icon: ShoppingBag },
    { keywords: ["home", "house"], icon: Home },
    { keywords: ["business", "finance"], icon: Building2 },
    { keywords: ["science"], icon: Lightbulb },
    { keywords: ["art", "design"], icon: Palette },
    { keywords: ["book", "literature"], icon: BookOpen },
    { keywords: ["photo", "image"], icon: Image },
    { keywords: ["video"], icon: Video },
    { keywords: ["podcast", "radio"], icon: Mic },
    { keywords: ["finance", "stock"], icon: DollarSign },
    { keywords: ["world", "global"], icon: Globe },
    { keywords: ["social", "people"], icon: MessageSquare },
  ];

  for (const { keywords, icon } of iconMap) {
    if (keywords.some((keyword) => name.includes(keyword)) && !usedIcons.has(icon)) {
      return icon;
    }
  }

  // Fallback: find first unused icon from pool
  for (const icon of subcategoryIconPool) {
    if (!usedIcons.has(icon)) {
      return icon;
    }
  }
  return Tag;
};

