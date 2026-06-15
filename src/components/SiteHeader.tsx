import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { href: "/#hero", label: "Home" },
  { href: "/cars", label: "Browse" },
  { href: "/made-to-order", label: "Made to Order" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center">
            <img src="eric-car-trading-logo.png" alt="Eric Car Trading" className="h-10 w-10 object-contain" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-xl tracking-wide">ERIC CAR TRADING</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Drive your dream</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="px-3 py-2 text-foreground/80 hover:text-primary">
              {l.label}
            </a>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/80 hover:text-primary hover:bg-accent/10"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="mt-8 flex flex-col gap-1 text-base">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-md text-foreground/80 hover:text-primary hover:bg-accent/10"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
