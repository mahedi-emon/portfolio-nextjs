"use client";

import Link from "next/link";
import { Sparkles, Zap, ArrowRight, Inbox } from "lucide-react";
import type { Service } from "@/lib/cms/types";

export function ServicesPageClient({ services }: { services: Service[] }) {
  return (
    <div className="space-y-16 pb-16">
      <section className="relative pt-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-5 blur-3xl animate-pulse-glow" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1320]/60 border border-white/10 mb-6 animate-slide-in-left hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4 text-[#C77DFF] animate-spin-slow" />
          <span className="text-sm font-medium text-[#C77DFF]">What I Offer</span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in text-white">
          My{" "}
          <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent text-shimmer hover:animate-wiggle inline-block">
            Services
          </span>
        </h1>
        <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto animate-slide-up">
          Professional services tailored to bring your ideas to life with cutting-edge solutions and
          expert craftsmanship.
        </p>
      </section>

      {services.length > 0 && (
        <section>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.id}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />

                <div className="relative h-full bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl p-8 border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] hover:border-white/[0.12] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 transition-all duration-600 ease-out">
                  {service.imageUrl ? (
                    <div className="w-full h-40 rounded-2xl overflow-hidden mb-6 border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 mb-6 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all duration-500 ease-out">
                      <Zap className="w-7 h-7 text-[#C77DFF]" />
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-white mb-3 transition-colors duration-500">
                    {service.title}
                  </h2>
                  <p className="text-[#C9D1D9] leading-relaxed mb-6">{service.summary}</p>

                  <div className="flex items-center gap-2 text-[#C77DFF]/70 font-medium text-sm group-hover:text-[#C77DFF] group-hover:gap-3 transition-all duration-500">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {services.length === 0 && (
        <section className="animate-fade-in">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#C77DFF]/10 flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-[#C77DFF]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Services Yet</h3>
            <p className="text-[#C9D1D9] max-w-md">
              Services will appear here once they are added and published through the admin panel.
            </p>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="relative animate-fade-in overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1320] via-[#0B1320]/95 to-[#0B1320] rounded-3xl" />
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#C77DFF]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#9D4EDD]/10 rounded-full blur-3xl" />

          <div className="relative px-8 py-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 animate-slide-up">
              Ready to Start Your Project?
            </h2>
            <p className="text-[#C9D1D9] text-lg max-w-2xl mx-auto mb-8 animate-fade-in">
              Let&apos;s work together to create something amazing. Get in touch and let&apos;s
              discuss your ideas.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C77DFF] text-[#0B1320] font-semibold rounded-xl shadow-lg shadow-[#C77DFF]/20 hover:shadow-xl hover:shadow-[#C77DFF]/30 hover:-translate-y-1 transition-all duration-300 group"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
