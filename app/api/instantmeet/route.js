import { NextResponse } from "next/server";
import { google } from "googleapis";

/**
 * API route that creates a Google Meet link by creating a Calendar event,
 * then deletes the event instantly (user won't see it in Calendar)
 */
export async function POST(request) {
  try {
    const { summary, description, startDateTime, endDateTime, accessToken } =
      await request.json();

    // Set up OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    );

    oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar("v3");

    // Define event
    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "Asia/Kolkata",
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    // Create the event
    const insertRes = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    const eventId = insertRes.data.id;
    const meetLink = insertRes.data.conferenceData.entryPoints?.find(
      (entry) => entry.entryPointType === "video",
    )?.uri;

    // Delete the event instantly
    await calendar.events.delete({
      auth: oauth2Client,
      calendarId: "primary",
      eventId,
    });

    return NextResponse.json({
      success: true,
      meetLink,
      eventId,
      deleted: true,
      isCompleted: false,
      note: "Event was deleted right after creation. Only Meet link returned.",
    });
  } catch (error) {
    console.error("Error creating + deleting Google Meet event:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
