"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

declare global {
  interface Window {
    google: any
    googleMapsLoaded: boolean
  }
}

export function AddressAutocomplete({ value, onChange, placeholder, required }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!inputRef.current) return

      try {
        // Clear any existing autocomplete
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        }

        // Create new autocomplete instance
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["establishment", "geocode"], // Changed from ["address"] to show places and locations
          componentRestrictions: { country: "gh" }, // Restrict to Ghana
          fields: ["formatted_address", "geometry", "name", "address_components", "place_id", "types"],
        })

        // Add listener for place selection
        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace()
          if (place.name && place.formatted_address) {
            // Use place name with formatted address for better context
            onChange(`${place.name}, ${place.formatted_address}`)
          } else if (place.name) {
            onChange(place.name)
          } else if (place.formatted_address) {
            onChange(place.formatted_address)
          }
        })

        setIsLoaded(true)
        setError("")
        console.log("Google Places Autocomplete initialized successfully")
      } catch (err) {
        console.error("Error initializing autocomplete:", err)
        setError("Failed to initialize address suggestions")
      }
    }

    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete()
      } else if (window.googleMapsLoaded) {
        // Google Maps is loaded but places might not be ready yet
        setTimeout(checkGoogleMaps, 100)
      } else {
        // Wait for Google Maps to load
        const handleGoogleMapsLoad = () => {
          setTimeout(checkGoogleMaps, 100)
        }
        window.addEventListener("google-maps-loaded", handleGoogleMapsLoad)
        return () => window.removeEventListener("google-maps-loaded", handleGoogleMapsLoad)
      }
    }

    // Check if API key is present
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setError("Google Maps API key not configured")
      console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set")
      return
    }

    checkGoogleMaps()

    // Cleanup
    return () => {
      if (autocompleteRef.current && window.google) {
        try {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
        } catch (err) {
          console.error("Error cleaning up autocomplete:", err)
        }
      }
    }
  }, [onChange])

  return (
    <div>
      <Label htmlFor="address">Pickup Location *</Label>
      <Input
        ref={inputRef}
        id="address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search for a place, landmark, or area..."}
        required={required}
        className="w-full"
      />
      {error ? (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      ) : (
        <p className="text-xs text-slate-500 mt-1">
          {isLoaded ? "Search for places, landmarks, malls, hospitals, schools, etc." : "Loading place suggestions..."}
        </p>
      )}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-400 mt-1">
          API Key: {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "Set" : "Not Set"} | Google Maps:{" "}
          {typeof window !== "undefined" && window.google ? "Loaded" : "Not Loaded"} | Places:{" "}
          {typeof window !== "undefined" && window.google?.maps?.places ? "Available" : "Not Available"}
        </div>
      )}
    </div>
  )
}
