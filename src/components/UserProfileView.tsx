import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Mail,
  Shield,
  Smartphone,
  Copy,
  Check,
  Code2,
  Users,
  Award,
  Sparkles,
  MapPin,
  FileCode,
  Layers,
  Sprout,
  Bell,
  Cpu,
  Download,
  ExternalLink,
  LogIn,
  LogOut,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Building,
  UserCheck,
} from 'lucide-react';
import { UserProfileData } from './LoginModal';
import { Language } from '../types/weather';

interface UserProfileViewProps {
  user: UserProfileData;
  onOpenLogin: () => void;
  onUpdateUser?: (user: UserProfileData) => void;
  lang?: Language;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onOpenLogin,
  onUpdateUser,
  lang = 'en',
}) => {
  const isTelugu = lang === 'te';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'main' | 'screen' | 'service' | 'pubspec'>('main');

  // In-Profile Person Login State
  const [showPersonLoginForm, setShowPersonLoginForm] = useState<boolean>(false);
  const [loginSuccessToast, setLoginSuccessToast] = useState<string | null>(null);

  // Form Fields for Person Login
  const [inputName, setInputName] = useState<string>('');
  const [inputRollNo, setInputRollNo] = useState<string>('');
  const [inputEmail, setInputEmail] = useState<string>('');
  const [inputDepartment, setInputDepartment] = useState<string>('Computer Science & Engineering');
  const [inputRole, setInputRole] = useState<string>('Student Researcher / Developer');
  const [inputPhone, setInputPhone] = useState<string>('+91 98480 22338');
  const [inputPin, setInputPin] = useState<string>('••••••');

  // Copy code helper
  const handleCopyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Team Members (Project Leaders)
  const teamMembers: UserProfileData[] = [
    {
      name: 'Kodati Abhiram',
      rollNo: '248x1a4573',
      role: 'Flutter App & UI/UX Specialist',
      email: '248x1a4573@khitguntur.ac.in',
      college: 'Kallam Haranadhareddy Institute of Technology (KHIT), Guntur',
      department: 'Computer Science & Engineering',
      isLoggedIn: true,
      avatarSeed: 'Abhiram',
    },
    {
      name: 'Mekala Dhanush',
      rollNo: '248x1a4595',
      role: 'AI Engine & Backend Integration Lead',
      email: '248x1a4595@khitguntur.ac.in',
      college: 'Kallam Haranadhareddy Institute of Technology (KHIT), Guntur',
      department: 'Computer Science & Engineering',
      isLoggedIn: true,
      avatarSeed: 'Dhanush',
    },
  ];

  // In-Profile Person Login Switcher
  const handleSwitchPerson = (selectedPerson: UserProfileData) => {
    if (onUpdateUser) {
      onUpdateUser(selectedPerson);
      setLoginSuccessToast(`Successfully logged in as ${selectedPerson.name} (${selectedPerson.rollNo})!`);
      setTimeout(() => setLoginSuccessToast(null), 3000);
    }
  };

  // In-Profile Person Custom Login Submit
  const handleCustomPersonLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputRollNo.trim()) return;

    const newPerson: UserProfileData = {
      name: inputName.trim(),
      rollNo: inputRollNo.trim().toUpperCase(),
      email: inputEmail.trim() || `${inputRollNo.toLowerCase()}@khitguntur.ac.in`,
      college: 'Kallam Haranadhareddy Institute of Technology (KHIT), Guntur',
      department: inputDepartment,
      role: inputRole,
      isLoggedIn: true,
      avatarSeed: inputName.trim(),
    };

    if (onUpdateUser) {
      onUpdateUser(newPerson);
    }
    setShowPersonLoginForm(false);
    setLoginSuccessToast(`Welcome! Logged in as ${newPerson.name} (${newPerson.rollNo}).`);
    setTimeout(() => setLoginSuccessToast(null), 3000);
  };

  // Flutter Code Snippets
  const flutterPubspec = `name: skycast_ai_flutter
description: Advanced AI Weather Forecasting & Disaster Alert Mobile App.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  geolocator: ^11.0.0
  provider: ^6.1.1
  google_fonts: ^6.1.0
  fl_chart: ^0.66.0
  flutter_map: ^6.1.0
  latlong2: ^0.9.0
  intl: ^0.19.0
  shared_preferences: ^2.2.2
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`;

  const flutterMainDart = `// SkyCast AI - Main Flutter Entry Point
// Team: Kodati Abhiram (248x1a4573) & Mekala Dhanush (248x1a4595)
// Institution: KHIT Guntur

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/weather_dashboard_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SkyCastApp());
}

class SkyCastApp extends StatelessWidget {
  const SkyCastApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SkyCast AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF090D16),
        primaryColor: const Color(0xFF06B6D4),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          ThemeData.dark().textTheme,
        ),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF06B6D4),
          secondary: Color(0xFF38BDF8),
          surface: Color(0xFF0F172A),
        ),
      ),
      home: const WeatherDashboardScreen(),
    );
  }
}
`;

  const flutterScreenDart = `// lib/screens/weather_dashboard_screen.dart
// Developed by Kodati Abhiram (248x1a4573) & Mekala Dhanush (248x1a4595)

import 'package:flutter/material.dart';
import '../services/weather_api_service.dart';

class WeatherDashboardScreen extends StatefulWidget {
  const WeatherDashboardScreen({super.key});

  @override
  State<WeatherDashboardScreen> createState() => _WeatherDashboardScreenState();
}

class _WeatherDashboardScreenState extends State<WeatherDashboardScreen> {
  final WeatherApiService _apiService = WeatherApiService();
  Map<String, dynamic>? _weatherData;
  bool _isLoading = true;
  String _cityName = 'Guntur, Andhra Pradesh';

  @override
  void initState() {
    super.initState();
    _loadWeather();
  }

  Future<void> _loadWeather() async {
    setState(() => _isLoading = true);
    try {
      // Default coordinates for Guntur: 16.3067, 80.4365
      final data = await _apiService.getWeatherData(16.3067, 80.4365);
      setState(() {
        _weatherData = data;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A).withOpacity(0.8),
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF06B6D4), Color(0xFF2563EB)],
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.cloud, size: 18, color: Colors.black),
            ),
            const SizedBox(width: 8),
            const Text(
              'SkyCast AI',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Color(0xFF38BDF8)),
            onPressed: _loadWeather,
          ),
          IconButton(
            icon: const Icon(Icons.person_outline, color: Colors.white70),
            onPressed: () {
              // Open Team & Profile Dialog
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFF06B6D4)),
            )
          : RefreshIndicator(
              onRefresh: _loadWeather,
              color: const Color(0xFF06B6D4),
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  _buildLocationHeader(),
                  const SizedBox(height: 16),
                  _buildMainWeatherCard(),
                  const SizedBox(height: 16),
                  _buildDisasterAlertBanner(),
                  const SizedBox(height: 16),
                  _buildAtmosphericGrid(),
                  const SizedBox(height: 24),
                  _buildTeamCreditsFooter(),
                ],
              ),
            ),
    );
  }

  Widget _buildLocationHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              _cityName,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const Text(
              'Telemetry: Open-Meteo & Gemini 3.8 Engine',
              style: TextStyle(fontSize: 11, color: Colors.white54),
            ),
          ],
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: const Color(0xFF10B981).withOpacity(0.2),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF10B981)),
          ),
          child: const Text(
            'STATION LIVE',
            style: TextStyle(fontSize: 10, color: Color(0xFF10B981), fontWeight: FontWeight.bold),
          ),
        ),
      ],
    );
  }

  Widget _buildMainWeatherCard() {
    final cur = _weatherData?['current'] ?? {};
    final temp = cur['temperature_2m']?.round() ?? 28;
    final feelsLike = cur['apparent_temperature']?.round() ?? 30;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFF0F172A),
            const Color(0xFF1E293B).withOpacity(0.8),
            const Color(0xFF082F49).withOpacity(0.5),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '\$temp°C',
                    style: const TextStyle(
                      fontSize: 64,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    'Feels like \$feelsLike°C',
                    style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 13),
                  ),
                ],
              ),
              const Icon(
                Icons.wb_sunny_rounded,
                size: 72,
                color: Color(0xFFFBBF24),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDisasterAlertBanner() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF881337).withOpacity(0.4),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF43F5E).withOpacity(0.4)),
      ),
      child: Row(
        children: [
          const Icon(Icons.warning_amber_rounded, color: Color(0xFFF43F5E)),
          const SizedBox(width: 10),
          const Expanded(
            child: Text(
              'Disaster Early Warning: Cyclone & Flood monitoring active.',
              style: TextStyle(fontSize: 12, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAtmosphericGrid() {
    final cur = _weatherData?['current'] ?? {};
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 10,
      mainAxisSpacing: 10,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        _buildMetricTile('Humidity', '\${cur['relative_humidity_2m'] ?? 65}%', Icons.water_drop, Colors.blue),
        _buildMetricTile('Wind Speed', '\${cur['wind_speed_10m'] ?? 12} km/h', Icons.air, Colors.teal),
        _buildMetricTile('Pressure', '\${cur['surface_pressure']?.round() ?? 1012} hPa', Icons.speed, Colors.purple),
        _buildMetricTile('UV Index', '\${cur['uv_index'] ?? 5.2}', Icons.wb_sunny, Colors.amber),
      ],
    );
  }

  Widget _buildMetricTile(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A).withOpacity(0.7),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, color: color, size: 22),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 11, color: Colors.white54)),
              Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTeamCreditsFooter() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: const Column(
        children: [
          Text(
            'SkyCast AI Mobile • KHIT Guntur',
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF38BDF8)),
          ),
          SizedBox(height: 4),
          Text(
            'Developed by Kodati Abhiram (248x1a4573) & Mekala Dhanush (248x1a4595)',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 10, color: Colors.white60),
          ),
        ],
      ),
    );
  }
}
`;

  const flutterServiceDart = `// lib/services/weather_api_service.dart
// Open-Meteo & Gemini Integration for Flutter App

import 'dart:convert';
import 'package:http/http.dart' as http;

class WeatherApiService {
  static const String baseUrl = 'https://api.open-meteo.com/v1/forecast';

  Future<Map<String, dynamic>> getWeatherData(double lat, double lon) async {
    final url = Uri.parse(
      '\$baseUrl?latitude=\$lat&longitude=\$lon'
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,surface_pressure,wind_speed_10m,uv_index'
      '&hourly=temperature_2m,precipitation_probability'
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum'
      '&timezone=auto',
    );

    final response = await http.get(url);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load weather data');
    }
  }
}
`;

  const codeSnippets = {
    main: { title: 'lib/main.dart', code: flutterMainDart },
    screen: { title: 'lib/screens/weather_dashboard_screen.dart', code: flutterScreenDart },
    service: { title: 'lib/services/weather_api_service.dart', code: flutterServiceDart },
    pubspec: { title: 'pubspec.yaml', code: flutterPubspec },
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Toast Notification on In-Profile Login */}
      {loginSuccessToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{loginSuccessToast}</span>
        </div>
      )}

      {/* 1. In-Profile Active Person Header Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/50 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-cyan-500/25 border-2 border-white/20">
                {user.name.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-md animate-pulse"></span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white">{user.name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  Roll: {user.rollNo}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Authenticated Person</span>
                </span>
              </div>
              <p className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>{user.college}</span>
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {user.department} • {user.role}
              </p>
            </div>
          </div>

          {/* Action buttons inside Profile */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowPersonLoginForm(!showPersonLoginForm)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{showPersonLoginForm ? 'Hide Login Form' : 'Person Login / Switch'}</span>
            </button>
          </div>
        </div>

        {/* Profile Metrics Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Project Scope</span>
            <span className="text-white font-bold">Web + Flutter Mobile</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Student ID</span>
            <span className="text-cyan-300 font-bold">{user.rollNo}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Session Token</span>
            <span className="text-slate-300 font-bold">KHIT-AUTH-{user.rollNo.slice(-4)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Authentication Status</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Verified Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Person Login Feature DIRECTLY in the Profile */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>In-Profile Person Authentication Hub</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {isTelugu ? 'ప్రొఫైల్ లో వ్యక్తి లాగిన్ & ఖాతా మార్పు' : 'Person Login & Contributor Account Management'}
            </h3>
            <p className="text-xs text-slate-300">
              Log in as a project leader, switch student profiles, or authenticate a new researcher directly from this screen.
            </p>
          </div>

          <div className="text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10">
            Active: <strong className="text-white">{user.name}</strong>
          </div>
        </div>

        {/* 1-Click Fast Switch Between Project Leads */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
            Quick 1-Click Person Switch (Project Leads):
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map((member) => {
              const isActive = user.rollNo.toLowerCase() === member.rollNo.toLowerCase();
              return (
                <div
                  key={member.rollNo}
                  onClick={() => handleSwitchPerson(member)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-cyan-950/40 border-cyan-400/60 shadow-lg shadow-cyan-500/15'
                      : 'bg-slate-900/60 border-white/5 hover:bg-slate-800/60 hover:border-cyan-400/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {member.name}
                      </div>
                      <div className="text-xs text-cyan-400 font-mono">Roll: {member.rollNo}</div>
                      <div className="text-[11px] text-slate-400">{member.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/40 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Logged In</span>
                      </span>
                    ) : (
                      <button className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-cyan-500 text-slate-300 group-hover:text-slate-950 text-xs font-bold transition-all">
                        Log In
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Person Login Expandable Form */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
              Or Sign In As Any Other Person / Student / Staff:
            </span>
            <button
              onClick={() => setShowPersonLoginForm(!showPersonLoginForm)}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              {showPersonLoginForm ? '− Collapse Form' : '+ Expand Login Form'}
            </button>
          </div>

          {showPersonLoginForm && (
            <form
              onSubmit={handleCustomPersonLogin}
              className="mt-4 p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    Person's Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="e.g. Mekala Dhanush or Kodati Abhiram"
                      required
                      className="w-full bg-slate-900 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    Roll Number / Student ID *
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={inputRollNo}
                      onChange={(e) => setInputRollNo(e.target.value)}
                      placeholder="e.g. 248x1a4595"
                      required
                      className="w-full bg-slate-900 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    College Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="e.g. 248x1a4595@khitguntur.ac.in"
                      className="w-full bg-slate-900 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    Academic Department
                  </label>
                  <select
                    value={inputDepartment}
                    onChange={(e) => setInputDepartment(e.target.value)}
                    className="w-full bg-slate-900 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                    <option value="AI & Data Science">AI & Data Science (AI&DS)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                    <option value="Electrical Engineering">Electrical & Electronics (EEE)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    Emergency Alert Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={inputPhone}
                      onChange={(e) => setInputPhone(e.target.value)}
                      placeholder="+91 98480 22338"
                      className="w-full bg-slate-900 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    Student Passcode / PIN
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={inputPin}
                      onChange={(e) => setInputPin(e.target.value)}
                      placeholder="Enter 4-6 digit PIN"
                      className="w-full bg-slate-900 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPersonLoginForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In This Person</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 3. Personalized User Agricultural & Disaster Notification Settings */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-emerald-400 text-sm font-bold">
            <Sprout className="w-5 h-5" />
            <span>Regional Agricultural & Crop Notification Preferences</span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Guntur Microclimate Profile
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Tailored weather risk advisories configured for cash crops and horticulture in the Guntur & Krishna delta region.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Guntur Mirchi / Chilli</span>
              <span className="text-[10px] text-slate-400">High Humidity & Pest Warning</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">Active</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Cotton (Kapas)</span>
              <span className="text-[10px] text-slate-400">Unseasonal Rain & Boll Rot</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">Active</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Paddy / Rice Crops</span>
              <span className="text-[10px] text-slate-400">Submergence & Drainage Alerts</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">Active</span>
          </div>
        </div>
      </div>

      {/* 4. Team Members of Flutter (1. Kodati Abhiram, 2. Mekala Dhanush) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white text-lg font-bold">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Team Members of Flutter App & AI Engineering</span>
          </div>
          <span className="text-xs font-mono text-cyan-400">KHIT Guntur Project Team</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={member.rollNo}
              className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-base shadow-lg"
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                        <span>{member.name}</span>
                      </h4>
                      <div className="text-xs font-mono text-cyan-400 font-semibold">
                        Roll No: {member.rollNo}
                      </div>
                      <div className="text-[11px] text-slate-400">{member.role}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                    Lead #{idx + 1}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
                    Core Technical Responsibilities:
                  </span>
                  <div className="text-xs text-slate-300 space-y-1">
                    {idx === 0 ? (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                          <span>Designed mobile glassmorphism UI widgets in Flutter & Dart</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                          <span>Built interactive radar map viewer and timeline slider</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                          <span>Implemented cross-platform state management & local caching</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                          <span>Integrated Gemini 3.8 Flash model for AI weather synthesis</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                          <span>Configured Open-Meteo & WMO telemetry API pipelines</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                          <span>Engineered disaster threshold algorithm & early warning sirens</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(idx === 0 ? ['Flutter Lead', 'Dart Certified', 'UI/UX Designer'] : ['AI Specialist', 'Backend Lead', 'System Architect']).map((b) => (
                    <span
                      key={b}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 border border-white/5 text-[10px] text-cyan-300 font-mono"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  {member.email}
                </span>
                <span className="text-slate-500">KHIT Guntur</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Flutter Code in Profile End */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cross-Platform Flutter & Dart Mobile Architecture</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              SkyCast AI Flutter Mobile Source Code
            </h3>
            <p className="text-xs text-slate-300">
              Complete production Flutter codebase developed by Kodati Abhiram & Mekala Dhanush for Android & iOS.
            </p>
          </div>

          <button
            onClick={() => handleCopyCode(activeCodeTab, codeSnippets[activeCodeTab].code)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
          >
            {copiedKey === activeCodeTab ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === activeCodeTab ? 'Code Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Tab selection for Flutter code files */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveCodeTab('main')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeCodeTab === 'main'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>lib/main.dart</span>
          </button>
          <button
            onClick={() => setActiveCodeTab('screen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeCodeTab === 'screen'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>lib/screens/weather_dashboard_screen.dart</span>
          </button>
          <button
            onClick={() => setActiveCodeTab('service')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeCodeTab === 'service'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>lib/services/weather_api_service.dart</span>
          </button>
          <button
            onClick={() => setActiveCodeTab('pubspec')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeCodeTab === 'pubspec'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>pubspec.yaml</span>
          </button>
        </div>

        {/* Code viewer box */}
        <div className="relative rounded-2xl bg-slate-950 border border-white/10 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="ml-2 text-cyan-300 font-semibold">{codeSnippets[activeCodeTab].title}</span>
            </div>
            <span>Dart • Flutter 3.x</span>
          </div>

          <pre className="p-5 text-xs text-slate-200 font-mono overflow-x-auto max-h-[460px] leading-relaxed scrollbar-thin">
            <code>{codeSnippets[activeCodeTab].code}</code>
          </pre>
        </div>

        {/* How to run instructions card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono">
            <Code2 className="w-4 h-4" />
            <span>How to Run this Flutter Project on Mobile (Android & iOS):</span>
          </div>
          <div className="text-slate-300 space-y-1 font-mono text-[11px]">
            <div>1. Create project: <code className="text-cyan-400">flutter create skycast_ai_flutter</code></div>
            <div>2. Add dependencies: <code className="text-cyan-400">flutter pub add http geolocator google_fonts provider</code></div>
            <div>3. Replace <code className="text-cyan-400">lib/main.dart</code> and add the screen files from above.</div>
            <div>4. Run in Android Studio or VS Code: <code className="text-emerald-400">flutter run</code></div>
          </div>
        </div>
      </div>
    </div>
  );
};
