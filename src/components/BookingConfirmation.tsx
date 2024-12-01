import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

type BookingConfirmationProps = {
  success: boolean;
  restaurantId?: number;
  date?: string;
  time?: string;
  partySize?: number;
};

export function BookingConfirmation({ 
  success, 
  restaurantId, 
  date, 
  time, 
  partySize 
}: BookingConfirmationProps) {
  if (!success) {
    return (
      <Card className="w-full max-w-2xl bg-red-50">
        <CardHeader>
          <CardTitle className="text-lg text-red-700">
            Booking Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Sorry, we couldn't complete your booking. Please try again or choose a different time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl bg-green-50">
      <CardHeader>
        <CardTitle className="text-lg text-green-700">
          Booking Confirmed!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-green-600">
          <p>Your table has been successfully booked.</p>
          {date && time && (
            <p>
              Date & Time: {format(new Date(date), 'EEEE, MMMM d, yyyy')} at {time}
            </p>
          )}
          {partySize && (
            <p>Party Size: {partySize} {partySize === 1 ? 'person' : 'people'}</p>
          )}
          <p className="text-sm mt-4">
            A confirmation email will be sent shortly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 