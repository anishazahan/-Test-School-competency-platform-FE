"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  User2,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/slices/auth-slices";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import logo from "../assets/Screenshot_2025-08-09_102528-removebg-preview.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();
  const pathname = usePathname();

  const initials =
    user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  const goDashboard = () => {
    if (!user) return;
    if (user.role === "admin") router.push("/admin/dashboard");
    else if (user.role === "supervisor") router.push("/supervisor/dashboard");
    else router.push("/exam");
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {}
    dispatch(signOut());
    router.push("/");
  };

  return (
    <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[80px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Test School Logo"
              width={120}
              height={40}
              className="mt-3"
            />
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-6 md:flex">
            {!user ? (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost">
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.name || user.email}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Signed in as
                    <div className="font-medium text-foreground">
                      {user.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {![
                    "/admin/dashboard",
                    "/supervisor/dashboard",
                    "/exam",
                  ].includes(pathname) && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={goDashboard}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  )}

                  {pathname !== "/profile/certificates" &&
                    user.role !== "admin" && (
                      <>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => router.push("/profile/certificates")}
                        >
                          <User2 className="mr-2 h-4 w-4" />
                          <span>My Certificates</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                  <DropdownMenuItem
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{loggingOut ? "Logging out..." : "Logout"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {/* Mobile toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-3 border-t px-4 py-4">
          {!user ? (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                className="w-full"
                onClick={() => setMenuOpen(false)}
              >
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button
                asChild
                className="w-full"
                onClick={() => setMenuOpen(false)}
              >
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{user.name || user.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.role}
                  </div>
                </div>
              </div>
              <Button
                className="cursor-pointer"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
