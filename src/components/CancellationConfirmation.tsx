import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CancellationConfirmationProps = {
  success: boolean;
  bookingId: number;
};

export function CancellationConfirmation({ 
  success, 
  bookingId 
}: CancellationConfirmationProps) {
  if (!success) {
    return (
      <Card className="w-full max-w-2xl bg-red-50">
        <CardHeader>
          <CardTitle className="text-lg text-red-700">
            Cancellation Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Sorry, we couldn't cancel your booking (ID: {bookingId}). 
            Please try again or contact support.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl bg-amber-50">
      <CardHeader>
        <CardTitle className="text-lg text-amber-700">
          Booking Cancelled
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-amber-600">
          <p>Your booking (ID: {bookingId}) has been successfully cancelled.</p>
          <p className="text-sm mt-4">
            A confirmation email will be sent shortly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 