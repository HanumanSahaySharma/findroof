import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { ICurrentUser } from "@/store/user/userSlice";
import {
  LucideCheck,
  LucideCheckCircle2,
  LucideIndianRupee,
  LucideMapPin,
  LucideTv2,
  LucideWashingMachine,
  LucideWifi,
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { capitalizeText } from "@/store/utils/capitalizeText";
import { Link } from "react-router-dom";

interface IAmenities {
  essentials: string[];
  features: string[];
  safety: string[];
}

export interface IProperty {
  _id: string;
  userId: string;
  slug: string;
  photoUrls: string[];
  name: string;
  description: string;
  address: string;
  price: number;
  propertyType: string;
  propertyFor: string;
  bedrooms: number;
  bathrooms: number;
  amenities: IAmenities;
}

export default function PropertyCard({ property }: { property: IProperty }) {
  const { currentUser } = useSelector((state: { user: ICurrentUser }) => state.user);
  const { userId, slug, photoUrls, name, description, address, price, propertyFor, propertyType, amenities } = property;
  const { essentials } = amenities;
  return (
    <div className="grid grid-cols-12 gap-8 bg-slate-100 p-4 mb-5 rounded-md">
      <div className="col-span-4 relative">
        <div className="absolute -left-3 top-2 shadow-lg rounded-tr rounded-br bg-gradient-to-tr from-pink-400 via-red-500 to-orange-500 text-white p-2 z-[1] ribbon">
          For {propertyFor}
        </div>
        <Carousel className="relative rounded-md overflow-hidden">
          <CarouselContent>
            {photoUrls.map((url: string, index: number) => (
              <CarouselItem key={index} className="bg-cover w-full h-60" style={{ backgroundImage: `url(${url})` }} />
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-1 top-[50%] -translate-y-[50%]" />
          <CarouselNext className="absolute right-1 top-[50%] -translate-y-[50%]" />
        </Carousel>
      </div>
      <div className="col-span-8">
        <h2 className="font-medium text-xl mb-2">{name}</h2>
        <p className="text-slate-500 flex items-center gap-2 mb-5">
          <LucideMapPin size={18} /> {address}
        </p>
        <div className="flex flex-wrap gap-5 mb-5">
          {essentials.length > 2 &&
            essentials.slice(0, 3).map((ess) => (
              <div className="flex items-center gap-2" key={ess}>
                <LucideCheckCircle2 size={20} className="text-red-500" />
                <span className="font-medium">{capitalizeText(ess)}</span>
              </div>
            ))}
          {essentials.length - 3 !== 0 && <span className="text-slate-400">+ {essentials.length - 3} more</span>}
        </div>
        <div className="line-clamp-1 mb-10">{description}</div>

        <div className="flex justify-between gap-4">
          <div>
            <p className="font-bold text-2xl flex items-center">
              <LucideIndianRupee size={20} className="mr-1" />
              {price}
            </p>
            {propertyType === "room" && <p className="text-sm text-slate-500">Room Per Night</p>}
            {propertyType === "home" && <p className="text-sm text-slate-500">Entire Home Per Night</p>}
          </div>

          <div className="flex justify-end gap-4">
            {currentUser?._id === userId && (
              <Link
                to={`/property/${slug}/edit`}
                className="font-normal bg-gradient-to-tr from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500"
              >
                Edit
              </Link>
            )}
            {currentUser?._id !== userId && (
              <>
                <Button className="font-normal bg-gradient-to-tr from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500">
                  View Details
                </Button>
                <Button className="font-normal bg-gradient-to-tr from-green-500 via-green-500 to-green-700  hover:from-green-600 hover:via-green-600 hover:to-green-400 transition-background duration-500">
                  Book Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
