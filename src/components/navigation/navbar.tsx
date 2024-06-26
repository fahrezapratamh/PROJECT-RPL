"use client";
import { DropdownAvatar } from "../dropdown/dropDownAvatar";
import { AlignRight } from "lucide-react";
import { DropDownAddNavbar } from "../dropdown/dropDownAddNavbar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { CalendarFold, Home, MessageSquareMore } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../dark-mode-toggle";
import PopoverNotification from "../dropdown/dropDownNotification";

export default function Navbar({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <>
      <div
        className={`${className} sticky top-0 flex left-0 z-10 max-w-full w-full items-center justify-between  lg:flex lg:px-7 px-3 py-3 border-b backdrop-blur-lg`}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="lg:hidden">
              <AlignRight className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <h1 className="text-2xl font-semibold">Task</h1>
            <nav className="grid gap-6 text-lg font-medium">
              <div className="leading-6 space-y-3 py-10">
                <Link
                  href="/dashboard"
                  className={`${
                    pathname === "/dashboard" ? "bg-secondary" : ""
                  } flex items-center px-4 py-3 gap-5 hover:bg-secondary rounded-md font-semibold cursor-pointer`}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-sm">Dashboard</span>
                </Link>
                <Link
                  href="/chats"
                  className={`${
                    pathname.startsWith("/chats") ? "bg-secondary" : ""
                  } flex items-center px-4 py-3 gap-5 hover:bg-secondary rounded-md font-semibold cursor-pointer`}
                >
                  <MessageSquareMore className="h-5 w-5" />
                  <span className="text-sm">Chats</span>
                </Link>
                <Link
                  href="/calendar"
                  className={`${
                    pathname === "/timeline" ? "bg-secondary" : ""
                  } flex items-center px-4 py-3 gap-5 hover:bg-secondary rounded-md font-semibold cursor-pointer`}
                >
                  <CalendarFold className="h-5 w-5" />
                  <span className="text-sm">Calendar</span>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center lg:justify-end justify-between w-full">
          <div className="flex items-center w-max lg:hidden">
            <h1 className="text-2xl font-semibold">Task</h1>
          </div>
          <div className="flex items-center w-max">
            <div className="flex items-center gap-5">
              <DropDownAddNavbar />
              <PopoverNotification />
              <ModeToggle />
              <DropdownAvatar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
