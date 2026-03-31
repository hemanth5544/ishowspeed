"use client";

import { useEffect, useState } from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MapPopup,
  useMap,
} from "@/components/ui/map";
import { Card, CardContent } from "@/components/ui/card";
import { LocateFixed } from "lucide-react";

interface LocationData {
  name: string;
  lat: number;
  lng: number;
  ip: string;
}

/* ✈️ FlyTo Animation */
function FlyToLocation({ location }: { location: LocationData | null }) {
  const { map } = useMap();

  useEffect(() => {
    if (!map || !location) return;

    map.flyTo({
      center: [location.lng, location.lat],
      zoom: 10,
      speed: 2.5,
      curve: 1.2,
      essential: true,
    });
  }, [map, location]);

  return null;
}

export function GlobeMarkersCard() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [triggerFly, setTriggerFly] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  /* 📍 Handle click */
  const handleLocate = async () => {
    if (isLocating) return;
    setIsLocating(true);
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      const loc = {
        name: `${data.city}, ${data.country_name}`,
        lat: data.latitude,
        lng: data.longitude,
        ip: data.ip,
      };

      setLocation(loc);
      setTriggerFly(true);
    } catch (err) {
      console.error("Failed to fetch location", err);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="h-full w-full">
      <Card className="h-full w-full rounded-2xl shadow-lg">
        <CardContent className="h-full p-2">
          <div className="relative h-full w-full overflow-hidden rounded-xl">

            {/* 🌍 Map */}
            <Map
              projection={{ type: "globe" }}
              center={[0, 20]}
              zoom={1.5}
            >
              {/* ✈️ Fly */}
              {triggerFly && <FlyToLocation location={location} />}

              {/* 📍 Marker */}
              {location && (
                <>
                  <MapMarker
                    longitude={location.lng}
                    latitude={location.lat}
                  >
                    <MarkerContent>
                      <div className="relative flex items-center justify-center">
                        <div className="absolute size-8 rounded-full bg-green-400 opacity-30 animate-ping" />
                        <div className="size-5 rounded-full bg-green-500 border-4 border-white shadow-lg" />
                      </div>
                    </MarkerContent>
                  </MapMarker>

                  {/* 💬 Popup */}
                  <MapPopup
                    longitude={location.lng}
                    latitude={location.lat}
                    closeButton={false}
                    closeOnClick={false}
                  >
                    <div className="text-sm font-medium">
                      {location.name}
                    </div>
                  </MapPopup>
                </>
              )}

              <MapControls
                position="bottom-right"
                showZoom
                showCompass
                showFullscreen
              />
            </Map>

            {/* 📍 Floating Locate Button */}
            <button
              onClick={handleLocate}
              disabled={isLocating}
              aria-label={isLocating ? "Locating your position" : "Locate my position"}
              className="absolute left-3 top-3 z-10 rounded-lg border border-border/70 bg-background/95 p-2 shadow-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-65"
            >
              <LocateFixed className="h-5 w-5 text-foreground" />
            </button>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
