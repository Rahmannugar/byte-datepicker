import {
  KeyboardEvent,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";

interface PickerPopoverProps {
  open: boolean;
  sourceRef: RefObject<HTMLDivElement | null>;
  onDismiss: () => void;
  dark: boolean;
  ariaLabel: string;
  children: ReactNode;
}

const focusableSelector = [
  "button:not([disabled])",
  "select:not([disabled])",
  "input:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function PickerPopover({
  open,
  sourceRef,
  onDismiss,
  dark,
  ariaLabel,
  children,
}: PickerPopoverProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => dropdownRef.current?.focus());

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        !sourceRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        onDismiss();
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      previousFocusRef.current?.focus();
    };
  }, [open, onDismiss, sourceRef]);

  if (!open || typeof document === "undefined") return null;

  const portalTarget =
    sourceRef.current?.closest("dialog, [role='dialog']") ?? document.body;

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dropdownRef.current) return;
    const focusable = Array.from(
      dropdownRef.current.querySelectorAll<HTMLElement>(focusableSelector)
    );
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (document.activeElement === dropdownRef.current) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className={`byte-picker-portal ${dark ? "byte-dark" : ""}`}>
      <div className="byte-overlay" aria-hidden="true" />
      <div
        className="byte-dropdown"
        ref={dropdownRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        onKeyDown={trapFocus}
      >
        {children}
      </div>
    </div>,
    portalTarget
  );
}
