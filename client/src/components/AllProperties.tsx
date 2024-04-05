import axios from "axios";
import { useEffect, useState } from "react";
import PropertyCard, { IProperty } from "./PropertyCard";
import Heading from "./Heading";
import SkeletonProerty from "./skeleton/SkeletonProperty";

export default function AllProperties() {
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const getProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/property/get-properties");
      if (res.status === 200) {
        setProperties(res.data.properties);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getProperties();
  }, []);
  return (
    <div className="bg-slate-100 w-full h-10">
      <div className="container max-w-screen-2xl">
        <div className="my-8 p-10 bg-white rounded-xl shadow-md custom-min-h-screen">
          <Heading title="Book now" cssClass="mb-5" />
          {loading ? (
            <SkeletonProerty />
          ) : (
            properties &&
            properties.map((property: IProperty, index: number) => <PropertyCard property={property} key={index} />)
          )}
        </div>
      </div>
    </div>
  );
}
