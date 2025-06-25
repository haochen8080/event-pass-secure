
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAutumn, useCustomer } from "autumn-js/react";
import ProductChangeDialog from './autumn/ProductChangeDialog';

const TicketPurchase = () => {
  const { attach } = useAutumn();
  const { customer } = useCustomer();

  // Check if user has active products
  const singleTicketPass = customer?.products?.find((p) => p.id === "single_ticket");
  const monthlySubscription = customer?.products?.find((p) => p.id === "subscription_monthly");
  
  // Get ticket_pass feature usage
  const ticketPassFeature = customer?.features?.ticket_pass;

  const handlePurchase = async (productId: string) => {
    await attach({
      productId,
      dialog: ProductChangeDialog,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Your Tickets</h2>
        <p className="text-gray-600">Choose the perfect option for your event experience</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Single Ticket Pass */}
        <Card className="relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Single Event Pass</CardTitle>
                <p className="text-gray-600 mt-1">Perfect for one special event</p>
              </div>
              {singleTicketPass && (
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-purple-600">$45</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Access to one selected event</li>
              <li>✓ Choose your preferred date</li>
              <li>✓ Full event experience</li>
            </ul>
            
            {singleTicketPass ? (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  You have an active single ticket pass
                </p>
              </div>
            ) : (
              <Button 
                onClick={() => handlePurchase('single_ticket')}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Select Event & Purchase
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Monthly Subscription */}
        <Card className="relative border-2 border-purple-200">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-purple-600 text-white">Most Popular</Badge>
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Monthly Unlimited</CardTitle>
                <p className="text-gray-600 mt-1">Attend all events this month</p>
              </div>
              {monthlySubscription && (
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-purple-600">$89<span className="text-lg text-gray-500">/month</span></div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Unlimited event access</li>
              <li>✓ Attend any available date</li>
              <li>✓ Cancel anytime</li>
              <li>✓ Best value for frequent attendees</li>
            </ul>
            
            {monthlySubscription ? (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ Active subscription - attend any event!
                </p>
                {ticketPassFeature && (
                  <p className="text-xs text-gray-600 mt-1">
                    Events attended this month: {ticketPassFeature.usage || 0}
                  </p>
                )}
              </div>
            ) : (
              <Button 
                onClick={() => handlePurchase('subscription_monthly')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Start Monthly Subscription
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Usage Display */}
      {ticketPassFeature && (
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Your Ticket Usage</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Events attended:</span>
              <span className="font-medium">{ticketPassFeature.usage || 0}</span>
            </div>
            {!ticketPassFeature.unlimited && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">Remaining:</span>
                <span className="font-medium">{ticketPassFeature.balance || 0}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TicketPurchase;
