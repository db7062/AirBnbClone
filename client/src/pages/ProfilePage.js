import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNavbar from "../AccountNavbar";

export default function ProfilePage() {
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  const [redirect, setRedirect] = useState(null);

  const { ready, user, setUser } = useContext(UserContext);

  if (!ready) {
    return "Loading.....";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }



  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/");
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
    <AccountNavbar/>

      {subpage === "profile" && (
        <div className="justify text-center mt-9">
          Logged is as {user.name}({user.email}) <br />
          <button
            onClick={logout}
            className="primary rounded full max-w-sm mt-3"
          >
            Logout
          </button>
        </div>
      )}

      {subpage === "places" && (
        <div>
          <PlacesPage />
        </div>
      )}
    </div>
  );
}
