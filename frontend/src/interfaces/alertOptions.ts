export interface AlertOptions {
  message: string;
  type?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "light"
    | "danger"
    | "dark";
  duration?: number;
  dismissible?: boolean;
}
