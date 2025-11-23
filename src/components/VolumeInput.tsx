import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VolumeInputProps {
  volume: number;
  unit: "L" | "gal";
  onVolumeChange: (volume: number) => void;
  onUnitChange: (unit: "L" | "gal") => void;
}

export function VolumeInput({ volume, unit, onVolumeChange, onUnitChange }: VolumeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="volume-input">Volumen del Tanque/Solución</Label>
      <div className="flex gap-2">
        <Input
          id="volume-input"
          type="number"
          min="0.1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value) || 0)}
          className="flex-1"
        />
        <Select value={unit} onValueChange={onUnitChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="L">Litros</SelectItem>
            <SelectItem value="gal">Galones</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-muted-foreground">
        {unit === "gal" ? `≈ ${(volume * 3.78541).toFixed(2)} L` : `≈ ${(volume / 3.78541).toFixed(2)} gal`}
      </p>
    </div>
  );
}
