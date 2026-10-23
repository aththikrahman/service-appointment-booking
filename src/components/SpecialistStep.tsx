import React from 'react';
import { Star, Clock, UserCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { Specialist, BusinessConfig } from '../types/booking';

interface SpecialistStepProps {
  business: BusinessConfig;
  selectedSpecialist: Specialist | null;
  onSelectSpecialist: (specialist: Specialist | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SpecialistStep: React.FC<SpecialistStepProps> = ({
  business,
  selectedSpecialist,
  onSelectSpecialist,
  onNext,
  onBack
}) => {
  const isAnySelected = selectedSpecialist === null;

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          <span>Step 02</span>
          <span aria-hidden="true">·</span>
          <span>Artisans & Specialists</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 tracking-tight">
          Select Your Dedicated Artisan
        </h2>
        <p className="mt-1 text-sm text-stone-600 max-w-2xl">
          Choose a recognized specialist with the right expertise, or opt for the earliest available master.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: Any Available Specialist */}
        <div
          onClick={() => onSelectSpecialist(null)}
          className={`col-span-1 md:col-span-2 p-5 rounded-xl border cursor-pointer transition-all ${
            isAnySelected
              ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-sm'
              : 'border-stone-200/90 bg-white hover:border-stone-300 hover:shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-medium text-stone-900">
                    First Available Specialist
                  </h3>
                  <span className="text-xs font-mono text-stone-500">· Recommended for maximum slot flexibility</span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  We will pair you with the best-matched master artisan currently open on your requested date.
                </p>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isAnySelected
                  ? 'bg-stone-900 text-white'
                  : 'border border-stone-300 text-transparent'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Individual Specialists */}
        {business.specialists.map((specialist) => {
          const isSelected = selectedSpecialist?.id === specialist.id;

          return (
            <div
              key={specialist.id}
              onClick={() => onSelectSpecialist(specialist)}
              className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-sm'
                  : 'border-stone-200/90 bg-white hover:border-stone-300 hover:shadow-2xs'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={specialist.avatarUrl}
                      alt={specialist.name}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="text-base font-serif font-medium text-stone-900">
                        {specialist.name}
                      </h4>
                      <p className="text-xs text-stone-500">{specialist.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-stone-600">
                        <span className="flex items-center gap-1 font-mono">
                          <Star className="w-3 h-3 text-stone-800 fill-stone-800" />
                          {specialist.rating.toFixed(2)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-stone-500 font-mono">({specialist.reviewCount} reviews)</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-stone-500 font-mono">{specialist.experienceYears}y craft</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-stone-900 text-white'
                        : 'border border-stone-300 text-transparent'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {specialist.bio}
                </p>

                {/* Specialties tags (unboxed text discipline) */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <span className="font-medium text-stone-700">Specialties:</span>
                  {specialist.specialties.map((spec, i) => (
                    <React.Fragment key={spec}>
                      <span>{spec}</span>
                      {i < specialist.specialties.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>Standard hours: {specialist.availableHours.start} – {specialist.availableHours.end}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Actions */}
      <div className="pt-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </button>

        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-lg text-sm font-medium bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
        >
          Choose Date & Time &rarr;
        </button>
      </div>
    </div>
  );
};
