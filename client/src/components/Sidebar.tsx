import { SIDEBAR_ITEMS } from "../const";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LucideLogOut } from "lucide-react";

export default function Sidebar() {
  const handleSignOut = () => {
    console.log("sing");
  };
  return (
    <aside className="relative bg-white p-2 shadow-md col-span-1 flex flex-col justify-between">
      <ul className="flex flex-col gap-2">
        {SIDEBAR_ITEMS.map((item, index) => (
          <li key={index}>
            <Link
              to={`?tab=${item.label.toLowerCase()}`}
              className="p-2 flex items-center gap-5 hover:bg-red-100 rounded-lg transition-all duration-300"
            >
              <span className="flex items-center justify-center rounded-full w-10 h-10 bg-red-200">
                {<item.icon size={20} />}
              </span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="sticky bottom-0 w-full">
        <li className="border-t border-t-slate-200">
          <Button
            onClick={handleSignOut}
            className="h-auto p-2 flex items-center justify-start gap-5 w-full text-md font-normal bg-transparent hover:bg-red-100 text-dark-800 rounded-lg transition-all duration-300"
          >
            <span className="flex items-center justify-center rounded-full w-10 h-10 bg-red-200">
              <LucideLogOut size={20} />
            </span>
            Sign out
          </Button>
        </li>
      </ul>
    </aside>
  );
}
