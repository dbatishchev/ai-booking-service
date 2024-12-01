import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

type TimeTableProps = {
  restaurantName: string;
  date: string;
  timeSlots: Array<{
    time: string;
    available: boolean;
  }>;
};

export function TimeTable({ restaurantName, date, timeSlots }: TimeTableProps) {
  const formattedDate = format(new Date(date), 'EEEE, MMMM d, yyyy');

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-lg">
          Available times for {restaurantName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {timeSlots.map(({ time, available }) => (
            <Badge
              key={time}
              variant={available ? "secondary" : "outline"}
              className={`
                py-2 
                justify-center 
                ${available 
                  ? 'hover:bg-primary hover:text-primary-foreground cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
            >
              {time}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
