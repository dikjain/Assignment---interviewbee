import { NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * API route handler for creating Google Meet events
 * Accepts meeting details and creates a calendar event with an attached Meet link
 */
export async function POST(request) {
  try {
    // Extract meeting details from request body
    const { summary, description, startDateTime, endDateTime, accessToken } = await request.json();

    // Initialize OAuth2 client with Google API credentials
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    );
    
    oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar('v3');
    
    // Prepare calendar event with Google Meet integration
    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Los_Angeles',
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };
    
    // Create the event in Google Calendar
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });
    
    // Extract the Google Meet link from the response
    const meetLink = response.data.conferenceData.entryPoints[0].uri;
    
    return NextResponse.json({ 
      success: true, 
      meetLink,
      eventId: response.data.id,
      isCompleted: false
    });
    
  } catch (error) {
    console.error('Error creating Google Meet event:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
