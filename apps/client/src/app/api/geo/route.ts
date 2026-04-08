import { NextRequest, NextResponse } from "next/server";
import { WebServiceClient } from "@maxmind/geoip2-node";

export const runtime = "nodejs";

type GeoPayload = {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryName: string;
  isp: string;
  asn: string;
  timezone: string;
  lat: number | null;
  lng: number | null;
};

function normalizeIp(ip: string) {
  return ip.replace(/^::ffff:/, "").trim();
}

function isLoopbackIp(ip: string) {
  const normalizedIp = normalizeIp(ip);
  return (
    !normalizedIp ||
    normalizedIp === "127.0.0.1" ||
    normalizedIp === "::1" ||
    normalizedIp === "localhost"
  );
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return normalizeIp(forwardedFor.split(",")[0] ?? "");
  }

  return normalizeIp(
    request.headers.get("x-real-ip") ??
      request.headers.get("cf-connecting-ip") ??
      "",
  );
}

async function resolveLookupIp(request: NextRequest) {
  const headerIp = getClientIp(request);
  if (!isLoopbackIp(headerIp)) {
    return headerIp;
  }

  try {
    const response = await fetch("https://api.ipify.org?format=json", {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`IPify returned ${response.status}`);
    }

    const data = (await response.json()) as { ip?: string };
    return normalizeIp(data.ip ?? headerIp);
  } catch (error) {
    console.error("Failed to resolve public IP for local request", error);
    return headerIp;
  }
}

function buildFallbackPayload(ip: string): GeoPayload {
  return {
    ip: ip || "—",
    city: "—",
    region: "—",
    country: "—",
    countryName: "Unknown",
    isp: "—",
    asn: "—",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    lat: null,
    lng: null,
  };
}

export async function GET(request: NextRequest) {
  const accountId = process.env.MAXMIND_ACCOUNT_ID;
  const licenseKey = process.env.MAXMIND_LICENSE_KEY;
  const headerIp = getClientIp(request);

  if (!accountId || !licenseKey) {
    return NextResponse.json(
      {
        ...buildFallbackPayload(headerIp),
        error: "MaxMind credentials are not configured on the server.",
      },
      { status: 500 },
    );
  }

  const lookupIp = await resolveLookupIp(request);

  if (isLoopbackIp(lookupIp)) {
    return NextResponse.json(buildFallbackPayload(headerIp));
  }

  try {
    const client = new WebServiceClient(accountId, licenseKey, {
      timeout: 3000,
    });
    const response = await client.city(lookupIp);

    const payload: GeoPayload = {
      ip: response.traits.ipAddress || lookupIp,
      city: response.city?.names?.en || "—",
      region: response.subdivisions?.[0]?.names?.en || "—",
      country: response.country?.isoCode || "—",
      countryName: response.country?.names?.en || "Unknown",
      isp: response.traits.isp || response.traits.organization || "—",
      asn: response.traits.autonomousSystemNumber
        ? `AS${response.traits.autonomousSystemNumber}`
        : "—",
      timezone: response.location?.timeZone || "UTC",
      lat: response.location?.latitude ?? null,
      lng: response.location?.longitude ?? null,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("MaxMind geo lookup failed", error);

    return NextResponse.json(
      {
        ...buildFallbackPayload(headerIp),
        error: "Failed to fetch geolocation from MaxMind.",
      },
      { status: 502 },
    );
  }
}
