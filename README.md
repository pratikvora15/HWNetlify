# Festival & Activity Directory 2025 - Google Sheets Integration

A beautiful, production-ready web application that displays festivals, day-trips, and activities across Ontario, Quebec, Montreal & Ottawa, with real-time Google Sheets integration.

## 🚀 Features

### 📊 Google Sheets Integration
- **Real-time sync** - Data automatically updates every 5 minutes
- **Manual sync** - Refresh button for immediate updates
- **Error handling** - Clear feedback for connection issues
- **Easy setup** - Simple configuration process

### 🎯 Event Management
- **Three event types**: Festivals, Day-trips, Activities
- **Complete information**: Dates, locations, pricing, descriptions
- **Status tracking**: Confirmed, Tentative, TBA
- **Direct website links** for each event

### 🔍 Advanced Filtering
- **Search functionality** - Find events by name, location, or description
- **Type filters** - Festival, Day-trip, Activity
- **Category filters** - Music, Cultural, Food, Winter, Summer
- **Region filters** - Ontario, Ottawa, Montreal, Quebec

### 📱 Beautiful Design
- **Responsive layout** that works on all devices
- **Modern card-based design** with hover effects
- **Color-coded indicators** for status and type
- **Category and type icons** for easy identification

## 📋 Google Sheets Setup

### Step 1: Create Your Google Sheet

Create a new Google Sheet with the following column structure:

| Column | Description | Example |
|--------|-------------|---------|
| A - Name | Event name | "Ottawa Bluesfest" |
| B - Date | Event dates | "July 10-20, 2025" |
| C - Location | Event location | "Ottawa, ON" |
| D - Entry Fee | Pricing information | "$89-$299" |
| E - Description | Event description | "Premier music festival..." |
| F - Website | Official website URL | "https://www.ottawabluesfest.ca/" |
| G - Category | Event category | "Music" |
| H - Region | Geographic region | "Ottawa" |
| I - Status | Event status | "confirmed" |
| J - Type | Event type | "festival" |

### Step 2: Make Sheet Public

1. Click **Share** in your Google Sheet
2. Change access to **"Anyone with the link can view"**
3. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 3: Get Google Sheets API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**
4. Create credentials (API Key)
5. Copy your API key

### Step 4: Configure the Application

Update the `GOOGLE_SHEETS_CONFIG` in `src/App.tsx`:

```typescript
const GOOGLE_SHEETS_CONFIG = {
  SHEET_ID: 'your-actual-sheet-id-here',
  API_KEY: 'your-actual-api-key-here',
  RANGE: 'Events!A:J' // Adjust if needed
};
```

## 📝 Data Format Guidelines

### Categories
- Music
- Cultural
- Food
- Winter
- Summer

### Regions
- Ontario
- Ottawa
- Montreal
- Quebec

### Status Options
- confirmed
- tentative
- tba

### Type Options
- festival
- day-trip
- activity

## 🔄 How Sync Works

1. **Automatic Sync**: Every 5 minutes
2. **Manual Sync**: Click the "Sync with Google Sheets" button
3. **Error Handling**: Clear error messages if sync fails
4. **Status Display**: Shows last sync time and current status

## 🎨 Sample Data Included

The application includes sample data to demonstrate functionality:
- Ottawa Bluesfest (Festival)
- Rideau Canal Skating (Activity)
- Thousand Islands Day Trip (Day-trip)
- Montreal Jazz Festival (Festival)
- Old Montreal Walking Tour (Activity)
- Blue Mountain Ski Day Trip (Day-trip)

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your Google Sheet (see setup instructions above)
4. Update the configuration with your Sheet ID and API key
5. Start the development server: `npm run dev`

## 🔧 Technical Features

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Google Sheets API v4** integration
- **Responsive design** with mobile-first approach
- **Error boundaries** and loading states
- **Auto-refresh** functionality

## 📱 Responsive Design

- **Mobile**: Single column layout
- **Tablet**: Two column grid
- **Desktop**: Three column grid
- **Large screens**: Optimized spacing and typography

## 🎯 Use Cases

Perfect for:
- Tourism boards
- Event organizers
- Travel bloggers
- Local government websites
- Community organizations
- Tourism businesses

## 🔒 Security Notes

- API keys should be environment variables in production
- Consider implementing rate limiting
- Use HTTPS for all API calls
- Regularly rotate API keys

## 📈 Future Enhancements

- User authentication
- Event favorites/bookmarking
- Calendar integration
- Social sharing
- Advanced search filters
- Map integration
- Event notifications

---

**Ready to manage your events with Google Sheets? Follow the setup guide above and start syncing your data in minutes!**