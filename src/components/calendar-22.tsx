"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { Label } from "@/src/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover"
import { useTranslations } from "next-intl"

type Calendar22Props = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  label?: string
}

export default function Calendar22({ value, onChange, label = "Date of birth" }: Calendar22Props) {
  const [open, setOpen] = React.useState(false)
  const t = useTranslations("tools.calendar")
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {value ? value.toLocaleDateString() : t("title")}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange?.(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
