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

/* ✈️ FlyTo Animation */
function FlyToLocation({ location }: any) {
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
  const [location, setLocation] = useState<any>(null);
  const [triggerFly, setTriggerFly] = useState(false);

  /* 📍 Handle click */
  const handleLocate = async () => {
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
              className="absolute top-3 left-3 z-10 bg-white p-2 rounded-lg shadow-md hover:bg-gray-100"
            >
              <LocateFixed className="w-5 h-5 text-black" />
            </button>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
