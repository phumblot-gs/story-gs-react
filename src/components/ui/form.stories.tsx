import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout, VStack } from "@/components/layout";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "./form";
import { Input } from "./input";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { toast } from "./sonner";
import { Toaster } from "./sonner";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Form Component

The Form component provides a complete form solution built on top of **react-hook-form** and **zod** for validation.

### Features

- **Type-safe forms** with TypeScript and Zod schemas
- **Automatic validation** with error messages
- **Accessible** form fields with proper ARIA attributes
- **Flexible** - works with all form components (Input, Select, Checkbox, etc.)

### Components

- **Form**: Wrapper component (FormProvider from react-hook-form)
- **FormField**: Connects a field to the form state
- **FormItem**: Container for a single form field
- **FormLabel**: Label for the field, automatically linked
- **FormControl**: Wrapper for the input component
- **FormDescription**: Helper text displayed below the field
- **FormMessage**: Error message displayed when validation fails
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Layout bg="white" padding={6}>
          <Story />
        </Layout>
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Form>;

// Schema for basic form example
const basicFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

// Schema for required fields example
const requiredFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
});

// Schema for form with descriptions
const descriptionFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

// Schema for validation with toast
const toastFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const BasicForm: Story = {
  render: () => {
    const BasicFormComponent = () => {
      const form = useForm<z.infer<typeof basicFormSchema>>({
        resolver: zodResolver(basicFormSchema),
        defaultValues: {
          username: "",
          email: "",
        },
      });

      const onSubmit = (data: z.infer<typeof basicFormSchema>) => {
        console.log("Form submitted:", data);
        toast({
          type: "success",
          title: "Form submitted successfully",
          description: `Username: ${data.username}, Email: ${data.email}`,
        });
      };

      return (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Basic Form</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      );
    };

    return <BasicFormComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: "A basic form with two fields (username and email) using react-hook-form and zod validation.",
      },
    },
  },
};

export const RequiredFields: Story = {
  render: () => {
    const RequiredFieldsComponent = () => {
      const form = useForm<z.infer<typeof requiredFormSchema>>({
        resolver: zodResolver(requiredFormSchema),
        defaultValues: {
          name: "",
          email: "",
          phone: "",
        },
      });

      const onSubmit = (data: z.infer<typeof requiredFormSchema>) => {
        console.log("Form submitted:", data);
        toast({
          type: "success",
          title: "Form submitted",
          description: `Name: ${data.name}, Email: ${data.email}`,
        });
      };

      return (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Required Fields</h3>
          <p className="text-sm text-grey-stronger mb-4">
            Fields marked with <span className="text-destructive">*</span> are required.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" required {...field} />
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
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+33 6 12 34 56 78" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      );
    };

    return <RequiredFieldsComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows how to mark required fields with an asterisk (*) and the HTML \`required\` attribute.

**Tips:**
- Add \`<span className="text-destructive">*</span>\` to the FormLabel for visual indication
- Use the HTML \`required\` attribute on the Input for browser validation
- Combine with Zod validation for server-side validation
        `,
      },
    },
  },
};

export const WithFormDescription: Story = {
  render: () => {
    const DescriptionFormComponent = () => {
      const form = useForm<z.infer<typeof descriptionFormSchema>>({
        resolver: zodResolver(descriptionFormSchema),
        defaultValues: {
          username: "",
          email: "",
        },
      });

      const onSubmit = (data: z.infer<typeof descriptionFormSchema>) => {
        console.log("Form submitted:", data);
        toast({
          type: "success",
          title: "Account created",
          description: `Welcome ${data.username}!`,
        });
      };

      return (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Form with Help Text</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a unique username between 3 and 20 characters. This will be your public display name.
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      We'll never share your email with anyone else. Used for account recovery and notifications.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit">Create Account</Button>
            </form>
          </Form>
        </div>
      );
    };

    return <DescriptionFormComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows how to use \`FormDescription\` to provide helpful context and guidance to users.

**Use FormDescription for:**
- Explaining what the field is used for
- Providing format examples
- Clarifying optional vs required fields
- Giving privacy or security information

**Best practices:**
- Keep descriptions concise and actionable
- Use simple language
- Place examples in the placeholder when possible
        `,
      },
    },
  },
};

export const ValidationWithToast: Story = {
  render: () => {
    const ToastValidationComponent = () => {
      const form = useForm<z.infer<typeof toastFormSchema>>({
        resolver: zodResolver(toastFormSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      });

      const onSubmit = (data: z.infer<typeof toastFormSchema>) => {
        console.log("Form submitted:", data);
        toast({
          type: "success",
          title: "Login successful",
          description: "Welcome back!",
        });
      };

      const onError = (errors: any) => {
        // Show toast for validation errors
        const firstError = Object.values(errors)[0] as any;
        if (firstError?.message) {
          toast({
            type: "error",
            title: "Validation error",
            description: firstError.message,
          });
        } else {
          toast({
            type: "error",
            title: "Form validation failed",
            description: "Please check the form fields and try again.",
          });
        }
      };

      return (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Validation with Toast</h3>
          <p className="text-sm text-grey-stronger mb-4">
            This form shows validation errors both inline (FormMessage) and as toast notifications.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit">Login</Button>
            </form>
          </Form>
        </div>
      );
    };

    return <ToastValidationComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows how to display validation errors in a toast notification when form submission fails.

**Implementation:**
- Use the \`onError\` callback in \`handleSubmit\`
- Extract error messages from the errors object
- Display them using the \`toast\` function
- Keep inline errors (FormMessage) for accessibility

**Best practices:**
- Show toast for general form errors or first field error
- Keep FormMessage for field-specific errors
- Use toast type "error" for validation failures
- Provide actionable error messages
        `,
      },
    },
  },
};

export const CompleteExample: Story = {
  render: () => {
    const completeSchema = z.object({
      name: z.string().min(2, { message: "Name must be at least 2 characters." }),
      email: z.string().email({ message: "Please enter a valid email." }),
      bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).optional(),
      newsletter: z.boolean().default(false),
    });

    const CompleteFormComponent = () => {
      const form = useForm<z.infer<typeof completeSchema>>({
        resolver: zodResolver(completeSchema),
        defaultValues: {
          name: "",
          email: "",
          bio: "",
          newsletter: false,
        },
      });

      const onSubmit = (data: z.infer<typeof completeSchema>) => {
        console.log("Form submitted:", data);
        toast({
          type: "success",
          title: "Profile updated",
          description: "Your changes have been saved.",
        });
      };

      return (
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Complete Form Example</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Full Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" required {...field} />
                    </FormControl>
                    <FormDescription>
                      Your full name as it appears on official documents.
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
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" required {...field} />
                    </FormControl>
                    <FormDescription>
                      We'll use this email to send you important updates.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input placeholder="Tell us about yourself..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional. A brief description about yourself (minimum 10 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer !leading-normal">
                        Subscribe to newsletter
                      </FormLabel>
                      <FormDescription>
                        Receive monthly updates about new features and tips.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>
      );
    };

    return <CompleteFormComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: `
A complete form example showing all the features together:
- Required fields with asterisk indicator
- Optional fields
- FormDescription for help text
- FormMessage for validation errors
- Multiple field types (text, email, checkbox)
- Form reset functionality
        `,
      },
    },
  },
};

