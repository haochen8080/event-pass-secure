
import React, { useState } from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  price: number;
  image: string;
  category: string;
  availableTickets: number;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { user, purchaseTicket } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to purchase tickets.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate purchase delay
    setTimeout(() => {
      purchaseTicket(event.id, quantity, event.price);
      toast({
        title: "Purchase successful!",
        description: `You've purchased ${quantity} ticket(s) for ${event.name}.`,
      });
      setIsLoading(false);
    }, 1000);
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-white/90 text-purple-700">
          {event.category}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
          {event.name}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{event.venue}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-purple-600">${event.price}</span>
            <span className="text-sm text-gray-500 ml-1">per ticket</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Ticket className="h-4 w-4" />
            <span>{event.availableTickets} available</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full space-y-3">
          <div className="flex items-center space-x-2">
            <label htmlFor={`quantity-${event.id}`} className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <select
              id={`quantity-${event.id}`}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <Button
            onClick={handlePurchase}
            disabled={isLoading || event.availableTickets === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {isLoading ? 'Processing...' : `Buy ${quantity} Ticket${quantity > 1 ? 's' : ''} - $${event.price * quantity}`}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
