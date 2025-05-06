import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string({
    required_error: "Please select a subject",
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormValues) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Message Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    contactMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-2xl font-bold font-display mb-6">Send Us a Message</h3>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="John Smith" 
                  {...field} 
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="john.smith@example.com" 
                  {...field} 
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="membership">Membership Inquiry</SelectItem>
                  <SelectItem value="event">Event Information</SelectItem>
                  <SelectItem value="tournament">Tournament Registration</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your message here..." 
                  className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-accent text-primary hover:bg-white hover:text-primary transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  );
}
