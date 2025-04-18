"use client";

import { Video } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import useMeetStore from "@/app/store/store";
import MeetCards from "@/app/components/MeetCards";
import ScheduleMeeting from "@/app/components/ScheduleMeeting";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: session } = useSession();
  const [meetingLink, setMeetingLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { meetings, addMeeting } = useMeetStore();

  const createGoogleMeetEvent = async (
    isInstant = false,
    meetingData = null,
  ) => {
    if (!session) return;

    setIsLoading(true);

    try {
      if (isInstant) {
        const now = new Date();
        const end = new Date(now);
        end.setMinutes(now.getMinutes() + 60);

        const response = await fetch("/api/instantmeet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: "Instant Meeting",
            description: "Meeting created via Meeting Scheduler",
            startDateTime: now.toISOString(),
            endDateTime: end.toISOString(),
            accessToken: session.accessToken,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setMeetingLink(data.meetLink);

          addMeeting({
            eventId: data.eventId,
            title: "Instant Meeting",
            description: "Meeting created via Meeting Scheduler",
            startDateTime: now.toISOString(),
            endDateTime: end.toISOString(),
            meetLink: data.meetLink,
            isCompleted: false,
          });
        } else {
          console.error("Error creating instant meeting:", data.error);
        }

        return;
      }

      // Scheduled meeting: Call your API
      const response = await fetch("/api/meet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...meetingData,
          accessToken: session.accessToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMeetingLink(data.meetLink);

        addMeeting({
          eventId: data.eventId,
          title: meetingData.summary,
          description: meetingData.description,
          startDateTime: meetingData.startDateTime,
          endDateTime: meetingData.endDateTime,
          meetLink: data.meetLink,
          isCompleted: data.isCompleted,
        });
      } else {
        console.error("Error creating meeting:", data.error);
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantMeeting = () => {
    if (!session) return;
    createGoogleMeetEvent(true);
  };

  const handleScheduleMeeting = (meetingData) => {
    if (!session) return;
    createGoogleMeetEvent(false, meetingData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Meeting Scheduler
          </h1>
          <p className="text-muted-foreground text-lg">
            Schedule Google Meet meetings with just a few clicks
          </p>
          {!session && (
            <p className="text-amber-600">Please sign in to create meetings</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Instant Meeting */}
            <Card className="h-auto">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Instant Meeting
                </CardTitle>
                <CardDescription>Start a Google Meet right now</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="sm"
                  className="w-full cursor-pointer"
                  onClick={handleInstantMeeting}
                  disabled={isLoading || !session}
                >
                  {isLoading ? "Creating..." : "Start Meeting"}
                </Button>
              </CardContent>
            </Card>

            {/* Schedule Meeting */}
            <ScheduleMeeting
              onSchedule={handleScheduleMeeting}
              isLoading={isLoading}
            />
          </div>

          {/* Meetings List */}
          <Card className="h-full relative">
            <div className="absolute top-3 right-3 bg-black text-white px-4 py-2 rounded-full">
              {meetings.filter((meeting) => !meeting.isCompleted).length}
            </div>
            <CardHeader>
              <CardTitle>Your Meetings</CardTitle>
              <CardDescription>
                All your scheduled and completed meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-screen overflow-y-auto pr-2">
                <MeetCards meetings={meetings} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
