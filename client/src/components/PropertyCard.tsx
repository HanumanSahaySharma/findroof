import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { ICurrentUser } from "@/store/user/userSlice";
import { LucideMapPin, LucideTv2, LucideWashingMachine, LucideWifi } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface IAmenities {
  essentials: string[];
  features: string[];
  safety: string[];
}

export interface IProperty {
  userId: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export default function PropertyCard({ property }: { property: IProperty }) {
  const { currentUser } = useSelector((state: { user: ICurrentUser }) => state.user);
  return (
    <div className="grid grid-cols-12 gap-8 bg-slate-100 p-4 mb-5 rounded-md">
      <div className="col-span-4 relative">
        <div className="absolute -left-3 top-2 shadow-lg rounded-tr rounded-br bg-gradient-to-tr from-pink-400 via-red-500 to-orange-500 text-white p-2 z-[1] ribbon">
          For {property.propertyFor}
        </div>
        <Carousel className="relative rounded-md overflow-hidden">
          <CarouselContent>
            {property.photoUrls.map((url: string, index: number) => (
              <CarouselItem key={index} className="bg-cover w-full h-60" style={{ backgroundImage: `url(${url})` }} />
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-1 top-[50%] -translate-y-[50%]" />
          <CarouselNext className="absolute right-1 top-[50%] -translate-y-[50%]" />
        </Carousel>
      </div>
      <div className="col-span-8">
        <h2 className="font-medium text-xl mb-2">{property.name}</h2>
        <p className="text-slate-500 flex items-center gap-2 mb-5">
          <LucideMapPin size={18} /> {property.address}
        </p>
        <div className="flex flex-wrap gap-5 mb-5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-200 flex items-center justify-center w-8 h-8">
              <LucideWifi size={18} className="text-red-500" />
            </span>
            <span className="font-medium">WiFi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-200 flex items-center justify-center w-8 h-8">
              <LucideTv2 size={18} className="text-red-500" />
            </span>
            <span className="font-medium">TV</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-200 flex items-center justify-center w-8 h-8">
              <LucideWashingMachine size={18} className="text-red-500" />
            </span>
            <span className="font-medium">Washing Machine</span>
          </div>
        </div>
        <div className="line-clamp-1 text-slate-500 mb-10">{property.description}</div>
        <div className="flex justify-end gap-4">
          {currentUser?._id === property.userId && (
            <Button className="font-normal bg-gradient-to-tr from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500">
              Edit
            </Button>
          )}
          {currentUser?._id !== property.userId && (
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
  );
}
