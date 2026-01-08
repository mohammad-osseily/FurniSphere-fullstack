// app/layout.tsx
import { ReactNode } from "react";
import "../public/static/css/global.css";
import { Roboto } from "next/font/google";
import NavbarWrapper from "./components/NavbarWrapper"; // Use the new wrapper
import { Provider } from "react-redux"; // Import Provider

export const metadata = {
  title: "FurniSphere",
};

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode[] }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} mx-auto flex w-full flex-col scrollbar scrollbar-track-primary  scrollbar `}
      >
        {" "}
        {/* Wrap everything in the Provider */}
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}
