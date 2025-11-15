export default function LoginForm() {
  return (
    <form className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Username"
        className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        type="password"
        placeholder="Password"
        className="p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="p-3 mt-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
      >
        Log In
      </button>
      <p className="text-sm text-gray-500 text-center mt-2">
        Don't have an account? <span className="text-purple-500 hover:underline cursor-pointer">Sign up</span>
      </p>
    </form>
  );
}
