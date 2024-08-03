export interface AlertOptions {
  message: string;
  type?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  duration?: number;
  dismissible?: boolean;
}
