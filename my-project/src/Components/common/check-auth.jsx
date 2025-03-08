import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, children }) {
  const location = useLocation();

  console.log("Current Path:", location.pathname, "| Authenticated:", isAuthenticated);

  // Redirect unauthenticated users to login unless they are already on login/register pages
  const isAuthPage = location.pathname.includes("/login") || location.pathname.includes("/register");

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // Redirect authenticated users from "/" to "/home"
  if (isAuthenticated && location.pathname === "/") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
