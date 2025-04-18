"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ScheduleMeeting({ onSchedule, isLoading }) {
  const { data: session } = useSession();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState("60");
  const [customDuration, setCustomDuration] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");

  const [today, setToday] = useState(new Date()); // State to store the "today" date

  // This effect runs once when the component mounts and ensures the "today" is updated correctly.
  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight
    setToday(currentDate);
  }, []); // Run only once on mount

  const handleScheduleMeeting = () => {
    if (!date || !session) return;

    const eventDateTime = new Date(date);
    const [hours, minutes] = time.split(":");
    eventDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const now = new Date();
    if (eventDateTime < now) {
      alert("Please select a future date and time.");
      return;
    }

    const durationInMinutes =
      duration === "custom"
        ? parseInt(customDuration, 10)
        : parseInt(duration, 10);

    const endDateTime = new Date(eventDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + durationInMinutes);

    onSchedule({
      summary: meetingTitle || "Scheduled Meeting",
      description:
        meetingDescription || "Meeting created via Meeting Scheduler",
      startDateTime: eventDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Schedule Meeting
        </CardTitle>
        <CardDescription>Plan a Google Meet for later</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Meeting Title"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            disabled={!session}
          />
        </div>
        <div className="space-y-2">
          <Label>Description (Optional)</Label>
          <Input
            type="text"
            placeholder="Meeting Description"
            value={meetingDescription}
            onChange={(e) => setMeetingDescription(e.target.value)}
            disabled={!session}
          />
        </div>
        <div className="space-y-2 w-full flex justify-center flex-col ">
          <Label>Date</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-fit self-center"
            disabled={!session}
            fromDate={today} {/* Uses the correct "today" date */}
          />
        </div>
        <div className="space-y-2">
          <Label>Start Time</Label>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={!session}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Duration</Label>
          <Select
            value={duration}
            onValueChange={(value) => setDuration(value)}
            disabled={!session}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {duration === "custom" && (
            <div className="mt-2">
              <Input
                type="number"
                placeholder="Duration in minutes"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                min="1"
                max="300"
                disabled={!session}
              />
            </div>
          )}
        </div>
        <Button
          className="w-full"
          onClick={handleScheduleMeeting}
          disabled={isLoading || !session}
        >
          {isLoading ? "Scheduling..." : "Schedule Meeting"}
        </Button>
      </CardContent>
    </Card>
  );
}
