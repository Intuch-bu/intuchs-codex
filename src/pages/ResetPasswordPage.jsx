import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import MemberPageLayout from "@/components/member/MemberPageLayout";
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
import { useAuth } from "@/context/useAuth";

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
      <MemberPageLayout title="Reset password">
        <form className="flex max-w-[440px] flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="currentPassword" className="text-base font-medium text-brown-400">
              Current password
            </label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Current password"
              value={form.currentPassword}
              onChange={handleChange("currentPassword")}
              className={`h-12 rounded-lg border-border bg-white placeholder:text-brown-400 ${errors.currentPassword ? "border-destructive" : ""}`}
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword" className="text-base font-medium text-brown-400">
              New password
            </label>
            <Input
              id="newPassword"
              type="password"
              placeholder="New password"
              value={form.newPassword}
              onChange={handleChange("newPassword")}
              className={`h-12 rounded-lg border-border bg-white placeholder:text-brown-400 ${errors.newPassword ? "border-destructive" : ""}`}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-base font-medium text-brown-400">
              Confirm new password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              className={`h-12 rounded-lg border-border bg-white placeholder:text-brown-400 ${errors.confirmPassword ? "border-destructive" : ""}`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="h-12 w-fit rounded-full bg-brown-600 px-10 text-base font-medium text-white hover:bg-brown-600/90"
          >
            Reset password
          </Button>
        </form>
      </MemberPageLayout>

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
