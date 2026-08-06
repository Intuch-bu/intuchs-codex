import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setShowError(false);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setShowError(false);
    setErrorMessage("");

    try {
      await loginUser(form.email.trim(), form.password);
      navigate("/");
    } catch (err) {
      setShowError(true);
      setErrorMessage(err.message || "Your password is incorrect or this email doesn't exist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-78px)] items-center justify-center bg-background px-4 py-8 sm:py-10">
        <div className="w-full max-w-[343px] rounded-[16px] bg-muted px-4 py-8 sm:max-w-[440px] sm:px-10 sm:py-10">
          <h1 className="mb-8 text-center text-[40px] font-semibold leading-[48px] text-brown-600">
            Log in
          </h1>

          <form className="mx-auto flex w-full max-w-[320px] flex-col gap-6" onSubmit={handleSubmit}>
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
                className={`h-12 rounded-lg border-border bg-white placeholder:text-brown-400 ${showError ? "border-destructive" : ""}`}
              />
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
                className={`h-12 rounded-lg border-border bg-white placeholder:text-brown-400 ${showError ? "border-destructive" : ""}`}
              />
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-full bg-brown-600 px-10 text-base font-medium text-white hover:bg-brown-600/90 disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-base font-medium text-brown-500">
            Don&apos;t have any account?{" "}
            <Link to="/signup" className="font-medium text-brown-600 underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      {showError && (
        <div className="fixed inset-x-0 bottom-0 bg-destructive px-4 py-4 text-center text-sm text-white">
          {errorMessage || "Your password is incorrect or this email doesn't exist. Please try another password or email."}
        </div>
      )}
    </>
  );
}

export default LoginPage;
