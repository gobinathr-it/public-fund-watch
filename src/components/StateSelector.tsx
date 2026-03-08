import { MapPin, ChevronDown } from "lucide-react";
import { useStateContext } from "@/contexts/StateContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StateSelector = ({ className = "" }: { className?: string }) => {
  const { selectedState, setSelectedState, states } = useStateContext();

  return (
    <Select value={selectedState} onValueChange={setSelectedState}>
      <SelectTrigger className={`w-[200px] gap-2 ${className}`}>
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Select State" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {states.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StateSelector;
