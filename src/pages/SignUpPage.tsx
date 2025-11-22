import SignUpForm from "../components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-3 text-white">
          RandomRank
        </h1>
        <p className="text-center text-gray-400 mb-5">
          Create your account
        </p>

        <SignUpForm />
      </div>
    </div>
  );
}