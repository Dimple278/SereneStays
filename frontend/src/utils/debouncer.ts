// Debouncing utility function
let debounceTimer: NodeJS.Timeout;
export const debounce = (func: Function, delay: number) => {
  return (...args: any[]) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
};
