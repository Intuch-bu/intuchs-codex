import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showError, setShowError] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setShowError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = loginUser(form.email.trim(), form.password);

    if (!user) {
      setShowError(true);
      return;
    }

    navigate("/");
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-muted px-4 py-10">
        <div className="w-full max-w-[440px] rounded-2xl bg-background p-8 shadow-sm">
          <h1 className="mb-8 text-center text-2xl font-bold">Log in</h1>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className={`h-11 rounded-lg border-border bg-background ${showError ? "border-destructive" : ""}`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                className={`h-11 rounded-lg border-border bg-background ${showError ? "border-destructive" : ""}`}
              />
            </div>

            <Button type="submit" className="mt-2 h-12 w-full rounded-full">
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have any account?{" "}
            <Link to="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      {showError && (
        <div className="fixed inset-x-0 bottom-0 bg-destructive px-4 py-4 text-center text-sm text-white">
          Your password is incorrect or this email doesn&apos;t exist. Please try
          another password or email.
        </div>
      )}
    </>
  );
}

export default LoginPage;
