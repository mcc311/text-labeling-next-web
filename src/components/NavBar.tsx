'use client'

import { Avatar, Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import React from "react";
import Logo from "./Logo";

export default function NavBar() {
  const pathname = usePathname();

  const { data: session } = useSession()

  interface LinkItem {
    name: string;
    href: string;
  };

  const links: LinkItem[] = [
    { name: "首頁", href: "/" },
    { name: "任務", href: "/task" },
    { name: "使用者管理", href: "/user" },
  ];
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar isBordered className="mb-8" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent justify="start" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="pr-3" justify="center">
        <NavbarBrand>
          <Logo />
          <p className="font-bold text-inherit">TAIDE Label System</p>
        </NavbarBrand>
      </NavbarContent>


      {session && session.user ? (
        <NavbarContent justify="end">
          <NavbarItem>
            <Button onClick={() => signOut()}>登出</Button>
          </NavbarItem>
          <NavbarItem>
            <Avatar name={session.user.name as string} />
          </NavbarItem>

        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem className="lg:flex">
            <Button onClick={() => signIn()} color='primary'>登入</Button>
          </NavbarItem>
          <NavbarItem className="lg:flex">
            <Link href="/signUp">註冊</Link>
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
        {session && session.user ? (
          <NavbarMenuItem>
            <Link href="/api/auth/signout">登出</Link>
          </NavbarMenuItem>
        ) : (
          <>
            <NavbarMenuItem>
              <Link href="/api/auth/signin">登入</Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link href="/signUp">註冊</Link>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
