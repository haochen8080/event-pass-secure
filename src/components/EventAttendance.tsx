
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { useAutumn, useCustomer } from "autumn-js/react";
import { toast } from '@/hooks/use-toast';

const EventAttendance = () => {
  const { check, track } = useAutumn();
  const { customer, refetch } = useCustomer();
  const [isLoading, setIsLoading] = useState(false);

  // Available events
  const events = [
    { id: 'saturday_6_28', name: 'Summer Music Festival', date: '2024-06-28', venue: 'Central Park' },
    { id: 'friday_7_5', name: 'Independence Day Special', date: '2024-07-05', venue: 'Downtown Plaza' },
    { id: 'saturday_7_12', name: 'Jazz & Blues Night', date: '2024-07-12', venue: 'Riverside Theater' },
    { id: 'friday_7_19', name: 'Comedy Showcase', date: '2024-07-19', venue: 'Laugh Factory' },
    { id: 'saturday_7_26', name: 'Food & Music Fusion', date: '2024-07-26', venue: 'Harbor View' },
  ];

  // Check user's access
  const singleTicketPass = customer?.products?.find((p) => p.id === "single_ticket");
  const monthlySubscription = customer?.products?.find((p) => p.id === "subscription_monthly");
  const hasAccess = singleTicketPass || monthlySubscription;

  const handleAttendEvent = async (eventId: string, eventName: string) => {
    if (!hasAccess) {
      toast({
        title: "Access required",
        description: "Please purchase a ticket pass to attend events.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if user can attend (has remaining uses)
      const { data } = await check({ featureId: "ticket_pass" });

      if (data?.allowed) {
        // Track the usage
        await track({ featureId: "ticket_pass" });
        
        // Refetch customer data to update usage counts
        await refetch();
        
        toast({
          title: "Event attended!",
          description: `Successfully checked in to ${eventName}. Enjoy the event!`,
        });
      } else {
        toast({
          title: "No remaining passes",
          description: "You've used all your available passes. Please upgrade or purchase a new pass.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in to event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!hasAccess) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Access</h3>
          <p className="text-gray-600 mb-4">
            You need a ticket pass to attend events.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Events</h2>
        <p className="text-gray-600">Click to check in and attend an event</p>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">Available</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={() => handleAttendEvent(event.id, event.name)}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Checking in...' : 'Check In & Attend'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventAttendance;
