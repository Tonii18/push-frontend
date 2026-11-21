import type { Metadata } from "next";
import { Poppins} from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pushtracker.vercel.app"),
  title: {
    default: "Push — Track your gym routines",
    template: "%s | Push",
  },
  description: "Plan your workouts, log your sets and track your progress.",
  applicationName: "Push",
  openGraph: {
    title: "Push — Track your gym routines",
    description: "Plan your workouts, log your sets and track your progress.",
    url: "https://pushtracker.vercel.app",
    siteName: "Push",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/push-image.png",
        width: 1200,
        height: 743,
        alt: "Push | Track your gym routines",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Push — Track your gym routines",
    description: "Plan your workouts, log your sets and track your progress.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
