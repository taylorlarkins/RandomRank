import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-700"
      >
        {user?.email}
      </button>

      {open && (
        <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl text-sm">
          <p className="text-gray-400 mb-2">Logged in as</p>
          <p className="text-white font-semibold mb-3">{user.email}</p>
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
