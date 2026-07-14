import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/navbar";
import MemberSidebar from "@/components/memberSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function ResetPasswordPage() {
  const { isLoggedIn, resetPassword } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.currentPassword) {
      nextErrors.currentPassword = "Current password is required";
    }

    if (!form.newPassword) {
      nextErrors.newPassword = "New password is required";
    } else if (form.newPassword.length < 8) {
      nextErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password";
    } else if (form.newPassword !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setShowConfirm(true);
  };

  const handleConfirmReset = () => {
    const result = resetPassword(form.currentPassword, form.newPassword);

    if (!result.ok) {
      if (result.field) {
        setErrors((current) => ({ ...current, [result.field]: result.error }));
      }
      setShowConfirm(false);
      return;
    }

    setShowConfirm(false);
    setForm(initialForm);
    toast.success("Password updated", {
      description: "Your password has been successfully reset.",
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-73px)] bg-muted px-4 py-10">
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 rounded-2xl bg-background p-6 shadow-sm md:flex-row md:p-10">
          <MemberSidebar />

          <section className="flex-1">
            <h1 className="mb-8 text-2xl font-bold">Reset password</h1>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="currentPassword" className="text-sm font-medium">
                  Current password
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={form.currentPassword}
                  onChange={handleChange("currentPassword")}
                  className={`h-11 rounded-lg bg-muted/50 ${errors.currentPassword ? "border-destructive" : "border-border"}`}
                />
                {errors.currentPassword && (
                  <p className="text-sm text-destructive">{errors.currentPassword}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange("newPassword")}
                  className={`h-11 rounded-lg bg-muted/50 ${errors.newPassword ? "border-destructive" : "border-border"}`}
                />
                {errors.newPassword && (
                  <p className="text-sm text-destructive">{errors.newPassword}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm new password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  className={`h-11 rounded-lg bg-muted/50 ${errors.confirmPassword ? "border-destructive" : "border-border"}`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" className="h-11 w-fit rounded-full px-8">
                Reset password
              </Button>
            </form>
          </section>
        </div>
      </main>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-sm text-center">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset password</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to reset your password?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 flex-row gap-3 sm:justify-center">
            <AlertDialogCancel className="static flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted">
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              className="h-auto flex-1 rounded-full px-4 py-2.5"
              onClick={handleConfirmReset}
            >
              Reset
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ResetPasswordPage;
