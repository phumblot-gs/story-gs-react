
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

// Map media status codes to CSS color classes
export const getMediaStatusColorClass = (status: MediaStatus): string => {
  switch (status) {
    case MediaStatus.IGNORED:
      return "status-grey";
    case MediaStatus.TO_RESHOOT:
      return "status-purple";
    case MediaStatus.NOT_SELECTED:
      return "status-transparent";
    case MediaStatus.SELECTED:
      return "status-blue";
    case MediaStatus.REFUSED_1:
    case MediaStatus.REFUSED_2:
      return "status-grey-strongest";
    case MediaStatus.SUBMITTED_FOR_APPROVAL:
      return "status-yellow";
    case MediaStatus.VALIDATED:
      return "status-validated";
    case MediaStatus.READY_TO_BROADCAST:
      return "status-khaki";
    case MediaStatus.ERROR_DURING_BROADCAST:
      return "status-error";
    case MediaStatus.BROADCAST:
    case MediaStatus.ARCHIVED:
      return "status-braun";
    default:
      return "status-transparent";
  }
};

// Get color class for a status dot indicator
export const getStatusDotClass = (status: MediaStatus): string => {
  return getMediaStatusColorClass(status);
};

// Usage example for component:
// <div className={`w-3 h-3 rounded-full ${getStatusDotClass(mediaStatus)}`}></div>
