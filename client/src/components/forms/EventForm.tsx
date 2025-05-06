import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Schema for event form validation
const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.string().min(1, "Please select an event type"),
  date: z.date({ required_error: "Please select a date" }),
  timeStart: z.string().min(1, "Please provide a start time"),
  timeEnd: z.string().min(1, "Please provide an end time"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location must be at least 3 characters")
});

// Type for form values
type EventFormValues = z.infer<typeof eventFormSchema>;

// Type for event data from the server
export interface Event {
  _id?: string;
  title: string;
  type: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  description: string;
  location: string;
}

interface EventFormProps {
  event?: Event;
  onSuccess?: () => void;
}

export default function EventForm({ event, onSuccess }: EventFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Default form values
  const defaultValues: Partial<EventFormValues> = {
    title: event?.title || "",
    type: event?.type || "",
    date: event?.date ? new Date(event.date) : undefined,
    timeStart: event?.timeStart || "",
    timeEnd: event?.timeEnd || "",
    description: event?.description || "",
    location: event?.location || ""
  };
  
  // Initialize form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues
  });

  // Create or update event mutation
  const mutation = useMutation({
    mutationFn: (data: EventFormValues) => {
      // Format date to ISO string YYYY-MM-DD
      const formattedData = {
        ...data,
        date: format(data.date, "yyyy-MM-dd")
      };
      
      if (event?._id) {
        // Update existing event
        return apiRequest(`/api/events/${event._id}`, {
          method: "PUT",
          body: JSON.stringify(formattedData)
        });
      } else {
        // Create new event
        return apiRequest("/api/events", {
          method: "POST",
          body: JSON.stringify(formattedData)
        });
      }
    },
    onSuccess: () => {
      // Show success message
      toast({
        title: event?._id ? "Event Updated" : "Event Created",
        description: event?._id 
          ? "The event has been updated successfully." 
          : "The event has been created successfully.",
      });
      
      // Reset form if creating new event
      if (!event?._id) {
        form.reset();
      }
      
      // Invalidate events query cache
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      // Show error message
      toast({
        title: "Error",
        description: `Failed to ${event?._id ? "update" : "create"} event. ${error.message}`,
        variant: "destructive"
      });
    }
  });

  function onSubmit(data: EventFormValues) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Spring Chess Tournament" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Event type field */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Tournament">Tournament</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Regular">Regular Meeting</SelectItem>
                  <SelectItem value="Social">Social Gathering</SelectItem>
                  <SelectItem value="Special">Special Event</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Event date field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Time fields - start and end */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="timeStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timeEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Description field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide details about this event..." 
                  className="min-h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Location field */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Student Union, Room 305" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 
            "Saving..." : 
            event?._id ? "Update Event" : "Create Event"
          }
        </Button>
      </form>
    </Form>
  );
}