"use client"

import { Menu, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useEffect, useState } from "react"
import { decodeJWT } from "@/lib/decode"


export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const authToken = localStorage.getItem('authToken');
    const [authUser, setAuthUser] = useState(false);

    useEffect(() => {
        if (authToken) {
            console.log(authToken);
            const decodedToken = decodeJWT(authToken);
            console.log(decodedToken);
            if (decodedToken.payload.userStatus === 'verified') {
                setAuthUser(true);
            } else {
                setAuthUser(false);
            }
        } else {
            setAuthUser(false);
        }
    }, [authToken]);

    const routes = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/services", label: "Services" },
        { href: "/pricing", label: "Pricing" },
        { href: "/contact", label: "Contact" },
    ]

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        router.push('/sign-in');
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-foreground backdrop-blur supports-[backdrop-filter]:bg-foreground">
            <div className="container flex h-16 items-center">
                <div className="mr-4 flex items-center space-x-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="size-8 rounded-full bg-primary/10">
                            <svg
                                className=" size-8 p-2 text-white"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </div>
                        <span className="hidden font-bold sm:inline-block">
                            Flowbite
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex md:flex-1 text-white">
                    <ul className="flex flex-1 items-center justify-center space-x-1">
                        {routes.map((route) => (
                            <li key={route.href}>
                                <Link
                                    href={route.href}
                                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${pathname === route.href
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                        }`}
                                >
                                    {route.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                {authUser ? (
                    <>
                        <div className="relative ml-auto flex-1 md:grow-0">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>K</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel className="bg-secondary">
                                        {/* {user.name} */} Auth User
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </>
                ) : (
                    <Button variant="ghost" size="icon" onClick={() => router.push('/sign-in')}>
                        <User className="h-5 w-5" />
                        <span className="sr-only">User account</span>
                    </Button>
                )}
                {/* User Avatar */}


                {/* Mobile Navigation */}
                <div className="ml-2 md:hidden bg-foreground">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                                <Menu className="size-4" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle className="text-white">Navigation</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col space-y-4 pt-4 bg-foreground">
                                {routes.map((route) => (
                                    <Link
                                        key={route.href}
                                        href={route.href}
                                        className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${pathname === route.href
                                            ? "text-primary"
                                            : "text-primary-foreground"
                                            }`}
                                    >
                                        {route.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}