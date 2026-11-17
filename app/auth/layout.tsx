import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Push — Create account",
  description: "Create an account to track your gym routines.",
};

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return children;
}
