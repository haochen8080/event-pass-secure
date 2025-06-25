
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '../components/Header';
import TicketPurchase from '../components/TicketPurchase';
import EventAttendance from '../components/EventAttendance';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Events = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Please Log In</h3>
              <p className="text-gray-600 mb-4">
                You need to be logged in to purchase tickets and attend events.
              </p>
              <Button onClick={() => window.location.href = '/login'}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Event <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Experience</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Purchase your tickets and attend amazing events with our flexible pricing options.
          </p>
        </div>

        <Tabs defaultValue="purchase" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="purchase">Purchase Tickets</TabsTrigger>
            <TabsTrigger value="attend">Attend Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="purchase" className="space-y-6">
            <TicketPurchase />
          </TabsContent>
          
          <TabsContent value="attend" className="space-y-6">
            <EventAttendance />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
