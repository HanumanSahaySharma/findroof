import React from "react";

import { Button } from "./ui/button";

export default function OAuth({ label }: { label: string }) {
  return <Button className="w-full mb-4 bg-slate-800 hover:bg-slate-700 transition-all duration-500">{label}</Button>;
}
