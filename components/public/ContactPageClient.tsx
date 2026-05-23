"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Sparkles, MessageCircle, CheckCircle2 } from "lucide-react";
import { detectSocialPlatform, formatPlatformLabel } from "@/lib/utils/detectSocialPlatform";
import { iconMap } from "@/lib/utils/iconMap";
import type { Contact } from "@/lib/cms/types";

export function ContactPageClient({ contact }: { contact: Contact }) {
  const contactInfo = contact.contactInfo ?? { email: "", phone: null, location: null };
  const socialLinks = Array.isArray(contact.socialLinks) ? contact.socialLinks : [];

  const [formValues, setFormValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formValues.name.trim()) next.name = "Name is required.";
    if (!formValues.email.trim()) next.email = "Email is required.";
    if (!formValues.subject.trim()) next.subject = "Subject is required.";
    if (!formValues.message.trim()) next.message = "Message is required.";
    if (formValues.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      next.email = "Enter a valid email.";
    }
    return next;
  };

  return (
    <div className="space-y-16 pb-16">
      <section className="relative pt-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1320]/60 border border-white/10 mb-6 animate-slide-in-left hover:scale-105 transition-transform">
          <MessageCircle className="w-4 h-4 text-[#C77DFF] animate-bounce-subtle" />
          <span className="text-sm font-medium text-[#C77DFF]">Get in Touch</span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in text-white">
          Let&apos;s{" "}
          <span className="gradient-text text-shimmer hover:animate-wiggle inline-block">
            Connect
          </span>
        </h1>
        <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto animate-slide-up">
          {contact.pageIntroText ||
            "Have a question or want to work together? I'd love to hear from you."}
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="group relative animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
            <div className="relative bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-600 ease-out">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15">
                  <Sparkles className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <h2 className="text-lg font-bold text-white">Contact Info</h2>
              </div>

              <div className="space-y-4">
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#0B1320]/50 hover:-translate-x-1 transition-all duration-300 group/item"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#C77DFF]/20 text-[#C77DFF] group-hover/item:bg-[#C77DFF]/30 group-hover/item:scale-110 transition-all">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider">Email</p>
                      <p className="text-sm font-medium text-[#C9D1D9]">{contactInfo.email}</p>
                    </div>
                  </a>
                )}

                {contactInfo.phone && (
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#0B1320]/50 hover:-translate-x-1 transition-all duration-300 group/item"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#C77DFF]/20 text-[#C77DFF] group-hover/item:bg-[#C77DFF]/30 group-hover/item:scale-110 transition-all">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider">Phone</p>
                      <p className="text-sm font-medium text-[#C9D1D9]">{contactInfo.phone}</p>
                    </div>
                  </a>
                )}

                {contactInfo.location && (
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#0B1320]/50 transition-colors group/item">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#C77DFF]/20 text-[#C77DFF] group-hover/item:scale-110 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wider">Location</p>
                      <p className="text-sm font-medium text-[#C9D1D9]">{contactInfo.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="group relative animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
              <div className="relative bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06]">
                <h2 className="text-lg font-bold text-white mb-4">Follow Me</h2>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((link) => {
                    const derived = detectSocialPlatform(link.url ?? "");
                    const platformKey = (link.platform ?? derived.platform) as keyof typeof iconMap;
                    const iconKey = (link.iconKey ?? derived.iconKey) as keyof typeof iconMap;
                    const Icon = iconMap[iconKey] ?? iconMap.custom;
                    const label = formatPlatformLabel(String(platformKey), derived.label);
                    return (
                      <a
                        key={`${label}-${link.url}`}
                        className="group/social inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1320]/50 text-[#C9D1D9] hover:bg-gradient-to-r hover:from-[#C77DFF] hover:to-[#9D4EDD] hover:text-white hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="group relative animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] via-[#9D4EDD] to-[#C77DFF] rounded-3xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
          <div className="relative bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/[0.06] hover:border-white/[0.12] transition-all duration-600 ease-out">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15">
                <Send className="w-5 h-5 text-[#C77DFF]" />
              </div>
              <h2 className="text-xl font-bold text-white">Send a Message</h2>
            </div>

            <form
              id="contact-form"
              className="space-y-5"
              onSubmit={async (event) => {
                event.preventDefault();
                const next = validate();
                setErrors(next);
                if (Object.keys(next).length > 0) return;
                setIsSubmitting(true);
                setSuccess(null);
                try {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formValues),
                  });
                  const result = await res.json();
                  if (!res.ok) throw new Error(result.error || "Failed to send message");
                  setFormValues({ name: "", email: "", subject: "", message: "" });
                  setErrors({});
                  setSuccess("Message sent successfully!");
                } catch (err) {
                  setErrors({
                    submit: err instanceof Error ? err.message : "Failed to send. Please try again.",
                  });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#C9D1D9] mb-1.5">Name</label>
                  <input
                    className={`w-full rounded-xl border ${errors.name ? "border-red-400" : "border-white/10 hover:border-[#C77DFF]/50"} bg-[#0B1320]/50 text-white placeholder-white/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF] transition-all`}
                    placeholder="John Doe"
                    value={formValues.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#C9D1D9] mb-1.5">Email</label>
                  <input
                    type="email"
                    className={`w-full rounded-xl border ${errors.email ? "border-red-400" : "border-white/10 hover:border-[#C77DFF]/50"} bg-[#0B1320]/50 text-white placeholder-white/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF] transition-all`}
                    placeholder="john@example.com"
                    value={formValues.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C9D1D9] mb-1.5">Subject</label>
                <input
                  className={`w-full rounded-xl border ${errors.subject ? "border-red-400" : "border-white/10 hover:border-[#C77DFF]/50"} bg-[#0B1320]/50 text-white placeholder-white/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF] transition-all`}
                  placeholder="Project Inquiry"
                  value={formValues.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                />
                {errors.subject && <p className="mt-1 text-sm text-red-400">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#C9D1D9] mb-1.5">Message</label>
                <textarea
                  rows={5}
                  className={`w-full rounded-xl border ${errors.message ? "border-red-400" : "border-white/10 hover:border-[#C77DFF]/50"} bg-[#0B1320]/50 text-white placeholder-white/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF] transition-all resize-none`}
                  placeholder="Tell me about your project..."
                  value={formValues.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                />
                {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                {errors.submit && (
                  <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm">
                    {errors.submit}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C77DFF] text-[#0B1320] font-semibold rounded-xl shadow-lg shadow-[#C77DFF]/30 hover:shadow-2xl hover:shadow-[#C77DFF]/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </button>

                  {success && (
                    <div className="flex items-center gap-2 text-[#C77DFF] animate-slide-in-left">
                      <CheckCircle2 className="w-5 h-5 animate-bounce-subtle" />
                      <span className="font-medium">{success}</span>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
