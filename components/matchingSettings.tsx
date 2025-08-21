import React from 'react';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

type Props = {
    enableNameAndArtistMatching: boolean;
    durationThresholdSec: number; // UI uses seconds
    onChange: (update: Partial<{
        enableNameAndArtistMatching: boolean;
        durationThresholdSec: number;
    }>) => void;
};

const MatchingSettings: React.FC<Props> = ({
    enableNameAndArtistMatching,
    durationThresholdSec,
    onChange,
}) => {
    const [open, setOpen] = React.useState(false);
    const { t } = useTranslation();

    return (
        <div className="mt-6 max-w-2xl mx-auto text-left">
            <Card className="overflow-hidden">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    aria-expanded={open}
                    aria-controls="matching-settings-content"
                >
                    <span className="font-semibold text-slate-900 dark:text-white">{t('matching-settings.title')}</span>
                    <svg
                        className={`h-5 w-5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.084l3.71-3.853a.75.75 0 111.08 1.04l-4.24 4.4a.75.75 0 01-1.08 0l-4.24-4.4a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                </button>
                {open && (
                    <div id="matching-settings-content" className="px-6 pb-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="space-y-5 text-sm text-slate-700 dark:text-slate-300">
                            <div className="flex items-start gap-3">
                                <input
                                    id="enable-name-artist"
                                    type="checkbox"
                                    checked={enableNameAndArtistMatching}
                                    onChange={(e) => onChange({ enableNameAndArtistMatching: e.target.checked })}
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-600"
                                />
                                <div>
                                    <label htmlFor="enable-name-artist" className="font-medium text-slate-900 dark:text-white">{t('matching-settings.enable-name-artist.title')}</label>
                                    <p className="text-xs text-muted-foreground mt-1">{t('matching-settings.enable-name-artist.help')}</p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="duration-threshold" className="block font-medium text-slate-900 dark:text-white mb-2">{t('matching-settings.duration-threshold.label')}</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="duration-threshold"
                                        type="number"
                                        min={0}
                                        step={0.1}
                                        value={Number.isFinite(durationThresholdSec) ? durationThresholdSec : 0}
                                        onChange={(e) => onChange({ durationThresholdSec: parseFloat(e.target.value || '0') })}
                                        className="w-40 rounded-md border border-slate-300 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                    />
                                    <span className="text-xs text-muted-foreground">{t('matching-settings.duration-threshold.help')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MatchingSettings;
