
import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '../components/Header';
import ProductChangeDialog from '../components/autumn/ProductChangeDialog';
import { useAutumn, useCustomer } from 'autumn-js/react';
import { toast } from '@/hooks/use-toast';

const Events = () => {
  const { attach, check, track } = useAutumn();
  const { customer, refetch } = useCustomer();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Available event dates
  const eventDates = [
    { id: '2024-06-28', label: 'Saturday 6/28', date: '2024-06-28' },
    { id: '2024-07-05', label: 'Saturday 7/5', date: '2024-07-05' },
    { id: '2024-07-12', label: 'Saturday 7/12', date: '2024-07-12' },
    { id: '2024-07-19', label: 'Saturday 7/19', date: '2024-07-19' },
    { id: '2024-07-26', label: 'Saturday 7/26', date: '2024-07-26' },
  ];

  // Check user's products
  const hasSingleTicket = customer?.products?.find((p: any) => p.id === 'single_ticket');
  const hasMonthlySubscription = customer?.products?.find((p: any) => p.id === 'subscription_monthly');
  const ticketPassFeature = customer?.features?.ticket_pass;

  const handleAttendEvent = async (eventId: string) => {
    setIsLoading(eventId);
    
    try {
      const { data } = await check({ featureId: 'ticket_pass' });
      
      if (data?.allowed) {
        // Track usage
        await track({ featureId: 'ticket_pass' });
        await refetch();
        
        toast({
          title: "Event Check-in Successful!",
          description: `You've checked in for ${eventDates.find(e => e.id === eventId)?.label}`,
        });
      } else {
        toast({
          title: "No tickets remaining",
          description: "Please purchase a ticket to attend this event.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Monthly <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-lg text-gray-600">
            Join us for our monthly gathering. Purchase a ticket or subscription to attend.
          </p>
        </div>

        <Tabs defaultValue="purchase" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchase">Get Tickets</TabsTrigger>
            <TabsTrigger value="attend">Attend Events</TabsTrigger>
          </TabsList>

          <TabsContent value="purchase" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Single Ticket */}
              <Card className="border-2 hover:border-purple-200 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">Single Event Pass</CardTitle>
                  <div className="text-3xl font-bold text-purple-600">$9.99</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Access to 1 event</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Choose your preferred date</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={async () => await attach({
                      productId: 'single_ticket',
                      dialog: ProductChangeDialog,
                    })}
                  >
                    Buy Single Pass
                  </Button>
                </CardContent>
              </Card>

              {/* Monthly Subscription */}
              <Card className="border-2 border-purple-300 bg-purple-50 relative">
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                  Most Popular
                </Badge>
                <CardHeader>
                  <CardTitle className="text-xl">Monthly Subscription</CardTitle>
                  <div className="text-3xl font-bold text-purple-600">$14.99<span className="text-base text-gray-500">/month</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Unlimited event access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Attend any/all monthly events</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Priority booking</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={async () => await attach({
                      productId: 'subscription_monthly',
                      dialog: ProductChangeDialog,
                    })}
                  >
                    Subscribe Monthly
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Usage Display */}
            {ticketPassFeature && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Your Ticket Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span>Ticket Passes:</span>
                    <span className="font-semibold">
                      {ticketPassFeature.unlimited ? 'Unlimited' : `${ticketPassFeature.balance} remaining`}
                    </span>
                  </div>
                  {!ticketPassFeature.unlimited && (
                    <div className="text-sm text-gray-500 mt-1">
                      Used: {ticketPassFeature.usage} / {ticketPassFeature.included_usage}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="attend" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Available Events</h2>
              
              {!customer && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-600">Please sign in to view and attend events.</p>
                  </CardContent>
                </Card>
              )}

              {customer && !hasSingleTicket && !hasMonthlySubscription && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You need a ticket to attend events.</p>
                    <p className="text-sm text-gray-500">Switch to the "Get Tickets" tab to purchase.</p>
                  </CardContent>
                </Card>
              )}

              {(hasSingleTicket || hasMonthlySubscription) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventDates.map(event => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">Monthly Event</CardTitle>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                              <Calendar className="h-4 w-4" />
                              <span>{event.label}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>Event Venue</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => handleAttendEvent(event.id)}
                          disabled={isLoading === event.id || (ticketPassFeature && !ticketPassFeature.unlimited && ticketPassFeature.balance <= 0)}
                          className="w-full"
                        >
                          {isLoading === event.id ? 'Checking in...' : 'Attend Event'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
