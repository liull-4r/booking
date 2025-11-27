import { toast } from "react-toastify";

export const handleApiError = (
  error: any,
  fallbackMessage = "Something went wrong"
) => {
  const status = error?.status;
  const data = error?.data ?? {};

  if (Array.isArray(data?.message)) {
    (data.message as unknown[]).forEach((msg) => toast.error(String(msg)));
    return;
  }

  if (data?.errors && typeof data.errors === "object") {
    Object.values<any>(data.errors).forEach((val) => {
      if (Array.isArray(val)) {
        val.forEach((m) => toast.error(String(m)));
      } else if (typeof val === "string") {
        toast.error(val);
      }
    });
    return;
  }

  let message = fallbackMessage;

  if (status) {
    switch (status) {
      case 400:
        message = data?.message || "Bad Request";
        break;
      case 401:
        message = data?.message || "Unauthorized. Please log in.";
        break;
      case 403:
        message = data?.message || "Access denied.";
        break;
      case 404:
        message = data?.message || "Not found.";
        break;
      case 409:
        message = data?.message || "Conflict.";
        break;
      case 422:
        message = data?.message || "Validation failed.";
        break;
      case 500:
        message = data?.message || "Internal server error.";
        break;
      default:
        message = data?.message || `Unexpected error (${status})`;
    }
  } else if (typeof data?.message === "string") {
    message = data.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (error?.error) {
    message = error.error;
  }

  toast.error(message);
};
