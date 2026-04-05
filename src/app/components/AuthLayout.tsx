import { useEffect } from "react";
import { useAppSelector } from "../hooks";
import { useNavigate } from "react-router";

interface AuthLayoutProps {
  readonly children: React.ReactNode;
  readonly authentication?: boolean;
}

function AuthLayout({ children, authentication = true }: AuthLayoutProps) {
  const authStatus = useAppSelector((state) => state.auth.status);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on authentication requirements:
    // - Protected routes (authentication=true) require user to be logged in
    // - Guest routes (authentication=false) redirect logged-in users away
    if (authentication && !authStatus) {
      navigate("/login");
    } else if (!authentication && authStatus) {
      navigate("/");
    }
  }, [authStatus, navigate, authentication]);

  return <>{children}</>;
}

export default AuthLayout;
