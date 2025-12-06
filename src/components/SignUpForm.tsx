import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: existingUsername, error: usernameError } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("username", username)
        .maybeSingle();

      if (usernameError) {
        console.error(usernameError);
        setError("Error checking username availability.");
        return;
      }

      if (existingUsername) {
        setError("Username already taken. Please choose another one.");
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError("Unexpected error: user not created.");
        return;
      }

      const userId = authData.user.id;

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: userId,
          username,
        },
      ]);

      if (profileError) {
        console.error(profileError);
        setError("Error saving profile. Please try again.");
        return;
      }

      setSuccess("Account created! Check your email to confirm your account.");
      setEmail("");
      setUsername("");
      setPassword("");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && <p className="text-green-500 text-sm text-center">{success}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
        {loading ? "Signing Up..." : "Sign Up"}
      </button>

      <p className="text-sm text-gray-500 text-center mt-2">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-purple-500 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
