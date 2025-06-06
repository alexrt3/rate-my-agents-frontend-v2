import React, { useEffect } from 'react'
import { userAuthStore } from '../store/authStore';

export const HomePage:React.FC = () => {
  const user = userAuthStore((state) => state.user);

  useEffect(() => {
    console.log("User data on HomePage:", user);
  }, [user]);

  if (!user) return <p>Loading user data...</p>;
  console.log("User data", user);

  return (
    <div>
      <h1>Welcome, {user.firstName} {user.lastName}!</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber}</p>
      <p>Agent Status: {user.isAgent ? "Yes" : "No"}</p>
    </div>
  );
}
