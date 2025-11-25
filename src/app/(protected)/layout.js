import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default function ProtectedLayout({ children }) {
  const token = localStorage.getItem('token')
  try {
    jwt.verify(token, 'qwerty1234567testuser123');
  } catch (e) {
    redirect("/login");
  }

  return <>{children}</>;
}
