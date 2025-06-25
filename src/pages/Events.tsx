
import React from 'react';
import { Calendar, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAutumn, useCustomer } from 'autumn-js/react';
import ProductChangeDialog from '../components/autumn/ProductChangeDialog';
import Header from '../components/Header';
import { toast } from '@/hooks/use-toast';

const Events = () => {
  const { attach, check, track } = useAutumn();
  const { customer, refetch } = useCustomer();

  console.log('Autumn Customer', customer);

  // Single event data
  const event = {
    id: '1',
    name: 'Summer Music Festival',
    date: '2024-08-15',
    venue: 'Central Park',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasSinglePass = customer?.products?.find((p) => p.id === "single_ticket");
  const hasMonthlySubscription = customer?.products?.find((p) => p.id === "subscription_monthly");
  const hasAccess = hasSinglePass || hasMonthlySubscription;

  const handlePurchase = async (productId: string) => {
    console.log('Attempting to purchase:', productId);
    try {
      await attach({
        productId: productId,
        dialog: ProductChangeDialog,
      });
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleAttendEvent = async () => {
    if (!hasAccess) {
      toast({
        title: "No access",
        description: "Please purchase a ticket to attend this event.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data } = await check({ featureId: "ticket_pass" });
      
      if (data?.allowed) {
        await track({ featureId: "ticket_pass" });
        await refetch();
        toast({
          title: "Event attendance confirmed!",
          description: "You've successfully checked in to the event.",
        });
      } else {
        toast({
          title: "No tickets remaining",
          description: "You've used all your available tickets.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Attendance error:', error);
      toast({
        title: "Error",
        description: "Failed to process attendance. Please try again.",
        variant: "destructive"
      });
    }
  };

  const ticketFeature = customer?.features?.ticket_pass;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Event Card */}
        <Card className="overflow-hidden mb-8">
          <div className="relative">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-64 object-cover"
            />
          </div>
          <CardHeader className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{event.venue}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Pricing Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Single Event Pass</h3>
              <p className="text-3xl font-bold text-purple-600 mb-4">$9.99</p>
              <p className="text-gray-600 mb-4">One-time access to this event</p>
              {hasSinglePass ? (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span>Purchased</span>
                </div>
              ) : (
                <Button
                  onClick={() => handlePurchase("single_ticket")}
                  className="w-full"
                >
                  Buy Single Pass
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Monthly Subscription</h3>
              <p className="text-3xl font-bold text-purple-600 mb-4">$14.99</p>
              <p className="text-gray-600 mb-4">Unlimited access to all events</p>
              {hasMonthlySubscription ? (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span>Active</span>
                </div>
              ) : (
                <Button
                  onClick={() => handlePurchase("subscription_monthly")}
                  className="w-full"
                  variant="outline"
                >
                  Subscribe Monthly
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Usage Status */}
        {hasAccess && ticketFeature && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tickets remaining:</span>
                <span className="font-semibold">
                  {ticketFeature.unlimited ? 'Unlimited' : ticketFeature.balance}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attend Event Button */}
        <div className="text-center">
          <Button
            onClick={handleAttendEvent}
            disabled={!hasAccess}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
          >
            {hasAccess ? 'Attend Event' : 'Purchase Ticket to Attend'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Events;
