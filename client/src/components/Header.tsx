import { Link, useLocation } from "wouter";
import { siteConfig } from "@/lib/siteConfig";
import { Menu, X, Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Domov" },
    { href: "/stahovanie", label: "Sťahovanie" },
    { href: "/cennik", label: "Cenník" },
    { href: "/blog", label: "Blog" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate rounded-md px-2 py-1 -ml-2 cursor-pointer">
              <Truck className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold tracking-tight">
                {siteConfig.name}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className={`px-4 py-2 text-sm font-medium transition-colors hover-elevate rounded-md cursor-pointer ${
                    location === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                  data-testid={`link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </div>
              </Link>
            ))}
            <Link href="/kontakt">
              <div className="ml-2">
                <Button 
                  size="sm"
                  data-testid="button-quote-header"
                >
                  Nezáväzná ponuka
                </Button>
              </div>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="flex flex-col gap-2 pb-4 md:hidden border-t border-border/40 mt-2 pt-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className={`block px-4 py-2 text-sm font-medium rounded-md hover-elevate cursor-pointer ${
                    location === link.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </div>
              </Link>
            ))}
            <Link href="/kontakt">
              <div onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  data-testid="button-quote-mobile"
                >
                  Nezáväzná ponuka
                </Button>
              </div>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
