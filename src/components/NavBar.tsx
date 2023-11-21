'use client'
 
import { usePathname } from 'next/navigation'
import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem} from "@nextui-org/react";
import Logo from "./Logo";

export default function NavBar() {
  const pathname = usePathname();
  const menuItems = [
    "首頁",
    "任務",
  ];

  interface LinkItem {
    name: string;
    href: string;
  };

  const links: LinkItem[] = [
    { name: "首頁", href: "/" },
    { name: "任務", href: "/task" },
  ];
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar isBordered className="mb-8" onMenuOpenChange={setIsMenuOpen}> 
      <NavbarContent className="lg:hidden" justify="start" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="lg:hidden pr-3" justify="center">
        <NavbarBrand>
          <Logo />
          <p className="font-bold text-inherit">TAIDE Label System</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex gap-4" justify="center">
        <NavbarBrand>
          <Logo />
          <p className="font-bold text-inherit">TAIDE Label System</p>
        </NavbarBrand>
        {links.map((link) => (
          <NavbarItem key={link.name}>
            <Link
              color={pathname === link.href ? "warning" : "foreground"}
              href={link.href}
            >
              {link.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="warning" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {links.map((link) => (
          <NavbarMenuItem key={link.name}>
            <Link
              color={pathname === link.href ? "warning" : "foreground"}
              href={link.href}
            >
              {link.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
