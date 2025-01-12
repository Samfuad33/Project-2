# MapWise 🗺️

## 🛠️ Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Database**:
  - MongoDB
  - Mongoose ODM
- **Styling**: 
  - Tailwind CSS
  - Magic UI (Shine Border Effect)
- **Maps Integration**:
  - Google Maps API
  - Google Places API
  - Geocoding API
- **State Management**: React Hooks
- **Icons**: Lucide React
- **Storage**: 
  - Local Storage API
  - MongoDB Atlas

## 📦 Installation

1. **Search for a Location**
   - Enter a location in the search bar
   - Select from the autocomplete suggestions
   - View the location on the map

2. **Explore Nearby Places**
   - Use the category filters to find specific types of places
   - Click on markers to view more information
   - Add places to your favorites

3. **Manage Favorites**
   - Click the heart icon to save a location
   - Access saved locations in the Favorites tab
   - Click "View on Map" to quickly navigate to a saved location

4. Set up MongoDB:
```env
MONGODB_URI=your_mongodb_connection_string
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💾 Database Setup

1. Create a MongoDB Atlas account or use an existing one
2. Create a new cluster
3. Get your connection string
4. Add the connection string to your `.env.local` file
5. Database collections:
   - `users`: Stores user information
   - `favorites`: Stores user favorites
   - `locations`: Caches frequently accessed location data

## 🔑 API Key Setup
To use MapWise, you'll need a Google Maps API key with the following APIs enabled:
- Maps JavaScript API
- Places API
- Geocoding API

Follow these steps to get your API key:
1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the required APIs
4. Create credentials (API key)
5. Add any necessary API key restrictions

## 💡 Usage

1. **Search for a Location**
   - Enter a location in the search bar
   - Select from the autocomplete suggestions
   - View the location on the map

2. **Explore Nearby Places**
   - Use the category filters to find specific types of places
   - Click on markers to view more information
   - Add places to your favorites

3. **Manage Favorites**
   - Click the heart icon to save a location
   - Access saved locations in the Favorites tab
   - Click "View on Map" to quickly navigate to a saved location

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👏 Acknowledgments

- Google Maps Platform for their comprehensive mapping services
- The Next.js team for their excellent framework
- The Tailwind CSS team for their utility-first CSS framework
- Magic UI for their beautiful shine border effect
