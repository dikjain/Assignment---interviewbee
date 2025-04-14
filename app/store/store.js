import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMeetStore = create(
  persist(
    (set) => ({
      meetings: [],
      
      // Add a new meeting
      addMeeting: (meeting) => set((state) => ({
        meetings: [...state.meetings, meeting]
      })),
      
      // Update meeting completion status
      updateMeetingStatus: (eventId, isCompleted) => set((state) => ({
        meetings: state.meetings.map(meeting => 
          meeting.eventId === eventId 
            ? { ...meeting, isCompleted } 
            : meeting
        )
      })),
      
    }),
    {
      name: 'meetings-storage',
    }
  )
);

export default useMeetStore;
