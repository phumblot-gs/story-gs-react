import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Checkbox } from "./checkbox";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
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

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Label component built with Radix UI. The Label automatically adapts its text color based on the parent background context via \`data-bg\`.

## Features

- Automatic context-aware styling based on parent background (white/grey/black)
- Proper accessibility with \`htmlFor\` attribute linking to form controls
- Works with all form components (Input, Textarea, Select, Checkbox, RadioGroup)
- Support for required field indicators

## Basic Usage

\`\`\`tsx
import { Label, Input, Layout } from '@story-gs-react';

<Layout bg="white">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</Layout>
\`\`\`

## Required Fields

To indicate that a field is required, add an asterisk (\`*\`) inside the Label:

\`\`\`tsx
<Label htmlFor="email">
  Email <span className="text-destructive">*</span>
</Label>
<Input id="email" type="email" required />
\`\`\`

**Best practices:**
- Use \`text-destructive\` class for the asterisk to match error styling
- Combine with HTML \`required\` attribute on the input for browser validation
- Use with Zod validation in forms for server-side validation

## With Different Form Components

The Label component works seamlessly with all form components:

### With Input
\`\`\`tsx
<Label htmlFor="username">Username</Label>
<Input id="username" />
\`\`\`

### With Textarea
\`\`\`tsx
<Label htmlFor="bio">Bio</Label>
<Textarea id="bio" />
\`\`\`

### With Select
\`\`\`tsx
<Label htmlFor="country">Country</Label>
<Select>
  <SelectTrigger id="country">
    <SelectValue placeholder="Select a country" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="fr">France</SelectItem>
  </SelectContent>
</Select>
\`\`\`

### With Checkbox
\`\`\`tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
\`\`\`

### With RadioGroup
\`\`\`tsx
<RadioGroup>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
</RadioGroup>
\`\`\`

## Context-Aware Styling

The Label automatically adapts its text color based on the parent Layout background:

- **White background**: Black text (\`#292828\`)
- **Grey background**: Black text (\`#292828\`)
- **Black background**: White text (\`#ffffff\`)

This is handled automatically via the \`data-bg\` attribute system.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    htmlFor: {
      control: "text",
      description: "ID of the form control this label is associated with",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes",
    },
    children: {
      control: "text",
      description: "Label text content",
    },
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={4}>
        <Story />
      </Layout>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Label",
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col w-[300px]">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Label associated with an Input field using the htmlFor attribute.",
      },
    },
  },
};

export const RequiredField: Story = {
  render: () => {
    const requiredFieldSchema = z.object({ 
      email: z.string().email({ message: "Please enter a valid email." })
    });

    const RequiredFieldComponent = () => {
      const form = useForm<z.infer<typeof requiredFieldSchema>>({
        resolver: zodResolver(requiredFieldSchema),
        defaultValues: { email: "" },
      });

      return (
        <div className="w-[300px]">
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input id="required-email" type="email" placeholder="john@example.com" required {...field} />
                    </FormControl>
                    <FormDescription>
                      Fields marked with <span className="text-destructive">*</span> are required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      );
    };

    return <RequiredFieldComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows how to mark a required field with an asterisk (*).

**Implementation:**
- Add \`<span className="text-destructive">*</span>\` inside the Label
- Use the HTML \`required\` attribute on the Input
- Combine with form validation (Zod, react-hook-form) for complete validation

**Accessibility:**
- The asterisk provides visual indication
- The \`required\` attribute provides semantic information for screen readers
        `,
      },
    },
  },
};

export const WithCheckbox: Story = {
  render: () => (
    <VStack gap={4} className="w-[300px]">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" />
        <Label htmlFor="newsletter">
          Subscribe to newsletter <span className="text-destructive">*</span>
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing">Receive marketing emails (optional)</Label>
      </div>
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Shows Label used with Checkbox components.

**Layout:**
- Use flexbox with \`flex items-center space-x-2\` for horizontal alignment
- Place the Checkbox first, then the Label
- The Label should be clickable to toggle the checkbox (via \`htmlFor\`)

**Pattern:**
\`\`\`tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>
\`\`\`
        `,
      },
    },
  },
};

export const WithRadioButtons: Story = {
  render: () => (
    <div className="w-[300px]">
      <Label className="mb-3 block">Preferred Communication</Label>
      <RadioGroup defaultValue="email">
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="email" id="radio-email" />
          <Label htmlFor="radio-email">Email</Label>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="sms" id="radio-sms" />
          <Label htmlFor="radio-sms">SMS</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="push" id="radio-push" />
          <Label htmlFor="radio-push">Push Notification</Label>
        </div>
      </RadioGroup>
      
      <div className="mt-6 pt-4 border-t">
        <Label className="mb-3 block">
          Payment Method <span className="text-destructive">*</span>
        </Label>
        <RadioGroup defaultValue="credit">
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="credit" id="radio-credit" />
            <Label htmlFor="radio-credit">Credit Card</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="paypal" id="radio-paypal" />
            <Label htmlFor="radio-paypal">PayPal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bank" id="radio-bank" />
            <Label htmlFor="radio-bank">Bank Transfer</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Shows Label used with RadioGroup components.

**Layout:**
- Use a parent Label for the group title (optional)
- Each RadioGroupItem has its own Label
- Use \`flex items-center space-x-2\` for horizontal alignment
- Stack multiple radio options vertically with spacing

**Pattern:**
\`\`\`tsx
<div>
  <Label className="mb-3 block">Group Title</Label>
  <RadioGroup>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option1" id="option1" />
      <Label htmlFor="option1">Option 1</Label>
    </div>
  </RadioGroup>
</div>
\`\`\`

**Accessibility:**
- Each RadioGroupItem needs a unique \`id\`
- The Label \`htmlFor\` must match the RadioGroupItem \`id\`
- Group label provides context for screen readers
        `,
      },
    },
  },
};

