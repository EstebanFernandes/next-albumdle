"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export default function AutoComplete({
  fullList,
  onEnter,
}: {
  fullList: { value: string; labelImportant: string; labelSecondary: string }[]
  onEnter: (value: string) => void
}) {
  const [filteredList, setFilteredList] = useState<{ value: string; labelImportant: string; labelSecondary: string }[]>([])
  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  function handleChanges(value: string) {
    setInputValue(value)
    setActiveIndex(-1)

    if (value.trim().length > 0) {
      const newList = fullList
        .filter((item) => String(item.labelImportant+" "+item.labelSecondary).toLowerCase().includes(value.toLowerCase()))
        .slice(0, 7)  
      setFilteredList(newList)
      setOpen(newList.length > 0)
    } else {
      setFilteredList([])
      setOpen(false)
    }
  }


  function enterPressed() {
    if (activeIndex >= 0) {
      selectItem(filteredList[activeIndex])
    } else if (inputValue.trim().length > 0) {
      onEnter(inputValue)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % filteredList.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex >= 0) {
        selectItem(filteredList[activeIndex])
      } else {
        onEnter(filteredList[activeIndex].value) // <-- Call parent callback with current input
        setOpen(false)
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
    }
  }

  function selectItem(item: { value: string; labelImportant: string; labelSecondary: string }) {
    setInputValue(item.labelImportant+" - "+item.labelSecondary)
    setOpen(false)
    setActiveIndex(-1)
    onEnter(item.value) // <-- also notify parent when selecting an item
    setInputValue("")
  }

  return (
    <div className="relative w-[500px]">
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <Input
        ref={inputRef}
        placeholder="Search an album..."
        value={inputValue}
        onChange={(e) => handleChanges(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button onClick={enterPressed}>Guess</Button></div>
      {open && (
        <Card className="absolute top-full mt-2 w-full  rounded-lg border shadow-md z-50">
          <ul className="max-h-60 overflow-auto p-2">
            {filteredList.map((item, index) => (
              <li
                key={item.value}
                className={`cursor-pointer p-1 rounded-md ${
                  index === activeIndex ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
                onMouseDown={() => selectItem(item)}
              >
                <b>{item.labelImportant}</b> - <span className="text-gray-500">{item.labelSecondary}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
