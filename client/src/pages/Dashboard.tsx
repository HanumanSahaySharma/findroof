import { useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

import Profile from "@/components/Profile";
import Properties from "@/components/Properties";

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
    <div className="grid grid-cols-12 gap-4 custom-min-h-screen">
      <Sidebar />
      <div className="col-span-10">
        {tab === "profile" && <Profile />}
        {tab === "properties" && <Properties />}
      </div>
    </div>
  );
}
