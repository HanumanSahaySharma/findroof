import { useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

import Profile from "@/components/Profile";

export default function Dashboard() {
  const [tab, setTab] = useState("");
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabName = urlParams.get("tab");
    if (tabName) {
      setTab(tabName);
    }
  }, [location.search]);
  return (
    <div className="grid grid-flow-col gap-4 custom-min-h-screen">
      <Sidebar />
      <div className="col-span-8">{tab === "profile" && <Profile />}</div>
    </div>
  );
}
