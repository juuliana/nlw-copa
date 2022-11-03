import { CSSProperties } from "react";
import { toast, ToastOptions } from "react-toastify";

export const BODY_STYLE: CSSProperties = {
  color: "black",
  fontWeight: 600,
  fontSize: 12,
  textAlign: "center",
};

export const OPTIONS: ToastOptions = {
  position: "top-center",
  bodyStyle: BODY_STYLE,
};

export function success({ message }) {
  return toast.success(message, OPTIONS);
}

export function error({ message }) {
  return toast.error(message, OPTIONS);
}
