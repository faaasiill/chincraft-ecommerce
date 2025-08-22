import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { resetPassword } from "../../api/firebase/auth";
import { useNavigate } from "react-router-dom";
import ArrowFollow from "../reactbites/arrowFollow";
import { ArrowBigDown } from "lucide-react";

const LoginForm = () => {
  const { googleLogin, emailLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
  };

  const clearResetErrors = () => {
    setResetEmailError("");
    setResetError("");
    setResetMessage("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailLogin = async () => {
    if (emailLoading) return;

    clearErrors();
    setEmailLoading(true);

    // Client-side validation
    if (!email.trim()) {
      setEmailError("Email is required");
      setEmailLoading(false);
      return;
    }
    if (!validateEmail(email.trim())) {
      setEmailError("Please enter a valid email address");
      setEmailLoading(false);
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      setEmailLoading(false);
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      setEmailLoading(false);
      return;
    }

    try {
      await emailLogin(email.trim(), password);
      // Navigate to home page on successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific Firebase errors
      const errorMessage = error.message || error.toString();

      if (
        errorMessage.includes("user-not-found") ||
        errorMessage.includes("auth/user-not-found")
      ) {
        setEmailError("No account found with this email address");
      } else if (
        errorMessage.includes("wrong-password") ||
        errorMessage.includes("auth/wrong-password") ||
        errorMessage.includes("auth/invalid-credential")
      ) {
        setPasswordError("Incorrect password");
      } else if (
        errorMessage.includes("invalid-email") ||
        errorMessage.includes("auth/invalid-email")
      ) {
        setEmailError("Invalid email format");
      } else if (
        errorMessage.includes("too-many-requests") ||
        errorMessage.includes("auth/too-many-requests")
      ) {
        setGeneralError("Too many failed attempts. Please try again later.");
      } else if (errorMessage.includes("network-request-failed")) {
        setGeneralError(
          "Network error. Please check your connection and try again."
        );
      } else {
        setGeneralError(
          "Login failed. Please check your credentials and try again."
        );
      }
    } finally {
      setEmailLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (resetLoading) return;

    clearResetErrors();
    setResetLoading(true);

    if (!resetEmail.trim()) {
      setResetEmailError("Email is required");
      setResetLoading(false);
      return;
    }
    if (!validateEmail(resetEmail.trim())) {
      setResetEmailError("Please enter a valid email address");
      setResetLoading(false);
      return;
    }

    try {
      await resetPassword(resetEmail.trim());
      setResetMessage(
        "Password reset email sent! Check your inbox and spam folder."
      );
      setResetEmail("");

      // Close modal after 3 seconds
      setTimeout(() => {
        setResetModalOpen(false);
        setResetMessage("");
      }, 3000);
    } catch (error) {
      console.error("Reset password error:", error);

      const errorMessage = error.message || error.toString();

      if (
        errorMessage.includes("user-not-found") ||
        errorMessage.includes("auth/user-not-found")
      ) {
        setResetEmailError("No account found with this email address");
      } else if (
        errorMessage.includes("invalid-email") ||
        errorMessage.includes("auth/invalid-email")
      ) {
        setResetEmailError("Invalid email format");
      } else if (
        errorMessage.includes("too-many-requests") ||
        errorMessage.includes("auth/too-many-requests")
      ) {
        setResetError("Too many reset attempts. Please try again later.");
      } else {
        setResetError("Failed to send reset email. Please try again.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;

    clearErrors();
    setGoogleLoading(true);

    try {
      await googleLogin();
      // Navigate to home page on successful login
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);

      const errorMessage = error.message || error.toString();

      if (errorMessage.includes("popup-closed-by-user")) {
        setGeneralError("Login cancelled. Please try again.");
      } else if (errorMessage.includes("network-request-failed")) {
        setGeneralError(
          "Network error. Please check your connection and try again."
        );
      } else {
        setGeneralError("Google login failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const closeResetModal = () => {
    setResetModalOpen(false);
    setResetEmail("");
    clearResetErrors();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="bg-white rounded-3xl border-t-4 border-rose p-8 md:p-12 max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Left Section - Character and Welcome */}
        <div className="md:w-1/2 text-center md:text-left">
          {/* Arrow Moving Animation */}
          <div className="mb-8 flex justify-center md:justify-start">
            <ArrowFollow
              valone={"✨ Authentic"}
              valtwo={"🎨 Artistic"}
              valthree={"💎 Elegant"}
              valfour={"⏳ Timeless"}
              connect={"connect"}
            />
          </div>

          <h1 className="text-4xl md:text-5xl tracking-tight handwrite-font rose mb-4">
            Welcome back!
          </h1>
          <p className="text-gray-500 font-light text-sm tracking-tighter">
            Ready to continue your journey? Please sign in to your account.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="md:w-1/2 w-full max-w-md">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full mb-6 px-6 py-4 bg-white border border-gray-300 tracking-tight rounded-full text-gray-800 font-medium 
             flex items-center justify-center gap-3 transition-all 
             hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
            )}
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* General Error */}
          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {generalError}
            </div>
          )}

          {/* Divider */}
          <div className="relative tracking-tight mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
                if (generalError) setGeneralError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !emailLoading) {
                  handleEmailLogin();
                }
              }}
              disabled={emailLoading}
              className={`w-full px-4 py-4 border tracking-tight rounded-full bg-white text-gray-900 placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-[#DD6A99] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                emailError
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {emailError && (
              <p className="mt-2 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
                if (generalError) setGeneralError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !emailLoading) {
                  handleEmailLogin();
                }
              }}
              disabled={emailLoading}
              className={`w-full px-4 py-4 border rounded-full tracking-tight bg-white text-gray-900 placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-[#DD6A99] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                passwordError
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {passwordError && (
              <p className="mt-2 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            onClick={handleEmailLogin}
            disabled={emailLoading}
            className="w-full mb-4 px-6 py-4 background-rose text-white font-medium rounded-full transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {emailLoading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {emailLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              onClick={() => setResetModalOpen(true)}
              disabled={emailLoading || googleLoading}
              className="text-sm text-gray-600 hover:text-gray-900 tracking-tight transition-colors focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Forgot your password?
            </button>
          </div>

          {/* Sign Up Redirect */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 tracking-tight">
              Do not have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="rose font-medium hover:underline focus:outline-none"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-white bg-opacity-20 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border-t-4 border-rose shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="text-center mb-8">
              {/* Modal Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-rose-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2h6a2 2 0 012 2v2M9 12h6"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 handwrite-font rose mb-2">
                Reset Password
              </h2>
              <p className="text-gray-500 font-light text-sm tracking-tighter">
                Enter your email address and we'll send you a reset link
              </p>
            </div>

            <div>
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    if (resetEmailError) setResetEmailError("");
                    if (resetError) setResetError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !resetLoading) {
                      handleResetPassword(e);
                    }
                  }}
                  disabled={resetLoading}
                  className={`w-full px-4 py-4 border rounded-full bg-white text-gray-900 placeholder-gray-500 tracking-tight transition-all focus:outline-none focus:ring-2 focus:ring-[#DD6A99] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                    resetEmailError
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {resetEmailError && (
                  <p className="mt-2 text-sm text-red-600">{resetEmailError}</p>
                )}
              </div>

              {/* Reset Success Message */}
              {resetMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                  {resetMessage}
                </div>
              )}

              {/* Reset Error Message */}
              {resetError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {resetError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={(e) => handleResetPassword(e)}
                  disabled={resetLoading}
                  className="flex-1 px-6 py-4 background-rose text-white font-medium rounded-full transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 tracking-tight disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {resetLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {resetLoading ? "Sending..." : "Send Reset Email"}
                </button>
                <button
                  onClick={closeResetModal}
                  disabled={resetLoading}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-800 font-medium rounded-full transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
