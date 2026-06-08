import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ToggleLeft, ToggleRight, Radio, Save, AlertCircle, RefreshCw, LogOut, ShieldAlert } from 'lucide-react';
import { UserState } from '../types';

interface SettingsProps {
  user: UserState;
  onSaveProfile: (updated: Partial<UserState>) => void;
  onResetProgress: () => void;
  onSignOut: () => void;
}

export default function SettingsView({ user, onSaveProfile, onResetProgress, onSignOut }: SettingsProps) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState('15');
  const [reminders, setReminders] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    onSaveProfile({ displayName, email });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div id="settings-workspace" className="max-w-3xl mx-auto space-y-6 text-left">
      
      {/* Banner */}
      <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <h2 className="font-heading font-black text-2xl text-slate-800">Account Parameters</h2>
          <p className="text-slate-450 text-slate-400 text-xs mt-0.5">Customize notification scopes, profile names, and platform structures.</p>
        </div>
      </section>

      {/* Forms bento block */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
        
        {/* Profile info */}
        <div className="space-y-4">
          <span className="font-bold text-slate-400 text-xs uppercase tracking-wider block">Profile settings</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">DISPLAY USERNAME</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Study reminders */}
        <div className="space-y-4 pt-4 border-t border-slate-50">
          <span className="font-bold text-slate-400 text-xs uppercase tracking-wider block">Coaching Schedules</span>
          
          <div className="flex justify-between items-center py-2 shrink-0">
            <div>
              <h4 className="font-bold text-sm text-slate-800">Daily Study Reminders</h4>
              <p className="text-xs text-slate-400 mt-0.5">Push notification advice directly to your platform banner.</p>
            </div>
            <button 
              onClick={() => setReminders(!reminders)}
              className="text-blue-600 focus:outline-none transition-transform"
            >
              {reminders ? <ToggleRight size={38} className="text-blue-600 fill-blue-650" /> : <ToggleLeft size={38} className="text-slate-350" />}
            </button>
          </div>

          <div className="flex justify-between items-center py-2 shrink-0">
            <div>
              <h4 className="font-bold text-sm text-slate-800">Weekly Career Alignment Reports</h4>
              <p className="text-xs text-slate-400 mt-0.5">Automated feedback metrics exported directly to your registered mailbox.</p>
            </div>
            <button 
              onClick={() => setMarketingEmail(!marketingEmail)}
              className="text-blue-600 focus:outline-none transition-transform"
            >
              {marketingEmail ? <ToggleRight size={38} className="text-blue-600" /> : <ToggleLeft size={38} className="text-slate-350" />}
            </button>
          </div>
        </div>

        {/* Dynamic CTA */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-50">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Save size={14} />
            <span>SAVE PARAMETERS</span>
          </button>
          
          <button
            onClick={onSignOut}
            className="bg-slate-100 hover:bg-red-50 hover:text-red-650 text-slate-700 hover:text-red-600 font-bold py-3.5 px-6 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="bg-green-50 text-green-700 font-semibold p-4 rounded-xl border border-green-200 text-center text-xs flex items-center justify-center gap-2">
            ✓ Settings updated successfully on EVE database syncs.
          </div>
        )}

      </div>

      {/* Dangerous/irreversible audits folder */}
      <div className="bg-red-50/50 rounded-3xl border border-red-100/50 p-6 space-y-4">
        <h4 className="font-bold text-red-800 text-sm flex items-center gap-2">
          <ShieldAlert size={16} /> Danger Zone
        </h4>
        <p className="text-xs text-red-600/90 leading-relaxed">
         Perform destructive actions on your local state history log. This includes resetting streak masteries, coins balances, completed course certificates, and overall levels.
        </p>

        <button
          onClick={() => {
            if (confirm("Are you absolutely sure you want to reset all EVE course points and accomplishments? This is irreversible.")) {
              onResetProgress();
            }
          }}
          className="border border-red-200 bg-white hover:bg-red-600 hover:text-white hover:border-red-600 text-red-600 font-bold py-3.5 px-6 rounded-xl text-xs tracking-widest uppercase transition-all cursor-pointer"
        >
          RESET ENTIRE LEARNING HISTORY
        </button>
      </div>

    </div>
  );
}
