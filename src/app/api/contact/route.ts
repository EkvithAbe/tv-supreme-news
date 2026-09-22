import { NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/contact-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MINUTE_MS = 60_000;
const recentSubmissions = new Map<string, number>();

type ContactLocale = "en" | "si" | "ta";

const contactMessages: Record<
  ContactLocale,
  {
    rateLimited: string;
    required: string;
    invalidEmail: string;
    success: string;
    unavailable: string;
    failed: string;
  }
> = {
  en: {
    rateLimited: "Please wait a minute before sending another message.",
    required: "Please complete all required contact fields.",
    invalidEmail: "Please enter a valid email address.",
    success: "Your message has been sent. We will get back to you soon.",
    unavailable: "Contact email is not configured yet. Please try again later.",
    failed: "We could not send your message right now. Please try again later.",
  },
  si: {
    rateLimited: "තවත් පණිවිඩයක් යැවීමට පෙර කරුණාකර මිනිත්තුවක් රැඳී සිටින්න.",
    required: "කරුණාකර අවශ්‍ය සියලුම සම්බන්ධතා තොරතුරු සම්පූර්ණ කරන්න.",
    invalidEmail: "කරුණාකර වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න.",
    success: "ඔබගේ පණිවිඩය යවන ලදී. අපි ඉක්මනින් ඔබ වෙත ප්‍රතිචාර දක්වන්නෙමු.",
    unavailable: "සම්බන්ධතා විද්‍යුත් තැපෑල තවම සකසා නැත. කරුණාකර පසුව නැවත උත්සාහ කරන්න.",
    failed: "දැනට ඔබගේ පණිවිඩය යැවීමට නොහැකි විය. කරුණාකර පසුව නැවත උත්සාහ කරන්න.",
  },
  ta: {
    rateLimited: "மற்றொரு செய்தியை அனுப்புவதற்கு முன் ஒரு நிமிடம் காத்திருக்கவும்.",
    required: "தேவையான அனைத்து தொடர்பு விவரங்களையும் பூர்த்தி செய்யவும்.",
    invalidEmail: "செல்லுபடியாகும் மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
    success: "உங்கள் செய்தி அனுப்பப்பட்டது. விரைவில் உங்களைத் தொடர்புகொள்வோம்.",
    unavailable: "தொடர்பு மின்னஞ்சல் இன்னும் அமைக்கப்படவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.",
    failed: "தற்போது உங்கள் செய்தியை அனுப்ப முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.",
  },
};

function getContactLocale(value: unknown): ContactLocale {
  return value === "si" || value === "ta" ? value : "en";
}

function getClientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function cleanText(value: unknown, maximumLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maximumLength)
    : "";
}

export async function POST(request: Request) {
  let messages = contactMessages.en;

  try {
    const body = await request.json();
    messages = contactMessages[getContactLocale(body.locale)];
    const clientKey = getClientKey(request);
    const previousSubmission = recentSubmissions.get(clientKey);

    if (previousSubmission && Date.now() - previousSubmission < MINUTE_MS) {
      return NextResponse.json(
        {
          success: false,
          error: messages.rateLimited,
        },
        { status: 429 },
      );
    }

    const name = cleanText(body.name, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    const phone = cleanText(body.phone, 50);
    const subject = cleanText(body.subject, 180);
    const message = cleanText(body.message, 5000);

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: messages.required,
        },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: messages.invalidEmail,
        },
        { status: 400 },
      );
    }

    await sendContactEmail({
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
    });

    recentSubmissions.set(clientKey, Date.now());

    return NextResponse.json({
      success: true,
      message: messages.success,
    });
  } catch (error) {
    console.error("POST /api/contact:", error);

    const unavailable =
      error instanceof Error &&
      (error.message.includes("GMAIL_USER") ||
        error.message.includes("GMAIL_APP_PASSWORD"));

    return NextResponse.json(
      {
        success: false,
        error: unavailable
          ? messages.unavailable
          : messages.failed,
      },
      { status: 503 },
    );
  }
}
