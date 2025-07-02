import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, Search, Filter, ExternalLink, Music, Palette, Utensils, Snowflake, Sun, Users, Camera, Compass, RefreshCw, AlertCircle, Heart, User, LogOut, Settings, Bell, BookmarkPlus, Eye, EyeOff } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  entryFee: string;
  description: string;
  website: string;
  category: string;
  region: string;
  status: 'confirmed' | 'tentative' | 'tba';
  type: 'festival' | 'day-trip' | 'activity';
}

interface User {
  id: string;
  email: string;
  preferences: {
    categories: string[];
    regions: string[];
    types: string[];
  };
  savedEvents: number[];
}

// Sample data
const sampleEvents: Event[] = [
  {
    id: 1,
    name: "Ottawa Bluesfest",
    date: "July 10-20, 2025",
    location: "Ottawa, ON",
    entryFee: "$89-$299 (Multi-day passes)",
    description: "One of Canada's premier music festivals featuring blues, rock, folk, and world music artists on multiple stages.",
    website: "https://www.ottawabluesfest.ca/",
    category: "Music",
    region: "Ottawa",
    status: "confirmed",
    type: "festival"
  },
  {
    id: 2,
    name: "Rideau Canal Skating",
    date: "December 2024 - March 2025",
    location: "Ottawa, ON",
    entryFee: "Free",
    description: "World's largest naturally frozen skating rink. Enjoy skating on the historic Rideau Canal with BeaverTails and hot chocolate.",
    website: "https://www.canada.ca/en/canadian-heritage/services/rideau-canal-skateway.html",
    category: "Winter",
    region: "Ottawa",
    status: "confirmed",
    type: "activity"
  },
  {
    id: 3,
    name: "Thousand Islands Day Trip",
    date: "May - October 2025",
    location: "Kingston, ON",
    entryFee: "$35-$85 (Boat tours)",
    description: "Scenic boat tour through the beautiful Thousand Islands region with castle visits and stunning views.",
    website: "https://www.1000islandstourism.com/",
    category: "Summer",
    region: "Ontario",
    status: "confirmed",
    type: "day-trip"
  },
  {
    id: 4,
    name: "Montreal International Jazz Festival",
    date: "June 26 - July 6, 2025",
    location: "Montreal, QC",
    entryFee: "Free outdoor shows, $35-$150 indoor concerts",
    description: "World's largest jazz festival with over 500 concerts, featuring jazz, blues, world music, and more.",
    website: "https://www.montrealjazzfest.com/",
    category: "Music",
    region: "Montreal",
    status: "tentative",
    type: "festival"
  },
  {
    id: 5,
    name: "Old Montreal Walking Tour",
    date: "Year-round",
    location: "Montreal, QC",
    entryFee: "$20-$40",
    description: "Explore the historic cobblestone streets, architecture, and landmarks of Old Montreal with guided tours.",
    website: "https://www.mtl.org/en/experience/old-montreal-walking-tour",
    category: "Cultural",
    region: "Montreal",
    status: "confirmed",
    type: "activity"
  },
  {
    id: 6,
    name: "Blue Mountain Ski Day Trip",
    date: "December 2024 - April 2025",
    location: "Blue Mountain, ON",
    entryFee: "$75-$120 (Lift tickets)",
    description: "Premier ski destination with slopes for all levels, plus village shopping and dining experiences.",
    website: "https://www.bluemountain.ca/",
    category: "Winter",
    region: "Ontario",
    status: "confirmed",
    type: "day-trip"
  },
  {
    id: 7,
    name: "Toronto International Film Festival",
    date: "September 5-15, 2025",
    location: "Toronto, ON",
    entryFee: "$25-$75 per screening",
    description: "One of the world's most prestigious film festivals showcasing international cinema and premieres.",
    website: "https://www.tiff.net/",
    category: "Cultural",
    region: "Ontario",
    status: "confirmed",
    type: "festival"
  },
  {
    id: 8,
    name: "Algonquin Park Canoe Adventure",
    date: "May - September 2025",
    location: "Algonquin Park, ON",
    entryFee: "$45-$95 per person",
    description: "Guided canoe trips through pristine wilderness with wildlife viewing and camping options.",
    website: "https://www.algonquinpark.on.ca/",
    category: "Summer",
    region: "Ontario",
    status: "confirmed",
    type: "activity"
  },
  {
    id: 9,
    name: "Quebec City Winter Carnival",
    date: "February 7-16, 2025",
    location: "Quebec City, QC",
    entryFee: "$15-$45",
    description: "World's largest winter carnival featuring ice sculptures, parades, and winter activities.",
    website: "https://www.carnaval.qc.ca/",
    category: "Winter",
    region: "Quebec",
    status: "confirmed",
    type: "festival"
  },
  {
    id: 10,
    name: "Niagara Falls Wine Country Tour",
    date: "April - October 2025",
    location: "Niagara, ON",
    entryFee: "$65-$150",
    description: "Full-day wine tasting tour through Niagara's renowned vineyards with lunch included.",
    website: "https://www.niagarawinecountry.com/",
    category: "Food",
    region: "Ontario",
    status: "confirmed",
    type: "day-trip"
  }
];

