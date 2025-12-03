import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { getMountainDateString } from "../utils/getMountainDate";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError, data: authData } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Incorrect email or password. Please try again.");
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      const today = getMountainDateString();
      const { data: ranking, error: rankingError } = await supabase
        .from("user_rankings")
        .select("id")
        .eq("user_id", authData.user?.id)
        .eq("date", today)
        .single();

      if (rankingError || !ranking) {
        navigate("/rank");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />

      <button
        type="submit"
        className={`p-3 mt-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Logging In..." : "Log In"}
      </button>

      <p className="text-sm text-gray-500 text-center mt-2">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-purple-500 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
