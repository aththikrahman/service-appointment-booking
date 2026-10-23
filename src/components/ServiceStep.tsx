import React, { useState } from 'react';
import { Clock, Plus, Check, Info, Sparkles } from 'lucide-react';
import { ServiceItem, ServiceAddon, BusinessConfig } from '../types/booking';

interface ServiceStepProps {
  business: BusinessConfig;
  selectedService: ServiceItem | null;
  selectedAddons: ServiceAddon[];
  onSelectService: (service: ServiceItem) => void;
  onToggleAddon: (addon: ServiceAddon) => void;
  onNext: () => void;
}

export const ServiceStep: React.FC<ServiceStepProps> = ({
  business,
  selectedService,
  selectedAddons,
  onSelectService,
  onToggleAddon,
  onNext
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedPrepId, setExpandedPrepId] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(business.services.map((s) => s.category)))];

  const filteredServices = activeCategory === 'all'
    ? business.services
    : business.services.filter((s) => s.category === activeCategory);

  const isAddonSelected = (addonId: string) =>
    selectedAddons.some((a) => a.id === addonId);

  const totalDuration = (selectedService?.durationMinutes || 0) +
    selectedAddons.reduce((sum, a) => sum + a.durationMinutes, 0);

  const totalPrice = (selectedService?.price || 0) +
    selectedAddons.reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          <span>Step 01</span>
          <span aria-hidden="true">·</span>
          <span>Curated Offerings</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 tracking-tight">
          Select Your Service & Rituals
        </h2>
        <p className="mt-1 text-sm text-stone-600 max-w-2xl">
          Choose a primary treatment tailored to your needs. Customize your session with bespoke add-on rituals.
        </p>
      </div>

      {/* Category Filter Controls (Segmented Tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
            }`}
          >
            {cat === 'all' ? 'All Services' : cat}
          </button>
        ))}
      </div>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredServices.map((service) => {
          const isSelected = selectedService?.id === service.id;
          const isPrepOpen = expandedPrepId === service.id;

          return (
            <div
              key={service.id}
              className={`relative rounded-xl border p-5 sm:p-6 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-sm'
                  : 'border-stone-200/90 bg-white hover:border-stone-300 hover:shadow-2xs'
              }`}
              onClick={() => onSelectService(service)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 text-xs text-stone-500">
                    <span className="font-medium text-stone-700">{service.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {service.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-medium text-stone-900">
                    {service.name}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">
                    {service.description}
                  </p>

                  {/* Preparation Guidelines Accordion Link */}
                  {service.prepNotes && service.prepNotes.length > 0 && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedPrepId(isPrepOpen ? null : service.id);
                        }}
                        className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>{isPrepOpen ? 'Hide preparation guidelines' : 'View preparation guidelines & notes'}</span>
                      </button>

                      {isPrepOpen && (
                        <div
                          className="mt-3 p-3.5 bg-stone-50 rounded-lg border border-stone-200/80 text-xs text-stone-600 space-y-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="font-semibold text-stone-800">Preparation & Client Care:</p>
                          <ul className="list-disc list-inside space-y-1 text-stone-600">
                            {service.prepNotes.map((note, idx) => (
                              <li key={idx}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Price and Selection indicator */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-right">
                    <div className="text-xl font-serif font-semibold text-stone-900 tabular-nums">
                      {business.currencySymbol}{service.price}
                    </div>
                    <div className="text-xs text-stone-500 font-mono">
                      {service.durationMinutes}m duration
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-stone-900 text-white'
                        : 'border border-stone-300 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* Recommended Add-ons section if this service is selected */}
              {isSelected && service.recommendedAddons && service.recommendedAddons.length > 0 && (
                <div
                  className="mt-6 pt-5 border-t border-stone-100 space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
                    <Sparkles className="w-3.5 h-3.5 text-stone-500" />
                    <span>Recommended Enhancements & Rituals:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.recommendedAddons.map((addon) => {
                      const added = isAddonSelected(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => onToggleAddon(addon)}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                            added
                              ? 'border-stone-800 bg-stone-50 ring-1 ring-stone-800'
                              : 'border-stone-200 bg-stone-50/60 hover:bg-stone-50 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="text-xs font-semibold text-stone-900">{addon.name}</div>
                              <p className="text-[11px] text-stone-500 line-clamp-1">{addon.description}</p>
                              <div className="text-[11px] text-stone-600 font-mono flex items-center gap-1.5 pt-0.5">
                                <span>+{business.currencySymbol}{addon.price}</span>
                                <span aria-hidden="true">·</span>
                                <span>+{addon.durationMinutes} mins</span>
                              </div>
                            </div>
                            <div
                              className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center transition-colors shrink-0 ${
                                added
                                  ? 'bg-stone-900 text-white'
                                  : 'border border-stone-300'
                              }`}
                            >
                              {added ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3 text-stone-400" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Summary Bar / Next Action */}
      <div className="sticky bottom-4 z-20 bg-stone-900 text-white p-4 sm:p-5 rounded-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
          <div>
            <div className="text-xs text-stone-400 uppercase tracking-wider font-mono">
              {selectedService ? 'Selected Service' : 'Selection Pending'}
            </div>
            <div className="text-sm font-medium text-stone-100 truncate max-w-xs sm:max-w-md">
              {selectedService ? selectedService.name : 'Please pick a service from above'}
            </div>
          </div>

          {selectedService && (
            <div className="text-right border-l border-stone-800 pl-6 shrink-0">
              <div className="text-lg font-serif font-semibold tabular-nums text-white">
                {business.currencySymbol}{totalPrice}
              </div>
              <div className="text-xs text-stone-400 font-mono">
                {totalDuration} mins total
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={!selectedService}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
            selectedService
              ? 'bg-white text-stone-900 hover:bg-stone-100 shadow-sm'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
          }`}
        >
          Select Artisan & Time &rarr;
        </button>
      </div>
    </div>
  );
};
