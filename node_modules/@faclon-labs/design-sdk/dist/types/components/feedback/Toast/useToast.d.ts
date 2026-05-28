import type { ToastContextValue } from './types';
/** Imperative Toast API. Mount a `<ToastContainer />` at the app root, then
 *  call `toast.show({ ... })` / `toast.dismiss(id?)` from any descendant. */
export declare function useToast(): ToastContextValue;
