import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Heading from "./Heading";
import PropertyCard from "./PropertyCard";
import { ICurrentUser } from "@/store/user/userSlice";

export default function Properties() {
  const [properties, setProperties] = useState<string[] | null>([]);
  const { currentUser } = useSelector((state: { user: ICurrentUser }) => state.user);

  const getProperties = async () => {
    try {
      const res = await axios.get(`/api/property/get-properties/${currentUser?._id}`);
      if (res.status === 200) {
        setProperties(res.data.properties);
        toast.success(res.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };
  useEffect(() => {
    getProperties();
  }, []);
  console.log(properties);
  return (
    <div className="container max-w-screen-2xl ">
      <div className="my-8 p-10 bg-white rounded-xl shadow-md custom-min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <Heading title="Properties" />
          <Link
            to="/properties/add-property"
            className="inline-flex items-center h-10 px-4 py-2 rounded-md text-sm bg-gradient-to-r font-normal text-white from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500"
          >
            Add Property
          </Link>
        </div>
        {properties &&
          properties.length > 0 &&
          properties.map((property, index) => <PropertyCard property={property} key={index} />)}
      </div>
    </div>
  );
}
