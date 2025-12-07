// src/lib/notify.ts
import { toast } from "sonner";

type PromiseToastOptions<T> = {
  loading: string;
  success: (data: T) => string | undefined | null;
  error: (err: any) => string | undefined | null;
};

// Call toast.promise for side-effects and return the original promise.
// Avoid marking this function `async` so the return type stays Promise<T>.
export function promiseToast<T>(
  promise: Promise<T>,
  opts: PromiseToastOptions<T>
): Promise<T> {
  toast.promise(promise as Promise<any>, {
    loading: opts.loading,
    success: (d: any) => opts.success(d) ?? undefined,
    error: (e: any) => opts.error(e) ?? undefined,
  });

  // Return the original promise so callers receive the expected T
  return promise;
}

const notify = {
  success: (msg: string, opts = {}) => toast.success(String(msg), opts),
  error: (msg: string, opts = {}) => toast.error(String(msg), opts),
  info: (msg: string, opts = {}) => toast(String(msg), opts),
  default: (msg: string, opts = {}) => toast(String(msg), opts),
  promise: promiseToast,
};

export default notify;