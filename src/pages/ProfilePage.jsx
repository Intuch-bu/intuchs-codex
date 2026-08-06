import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRound } from "lucide-react";
import MemberPageLayout from "@/components/member/MemberPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/useAuth";
import { supabase } from "@/lib/supabaseClient";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function createProfileForm(user) {
  return {
    name: user?.name ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
    profileImage: user?.profileImage ?? user?.profile_pic ?? "",
  };
}

function ProfilePage() {
  const { user, isLoggedIn, updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(() => createProfileForm(user));
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size limit", {
        description: "Please select an image smaller than 5MB.",
      });
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id || "user"}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setIsUploadingImage(true);
    const toastId = toast.loading("Uploading image to Supabase Storage...");

    try {
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error("Could not get public URL from Supabase Storage");
      }

      setForm((current) => ({
        ...current,
        profileImage: publicUrl,
      }));

      toast.success("Profile picture uploaded!", { id: toastId });
    } catch (err) {
      console.error("Supabase Storage upload error:", err);
      toast.error("Upload failed", {
        id: toastId,
        description:
          err.message ||
          "Please ensure a public bucket named 'profiles' is created in Supabase Dashboard.",
      });
    } finally {
      setIsUploadingImage(false);
    }
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const result = await updateProfile({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        profileImage: form.profileImage,
      });

      if (!result.ok) {
        if (result.field) {
          setErrors((current) => ({ ...current, [result.field]: result.error }));
        } else {
          toast.error(result.error || "Failed to update profile");
        }
        return;
      }

      toast.success("Updated profile", {
        description: "Your profile has been successfully updated.",
      });
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MemberPageLayout title="Profile">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-4 border-b border-border pb-8 md:flex-row md:items-center">
          <div className="flex size-28 items-center justify-center overflow-hidden rounded-full bg-background md:size-28">
            {form.profileImage ? (
              <img
                src={form.profileImage}
                alt={form.name}
                className="size-full object-cover"
              />
            ) : (
              <UserRound className="size-12 text-muted-foreground" />
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
              disabled={isUploadingImage}
              className="h-12 rounded-full border-brown-600 bg-white px-6 text-base font-medium text-brown-600 hover:bg-background disabled:opacity-50"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploadingImage ? "Uploading..." : "Upload profile picture"}
            </Button>
          </div>
        </div>

        <div className="flex max-w-[440px] flex-col gap-6 self-stretch md:self-start">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-base font-medium text-brown-400">
              Name
            </label>
            <Input
              id="name"
              value={form.name}
              onChange={handleChange("name")}
              className={`h-12 rounded-lg border-border bg-white ${errors.name ? "border-destructive" : ""}`}
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
              value={form.username}
              onChange={handleChange("username")}
              className={`h-12 rounded-lg border-border bg-white ${errors.username ? "border-destructive" : ""}`}
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
              value={form.email}
              onChange={handleChange("email")}
              className={`h-12 rounded-lg border-border bg-white text-brown-400 md:block ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="h-12 w-fit rounded-full bg-brown-600 px-10 text-base font-medium text-white hover:bg-brown-600/90 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </MemberPageLayout>
  );
}

export default ProfilePage;
