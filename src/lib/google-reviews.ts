import "server-only";

/**
 * Live Google reviews for the business, from the Google Places API (New).
 *
 * Server-only env vars (see .env.example):
 *   GOOGLE_PLACES_API_KEY  required: an API key with "Places API (New)" enabled
 *   GOOGLE_PLACE_ID        optional: defaults to the Mecatronix Google Business profile below
 *
 * Google returns the overall rating, the total count and up to five reviews (Google's choice of
 * the most relevant). The result is refreshed every 30 minutes, so new reviews Google includes
 * appear on their own; without the key (or if Google fails) this returns null and the page shows
 * its "Review us on Google" card instead — reviews are never invented.
 */

/**
 * Place ID of the Mecatronix Google Business profile — the place behind the review QR code
 * (https://g.page/r/CZ9lDxtzzpCEEAE/review -> feature 0x3ba859d8466e5bd9:0x8490ce731b0f659f).
 */
export const MECATRONIX_PLACE_ID = "ChIJ2VtuRthZqDsRn2UPG3POkIQ";

export interface GoogleReview {
  id: string;
  author: string;
  authorUrl?: string;
  photo?: string;
  rating: number;
  text: string;
  /** e.g. "2 weeks ago", as Google words it */
  when: string;
}

export interface GoogleReviews {
  rating: number;
  total: number;
  mapsUrl: string;
  writeUrl: string;
  reviews: GoogleReview[];
}

const REFRESH_SECONDS = 30 * 60;

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    name?: string;
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }[];
}

/** Link that opens Google's "write a review" box for the place. */
export const googleWriteReviewUrl = (placeId: string) => `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;

export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim() || MECATRONIX_PLACE_ID;
  if (!key) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
      next: { revalidate: REFRESH_SECONDS, tags: ["content:reviews"] },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) {
      console.error(`Google Places responded ${res.status}`);
      return null;
    }
    const place = (await res.json()) as PlacesResponse;
    const reviews = (place.reviews ?? [])
      .map((r, i): GoogleReview | null => {
        const text = (r.text?.text || r.originalText?.text || "").trim();
        const author = r.authorAttribution?.displayName?.trim();
        if (!text || !author) return null;
        return {
          id: r.name ?? `review-${i}`,
          author,
          authorUrl: r.authorAttribution?.uri,
          photo: r.authorAttribution?.photoUri,
          rating: Math.min(5, Math.max(1, Math.round(r.rating ?? 5))),
          text,
          when: r.relativePublishTimeDescription ?? "",
        };
      })
      .filter((r): r is GoogleReview => r !== null);

    return {
      rating: place.rating ?? 0,
      total: place.userRatingCount ?? 0,
      mapsUrl: place.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`,
      writeUrl: googleWriteReviewUrl(placeId),
      reviews,
    };
  } catch (error) {
    console.error("Google Places request failed:", error);
    return null;
  }
}
