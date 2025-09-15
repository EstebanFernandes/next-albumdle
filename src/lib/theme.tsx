"use client"

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useId, useState } from "react";
import { Switch } from "../components/ui/switch";
/*
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
*/
export function ThemeToggle () {

  const {theme,setTheme} = useTheme();
  const [checked, setChecked] = useState(theme === "dark");
  const toggleSwitch = (isTrue: boolean|null) => {
    if(isTrue===null)
    setChecked(!checked);
    else
        setChecked(isTrue);

    setTheme(!checked ? "dark" : "light");
  }
  const id = useId()

  return (
    <div className='group inline-flex items-center gap-2' data-state={theme === "dark" ? 'checked' : 'unchecked'}>
      <span
        id={`${id}-light`}
        className='group-data-[state=checked]:text-muted-foreground/70 cursor-pointer text-left text-sm font-medium'
        aria-controls={id}
        onClick={() => setChecked(true)}
      >
        <SunIcon className='size-4' aria-hidden='true' />
      </span>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={toggleSwitch}
        aria-labelledby={`${id}-dark ${id}-light`}
        aria-label='Toggle between dark and light mode'
      />
      <span
        id={`${id}-dark`}
        className='group-data-[state=unchecked]:text-muted-foreground/70 cursor-pointer text-right text-sm font-medium'
        aria-controls={id}
        onClick={() => setChecked(true)}
      >
        <MoonIcon className='size-4' aria-hidden='true' />
      </span>
    </div>
  )
}