const categories = ["All", "Music", "Cultural", "Food", "Winter", "Summer"];
const regions = ["All", "Ontario", "Ottawa", "Montreal", "Quebec"];

// Google Sheets integration configuration (hidden from users)
const GOOGLE_SHEETS_CONFIG = {
  SHEET_ID: '1Jhl2fjGTk1_ZHeafHFbGjMzeJ7d4Rm3mANRV9E_CLp0',
  API_KEY: 'AIzaSyDVxZ1z0qd7KssyHBxhcA04YPDw1AmBSA4',
  RANGE: 'Events!A:J'
};

function App() {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [activeTab, setActiveTab] = useState<'festival' | 'day-trip' | 'activity'>('festival');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '', showPassword: false });
  const [signupForm, setSignupForm] = useState({ email: '', password: '', confirmPassword: '', showPassword: false });
  const [onboardingForm, setOnboardingForm] = useState({
    categories: [] as string[],
    regions: [] as string[],
    types: [] as string[]
  });

  // Function to fetch data from Google Sheets (hidden from users)
  const fetchFromGoogleSheets = async () => {
    if (GOOGLE_SHEETS_CONFIG.API_KEY === 'YOUR_GOOGLE_API_KEY_HERE') return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGE}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from Google Sheets');
      }
      
      const data = await response.json();
      
      if (data.values && data.values.length > 1) {
        const sheetEvents: Event[] = data.values.slice(1).map((row: string[], index: number) => ({
          id: index + 1,
          name: row[0] || '',
          date: row[1] || '',
          location: row[2] || '',
          entryFee: row[3] || '',
          description: row[4] || '',
          website: row[5] || '',
          category: row[6] || 'Cultural',
          region: row[7] || 'Ontario',
          status: (row[8] as 'confirmed' | 'tentative' | 'tba') || 'tba',
          type: (row[9] as 'festival' | 'day-trip' | 'activity') || 'festival'
        }));
        
        setEvents(sheetEvents);
        setLastSync(new Date());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching from Google Sheets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-sync every 5 minutes (hidden from users)
  useEffect(() => {
    if (GOOGLE_SHEETS_CONFIG.API_KEY !== 'YOUR_GOOGLE_API_KEY_HERE') {
      fetchFromGoogleSheets();
      const interval = setInterval(fetchFromGoogleSheets, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, []);

  // Authentication functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    const user: User = {
      id: '1',
      email: loginForm.email,
      preferences: {
        categories: ['Music', 'Cultural'],
        regions: ['Ontario', 'Ottawa'],
        types: ['festival', 'activity']
      },
      savedEvents: [1, 3, 5]
    };
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowLogin(false);
    setLoginForm({ email: '', password: '', showPassword: false });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setShowSignup(false);
    setShowOnboarding(true);
  };

  const handleOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: '1',
      email: signupForm.email,
      preferences: onboardingForm,
      savedEvents: []
    };
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowOnboarding(false);
    setSignupForm({ email: '', password: '', confirmPassword: '', showPassword: false });
    setOnboardingForm({ categories: [], regions: [], types: [] });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowUserMenu(false);
  };

  const toggleSaveEvent = (eventId: number) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      savedEvents: currentUser.savedEvents.includes(eventId)
        ? currentUser.savedEvents.filter(id => id !== eventId)
        : [...currentUser.savedEvents, eventId]
    };
    setCurrentUser(updatedUser);
  };

  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      const matchesRegion = selectedRegion === "All" || event.region === selectedRegion;
      const matchesType = event.type === activeTab;
      
      return matchesSearch && matchesCategory && matchesRegion && matchesType;
    });

    // If user is logged in and has preferences, prioritize matching events
    if (isLoggedIn && currentUser) {
      const preferredEvents = filtered.filter(event => 
        currentUser.preferences.categories.includes(event.category) ||
        currentUser.preferences.regions.includes(event.region)
      );
      const otherEvents = filtered.filter(event => 
        !currentUser.preferences.categories.includes(event.category) &&
        !currentUser.preferences.regions.includes(event.region)
      );
      return [...preferredEvents, ...otherEvents];
    }

    return filtered;
  }, [events, searchTerm, selectedCategory, selectedRegion, activeTab, isLoggedIn, currentUser]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Music": return <Music className="w-4 h-4" />;
      case "Cultural": return <Palette className="w-4 h-4" />;
      case "Food": return <Utensils className="w-4 h-4" />;
      case "Winter": return <Snowflake className="w-4 h-4" />;
      case "Summer": return <Sun className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "festival": return <Music className="w-4 h-4" />;
      case "day-trip": return <Camera className="w-4 h-4" />;
      case "activity": return <Compass className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "tentative": return "bg-yellow-100 text-yellow-800";
      case "tba": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "festival": return "bg-purple-100 text-purple-800";
      case "day-trip": return "bg-blue-100 text-blue-800";
      case "activity": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🎉 Festival & Activity Directory 2025
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Festivals, Day-trips & Activities across Ontario, Quebec, Montreal & Ottawa
              </p>
            </div>
            
            {/* User Authentication */}
            <div className="relative">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:block font-medium">{currentUser?.email}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                      <div className="py-2">
                        <div className="px-4 py-3 text-sm text-gray-700 border-b bg-gray-50">
                          <div className="font-medium">{currentUser?.email}</div>
                          <div className="text-xs text-gray-500 mt-1">Personalized Experience</div>
                        </div>
                        <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-200">
                          <Settings className="w-4 h-4 text-blue-600" />
                          <span>Preferences</span>
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-200">
                          <Bell className="w-4 h-4 text-blue-600" />
                          <span>Notifications</span>
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-200">
                          <Heart className="w-4 h-4 text-blue-600" />
                          <span>Saved Events</span>
                        </button>
                        <div className="border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-8 flex justify-center">
            <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setActiveTab('festival')}
                className={`px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === 'festival'
                    ? 'bg-white text-purple-600 shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Music className="w-5 h-5" />
                <span className="text-lg">Events</span>
              </button>
              <button
                onClick={() => setActiveTab('day-trip')}
                className={`px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === 'day-trip'
                    ? 'bg-white text-blue-600 shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="text-lg">Day-trips</span>
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === 'activity'
                    ? 'bg-white text-orange-600 shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Compass className="w-5 h-5" />
                <span className="text-lg">Activities</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}s...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredEvents.length}</span> {activeTab}s
          </p>
          {isLoggedIn && currentUser && (
            <p className="text-sm text-blue-600">
              {filteredEvents.filter(event => 
                currentUser.preferences.categories.includes(event.category) ||
                currentUser.preferences.regions.includes(event.region)
              ).length} match your preferences
            </p>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${
                isLoggedIn && currentUser && (
                  currentUser.preferences.categories.includes(event.category) ||
                  currentUser.preferences.regions.includes(event.region)
                ) ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-100'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(event.type)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                      {event.type.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center space-x-1">
                      {getCategoryIcon(event.category)}
                      <span>{event.category}</span>
                    </span>
                    {isLoggedIn && (
                      <button
                        onClick={() => toggleSaveEvent(event.id)}
                        className={`p-1 rounded-full transition-colors duration-200 ${
                          currentUser?.savedEvents.includes(event.id)
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${
                          currentUser?.savedEvents.includes(event.id) ? 'fill-current' : ''
                        }`} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Event Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {event.name}
                  {isLoggedIn && currentUser && (
                    currentUser.preferences.categories.includes(event.category) ||
                    currentUser.preferences.regions.includes(event.region)
                  ) && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </h3>

                {/* Date */}
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">{event.date}</span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{event.location}</span>
                </div>

                {/* Entry Fee */}
                <div className="flex items-center space-x-2 mb-4">
                  <DollarSign className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{event.entryFee}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Website Link */}
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Visit Website</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No {activeTab}s found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={loginForm.showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setLoginForm({...loginForm, showPassword: !loginForm.showPassword})}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {loginForm.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>
            <form onSubmit={handleSignup}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={signupForm.showPassword ? "text" : "password"}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setSignupForm({...signupForm, showPassword: !signupForm.showPassword})}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {signupForm.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSignup(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Set Your Preferences</h2>
            <p className="text-gray-600 mb-6">Help us personalize your experience by selecting your interests.</p>
            
            <form onSubmit={handleOnboarding}>
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Preferred Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onboardingForm.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setOnboardingForm({
                              ...onboardingForm,
                              categories: [...onboardingForm.categories, category]
                            });
                          } else {
                            setOnboardingForm({
                              ...onboardingForm,
                              categories: onboardingForm.categories.filter(c => c !== category)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex items-center space-x-1">
                        {getCategoryIcon(category)}
                        <span>{category}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Regions */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Preferred Regions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {regions.filter(region => region !== 'All').map(region => (
                    <label key={region} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onboardingForm.regions.includes(region)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setOnboardingForm({
                              ...onboardingForm,
                              regions: [...onboardingForm.regions, region]
                            });
                          } else {
                            setOnboardingForm({
                              ...onboardingForm,
                              regions: onboardingForm.regions.filter(r => r !== region)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Types */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Preferred Types</h3>
                <div className="grid grid-cols-1 gap-3">
                  {['festival', 'day-trip', 'activity'].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onboardingForm.types.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setOnboardingForm({
                              ...onboardingForm,
                              types: [...onboardingForm.types, type]
                            });
                          } else {
                            setOnboardingForm({
                              ...onboardingForm,
                              types: onboardingForm.types.filter(t => t !== type)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex items-center space-x-1">
                        {getTypeIcon(type)}
                        <span className="capitalize">{type}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowOnboarding(false);
                    setShowSignup(true);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Complete Setup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Important Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-2">Event Dates</h4>
                <p>Many 2025 dates are still being announced. Check individual websites for confirmed dates.</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Ticket Requirements</h4>
                <p>Most events require advance booking. Check official websites for pricing and availability.</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Weather Considerations</h4>
                <p>Outdoor events may be subject to weather-related changes or cancellations.</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Personalized Experience</h4>
                <p>Sign up to save events and get personalized recommendations based on your preferences.</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-400">
                Festival & Activity Directory 2025 - Your Personalized Event Discovery Platform
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
