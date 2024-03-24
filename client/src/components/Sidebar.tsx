import { SIDEBAR_ITEMS } from "../const";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { LucideLogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutUser } from "@/store/user/userSlice";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const type = new URLSearchParams(search).get("tab");
  return (
    <aside className="relative bg-white p-2 shadow-md col-span-1 flex flex-col justify-between">
      <ul className="flex flex-col gap-2">
        {SIDEBAR_ITEMS.map((item, index) => (
          <li key={index}>
            <NavLink
              to={`?tab=${item.label.toLowerCase()}`}
              className={({ isActive }) =>
                (isActive && type === `${item.label.toLowerCase()}` ? "bg-red-100 " : "") +
                "p-2 flex items-center gap-5 hover:bg-red-100 rounded-lg transition-all duration-300"
              }
            >
              <span className="flex items-center justify-center rounded-full w-10 h-10 bg-red-200">
                {<item.icon size={20} />}
              </span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <ul className="sticky bottom-0 w-full">
        <li className="border-t border-t-slate-200">
          <Button
            onClick={() => (dispatch(signOutUser()), navigate("/signin"))}
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
