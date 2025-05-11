
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).max(160, { message: "Bio must not exceed 160 characters." }),
  role: z.string({
    required_error: "Please select a role.",
  }),
  expertise: z.number().min(1).max(100),
  notifications: z.boolean().default(false),
  newsletter: z.boolean(),
  communication: z.enum(["email", "sms", "push"], {
    required_error: "You need to select a communication method.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
});

// Background context for form components
type BackgroundType = "white" | "black" | "grey";
const backgrounds: BackgroundType[] = ["white", "black", "grey"];

// Define the FormTestSection component
const FormComponentsTestSection: React.FC = () => {
  // For the background tabs
  const [selectedBackground, setSelectedBackground] = useState<BackgroundType>("white");
  
  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      expertise: 50,
      notifications: false,
      newsletter: false,
      communication: "email",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    alert("Form submitted! Check console for values.");
  };

  // For demonstrating non-form components
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchValue, setSwitchValue] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">Form Components</h2>
        <p className="text-muted-foreground mb-6">
          These are all the available form components with different background variants.
        </p>
      </div>

      <Tabs defaultValue="white" onValueChange={(value) => setSelectedBackground(value as BackgroundType)}>
        <TabsList>
          <TabsTrigger value="white">White Background</TabsTrigger>
          <TabsTrigger value="black">Black Background</TabsTrigger>
          <TabsTrigger value="grey">Grey Background</TabsTrigger>
        </TabsList>
        
        {backgrounds.map((bg) => (
          <TabsContent key={bg} value={bg} className={cn(
            "p-6 rounded-lg mt-4",
            bg === "white" && "bg-white",
            bg === "black" && "bg-black",
            bg === "grey" && "bg-grey"
          )}>
            {/* Basic components showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label className={bg === "black" ? "text-white" : "text-black"}>Input</Label>
                  <div className="mt-2">
                    <Input background={bg} placeholder="Enter your text here" />
                  </div>
                </div>
                
                <div>
                  <Label className={bg === "black" ? "text-white" : "text-black"}>Textarea</Label>
                  <div className="mt-2">
                    <Textarea background={bg} placeholder="Write your message here" />
                  </div>
                </div>
                
                <div>
                  <Label className={bg === "black" ? "text-white" : "text-black"}>Select</Label>
                  <div className="mt-2">
                    <Select>
                      <SelectTrigger background={bg}>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent background={bg}>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className={bg === "black" ? "text-white" : "text-black"}>Slider</Label>
                  <div className="mt-2">
                    <Slider 
                      background={bg}
                      value={sliderValue} 
                      onValueChange={setSliderValue} 
                      max={100} 
                      step={1} 
                    />
                    <p className={cn(
                      "text-sm mt-1",
                      bg === "black" ? "text-white" : "text-muted-foreground"
                    )}>
                      Value: {sliderValue}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className={bg === "black" ? "text-white" : "text-black"}>Switch</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Switch
                      background={bg}
                      checked={switchValue}
                      onCheckedChange={setSwitchValue}
                    />
                    <span className={cn(
                      "text-sm",
                      bg === "black" ? "text-white" : "text-muted-foreground"
                    )}>
                      {switchValue ? "On" : "Off"}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label className={bg === "black" ? "text-white" : "text-black"}>Checkbox</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox background={bg} id={`terms-${bg}`} />
                    <label
                      htmlFor={`terms-${bg}`}
                      className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        bg === "black" ? "text-white" : "text-black"
                      )}
                    >
                      Accept terms and conditions
                    </label>
                  </div>
                </div>
                
                <div>
                  <Label className={bg === "black" ? "text-white" : "text-black"}>Radio Group</Label>
                  <div className="mt-2">
                    <RadioGroup defaultValue="option1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem background={bg} value="option1" id={`option1-${bg}`} />
                        <label 
                          htmlFor={`option1-${bg}`}
                          className={bg === "black" ? "text-white" : "text-black"}
                        >
                          Option 1
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem background={bg} value="option2" id={`option2-${bg}`} />
                        <label 
                          htmlFor={`option2-${bg}`}
                          className={bg === "black" ? "text-white" : "text-black"}
                        >
                          Option 2
                        </label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div>
                  <Label className={bg === "black" ? "text-white" : "text-black"}>Button</Label>
                  <div className="mt-2 space-x-2">
                    <Button 
                      variant="default" 
                      background={bg as any}
                    >
                      Default Button
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Complete form example */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Complete Form Example with {selectedBackground} Background</h2>
        <div className={cn(
          "p-6 rounded-lg border",
          selectedBackground === "white" && "bg-white",
          selectedBackground === "black" && "bg-black", 
          selectedBackground === "grey" && "bg-grey"
        )}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={selectedBackground === "black" ? "text-white" : ""}>Name</FormLabel>
                      <FormControl>
                        <Input background={selectedBackground} placeholder="Your name" {...field} />
                      </FormControl>
                      <FormDescription className={selectedBackground === "black" ? "text-gray-400" : ""}>
                        Enter your full name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={selectedBackground === "black" ? "text-white" : ""}>Email</FormLabel>
                      <FormControl>
                        <Input background={selectedBackground} placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormDescription className={selectedBackground === "black" ? "text-gray-400" : ""}>
                        Your email will not be shared.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={selectedBackground === "black" ? "text-white" : ""}>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        background={selectedBackground}
                        placeholder="Tell us a bit about yourself" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className={selectedBackground === "black" ? "text-gray-400" : ""}>
                      Brief description for your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={selectedBackground === "black" ? "text-white" : ""}>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger background={selectedBackground}>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent background={selectedBackground}>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className={selectedBackground === "black" ? "text-gray-400" : ""}>
                        Your role in the system
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={selectedBackground === "black" ? "text-white" : ""}>Expertise Level (1-100)</FormLabel>
                      <FormControl>
                        <Slider
                          background={selectedBackground}
                          min={1}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <FormDescription className={cn(
                        "flex justify-between",
                        selectedBackground === "black" ? "text-gray-400" : ""
                      )}>
                        <span>Beginner</span>
                        <span>Current: {field.value}</span>
                        <span>Expert</span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="notifications"
                  render={({ field }) => (
                    <FormItem className={cn(
                      "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",
                      selectedBackground === "black" ? "border-gray-700" : ""
                    )}>
                      <FormControl>
                        <Switch
                          background={selectedBackground}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className={selectedBackground === "black" ? "text-white" : ""}>Enable Notifications</FormLabel>
                        <FormDescription className={selectedBackground === "black" ? "text-gray-400" : ""}>
                          Receive notifications about account activity.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className={selectedBackground === "black" ? "text-white" : ""}>Select Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              background={selectedBackground as any}
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
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription className={selectedBackground === "black" ? "text-gray-400" : ""}>
                        Select an important date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        background={selectedBackground}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className={selectedBackground === "black" ? "text-white" : ""}>Subscribe to newsletter</FormLabel>
                      <FormDescription className={selectedBackground === "black" ? "text-gray-400" : ""}>
                        Receive emails about new features and updates.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="communication"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className={selectedBackground === "black" ? "text-white" : ""}>Preferred Communication</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem background={selectedBackground} value="email" />
                          </FormControl>
                          <FormLabel className={cn(
                            "font-normal",
                            selectedBackground === "black" ? "text-white" : ""
                          )}>
                            Email
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem background={selectedBackground} value="sms" />
                          </FormControl>
                          <FormLabel className={cn(
                            "font-normal",
                            selectedBackground === "black" ? "text-white" : ""
                          )}>
                            SMS
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem background={selectedBackground} value="push" />
                          </FormControl>
                          <FormLabel className={cn(
                            "font-normal",
                            selectedBackground === "black" ? "text-white" : ""
                          )}>
                            Push Notification
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                background={selectedBackground as any} 
                type="submit" 
                className="w-full md:w-auto"
              >
                Submit Form
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default FormComponentsTestSection;
