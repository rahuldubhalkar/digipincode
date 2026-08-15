'use server';

const API_KEY = "d3d6076396664a30b4a7c991ba219bf9";
const TRACKING_API_URL = "https://api.shipway.in/v1/track";

/**
 * Server Action to fetch tracking data from Shipway API.
 * Moving this to server-side avoids CORS issues and protects the API key.
 */
export async function trackParcel(trackingNumber: string) {
  if (!trackingNumber || trackingNumber.trim().length < 5) {
    return { error: 'Invalid tracking number. Most India Post IDs consist of 13 alphanumeric characters (e.g., EB123456789IN).' };
  }

  try {
    const response = await fetch(`${TRACKING_API_URL}?key=${API_KEY}&tracking_number=${trackingNumber}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 } // Cache for 1 minute to stay within rate limits
    });

    if (!response.ok) {
      throw new Error(`Tracking service is temporarily unavailable.`);
    }

    const data = await response.json();

    if (data && data.status === "success") {
      // API returns history in chronological order, we want latest first for better UX
      const events = (data.history || []).map((h: any) => ({
        time: h.date_time || h.time || 'N/A',
        location: h.location || 'Sorting Facility',
        description: h.activity || h.description || 'Processed',
        status: h.status || 'Active'
      })).reverse();

      return {
        success: true,
        data: {
          trackingNumber: trackingNumber.toUpperCase(),
          status: data.current_status || (events.length > 0 ? events[0].status : "In Transit"),
          lastUpdate: new Date().toLocaleString(),
          origin: data.origin || "India Post Sorting Hub",
          destination: data.destination || "Delivery Post Office",
          events: events
        }
      };
    }

    // Return a structured error if the consignment is not found
    return { error: 'Consignment details not found. Please ensure the tracking ID is correct and was dispatched within the last 60 days.' };

  } catch (error) {
    console.error('Tracking action error:', error);
    return { error: 'Unable to connect to India Post tracking service. Please try again later.' };
  }
}
