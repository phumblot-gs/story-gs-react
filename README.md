
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b47d4709-f8a9-430e-9c62-c4333e7b5f50

## Components

### Media Status Components

The project includes components for handling media statuses:

#### StatusIndicator

A visual indicator that shows the status of a media item using color-coded dots:

```jsx
import StatusIndicator from "@/components/StatusIndicator";
import { MediaStatus } from "@/utils/mediaStatus";

// Example usage
<StatusIndicator status={MediaStatus.VALIDATED} size="md" />
```

#### ButtonStatus

Buttons that allow changing the status of a media item, with appropriate color coding and icons:

```jsx
import ButtonStatus from "@/components/ButtonStatus";
import { MediaStatus } from "@/utils/mediaStatus";

// Example usage - Approve button
<ButtonStatus 
  status={MediaStatus.VALIDATED} 
  icon="check"
  onClick={() => handleStatusChange(MediaStatus.VALIDATED)} 
/>

// Example usage - Reject button
<ButtonStatus 
  status={MediaStatus.REFUSED_1} 
  icon="x"
  onClick={() => handleStatusChange(MediaStatus.REFUSED_1)} 
/>

// Active state (when media already has this status)
<ButtonStatus 
  status={MediaStatus.VALIDATED} 
  icon="check"
  isActive={true}
/>

// Disabled state
<ButtonStatus 
  status={MediaStatus.VALIDATED} 
  icon="check"
  disabled={true}
/>
```

The ButtonStatus component has three states:
- Default: White background with status-colored icon
- Hover/Active: Status-colored background with white icon
- Disabled: Grey styling

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b47d4709-f8a9-430e-9c62-c4333e7b5f50) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b47d4709-f8a9-430e-9c62-c4333e7b5f50) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
