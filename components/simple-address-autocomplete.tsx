"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SimpleAddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

// Fallback component without Google Places API
export function SimpleAddressAutocomplete({ value, onChange, placeholder, required }: SimpleAddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Common Ghana places, landmarks, and neighborhoods for fallback suggestions
  const ghanaLocations = [
    // Accra Places & Landmarks
    "Kotoka International Airport, Accra",
    "Accra Mall, Tetteh Quarshie",
    "West Hills Mall, Weija",
    "Marina Mall, Airport City",
    "Oxford Street, Osu",
    "Labadi Beach Hotel, La",
    "University of Ghana, Legon",
    "37 Military Hospital, Airport Residential Area",
    "Ridge Hospital, Ridge",
    "National Theatre, Accra",
    "Independence Square, Osu",
    "Makola Market, Central Accra",
    "Kaneshie Market, Kaneshie",
    "Circle, Accra",
    "Tema Station, Accra Central",
    "Achimota Mall, Achimota",
    "A&C Mall, East Legon",
    "Junction Mall, Nungua",

    // Neighborhoods & Areas
    "East Legon, Accra",
    "Airport Residential Area, Accra",
    "Cantonments, Accra",
    "Labone, Accra",
    "Osu, Accra",
    "Dzorwulu, Accra",
    "Roman Ridge, Accra",
    "North Kaneshie, Accra",
    "Dansoman, Accra",
    "Teshie, Accra",
    "Madina, Accra",
    "Adenta, Accra",
    "Spintex, Accra",
    "Tema Community 1",
    "Tema Community 25",
    "Ashaiman, Greater Accra",

    // Kumasi Places
    "Kumasi City Mall, Kumasi",
    "Kejetia Market, Kumasi",
    "KNUST, Kumasi",
    "Komfo Anokye Teaching Hospital, Kumasi",
    "Adum, Kumasi",
    "Bantama, Kumasi",

    // Other Major Cities & Places
    "Takoradi Market Circle, Takoradi",
    "University of Cape Coast, Cape Coast",
    "Cape Coast Castle, Cape Coast",
    "Tamale Teaching Hospital, Tamale",
    "Sunyani Central Market, Sunyani",
    "Ho Central Market, Ho",
    "Koforidua Central Market, Koforidua",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange(inputValue)

    if (inputValue.length > 2) {
      const filtered = ghanaLocations.filter((location) => location.toLowerCase().includes(inputValue.toLowerCase()))
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <Label htmlFor="address">Pickup Location *</Label>
      <Input
        ref={inputRef}
        id="address"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder || "Search for a place, landmark, or area..."}
        required={required}
        className="w-full"
        onFocus={() => value.length > 2 && setShowSuggestions(true)}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-1">Search for places, landmarks, malls, hospitals, schools, etc.</p>
    </div>
  )
}
