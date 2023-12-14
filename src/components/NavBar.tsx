'use client'
 
import { Avatar, Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import React from "react";
import Logo from "./Logo";

export default function NavBar() {
  const pathname = usePathname();
  const menuItems = [
    "首頁",
    "任務",
  ];

  const { data: session } = useSession()

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
              color={pathname === link.href ? "primary" : "foreground"}
              href={link.href}
            >
              {link.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* <NavbarContent justify="end">

        <NavbarItem className="hidden lg:flex">
           <LoginButton />
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent> */}
      {session && session.user ? (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Button onClick={() => signOut()}>Sign out</Button>
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <Avatar name={session.user.name as string} />
          </NavbarItem>
          
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem className="lg:flex">
            <Button onClick={() => signIn()} color='primary'>登入</Button>
          </NavbarItem>
        </NavbarContent>
      )}


      <NavbarMenu>
        {links.map((link) => (
          <NavbarMenuItem key={link.name}>
            <Link
              color={pathname === link.href ? "primary" : "foreground"}
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
