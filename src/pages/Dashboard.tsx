import React from 'react';
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import AutumnTest from '../components/AutumnTest';

const Dashboard = () => {
  const { user, userProfile, userTickets } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const upcomingTickets = userTickets.filter(ticket => isUpcoming(ticket.eventDate));
  const pastTickets = userTickets.filter(ticket => !isUpcoming(ticket.eventDate));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Autumn Test Component */}
        <AutumnTest />
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.full_name || user?.email}!
          </h1>
          <p className="text-gray-600">
            Here are your tickets and event information.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {userTickets.reduce((sum, ticket) => sum + ticket.quantity, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{upcomingTickets.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${userTickets.reduce((sum, ticket) => sum + ticket.price, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {userTickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't purchased any tickets yet. Browse our events to find something amazing!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Upcoming Events */}
            {upcomingTickets.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingTickets.map(ticket => (
                    <Card key={ticket.id} className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold text-gray-900">
                              {ticket.eventName}
                            </CardTitle>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(ticket.eventDate)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{ticket.venue}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Upcoming</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">
                              Quantity: <span className="font-medium">{ticket.quantity}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Purchased: <span className="font-medium">{ticket.purchaseDate}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-purple-600">${ticket.price}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastTickets.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastTickets.map(ticket => (
                    <Card key={ticket.id} className="border-l-4 border-l-gray-400 opacity-75">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold text-gray-900">
                              {ticket.eventName}
                            </CardTitle>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(ticket.eventDate)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{ticket.venue}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">Past</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">
                              Quantity: <span className="font-medium">{ticket.quantity}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Purchased: <span className="font-medium">{ticket.purchaseDate}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-600">${ticket.price}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
