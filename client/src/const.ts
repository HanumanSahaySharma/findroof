import { LucideCircleGauge, LucideCircleUserRound, LucideBuilding } from "lucide-react";

export const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    icon: LucideCircleGauge,
  },
  {
    label: "Profile",
    icon: LucideCircleUserRound,
  },
  {
    label: "Properties",
    icon: LucideBuilding,
  },
];

export const PROPERTY_TYPE = ["Room", "Home"];
export const PROPERTY_FOR = ["Sale", "Rent"];

export const BEDROOMS = ["1", "2", "3", "4", "5", "6+"];
export const BATHROOMS = ["1", "2", "3", "4", "5", "6+"];

export const ESSENTIALS = [
  { id: "wifi", label: "Wifi" },
  { id: "kitchen", label: "Kitchen" },
  { id: "private attached bathroom", label: "Private attached bathroom" },
  { id: "washing machine", label: "Washing machine" },
  { id: "air conditioning", label: "Air conditioning" },
  { id: "tv", label: "TV" },
  { id: "hair dryer", label: "Hair dryer" },
  { id: "iron", label: "Iron" },
];
export const FEATURES = [
  { id: "pool", label: "Pool" },
  { id: "hot tub", label: "Hot tub" },
  { id: "free parking", label: "Free parking" },
  { id: "ev charger", label: "EV charger" },
  { id: "king bed", label: "King bed" },
  { id: "gym", label: "Gym" },
  { id: "smoking allowed", label: "Smoking allowed" },
  { id: "indoor fireplace", label: "Indoor fireplace" },
];

export const SEFETY_FEATURES = [
  {
    id: "smoke alarm",
    label: "Smoke alarm",
  },
  {
    id: "carbon monoxide alarm",
    label: "Carbon monoxide alarm",
  },
];
