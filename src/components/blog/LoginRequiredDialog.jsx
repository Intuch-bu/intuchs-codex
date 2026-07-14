import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function LoginRequiredDialog({ isOpen, onOpenChange }) {
  const navigate = useNavigate();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md gap-6 rounded-2xl p-8 text-center">
        <AlertDialogCancel
          aria-label="Close"
          className="absolute top-4 right-4 size-8 rounded-full border-0 bg-transparent p-0 shadow-none hover:bg-muted"
        >
          <X className="size-4" />
        </AlertDialogCancel>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-semibold text-brown-600">
            Create an account to continue
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-4 sm:flex-col">
          <Button
            type="button"
            className="h-12 w-full rounded-full bg-brown-600 text-base font-medium text-white hover:bg-brown-600/90"
            onClick={() => {
              onOpenChange(false);
              navigate("/signup");
            }}
          >
            Create account
          </Button>
          <p className="text-center text-base font-medium text-brown-500">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-brown-600 underline underline-offset-4"
              onClick={() => {
                onOpenChange(false);
                navigate("/login");
              }}
            >
              Log in
            </button>
          </p>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LoginRequiredDialog;
