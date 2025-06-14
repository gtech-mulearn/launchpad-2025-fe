"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function NavBar() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 ease-in-out",
        isScrolled ? "bg-secondary-900/95 backdrop-blur-md shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative overflow-hidden flex items-center space-x-3">
            <img src="/images/logo.webp" alt="Launchpad Kerala Logo" className="h-8 w-auto" />
                     </div>
        </Link>
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "px-4 py-2 text-white hover:text-primary-500 transition-all duration-300 text-sm uppercase tracking-widest font-medium",
                    )}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#about" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "px-4 py-2 text-white hover:text-primary-500 transition-all duration-300 text-sm uppercase tracking-widest font-medium",
                    )}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#recruiters" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "px-4 py-2 text-white hover:text-primary-500 transition-all duration-300 text-sm uppercase tracking-widest font-medium",
                    )}
                  >
                    Recruiters
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4 py-2 text-white hover:text-primary-500 transition-all duration-300 text-sm uppercase tracking-widest font-medium bg-transparent hover:bg-transparent">
                  More
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-secondary-900">
                    <ListItem href="#process" title="Process">
                      Learn about our recruitment process
                    </ListItem>
                    <ListItem href="#updates" title="Updates">
                      Stay updated with the latest news
                    </ListItem>
                    <ListItem href="#results" title="Results">
                      Check the latest results
                    </ListItem>
                    <ListItem href="/register" title="Registration">
                      Register as a recruiter
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="hidden md:block">
          <Button
            asChild
            className="bg-transparent hover:bg-transparent text-white border border-primary-500 hover:border-primary-400 px-6 py-2 text-sm uppercase tracking-widest font-medium transition-all duration-300"
          >
            <Link href="/register">Register Now</Link>
          </Button>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-primary-500 text-white hover:bg-transparent transition-all duration-300"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-secondary-900 border-l border-primary-500/20">
              <nav className="flex flex-col gap-6 mt-12">
                <Link
                  href="/"
                  className="text-sm uppercase tracking-widest font-medium text-white hover:text-primary-500 transition-colors duration-300"
                >
                  Home
                </Link>
                <Link
                  href="#about"
                  className="text-sm uppercase tracking-widest font-medium text-white hover:text-primary-500 transition-colors duration-300"
                >
                  About
                </Link>
                <Link
                  href="#recruiters"
                  className="text-sm uppercase tracking-widest font-medium text-white hover:text-primary-500 transition-colors duration-300"
                >
                  Recruiters
                </Link>
                <Link
                  href="#process"
                  className="text-sm uppercase tracking-widest font-medium text-white hover:text-primary-500 transition-colors duration-300"
                >
                  Process
                </Link>
                <Link
                  href="#updates"
                  className="text-sm uppercase tracking-widest font-medium text-white hover:text-primary-500 transition-colors duration-300"
                >
                  Updates
                </Link>
                <Link
                  href="#results"
                  className="text-sm uppercase tracking-widest font-medium text-white hover:text-primary-500 transition-colors duration-300"
                >
                  Results
                </Link>
                <Link
                  href="/register"
                  className="text-sm uppercase tracking-widest font-medium text-white hover:text-primary-500 transition-colors duration-300"
                >
                  Registration
                </Link>
                <Button
                  className="mt-4 bg-transparent hover:bg-transparent text-white border border-primary-500 hover:border-primary-400 px-6 py-2 text-sm uppercase tracking-widest font-medium transition-all duration-300"
                  asChild
                >
                  <Link href="/register">Register Now</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-primary-500/10 hover:text-primary-500 focus:bg-primary-500/10 focus:text-primary-500 text-white",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none uppercase tracking-widest">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-gray-400 mt-2">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
