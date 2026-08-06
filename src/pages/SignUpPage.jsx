import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/useAuth";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const initialForm = {
  name: "",
  username: "",
  email: "",
  password: "",
};

function SignUpPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "", form: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!form.username.trim()) {
      nextErrors.username = "Username is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = "Email must be a valid email";
    }

    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setIsSuccess(true);
    } catch (err) {
      setErrors((current) => ({
        ...current,
        form: err.message || "Registration failed. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-78px)] items-center justify-center bg-background px-4 py-8 sm:py-10">
        <div className="w-full max-w-[343px] rounded-[16px] bg-muted px-4 py-8 sm:max-w-[440px] sm:px-10 sm:py-10">
          {isSuccess ? (
            <div className="flex flex-col items-center gap-6 py-4 text-center">
              <CircleCheck className="size-16 text-brand" />
              <h1 className="text-[32px] font-semibold text-brown-600">
                Registration success
              </h1>
              <Button
                type="button"
                className="h-12 rounded-full bg-brown-600 px-10 text-base font-medium text-white hover:bg-brown-600/90"
                onClick={() => navigate("/")}
              >
                Continue
              </Button>
            </div>
          ) : (
            <>
              <h1 className="mb-8 text-center text-[40px] font-semibold leading-[48px] text-brown-600">
                Sign up
              </h1>

              <form
                className="mx-auto flex w-full max-w-[320px] flex-col gap-5"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="text-base font-medium text-brown-400">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={form.name}
                    onChange={handleChange("name")}
                    className={`h-12 rounded-lg bg-white placeholder:text-brown-400 ${errors.name ? "border-destructive" : "border-border"}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="username" className="text-base font-medium text-brown-400">
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange("username")}
                    className={`h-12 rounded-lg bg-white placeholder:text-brown-400 ${errors.username ? "border-destructive" : "border-border"}`}
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-base font-medium text-brown-400">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className={`h-12 rounded-lg bg-white placeholder:text-brown-400 ${errors.email ? "border-destructive" : "border-border"}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="text-base font-medium text-brown-400">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange("password")}
                    className={`h-12 rounded-lg bg-white placeholder:text-brown-400 ${errors.password ? "border-destructive" : "border-border"}`}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {errors.form && (
                  <p className="text-center text-sm font-medium text-destructive">{errors.form}</p>
                )}

                <div className="flex justify-center pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 rounded-full bg-brown-600 px-10 text-base font-medium text-white hover:bg-brown-600/90 disabled:opacity-50"
                  >
                    {isSubmitting ? "Signing up..." : "Sign up"}
                  </Button>
                </div>
              </form>

              <p className="mt-6 text-center text-base font-medium text-brown-500">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-brown-600 underline underline-offset-4">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default SignUpPage;
