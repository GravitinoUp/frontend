import React from "react";
import { useLocation } from "react-router-dom";

export default function NavIcon({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();

  return <div className={path === pathname ? "svg" : ""}>{children}</div>;
}
