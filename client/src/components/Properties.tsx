import { Link } from "react-router-dom";
import Heading from "./Heading";

export default function Properties() {
  return (
    <div className="container max-w-screen-2xl ">
      <div className="my-8 p-10 bg-white rounded-xl shadow-md custom-min-h-screen">
        <div className="flex items-center justify-between">
          <Heading title="Properties" />
          <Link
            to="/properties/add-property"
            className="inline-flex px-4 py-2 rounded-md text-sm bg-gradient-to-r font-normal text-white from-pink-400 via-red-500 to-orange-500  hover:from-pink-600 hover:via-red-600 hover:to-orange-400 transition-all duration-500"
          >
            Add Property
          </Link>
        </div>
      </div>
    </div>
  );
}
