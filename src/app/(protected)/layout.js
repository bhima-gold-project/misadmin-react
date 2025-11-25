import { redirect } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "../../../constant";
import { cookies } from "next/headers";

export default async function ProtectedLayout({ children }) {
  try {
    // Read secure httpOnly cookie on server
    const token = cookies().get("token")?.value;

    if (!token) {
      redirect("/login");
    }
    
    const response = await axios.get(
      `${BASE_URL}/api/users/getuserdetails`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    console.log("response", response?.data);
  } catch (e) {
    redirect("/login");
  }

  return <>{children}</>;
}
