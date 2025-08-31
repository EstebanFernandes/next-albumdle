"use client"

import { useTheme } from "next-themes";
import { Button } from "../components/ui/button"

export function ThemeToggle()
{
    const {theme,setTheme} = useTheme();
    return (
        <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        variant={"outline"}
        >
            Change to {theme === "dark" ? "light" : "dark"} mode
        </Button>
    )
}