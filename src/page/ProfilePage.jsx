import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRound } from "lucide-react";
import Navbar from "@/components/navbar";
import MemberSidebar from "@/components/memberSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { isValidEmail } from "@/lib/authStorage";

function ProfilePage() {
  const { user, isLoggedIn, updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    profileImage: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
        profileImage: user.profileImage ?? "",
      });
    }
  }, [user]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        profileImage: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const result = updateProfile({
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      profileImage: form.profileImage,
    });

    if (!result.ok) {
      if (result.field) {
        setErrors((current) => ({ ...current, [result.field]: result.error }));
      }
      return;
    }

    toast.success("Updated profile", {
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-73px)] bg-muted px-4 py-10">
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 rounded-2xl bg-background p-6 shadow-sm md:flex-row md:p-10">
          <MemberSidebar />

          <section className="flex-1">
            <h1 className="mb-8 text-2xl font-bold">Profile</h1>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex items-center gap-4">
                <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-muted">
                  {form.profileImage ? (
                    <img
                      src={form.profileImage}
                      alt={form.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound className="size-10 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload profile picture
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className={`h-11 rounded-lg bg-muted/50 ${errors.name ? "border-destructive" : "border-border"}`}
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
                  className={`h-11 rounded-lg bg-muted/50 ${errors.username ? "border-destructive" : "border-border"}`}
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
                  className={`h-11 rounded-lg bg-muted/50 ${errors.email ? "border-destructive" : "border-border"}`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <Button type="submit" className="h-11 w-fit rounded-full px-8">
                Save
              </Button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

export default ProfilePage;
