
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EventCard from '../components/EventCard';
import Header from '../components/Header';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock events data
  const events = [
    {
      id: '1',
      name: 'Summer Music Festival',
      date: '2024-08-15',
      venue: 'Central Park',
      price: 89,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Music',
      availableTickets: 150
    },
    {
      id: '2',
      name: 'Tech Conference 2024',
      date: '2024-09-20',
      venue: 'Convention Center',
      price: 199,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Technology',
      availableTickets: 75
    },
    {
      id: '3',
      name: 'Comedy Night Live',
      date: '2024-07-30',
      venue: 'Comedy Club Downtown',
      price: 45,
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Comedy',
      availableTickets: 200
    },
    {
      id: '4',
      name: 'Art Gallery Opening',
      date: '2024-08-05',
      venue: 'Metropolitan Museum',
      price: 25,
      image: 'https://images.unsplash.com/photo-1544967882-7d8ac882e5a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Art',
      availableTickets: 100
    },
    {
      id: '5',
      name: 'Food & Wine Festival',
      date: '2024-09-10',
      venue: 'Harbor View',
      price: 125,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Food',
      availableTickets: 80
    },
    {
      id: '6',
      name: 'Basketball Championship',
      date: '2024-08-25',
      venue: 'Sports Arena',
      price: 150,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Sports',
      availableTickets: 300
    }
  ];

  const categories = ['All', 'Music', 'Technology', 'Comedy', 'Art', 'Food', 'Sports'];

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
            Discover Amazing <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find and book tickets for the hottest events in your city. From concerts to conferences, we've got you covered.
          </p>
        </div>

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
      </div>
    </div>
  );
};

export default Events;
