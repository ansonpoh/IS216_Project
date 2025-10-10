import React, { useState, useEffect } from "react";
import { UserProvider } from "./UserContext";
import { OrgProvider } from "./OrgContext";

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => sessionStorage.getItem("auth_role"));

  useEffect(() => {
    const handleStorageChange = () => {
      const newRole = sessionStorage.getItem("auth_role");
      setRole(newRole);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    setRole(sessionStorage.getItem("auth_role"));
  }, []);

  // When role is not yet determined (e.g., before login)
  if (!role) {
    return <>{children}</>;
  }

  // Render appropriate provider
  if (role === "org") {
    return (
      <OrgProvider>
        {children}
      </OrgProvider>
    );
  }

  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
};
