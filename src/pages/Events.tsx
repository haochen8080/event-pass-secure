
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAutumn, useCustomer } from "autumn-js/react";
import ProductChangeDialog from '../components/autumn/ProductChangeDialog';
import Header from '../components/Header';

const Events = () => {
  const { attach, track } = useAutumn();
  const { customer, refetch } = useCustomer();

  // Check if user has the monthly subscription
  const hasSubscription = customer?.products?.find((p) => p.id === "subscription_monthly");

  // Single minimalistic event
  const event = {
    id: '1',
    name: 'Tech Conference 2024',
    date: '2024-09-20',
    venue: 'Convention Center',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  };

  const handleSubscribe = async () => {
    await attach({
      productId: "subscription_monthly",
      dialog: ProductChangeDialog,
    });
  };

  const handleAttendEvent = async () => {
    if (hasSubscription) {
      // Track the ticket_pass usage
      await track({ featureId: " ticket_pass" });
      await refetch();
      alert('Event attendance recorded!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Single Event Card */}
        <Card className="overflow-hidden">
          <div className="relative">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-64 object-cover"
            />
          </div>

          <CardHeader className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {event.name}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-600 mt-4">
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

          <CardContent className="text-center space-y-6">
            {!hasSubscription ? (
              <div className="space-y-4">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">
                    Monthly Subscription
                  </h3>
                  <p className="text-purple-700 mb-4">
                    Unlimited event access
                  </p>
                  <div className="text-2xl font-bold text-purple-600">
                    $14.99/month
                  </div>
                </div>
                <Button
                  onClick={handleSubscribe}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Subscribe Now
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-medium">
                    ✓ You have unlimited access
                  </p>
                </div>
                <Button
                  onClick={handleAttendEvent}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Attend Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Events;
