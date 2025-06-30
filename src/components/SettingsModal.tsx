import React, { useState, useEffect } from 'react';
import { MapPin, X, Save } from 'lucide-react';
import { SearchSettings } from '@/types/news';
import { newsService } from '@/lib/newsService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<SearchSettings>({
    searchContextSize: 'medium',
    location: {
      country: 'US',
      city: 'New York',
      region: 'New York',
      timezone: 'America/New_York'
    },
    enableCitations: true,
    maxArticles: 5,
    language: 'en'
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentSettings = newsService.getSettings();
      setSettings(currentSettings);
    }
  }, [isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      newsService.updateSettings(settings);
      await new Promise(resolve => setTimeout(resolve, 300));
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'IN', name: 'India' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="surface rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-primary">Settings</h2>
          <button
            onClick={onClose}
            className="button-secondary p-2 focus-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary flex items-center gap-2">
              Search Preferences
            </h3>
            
            <div>
              <label className="block text-sm text-secondary mb-2">
                Search Quality
              </label>
              <select
                value={settings.searchContextSize}
                onChange={(e) => setSettings({
                  ...settings,
                  searchContextSize: e.target.value as 'low' | 'medium' | 'high'
                })}
                className="input-field w-full px-3 py-2"
              >
                <option value="low">Fast</option>
                <option value="medium">Balanced</option>
                <option value="high">Comprehensive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-secondary mb-2">
                Articles per category
              </label>
              <select
                value={settings.maxArticles}
                onChange={(e) => setSettings({
                  ...settings,
                  maxArticles: parseInt(e.target.value)
                })}
                className="input-field w-full px-3 py-2"
              >
                <option value={3}>3 articles</option>
                <option value={5}>5 articles</option>
                <option value={7}>7 articles</option>
              </select>
            </div>
          </div>

          {/* Location Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </h3>
            
            <div>
              <label className="block text-sm text-secondary mb-2">Country</label>
              <select
                value={settings.location.country}
                onChange={(e) => setSettings({
                  ...settings,
                  location: { ...settings.location, country: e.target.value }
                })}
                className="input-field w-full px-3 py-2"
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-secondary mb-2">City</label>
                <input
                  type="text"
                  value={settings.location.city}
                  onChange={(e) => setSettings({
                    ...settings,
                    location: { ...settings.location, city: e.target.value }
                  })}
                  placeholder="New York"
                  className="input-field w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-secondary mb-2">State</label>
                <input
                  type="text"
                  value={settings.location.region}
                  onChange={(e) => setSettings({
                    ...settings,
                    location: { ...settings.location, region: e.target.value }
                  })}
                  placeholder="NY"
                  className="input-field w-full px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t surface-muted">
          <button
            onClick={onClose}
            className="button-secondary px-4 py-2 focus-ring"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="button-primary px-4 py-2 flex items-center gap-2 focus-ring disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
