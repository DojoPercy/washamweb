"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, CheckCircle } from "lucide-react"

interface FriendlyDatePickerProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
}

interface DateOption {
  value: string
  label: string
  sublabel: string
  isToday?: boolean
  isTomorrow?: boolean
  isWeekend?: boolean
  isPastCutoff?: boolean
}

export function FriendlyDatePicker({ value, onChange, required }: FriendlyDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(value)

  const generateDateOptions = (): DateOption[] => {
    const options: DateOption[] = []
    const now = new Date()
    const currentHour = now.getHours()

    // If it's past 8 PM, start from tomorrow
    const startDate = currentHour >= 20 ? new Date(now.getTime() + 24 * 60 * 60 * 1000) : new Date()

    // Generate options for the next 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const dateString = date.toISOString().split("T")[0]

      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      const dayName = dayNames[date.getDay()]
      const monthName = monthNames[date.getMonth()]
      const dayNumber = date.getDate()

      let label = dayName
      let sublabel = `${monthName} ${dayNumber}`
      let isToday = false
      let isTomorrow = false

      // Special labels for today and tomorrow
      if (i === 0 && currentHour < 20) {
        label = "Today"
        sublabel = `${dayName}, ${monthName} ${dayNumber}`
        isToday = true
      } else if ((i === 0 && currentHour >= 20) || (i === 1 && currentHour < 20)) {
        label = "Tomorrow"
        sublabel = `${dayName}, ${monthName} ${dayNumber}`
        isTomorrow = true
      }

      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const isPastCutoff = currentHour >= 20 && i === 0

      options.push({
        value: dateString,
        label,
        sublabel,
        isToday,
        isTomorrow,
        isWeekend,
        isPastCutoff,
      })
    }

    return options
  }

  const dateOptions = generateDateOptions()

  const handleDateSelect = (dateValue: string) => {
    setSelectedDate(dateValue)
    onChange(dateValue)
  }

  const getOptionStyle = (option: DateOption) => {
    const isSelected = selectedDate === option.value

    if (isSelected) {
      return "border-2 border-blue-500 bg-blue-50 text-blue-800"
    }

    if (option.isToday) {
      return "border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:border-emerald-400"
    }

    if (option.isTomorrow) {
      return "border-2 border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-800 hover:border-orange-400"
    }

    if (option.isWeekend) {
      return "border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 hover:border-purple-300"
    }

    return "border-2 border-slate-200 bg-white hover:bg-blue-50 text-slate-700 hover:border-blue-300"
  }

  const getOptionIcon = (option: DateOption) => {
    if (selectedDate === option.value) {
      return <CheckCircle className="w-5 h-5 text-blue-600" />
    }

    if (option.isToday) {
      return <Clock className="w-5 h-5 text-emerald-600" />
    }

    if (option.isTomorrow) {
      return <Calendar className="w-5 h-5 text-orange-600" />
    }

    return <Calendar className="w-5 h-5 text-slate-400" />
  }

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-slate-800 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
        Pickup Date {required && "*"}
      </Label>

      {/* Current time notice */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center space-x-2 text-sm text-blue-700">
          <Clock className="w-4 h-4" />
          <span>
            {new Date().getHours() >= 20
              ? "It's past 8 PM - earliest pickup is tomorrow"
              : "Pickup available today until 8 PM"}
          </span>
        </div>
      </div>

      {/* Date Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {dateOptions.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            onClick={() => handleDateSelect(option.value)}
            className={`h-auto p-4 justify-start transition-all duration-200 ${getOptionStyle(option)}`}
          >
            <div className="flex items-center space-x-3 w-full">
              {getOptionIcon(option)}
              <div className="text-left flex-1">
                <div className="font-semibold text-base">{option.label}</div>
                <div className="text-sm opacity-75">{option.sublabel}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Selected date confirmation */}
      {selectedDate && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">
                  Pickup scheduled for: {dateOptions.find((opt) => opt.value === selectedDate)?.label}
                </p>
                <p className="text-sm text-green-700">
                  {dateOptions.find((opt) => opt.value === selectedDate)?.sublabel}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Helpful tips */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-2 text-sm">💡 Pickup Tips:</h4>
        <ul className="text-xs text-slate-600 space-y-1">
          <li>• We pickup between 8 AM - 10 PM daily</li>
          <li>• You'll get a 30-minute heads up via SMS</li>
          <li>• Weekend pickups available at no extra cost</li>
          <li>• Same-day pickup available until 8 PM</li>
        </ul>
      </div>
    </div>
  )
}
