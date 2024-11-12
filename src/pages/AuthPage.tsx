import { AuthForm } from "@/components/AuthForm";
import { useSearchParams } from "react-router-dom";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("signup") === "true";

  return (
    <div className="min-h-screen bg-bookBeige py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <AuthForm defaultIsSignUp={isSignUp} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
