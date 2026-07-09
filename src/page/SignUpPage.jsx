import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  findUserByEmail,
  findUserByUsername,
  isValidEmail,
  registerUser,
} from "@/lib/authStorage";

const initialForm = {
  name: "",
  username: "",
  email: "",
  password: "",
};

function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!form.username.trim()) {
      nextErrors.username = "Username is required";
    } else if (findUserByUsername(form.username.trim())) {
      nextErrors.username = "Username is already taken";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = "Email must be a valid email";
    } else if (findUserByEmail(form.email.trim())) {
      nextErrors.email = "Email is already taken";
    }

    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    registerUser({
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    setIsSuccess(true);
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-muted px-4 py-10">
        <div className="w-full max-w-[440px] rounded-2xl bg-background p-8 shadow-sm">
          {isSuccess ? (
            <div className="flex flex-col items-center gap-6 py-4 text-center">
              <CircleCheck className="size-16 text-green-500" />
              <h1 className="text-2xl font-bold">Registration success</h1>
              <Button
                type="button"
                className="h-12 w-full rounded-full"
                onClick={() => navigate("/")}
              >
                Continue
              </Button>
            </div>
          ) : (
            <>
              <h1 className="mb-8 text-center text-2xl font-bold">Sign up</h1>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={handleChange("name")}
                    className={`h-11 rounded-lg bg-background ${errors.name ? "border-destructive" : "border-border"}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <Input
                    id="username"
                    value={form.username}
                    onChange={handleChange("username")}
                    className={`h-11 rounded-lg bg-background ${errors.username ? "border-destructive" : "border-border"}`}
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className={`h-11 rounded-lg bg-background ${errors.email ? "border-destructive" : "border-border"}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
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
                    className={`h-11 rounded-lg bg-background ${errors.password ? "border-destructive" : "border-border"}`}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <Button type="submit" className="mt-2 h-12 w-full rounded-full">
                  Sign up
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
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
