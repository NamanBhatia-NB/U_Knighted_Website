import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ChessSections/Footer";
import EventForm, { Event } from "@/components/forms/EventForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarIcon, PlusIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import { format } from "date-fns";

export default function ManageEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Fetch events
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });
  
  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => {
      return apiRequest(`/api/events/${eventId}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      toast({
        title: "Event Deleted",
        description: "The event has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete event. ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle event edit
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };
  
  // Handle event creation success
  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
  };
  
  // Handle event edit success
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedEvent(null);
  };
  
  // Handle event delete
  const handleDeleteEvent = (eventId: string) => {
    deleteEventMutation.mutate(eventId);
  };
  
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-28">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display">Manage Events</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusIcon size={16} /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill out the form below to create a new event for the chess society.
                </DialogDescription>
              </DialogHeader>
              <EventForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Event listing */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center p-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No events found</h3>
              <p className="mt-1 text-gray-500">Get started by creating a new event.</p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {events.map((event) => (
                    <tr 
                      key={event._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{event.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.type === 'Tournament' ? 'bg-accent/20 text-accent' : 
                          event.type === 'Workshop' ? 'bg-primary/20 text-primary' : 
                          event.type === 'Social' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {event.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(event.date), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.timeStart} - {event.timeEnd}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap truncate max-w-[200px]">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary-dark mr-2"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit2Icon size={16} />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2Icon size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Event</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{event.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteEvent(event._id!)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      {/* Edit Event Dialog */}
      {selectedEvent && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Update the event details below.
              </DialogDescription>
            </DialogHeader>
            <EventForm event={selectedEvent} onSuccess={handleEditSuccess} />
          </DialogContent>
        </Dialog>
      )}
      
      <Footer />
    </>
  );
}