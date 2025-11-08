'use client';

/**
 * Preferences Modal Component
 * 
 * Modal UI for managing user preferences
 * Includes sections for:
 * - Location Defaults
 * - Insurance Preferences
 * - Saved Locations Manager
 * - Language & Notifications
 */

import { useState } from 'react';
import { X, MapPin, Shield, Globe, Bell, Plus, Trash2 } from 'lucide-react';
import { usePreferences } from '@/lib/contexts/PreferencesContext';
import { SavedLocation } from '@/types/preferences';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const {
    defaultZip,
    defaultRadius,
    preferredInsuranceCarriers,
    savedLocations,
    language,
    notifications,
    updatePreferences,
  } = usePreferences();

  const [formState, setFormState] = useState({
    zip: defaultZip || '',
    radius: defaultRadius || 50,
    carriers: [...(preferredInsuranceCarriers || [])],
    newCarrier: '',
    newLocation: {
      name: '',
      zip: '',
      radius: 50,
    },
    language: language || 'en',
    emailEnabled: notifications?.email ?? true,
    smsEnabled: notifications?.sms ?? false,
  });

  if (!isOpen) return null;

  const handleSave = async () => {
    await updatePreferences({
      defaultZip: formState.zip || undefined,
      defaultRadius: formState.radius,
      preferredInsuranceCarriers: formState.carriers,
      language: formState.language,
      notifications: {
        email: formState.emailEnabled,
        sms: formState.smsEnabled,
      },
    });
    onClose();
  };

  const handleAddCarrier = () => {
    if (formState.newCarrier.trim()) {
      setFormState({
        ...formState,
        carriers: [...formState.carriers, formState.newCarrier.trim()],
        newCarrier: '',
      });
    }
  };

  const handleRemoveCarrier = (index: number) => {
    setFormState({
      ...formState,
      carriers: formState.carriers.filter((_, i) => i !== index),
    });
  };

  const handleAddLocation = () => {
    if (formState.newLocation.name.trim() && formState.newLocation.zip.trim()) {
      const newLocation: SavedLocation = {
        id: Date.now().toString(),
        name: formState.newLocation.name,
        zip: formState.newLocation.zip,
        radius: formState.newLocation.radius,
      };
      
      const updatedLocations = savedLocations.length >= 5
        ? [...savedLocations.slice(1), newLocation]
        : [...savedLocations, newLocation];
      
      updatePreferences({ savedLocations: updatedLocations });
      
      setFormState({
        ...formState,
        newLocation: { name: '', zip: '', radius: 50 },
      });
    }
  };

  const handleRemoveLocation = (id: string) => {
    updatePreferences({
      savedLocations: savedLocations.filter(loc => loc.id !== id),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-0 text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle">
          <div className="px-6 pt-6 pb-4 sm:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {/* Location Defaults */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Location Defaults</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="defaultZip" className="block text-sm font-medium text-gray-700 mb-1">
                      Default ZIP Code
                    </label>
                    <input
                      type="text"
                      id="defaultZip"
                      value={formState.zip}
                      onChange={(e) => setFormState({ ...formState, zip: e.target.value })}
                      placeholder="12345"
                      maxLength={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="defaultRadius" className="block text-sm font-medium text-gray-700 mb-1">
                      Default Search Radius: {formState.radius} miles
                    </label>
                    <input
                      type="range"
                      id="defaultRadius"
                      min="10"
                      max="100"
                      step="10"
                      value={formState.radius}
                      onChange={(e) => setFormState({ ...formState, radius: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </section>

              {/* Insurance Preferences */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Insurance Preferences</h3>
                </div>
                <div className="space-y-3">
                  {/* Existing carriers */}
                  {formState.carriers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formState.carriers.map((carrier, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                        >
                          {carrier}
                          <button
                            onClick={() => handleRemoveCarrier(index)}
                            className="hover:text-emerald-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Add carrier */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formState.newCarrier}
                      onChange={(e) => setFormState({ ...formState, newCarrier: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCarrier()}
                      placeholder="Enter insurance provider"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={handleAddCarrier}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Saved Locations */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Saved Locations</h3>
                  <span className="text-sm text-gray-500">
                    ({savedLocations.length}/5)
                  </span>
                </div>
                <div className="space-y-3">
                  {/* Existing locations */}
                  {savedLocations.map((loc) => (
                    <div
                      key={loc.id}
                      className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{loc.name}</div>
                        <div className="text-sm text-gray-600">
                          ZIP: {loc.zip} • Radius: {loc.radius} mi
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveLocation(loc.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {/* Add location */}
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                    <input
                      type="text"
                      value={formState.newLocation.name}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          newLocation: { ...formState.newLocation, name: e.target.value },
                        })
                      }
                      placeholder="Location name (e.g., Home)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formState.newLocation.zip}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            newLocation: { ...formState.newLocation, zip: e.target.value },
                          })
                        }
                        placeholder="ZIP Code"
                        maxLength={5}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={handleAddLocation}
                        disabled={savedLocations.length >= 5}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Language & Notifications */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Language</h3>
                </div>
                <div>
                  <select
                    value={formState.language}
                    onChange={(e) => setFormState({ ...formState, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.emailEnabled}
                      onChange={(e) =>
                        setFormState({ ...formState, emailEnabled: e.target.checked })
                      }
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.smsEnabled}
                      onChange={(e) =>
                        setFormState({ ...formState, smsEnabled: e.target.checked })
                      }
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">SMS notifications</span>
                  </label>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-8 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors sm:w-auto sm:ml-3"
            >
              Save Preferences
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 mt-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

