
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventCard from '../components/EventCard';
import Header from '../components/Header';
import TicketPurchase from '../components/TicketPurchase';
import EventAttendance from '../components/EventAttendance';
import AutumnTest from '../components/AutumnTest';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock events data - simplified for single event focus
  const events = [
    {
      id: '1',
      name: 'Weekly Community Meetup',
      date: '2024-08-15',
      venue: 'Community Center',
      price: 0, // Free with ticket pass
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Community',
      availableTickets: 100
    }
  ];

  const categories = ['All', 'Community'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our weekly community meetups. Get a ticket pass to attend events and connect with like-minded people.
          </p>
        </div>

        {/* Autumn Test Component */}
        <AutumnTest />

        {/* Tabs for different sections */}
        <Tabs defaultValue="purchase" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="purchase">Get Tickets</TabsTrigger>
            <TabsTrigger value="attendance">Check In</TabsTrigger>
            <TabsTrigger value="events">Browse Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="purchase" className="mt-8">
            <TicketPurchase />
          </TabsContent>
          
          <TabsContent value="attendance" className="mt-8">
            <EventAttendance />
          </TabsContent>
          
          <TabsContent value="events" className="mt-8">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search events or venues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedCategory === category 
                            ? 'bg-purple-600 text-white' 
                            : 'hover:bg-purple-50 hover:text-purple-600'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
