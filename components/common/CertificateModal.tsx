"use client";

import { X } from "lucide-react";

export type CertificateModalProps = {
  isOpen: boolean;
  imageUrl?: string;
  title?: string;
  onClose: () => void;
};

export function CertificateModal({ isOpen, imageUrl, title, onClose }: CertificateModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-4xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="absolute -top-12 right-0 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          onClick={onClose}
        >
          <span className="text-sm">Close</span>
          <X className="w-5 h-5" />
        </button>
        {title && <h2 className="text-white text-lg font-semibold mb-4 text-center">{title}</h2>}
        {imageUrl ? (
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title ?? "Certificate"}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-white/10 border border-white/20 p-12 text-center text-white/60">
            No certificate image available.
          </div>
        )}
      </div>
    </div>
  );
}
