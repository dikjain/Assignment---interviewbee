"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Link as LinkIcon, ExternalLink } from "lucide-react";
import useMeetStore from "@/app/store/store";
import { Button } from "@/components/ui/button";

/**
 * MeetCards component displays a list of scheduled meetings
 * with options to copy meeting links, open them, and mark meetings as completed
 * with subtle animations for new cards
 */
export default function MeetCards({ meetings }) {
  const { updateMeetingStatus } = useMeetStore();
  const [copyStatus, setCopyStatus] = useState({});
  const prevMeetingCount = useRef(meetings.length);

  // Track number of meetings to highlight the newest one
  const isNewCard = (index) => {
    return index === 0 && meetings.length > prevMeetingCount.current;
  };

  useEffect(() => {
    prevMeetingCount.current = meetings.length;
  }, [meetings]);

  // Toggle the completion status of a meeting
  const handleToggleCompletion = (eventId, isCompleted) => {
    updateMeetingStatus(eventId, !isCompleted);
  };

  // Copy meeting link to clipboard
  const handleCopyLink = (meetLink, eventId) => {
    navigator.clipboard.writeText(meetLink);
    setCopyStatus((prev) => ({ ...prev, [eventId]: true }));

    setTimeout(() => {
      setCopyStatus((prev) => ({ ...prev, [eventId]: false }));
    }, 2000);
  };

  if (meetings.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No meetings scheduled yet.
      </div>
    );
  }

  return (
    <div className="space-y-3 h-full relative">
      <AnimatePresence>
        {meetings.map((meeting, index) => {
          const startDate = new Date(meeting.startDateTime);
          const endDate = new Date(meeting.endDateTime);
          const duration = Math.round((endDate - startDate) / (1000 * 60));

          return (
            <motion.div
              key={meeting.eventId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    {meeting.title || meeting.summary}
                  </div>
                  {meeting.description && (
                    <div className="text-xs text-muted-foreground">
                      {meeting.description}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {startDate.toLocaleDateString()} at{" "}
                    {startDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Duration: {duration} minutes
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {/* Copy Link */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() =>
                      handleCopyLink(meeting.meetLink, meeting.eventId)
                    }
                  >
                    <LinkIcon className="w-4 h-4 mr-1" />
                    {copyStatus[meeting.eventId] ? "Copied!" : "Copy"}
                  </Button>

                  {/* Open Link */}
                  <a
                    href={meeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      className="cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open
                    </Button>
                  </a>

                  {/* Toggle Done/Undo */}
                  <Button
                    size="sm"
                    variant={meeting.isCompleted ? "destructive" : "success"}
                    className={`cursor-pointer ${
                      !meeting.isCompleted ? "hover:bg-gray-300" : ""
                    }`}
                    onClick={() =>
                      handleToggleCompletion(
                        meeting.eventId,
                        meeting.isCompleted,
                      )
                    }
                  >
                    {meeting.isCompleted ? (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        Undo
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Done
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