export const WithTextarea: Story = {
  render: () => {
    const textareaSchema = z.object({ 
      bio: z.string().optional(),
      description: z.string().min(10, { message: "Description must be at least 10 characters." })
    });

    const WithTextareaComponent = () => {
      const form = useForm<z.infer<typeof textareaSchema>>({
        resolver: zodResolver(textareaSchema),
        defaultValues: { bio: "", description: "" },
      });

      return (
        <div className="w-[300px]">
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="bio">Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="required-bio">
                      Description <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        id="required-bio" 
                        placeholder="Enter a description (minimum 10 characters)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This field is required and must be at least 10 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      );
    };

    return <WithTextareaComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: `
Shows Label used with Textarea components.

**Pattern:**
\`\`\`tsx
<div className="flex flex-col">
  <Label htmlFor="bio">Bio</Label>
  <Textarea id="bio" placeholder="Enter text..." />
</div>
\`\`\`

**Styling:**
- Use \`flex flex-col\` for vertical stacking
- Add \`min-h-[100px]\` or similar to control Textarea height
- Consider adding helper text below for longer descriptions
        `,
      },
    },
  },
};

export const WithSelect: Story = {
  render: () => (
    <VStack gap={4} className="w-[300px]">
      <div className="flex flex-col w-full">
        <Label htmlFor="country">Country</Label>
        <Select>
          <SelectTrigger id="country">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">France</SelectItem>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col w-full">
        <Label htmlFor="required-language">
          Language <span className="text-destructive">*</span>
        </Label>
        <Select>
          <SelectTrigger id="required-language">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Shows Label used with Select components.

**Pattern:**
\`\`\`tsx
<div className="flex flex-col">
  <Label htmlFor="select-id">Select Label</Label>
  <Select>
    <SelectTrigger id="select-id">
      <SelectValue placeholder="Choose..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
    </SelectContent>
  </Select>
</div>
\`\`\`

**Important:**
- The \`id\` should be on the SelectTrigger, not the Select wrapper
- Use \`flex flex-col\` for vertical stacking
- The Label \`htmlFor\` should match the SelectTrigger \`id\`
        `,
      },
    },
  },
};

export const WithBackgrounds: Story = {
  render: () => (
    <VStack gap={6} className="w-[400px]">
      <Layout bg="white" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium mb-2">Background: White</p>
          <Label htmlFor="white-input">Email</Label>
          <Input id="white-input" placeholder="john@example.com" />
        </VStack>
      </Layout>

      <Layout bg="grey" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium mb-2">Background: Grey</p>
          <Label htmlFor="grey-input">Email</Label>
          <Input id="grey-input" placeholder="john@example.com" />
        </VStack>
      </Layout>

      <Layout bg="black" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium mb-2 text-white">Background: Black</p>
          <Label htmlFor="black-input">Email</Label>
          <Input id="black-input" placeholder="john@example.com" />
        </VStack>
      </Layout>
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Shows how Label adapts its text color based on the parent Layout background.

**Automatic Adaptation:**
- **White background**: Label text is black
- **Grey background**: Label text is black
- **Black background**: Label text is white

This is handled automatically via the \`data-bg\` context system. No manual styling needed!
        `,
      },
    },
  },
};

export const MultipleRequiredFields: Story = {
  render: () => {
    const multipleRequiredSchema = z.object({
      name: z.string().min(1, { message: "Name is required." }),
      email: z.string().email({ message: "Please enter a valid email." }),
      phone: z.string().optional(),
      terms: z.boolean().refine(val => val === true, { message: "You must accept the terms." }),
    });

    const MultipleRequiredFieldsComponent = () => {
      const form = useForm<z.infer<typeof multipleRequiredSchema>>({
        resolver: zodResolver(multipleRequiredSchema),
        defaultValues: { name: "", email: "", phone: "", terms: false },
      });

      return (
        <div className="w-[400px]">
          <h3 className="text-lg font-semibold mb-4">Registration Form</h3>
          <Form {...form}>
            <form className="space-y-4">
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
                      Email Address <span className="text-destructive">*</span>
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+33 6 12 34 56 78" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="terms"
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
                        I agree to the terms and conditions <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormDescription>
                        Fields marked with <span className="text-destructive">*</span> are required.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      );
    };

    return <MultipleRequiredFieldsComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: `
Complete example showing multiple required fields in a form.

**Best Practices:**
- Use consistent asterisk styling (\`text-destructive\`)
- Add a note at the bottom explaining what the asterisk means
- Combine visual indicators with HTML \`required\` attributes
- Use with form validation libraries for complete validation
        `,
      },
    },
  },
};
