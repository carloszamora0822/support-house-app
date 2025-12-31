import toast, { type ToastOptions } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { createElement } from 'react';

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    borderRadius: '0.5rem',
    padding: '1rem',
    fontSize: '0.875rem',
  },
};

export const notify = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      ...defaultOptions,
      ...options,
      icon: createElement(CheckCircle2, { className: 'h-5 w-5 text-status-success' }),
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      ...defaultOptions,
      duration: 6000,
      ...options,
      icon: createElement(XCircle, { className: 'h-5 w-5 text-status-error' }),
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: createElement(AlertCircle, { className: 'h-5 w-5 text-status-warning' }),
      style: {
        ...defaultOptions.style,
        backgroundColor: '#fef3c7',
        color: '#92400e',
      },
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: createElement(Info, { className: 'h-5 w-5 text-status-info' }),
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, messages, {
      ...defaultOptions,
      ...options,
    });
  },

  hipaaSuccess: (action: string) => {
    return notify.success(`${action} completed successfully`);
  },

  hipaaError: (action: string) => {
    return notify.error(`Failed to ${action}. Please try again or contact support.`);
  },
};
