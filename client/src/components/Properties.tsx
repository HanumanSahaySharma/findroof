import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Heading from "./Heading";
import PropertyCard, { IProperty } from "./PropertyCard";
import { ICurrentUser } from "@/store/user/userSlice";
import SkeletonProerty from "./skeleton/SkeletonProperty";

export default function Properties() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useSelector((state: { user: ICurrentUser }) => state.user);

  const getProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/property/get-properties?userId=${currentUser?._id}`);
      if (res.status === 200) {
        setProperties(res.data.properties);
        toast.success(res.data.message, {
          toastId: "success",
        });
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      setLoading(false);
    }
  };

  const deleteProperty = async (propertyId: string, userId: string) => {
    try {
      const res = await axios.delete(`/api/property/delete-property?propertyId=${propertyId}&userId=${userId}`);
      if (res.status === 200) {
        toast.success(res.data.message, {
          toastId: "success",
        });
        setProperties(properties.filter((property: IProperty) => property._id !== propertyId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProperties();
  }, [currentUser]);

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

        {loading ? (
          <SkeletonProerty />
        ) : properties.length > 0 ? (
          properties.map((property: IProperty) => (
            <PropertyCard property={property} key={property._id} deleteProperty={deleteProperty} />
          ))
        ) : (
          <p>No properties found.</p>
        )}
      </div>
    </div>
  );
}
