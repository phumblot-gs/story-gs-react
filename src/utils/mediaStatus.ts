
// Media status codes
export enum MediaStatus {
  IGNORED = 1,
  TO_RESHOOT = 5,
  NOT_SELECTED = 10,
  SELECTED = 30,
  REFUSED_1 = 31,
  REFUSED_2 = 35,
  SUBMITTED_FOR_APPROVAL = 40,
  VALIDATED = 50,
  READY_TO_BROADCAST = 51,
  ERROR_DURING_BROADCAST = 52,
  BROADCAST = 55,
  ARCHIVED = 80
}

// Media status names
export const mediaStatusNames: Record<MediaStatus, string> = {
  [MediaStatus.IGNORED]: "Ignored",
  [MediaStatus.TO_RESHOOT]: "To Reshoot",
  [MediaStatus.NOT_SELECTED]: "Not Selected",
  [MediaStatus.SELECTED]: "Selected",
  [MediaStatus.REFUSED_1]: "Refused",
  [MediaStatus.REFUSED_2]: "Refused",
  [MediaStatus.SUBMITTED_FOR_APPROVAL]: "Submitted for Approval",
  [MediaStatus.VALIDATED]: "Validated",
  [MediaStatus.READY_TO_BROADCAST]: "Ready to Broadcast",
  [MediaStatus.ERROR_DURING_BROADCAST]: "Error During Broadcast",
  [MediaStatus.BROADCAST]: "Broadcast",
  [MediaStatus.ARCHIVED]: "Archived"
};

// Map media status codes to CSS status classes (renamed from colors to status names)
export const getMediaStatusColorClass = (status: MediaStatus): string => {
  switch (status) {
    case MediaStatus.IGNORED:
      return "status-ignored";
    case MediaStatus.TO_RESHOOT:
      return "status-reshoot";
    case MediaStatus.NOT_SELECTED:
      return "status-not-selected";
    case MediaStatus.SELECTED:
      return "status-selected";
    case MediaStatus.REFUSED_1:
    case MediaStatus.REFUSED_2:
      return "status-refused";
    case MediaStatus.SUBMITTED_FOR_APPROVAL:
      return "status-for-approval";
    case MediaStatus.VALIDATED:
      return "status-validated";
    case MediaStatus.READY_TO_BROADCAST:
      return "status-to-publish";
    case MediaStatus.ERROR_DURING_BROADCAST:
      return "status-error";
    case MediaStatus.BROADCAST:
    case MediaStatus.ARCHIVED:
      return "status-published";
    default:
      return "status-not-selected";
  }
};

// Get color class for a status dot indicator
export const getStatusDotClass = (status: MediaStatus): string => {
  return getMediaStatusColorClass(status);
};

// Determine if the icon should be white or black based on status background color
export const shouldUseWhiteIcon = (status: MediaStatus): boolean => {
  // Dark backgrounds that need white icons for better contrast
  const darkBackgrounds = [
    MediaStatus.TO_RESHOOT,      // Purple
    MediaStatus.REFUSED_1,       // Grey strongest
    MediaStatus.REFUSED_2,       // Grey strongest
    MediaStatus.BROADCAST,       // Braun
    MediaStatus.ARCHIVED,        // Braun
    MediaStatus.ERROR_DURING_BROADCAST // Error (red)
  ];
  
  return darkBackgrounds.includes(status);
};

// Usage example for component:
// <div className={`w-3 h-3 rounded-full ${getStatusDotClass(mediaStatus)}`}></div>
