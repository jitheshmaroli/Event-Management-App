import { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import Joi from "joi";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { OTP_PURPOSE } from "@/constants/otpPurpose";

const phoneRegex = /^[6-9]\d{9}$/;

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Name must be at least 2 characters",
    "any.required": "Full name is required",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).+$/,
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 64 characters",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  }),

  phone: Joi.string().pattern(phoneRegex).allow("").messages({
    "string.pattern.base": "Mobile number must be 10 digits starting with 6-9",
  }),
}).options({ abortEarly: false });

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Real-time validation on change + after blur
  const validateField = (name: string, value: string) => {
    const { error } = registerSchema.validate(
      { ...form, [name]: value },
      { abortEarly: false },
    );

    if (error) {
      const fieldError = error.details.find((d) => d.context?.key === name);
      return fieldError ? fieldError.message : undefined;
    }
    return undefined;
  };

  const validateWholeForm = () => {
    const { error } = registerSchema.validate(form, { abortEarly: false });

    if (!error) return {};

    const newErrors: Record<string, string> = {};
    error.details.forEach((err) => {
      if (err.context?.key) {
        newErrors[err.context.key] = err.message;
      }
    });
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let finalValue = value;
    if (name === "phone") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => ({ ...prev, [name]: finalValue }));

    // Validate immediately if field was already touched
    if (touched[name]) {
      const error = validateField(name, finalValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error || "",
    }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
    });

    const validationErrors = validateWholeForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
      });

      navigate("/verify-email", {
        state: { email: form.email, purpose: OTP_PURPOSE.SIGNUP },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Left Section - Registration Form */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">
                Join EventHub and start your journey
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      name="name"
                      type="text"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg transition-all outline-none ${
                        touched.name && errors.name
                          ? "border-red-500 focus:ring-red-500/30"
                          : "border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      }`}
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.name && errors.name && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      name="email"
                      type="email"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg transition-all outline-none ${
                        touched.email && errors.email
                          ? "border-red-500 focus:ring-red-500/30"
                          : "border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      }`}
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone - Optional */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number{" "}
                    <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                      size={20}
                    />
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-500 pointer-events-none z-10">
                      <span className="text-sm font-medium">+91</span>
                      <div className="w-px h-4 bg-gray-300" />
                    </div>

                    <input
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      className={`w-full pl-28 pr-4 py-3 border rounded-lg transition-all outline-none ${
                        touched.phone && errors.phone
                          ? "border-red-500 focus:ring-red-500/30"
                          : "border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      }`}
                      placeholder="98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.phone}
                    </p>
                  )}
                  {!errors.phone && (
                    <p className="mt-1.5 text-xs text-gray-500">
                      10-digit mobile number (without +91 or 0)
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full pl-11 pr-12 py-3 border rounded-lg transition-all outline-none ${
                        touched.password && errors.password
                          ? "border-red-500 focus:ring-red-500/30"
                          : "border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      }`}
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full pl-11 pr-12 py-3 border rounded-lg transition-all outline-none ${
                        touched.confirmPassword && errors.confirmPassword
                          ? "border-red-500 focus:ring-red-500/30"
                          : "border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      }`}
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 px-4 rounded-lg font-medium hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-2">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>
            {/* Sign In Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                className="font-medium text-violet-600 hover:text-violet-500">
                Sign in
              </a>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-white/80">
            © 2026 EventHub. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Section - Features */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <span className="text-3xl font-bold">EventHub</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Start Your Event Journey Today
          </h1>

          <p className="text-xl text-white/90 mb-10">
            Create an account and unlock exclusive access to thousands of
            events, seamless booking, and powerful event management tools.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">
                  Find the Right Services
                </h3>
                <p className="text-white/80 text-lg">
                  Easily search and filter venues, caterers, photographers, DJs,
                  and more based on price, location, and availability.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Secure & Safe</h3>
                <p className="text-white/80 text-lg">
                  Your information and bookings are protected so you can plan
                  your events stress-free.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Instant Access</h3>
                <p className="text-white/80 text-lg">
                  Start booking events immediately after registration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
