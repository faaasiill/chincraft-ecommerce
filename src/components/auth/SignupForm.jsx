import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ArrowFollow from "../reactbites/arrowFollow";

const SignupForm = () => {
  const { googleLogin, emailSignup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setGeneralError("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 6 characters, contains at least one letter and one number
    return password.length >= 6;
  };

  const handleEmailSignup = async () => {
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
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long");
      setEmailLoading(false);
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      setEmailLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      setEmailLoading(false);
      return;
    }

    try {
      await emailSignup(email.trim(), password);
      // Navigate to home page on successful signup
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);

      // Handle specific Firebase errors
      const errorMessage = error.message || error.toString();
      const errorCode = error.code;

      if (
        errorCode === "auth/email-already-in-use" ||
        errorMessage.includes("email-already-in-use")
      ) {
        setEmailError("This email is already registered");
      } else if (
        errorCode === "auth/invalid-email" ||
        errorMessage.includes("invalid-email")
      ) {
        setEmailError("Invalid email format");
      } else if (
        errorCode === "auth/weak-password" ||
        errorMessage.includes("weak-password")
      ) {
        setPasswordError("Password is too weak. Use at least 6 characters");
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
          "Signup failed. Please check your information and try again."
        );
      }
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (googleLoading) return;

    clearErrors();
    setGoogleLoading(true);

    try {
      await googleLogin();
      // Navigate to home page on successful signup
      navigate("/");
    } catch (error) {
      console.error("Google signup error:", error);

      const errorMessage = error.message || error.toString();

      if (errorMessage.includes("popup-closed-by-user")) {
        setGeneralError("Signup cancelled. Please try again.");
      } else if (errorMessage.includes("network-request-failed")) {
        setGeneralError(
          "Network error. Please check your connection and try again."
        );
      } else {
        setGeneralError("Google signup failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="bg-white rounded-3xl border-t-4 border-rose p-8 md:p-12 max-w-4xl w-full flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Left Section - Character and Welcome */}
        <div className="md:w-1/2 text-center md:text-left">
          {/* Arrow Moving Animation */}
          <div className="mb-8 flex justify-center md:justify-start">
            <ArrowFollow valone={'🌱 Creative'} valtwo={'🌟 Unique'} valthree={'💫 Inspired'} valfour={'🌸 Graceful'} connect={'connect'}/>
          </div>

          <h1 className="text-4xl md:text-5xl tracking-tight handwrite-font rose mb-4">
            Join us today!
          </h1>
          <p className="text-gray-500 font-light text-sm tracking-tighter">
            Create your account and start your journey with us. It only takes a few minutes.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="md:w-1/2 w-full max-w-md">
          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
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
            {googleLoading ? "Creating account..." : "Sign up with Google"}
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
                or create account with email
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
                  handleEmailSignup();
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
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
                if (generalError) setGeneralError("");
                // Clear confirm password error if passwords now match
                if (confirmPassword && e.target.value === confirmPassword && confirmPasswordError) {
                  setConfirmPasswordError("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !emailLoading) {
                  handleEmailSignup();
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

          {/* Confirm Password Input */}
          <div className="mb-6">
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError("");
                if (generalError) setGeneralError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !emailLoading) {
                  handleEmailSignup();
                }
              }}
              disabled={emailLoading}
              className={`w-full px-4 py-4 border rounded-full tracking-tight bg-white text-gray-900 placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-[#DD6A99] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                confirmPasswordError
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {confirmPasswordError && (
              <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="mb-6 text-xs text-gray-500 tracking-tight">
            Password must be at least 6 characters long
          </div>

          {/* Signup Button */}
          <button
            onClick={handleEmailSignup}
            disabled={emailLoading}
            className="w-full mb-4 px-6 py-4 background-rose text-white font-medium rounded-full transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {emailLoading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {emailLoading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Terms and Privacy */}
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 tracking-tight leading-relaxed">
              By creating an account, you agree to our{" "}
              <button className="rose hover:underline focus:outline-none">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="rose hover:underline focus:outline-none">
                Privacy Policy
              </button>
            </p>
          </div>

          {/* Login Redirect */}
          <div className="text-center">
            <p className="text-sm text-gray-500 tracking-tight">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="rose font-medium hover:underline focus:outline-none"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;