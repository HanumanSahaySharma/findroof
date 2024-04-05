import axios from "axios";
import { IProperty } from "./PropertyCard";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BathIcon, BedDouble, IndianRupee, LucideCheckCircle2, MapPinIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

import Heading from "./Heading";
import { capitalizeText } from "@/store/utils/capitalizeText";
import { Button } from "./ui/button";

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<IProperty>({
    photoUrls: [],
    name: "",
    description: "",
    address: "",
    price: 0,
    propertyType: "",
    propertyFor: "",
    bedrooms: 0,
    bathrooms: 0,
    amenities: {
      essentials: [],
      features: [],
      safetyFeatures: [],
    },
  });

  const getPropertyById = async () => {
    try {
      const res = await axios.get(`/api/property/get-properties?propertyId=${propertyId}`);
      if (res.status === 200) {
        setProperty(res.data.properties[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPropertyById();
  }, []);
  const { photoUrls, name, description, address, price, propertyType, propertyFor, bedrooms, bathrooms, amenities } =
    property;
  const { essentials, features, safetyFeatures } = amenities;
  return (
    <div className="w-full relative">
      {photoUrls.length > 1 ? (
        <Carousel className="relative overflow-hidden mb-8">
          <CarouselContent>
            {photoUrls.map((url: string, index: number) => (
              <CarouselItem
                key={index}
                className="bg-cover w-full h-96"
                style={{ backgroundImage: `url(${url})`, backgroundPosition: "center" }}
              />
            ))}
          </CarouselContent>
          {photoUrls.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-1 top-[50%] -translate-y-[50%]" />
              <CarouselNext className="absolute right-1 top-[50%] -translate-y-[50%]" />
            </>
          )}
        </Carousel>
      ) : (
        <div
          className="bg-cover w-full h-96 rounded-md mb-8"
          style={{ backgroundImage: `url('https://placehold.co/600x400/fee2e2/333333/png` }}
        />
      )}
      <div className="container max-w-screen-2xl relative">
        <div className="my-8 p-10 bg-white rounded-xl shadow-md custom-min-h-screen">
          <div className="flex mb-2">
            <Link
              to="/"
              className="self-start mr-5 p-0.5 rounded-md bg-gradient-to-r text-white from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500"
            >
              <span className="p-1.5 bg-white flex items-center text-red-500 rounded">
                <ArrowLeft size={20} />
              </span>
            </Link>
            <Heading title={name} />
          </div>
          <div className="mb-8 inline-flex ml-14 px-2 py-1.5 text-sm font-medium rounded-md bg-gradient-to-r text-white from-pink-400 via-red-500 to-orange-500">
            For {propertyFor}
          </div>

          <div className="grid gap-5 mb-8">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="flex items-center justify-center text-white rounded-full  w-8 h-8 bg-gradient-to-r from-pink-400 via-red-500 to-orange-500">
                <MapPinIcon size={18} />
              </div>
              <span className="font-semibold">{address}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <div className="flex items-center justify-center text-white rounded-full  w-8 h-8 bg-gradient-to-r from-pink-400 via-red-500 to-orange-500">
                <BedDouble size={18} />
              </div>
              <span className="font-semibold">{bedrooms}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <div className="flex items-center justify-center text-white rounded-full  w-8 h-8 bg-gradient-to-r from-pink-400 via-red-500 to-orange-500">
                <BathIcon size={18} />
              </div>
              <span className="font-semibold">{bathrooms}</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="grid grid-flow-row">
              {essentials && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 uppercase text-slate-500">Essantials Amenities</h3>
                  <div className="flex gap-10">
                    {essentials.map((ess: string) => (
                      <div className="flex items-center gap-2" key={ess}>
                        <LucideCheckCircle2 size={20} className="text-red-500" />
                        <span className="font-medium">{capitalizeText(ess)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {features && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 uppercase text-slate-500">Features</h3>
                  <div className="flex gap-10">
                    {features.map((feature: string) => (
                      <div className="flex items-center gap-2" key={feature}>
                        <LucideCheckCircle2 size={20} className="text-red-500" />
                        <span className="font-medium">{capitalizeText(feature)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {safetyFeatures && (
                <div className="mb-0">
                  <h3 className="font-semibold mb-4 uppercase text-slate-500">Safety Features</h3>
                  <div className="flex gap-10">
                    {safetyFeatures.map((feature: string) => (
                      <div className="flex items-center gap-2" key={feature}>
                        <LucideCheckCircle2 size={20} className="text-red-500" />
                        <span className="font-medium">{capitalizeText(feature)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="font-semibold mb-4 uppercase text-slate-500">About this property</h3>
            <p>{description}</p>
          </div>

          <div className="bg-gradient-to-r from-pink-400 via-red-500 to-orange-500 p-1 rounded-md">
            <div className="bg-white p-10 flex justify-between items-center rounded-md">
              <div className="">
                <span className="font-bold uppercase text-slate-500">Price:</span>
                <span className="flex items-baseline gap-2 font-bold">
                  <IndianRupee />
                  <span className="text-4xl bg-gradient-to-r from-pink-400 via-red-500 to-orange-500 text-transparent bg-clip-text">
                    {price}
                  </span>
                  <span className="uppercase text-slate-500">
                    {propertyType === "room"
                      ? "Room per night"
                      : propertyType === "home"
                      ? "Entire home per night"
                      : ""}
                  </span>
                </span>
              </div>
              <Button
                size="lg"
                className="px-12 py-6 rounded-md font-semibold text-white flex items-center justify-center bg-gradient-to-tr from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
