"use client";
import { LogOut } from "lucide-react";
import { signOut } from "@/server/actions/auth";
export function LogoutButton() { return <form action={signOut}><button className="admin-logout" type="submit"><LogOut size={16} /> Log out</button></form>; }
