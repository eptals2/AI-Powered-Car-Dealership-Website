import { Link } from "@tanstack/react-router";
import { Home, Car, Phone, GalleryVerticalIcon } from "lucide-react";

const links = [
  { href: "/#home", label: "Home", icon: Home },
  { href: "/cars", label: "Cars", icon: Car },
  { href: "/#contact", label: "Contact", icon: Phone },
  { href: "/made-to-order", label: "Gallery", icon: GalleryVerticalIcon },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center">
            <img src="eric-car-trading-logo.png" alt="Eric Car Trading" className="h-10 w-10 object-contain" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-md ">ERIC CAR TRADING</div>
            <div className="text-[5px] uppercase tracking-[0.2em] text-muted-foreground">Drive your dream</div>
          </div>
        </Link>

        {/* Desktop nav — text links */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="px-3 py-2 text-foreground/80 hover:text-primary">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile nav — individual icon buttons */}
        <nav className="flex md:hidden items-center gap-1">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-label={l.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/80 hover:text-primary hover:bg-accent/10"
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}