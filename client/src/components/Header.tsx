import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "../images/logo.svg";
import { BiSolidUserCircle } from "react-icons/bi";
import { LucideMenu } from "lucide-react";
import { signOutUser } from "@/store/user/userSlice";

export default function Header() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, []);
  const { currentUser } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      const res = await axios.post("/api/auth/signout");
      if (res.status === 200) {
        toast.success(res.data.message);
        dispatch(signOutUser());
      }
    } catch (err: any) {
      console.log(err.response.data.message);
    }
  };
  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-md">
      <div className="container-fluid pl-4 pr-4">
        <div className="flex items-center h-16 justify-between">
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center mr-5">
              <img src={Logo} alt="Logo" width={120} />
            </Link>
            {!currentUser && (
              <nav className="">
                <ul className="flex items-center">
                  <li>
                    <Link
                      to="/"
                      className="hover:bg-red-500 hover:text-white text-sm px-4 py-3 transition duration-500 rounded-sm"
                    >
                      Stay
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="hover:bg-red-500 hover:text-white text-sm px-4 py-3 transition duration-500 rounded-sm"
                    >
                      Experiences
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="hover:bg-red-500 hover:text-white text-sm px-4 py-3 transition duration-500 rounded-sm"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-gray-300 hover:shadow-lg pl-4 pr-1.5 py-1.5 text-gray-500 focus:outline-none transition-all">
              <LucideMenu size={20} />
              <BiSolidUserCircle size={36} className="text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-60 shadow-xl">
              {currentUser && (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <p className="font-semibold mb-1">{currentUser.username}</p>
                    <p>{currentUser.email}</p>
                  </DropdownMenuLabel>
                </>
              )}
              {currentUser ? (
                <>
                  <DropdownMenuSeparator />
                  <Link to="/dashboard?tab=profile">
                    <DropdownMenuItem className="py-2 font-medium">Profile</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleSignOut} className="py-2 font-medium">
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <DropdownMenuItem className="py-2 font-medium">Sign Up</DropdownMenuItem>
                  </Link>
                  <Link to="/signin">
                    <DropdownMenuItem className="py-2 font-medium">Sign In</DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
