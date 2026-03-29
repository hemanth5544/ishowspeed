import { Map, MapControls } from "@/components/ui/map";
import { Card, CardContent } from "@/components/ui/card";

export function MapControlsExample() {
  return (
    <Card className="w-full h-full rounded-2xl shadow-lg">
      <CardContent className="p-2 h-full">
        <div className="w-full h-full rounded-xl overflow-hidden">
          <Map center={[2.3522, 48.8566]} zoom={11}>
            <MapControls
              position="bottom-right"
              showZoom
              showCompass
              showLocate
              showFullscreen
            />
          </Map>
        </div>
      </CardContent>
    </Card>
  );
}