"use client";

import { useState } from "react";
import { trpc } from "@/trpc/provider";
import { toast } from "sonner";
import { X } from "lucide-react";

interface TourRequestFormProps {
  listingId: number;
  listingTitle: string;
  onClose: () => void;
}

export function TourRequestForm({ listingId, listingTitle, onClose }: TourRequestFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    preferredDate: "",
    message: "",
  });

  const mutation = trpc.tours.requestTour.useMutation({
    onSuccess: () => {
      toast.success("Tour request submitted! We'll be in touch soon.");
      onClose();
    },
    onError: (err) => {
      try {
        const parsedError = JSON.parse(err.message);
        if (Array.isArray(parsedError) && parsedError.length > 0 && parsedError[0].message) {
          toast.error(parsedError[0].message);
          return;
        }
      } catch (e) {
        // ignore parse error
      }
      toast.error(err.message || "Something went wrong. Please try again.");
      console.error("tour request failed:", err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email");
      return;
    }
    mutation.mutate({
      listingId,
      name: formData.name,
      email: formData.email,
      company: formData.company || undefined,
      teamSize: formData.teamSize ? parseInt(formData.teamSize) : undefined,
      preferredDate: formData.preferredDate || undefined,
      message: formData.message || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Request Tour</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Schedule a tour of <span className="font-medium">{listingTitle}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Company name"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Team size"
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <textarea
            placeholder="Any questions or notes?"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
          />

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
