import { useState } from 'react';
import { Check, X, Link as LinkIcon } from 'lucide-react';
import useMeetStore from '@/app/store/store';


import { Button } from '@/components/ui/button';

/**
 * MeetCards component displays a list of scheduled meetings
 * with options to copy meeting links and mark meetings as completed
 */
export default function MeetCards({ meetings }) {
  const { updateMeetingStatus } = useMeetStore();
  const [copyStatus, setCopyStatus] = useState({});

  // Toggle the completion status of a meeting
  const handleToggleCompletion = (eventId, isCompleted) => {
    updateMeetingStatus(eventId, !isCompleted);
  };

  // Copy meeting link to clipboard and show temporary confirmation
  const handleCopyLink = (meetLink, eventId) => {
    navigator.clipboard.writeText(meetLink);
    setCopyStatus({ ...copyStatus, [eventId]: true });
    
    setTimeout(() => {
      setCopyStatus({ ...copyStatus, [eventId]: false });
    }, 2000);
  };

  // Display message when no meetings are scheduled
  if (meetings.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No meetings scheduled yet.
      </div>
    );
  }

  return (
    <div className="space-y-3 relative">
      {meetings.map((meeting) => {
        const startDate = new Date(meeting.startDateTime);
        const endDate = new Date(meeting.endDateTime);
        const duration = endDate.getTime() - startDate.getTime();
        const durationInMinutes = Math.round(duration / (1000 * 60));
        
        return (
          <div key={meeting.eventId} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1">
              <div className="font-medium">{meeting.summary}</div>
              <div className="text-sm text-muted-foreground">
                {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs text-muted-foreground">
                Duration: {durationInMinutes} minutes
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer"
                onClick={() => handleCopyLink(meeting.meetLink, meeting.eventId)}
              >
                <LinkIcon className="w-4 h-4 mr-1" />
                {copyStatus[meeting.eventId] ? "Copied!" : "Copy"}
              </Button>
              <Button
                size="sm"
                variant={meeting.isCompleted ? "destructive" : "success"}
                className={`cursor-pointer ${!meeting.isCompleted ? "hover:bg-gray-300" : ""}`}
                onClick={() => handleToggleCompletion(meeting.eventId, meeting.isCompleted)}
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
        );
      })}
    </div>
  );
}
