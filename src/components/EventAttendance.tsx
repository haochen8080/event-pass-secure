
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAutumn, useCustomer } from "autumn-js/react";
import { Calendar, MapPin, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EventAttendance = () => {
  const { check, track } = useAutumn();
  const { customer, refetch } = useCustomer();
  const [isChecking, setIsChecking] = useState(false);

  const eventDates = [
    { id: '2024-06-28', label: 'Saturday 6/28', venue: 'Main Hall' },
    { id: '2024-07-05', label: 'Saturday 7/5', venue: 'Conference Center' },
    { id: '2024-07-12', label: 'Saturday 7/12', venue: 'Grand Theater' },
    { id: '2024-07-19', label: 'Saturday 7/19', venue: 'Main Hall' },
    { id: '2024-07-26', label: 'Saturday 7/26', venue: 'Conference Center' }
  ];

  const hasSubscription = customer?.products?.find(p => p.id === 'subscription_monthly');
  const singleTicketProduct = customer?.products?.find(p => p.id === 'single_ticket');
  const ticketFeature = customer?.features?.ticket_pass;

  const handleCheckIn = async (eventId: string, eventLabel: string) => {
    setIsChecking(true);
    
    try {
      // Check if user has access to use ticket_pass
      const { data } = await check({ featureId: "ticket_pass" });
      
      if (data?.allowed) {
        // If single ticket, verify they selected this event
        if (singleTicketProduct && !hasSubscription) {
          // For demo purposes, we'll allow any event for single ticket users
          // In production, you'd check against the selectedEvent from purchase metadata
        }
        
        // Track the usage
        await track({ featureId: "ticket_pass", metadata: { eventId, eventLabel } });
        await refetch(); // Refresh customer data
        
        toast({
          title: "Check-in Successful!",
          description: `You've checked in to ${eventLabel}`,
        });
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have access to this event. Please purchase a ticket.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Check-in failed:', error);
      toast({
        title: "Check-in Failed",
        description: "There was an error processing your check-in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const canAttendEvent = (eventId: string) => {
    if (hasSubscription) return true;
    if (singleTicketProduct && ticketFeature?.balance > 0) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Check-In</h2>
        <p className="text-gray-600">Select an event to check in and use your ticket pass</p>
      </div>

      {/* Usage Status */}
      {ticketFeature && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Ticket Pass Status</h3>
                <p className="text-sm text-blue-700">
                  {ticketFeature.unlimited 
                    ? 'Unlimited access with subscription' 
                    : `${ticketFeature.balance} tickets remaining`
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event List */}
      <div className="grid gap-4">
        {eventDates.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{event.label}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleCheckIn(event.id, event.label)}
                  disabled={!canAttendEvent(event.id) || isChecking}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isChecking ? 'Checking In...' : 'Check In'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!customer?.products?.length && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <p className="text-yellow-800">
              You don't have any active tickets. Purchase a ticket pass to attend events.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventAttendance;
