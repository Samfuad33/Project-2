# MapWise 🗺️

[Previous introduction stays the same...]

## 🌟 Features

[Previous features section stays the same...]

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





[Rest of the README stays the same...]
