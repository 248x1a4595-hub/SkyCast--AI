import React, { useState } from 'react';
import { X, LogIn, User, Lock, Mail, GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

export interface UserProfileData {
  name: string;
  rollNo: string;
  email: string;
  college: string;
  department: string;
  role: string;
  isLoggedIn: boolean;
  avatarSeed: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfileData;
  onLogin: (user: UserProfileData) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  const [customName, setCustomName] = useState(currentUser.name);
  const [customRollNo, setCustomRollNo] = useState(currentUser.rollNo);
  const [customEmail, setCustomEmail] = useState(currentUser.email);

  const teamProfiles: UserProfileData[] = [
    {
      name: 'Mekala Dhanush',
      rollNo: '248x1a4595',
      email: '248x1a4595@khitguntur.ac.in',
      college: 'Kallam Haranadhareddy Institute of Technology (KHIT), Guntur',
      department: 'Computer Science & Engineering',
      role: 'AI & Backend Integration Lead',
      isLoggedIn: true,
      avatarSeed: 'Dhanush',
    },
    {
      name: 'Kodati Abhiram',
      rollNo: '248x1a4573',
      email: '248x1a4573@khitguntur.ac.in',
      college: 'Kallam Haranadhareddy Institute of Technology (KHIT), Guntur',
      department: 'Computer Science & Engineering',
      role: 'Flutter App & UI/UX Specialist',
      isLoggedIn: true,
      avatarSeed: 'Abhiram',
    },
  ];

  const handleSelectTeamMember = (profile: UserProfileData) => {
    onLogin(profile);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: customName || 'College Student',
      rollNo: customRollNo || '248x1a0000',
      email: customEmail || 'student@khitguntur.ac.in',
      college: 'Kallam Haranadhareddy Institute of Technology (KHIT), Guntur',
      department: 'Computer Science & Engineering',
      role: 'Meteorology Research Scholar',
      isLoggedIn: true,
      avatarSeed: customName || 'Student',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>KHIT Guntur Student Portal</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Student & Researcher Sign In</h2>
          <p className="text-xs text-slate-400">
            Sign in to access personalized disaster advisories, agricultural alerts, and Flutter code.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-white/5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'quick' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quick Team Login
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'credentials' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom Student ID
          </button>
        </div>

        {activeTab === 'quick' ? (
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
              Select Verified Project Contributor:
            </span>

            {teamProfiles.map((p) => {
              const isSelected = currentUser.rollNo.toLowerCase() === p.rollNo.toLowerCase();
              return (
                <div
                  key={p.rollNo}
                  onClick={() => handleSelectTeamMember(p)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400/50 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-white/5 hover:bg-slate-800/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-cyan-500/20">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {p.name}
                      </div>
                      <div className="text-xs text-cyan-400 font-mono">Roll: {p.rollNo}</div>
                      <div className="text-[10px] text-slate-400">{p.role}</div>
                    </div>
                  </div>

                  {isSelected && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                </div>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono text-slate-300 block mb-1">Full Student Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Mekala Dhanush"
                  required
                  className="w-full bg-slate-950 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-300 block mb-1">Roll Number</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={customRollNo}
                  onChange={(e) => setCustomRollNo(e.target.value)}
                  placeholder="e.g. 248x1a4595"
                  required
                  className="w-full bg-slate-950 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-300 block mb-1">College Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. 248x1a4595@khitguntur.ac.in"
                  required
                  className="w-full bg-slate-950 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Confirm & Sign In</span>
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-white/5 text-center text-[10px] text-slate-500 font-mono">
          Affiliated with Kallam Haranadhareddy Institute of Technology (KHIT), Guntur
        </div>
      </div>
    </div>
  );
};
