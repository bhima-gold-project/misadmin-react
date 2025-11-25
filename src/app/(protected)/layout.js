import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default function ProtectedLayout({ children }) {
  const token = cookies().get("token")?.value;

  // No token → redirect to login
  if (!token) {
    redirect("/login");
  }

  // Optional: Verify JWT
  try {
    jwt.verify(token, 'qwerty1234567testuser123');
  } catch (e) {
    redirect("/login");
  }

  return <>{children}</>;
}
