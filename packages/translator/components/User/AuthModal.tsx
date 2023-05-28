import { FC, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  show?: boolean,
  onClose?: () => void
}
export const AuthModal: FC<Props> = ({ show = false, onClose = () => null }) => {
  const { data: session } = useSession();

  const signInWithGoogle = ():void => {
    // toast.loading('Redirecting...');
    // setDisabled(true);
    // Perform sign in
    signIn("google", {
      callbackUrl: window.location.href,
    });
  };

  const signInWithGithub = ():void => {
    // toast.loading('Redirecting...');
    // setDisabled(true);
    // Perform sign in
    signIn("github", {
      callbackUrl: window.location.href,
    });
  };
  const closeModal = ():void => {
    if (typeof onClose === "function") {
      onClose();
    }
  };
  useEffect(() => {
    if (session) {
      // setShowModal(false);
    }
  }, [session]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Log in</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
          <DialogDescription>
          Choose a provider to login with
          </DialogDescription>
        </DialogHeader>
        <div>

          <button
            onClick={() => signInWithGithub()}
            className="mt-4 h-[46px] w-full mx-auto border rounded-md p-2 flex justify-center items-center space-x-2 text-gray-500 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
          >
            <Image
              src="/github.svg"
              alt="Google"
              width={32}
              height={32}
            />
            <span>Sign in with Github</span>
          </button>

          <button
            onClick={() => signInWithGoogle()}
            className="mt-4 h-[46px] w-full mx-auto border rounded-md p-2 flex justify-center items-center space-x-2 text-gray-500 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={32}
              height={32}
            />
            <span>Sign in with Google</span>
          </button>

        </div>
        <DialogFooter>
          {/* <Button type="submit">Login</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};