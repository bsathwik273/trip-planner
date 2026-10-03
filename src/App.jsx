import { useState } from "react";
import {
  MapPin,
  Upload,
  Sparkles,
  Image,
  Video,
  ArrowRight,
  Check,
  LoaderCircle,
  X,
  Pencil,
  CalendarDays,
  Compass,
  Zap,
  Coffee,
} from "lucide-react";
import "./index.css";

function App() {
  const [files, setFiles] = useState([]);
  const [screen, setScreen] = useState("home");

  const [places, setPlaces] = useState([]);

  const [tripName, setTripName] = useState("My Trip");
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState("balanced");

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleContinue = async () => {
  if (files.length === 0) {
    return;
  }

  try {
    setScreen("processing");

    const extractedPlaces = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/extract-places",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Gemini response:", data);

      if (Array.isArray(data.places)) {
        data.places.forEach((place) => {
          const alreadyExists = extractedPlaces.some(
            (existingPlace) =>
              existingPlace.name.toLowerCase() ===
              place.name.toLowerCase()
          );

          if (!alreadyExists) {
            extractedPlaces.push({
              id: extractedPlaces.length + 1,
              name: place.name,
              city: place.city,
              region: place.region,
              country: place.country,
              confidence: place.confidence,
              location: [
                place.city,
                place.region,
                place.country,
              ]
                .filter(Boolean)
                .join(", "),
              source: file.name,
            });
          }
        });
      }
    }

    console.log("Final extracted places:", extractedPlaces);

    setPlaces(extractedPlaces);

    // Move to places screen only after Gemini finishes
    setScreen("places");

  } catch (error) {
    console.error("AI extraction failed:", error);
    setScreen("home");
  }
};

  const removePlace = (id) => {
    setPlaces((currentPlaces) =>
      currentPlaces.filter((place) => place.id !== id)
    );
  };

  const handlePlacesContinue = () => {
    if (places.length === 0) {
      return;
    }

    setScreen("settings");
  };

  const handleGenerate = () => {
    setScreen("itinerary");
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("video/")) {
      return <Video size={20} />;
    }

    return <Image size={20} />;
  };

  const placesPerDay =
    places.length > 0
      ? Math.ceil(places.length / days)
      : 0;

  const dayGroups = [];

  if (placesPerDay > 0) {
    for (let i = 0; i < days; i++) {
      const start = i * placesPerDay;
      const end = start + placesPerDay;
      const dayPlaces = places.slice(start, end);

      if (dayPlaces.length > 0) {
        dayGroups.push(dayPlaces);
      }
    }
  }

  return (
    <div className="app">

      {/* =========================
          HOME SCREEN
      ========================= */}

      {screen === "home" && (
        <>
          <nav className="navbar">
            <div className="logo">
              <div className="logo-icon">
                <MapPin size={20} />
              </div>

              <span>Triply</span>
            </div>

            <div className="nav-right">
              <span>AI Trip Planner</span>

              <div className="profile">
                S
              </div>
            </div>
          </nav>

          <main className="hero">
            <div className="hero-content">

              <div className="badge">
                <Sparkles size={15} />
                AI TRIP PLANNER
              </div>

              <h1>
                Turn your saved
                <br />
                <span>travel inspiration</span>
                <br />
                into a real trip.
              </h1>

              <p className="subtitle">
                Upload your screenshots, saved reels, and travel
                videos. Triply finds the places and builds your
                itinerary automatically.
              </p>

              <label className="upload-card">

                <div className="upload-icon">
                  <Upload size={28} />
                </div>

                <h2>
                  Drop your travel inspiration here
                </h2>

                <p>
                  Screenshots, photos, or saved videos
                </p>

                <span className="browse-button">
                  <Upload size={18} />
                  Choose Files
                </span>

                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFiles}
                />

              </label>

              {files.length > 0 && (
                <section className="files-section">

                  <h3>
                    Selected files ({files.length})
                  </h3>

                  <div className="file-list">

                    {files.map((file, index) => (
                      <div
                        className="file-item"
                        key={index}
                      >
                        {getFileIcon(file)}

                        <span>
                          {file.name}
                        </span>
                      </div>
                    ))}

                  </div>

                  <button
                    className="continue-button"
                    onClick={handleContinue}
                  >
                    Find Places
                    <ArrowRight size={18} />
                  </button>

                </section>
              )}

              <section className="features">

                <div>
                  <Sparkles size={17} />
                  AI Place Extraction
                </div>

                <div>
                  <Compass size={17} />
                  Smart Grouping
                </div>

                <div>
                  <CalendarDays size={17} />
                  Day-by-Day Planning
                </div>

              </section>

            </div>
          </main>
        </>
      )}

      {/* =========================
          PROCESSING SCREEN
      ========================= */}

      {screen === "processing" && (
        <>
          <nav className="navbar">
            <div className="logo">
              <div className="logo-icon">
                <MapPin size={20} />
              </div>

              <span>Triply</span>
            </div>

            <div className="profile">
              S
            </div>
          </nav>

          <main className="processing-page">

            <div className="processing-card">

              <div className="processing-icon">
                <LoaderCircle
                  size={38}
                  className="spinner"
                />
              </div>

              <div className="badge">
                <Sparkles size={15} />
                AI PROCESSING
              </div>

              <h1>
                Analyzing your
                <br />
                <span>travel inspiration</span>
              </h1>

              <p className="subtitle">
                Triply is reading your files and identifying
                the places you might want to visit.
              </p>

              <div className="processing-steps">

                <div className="processing-step completed">

                  <div className="step-icon">
                    <Check size={16} />
                  </div>

                  <div>
                    <strong>
                      Reading your files
                    </strong>

                    <p>
                      Your uploaded files are being analyzed.
                    </p>
                  </div>

                </div>

                <div className="processing-step active">

                  <div className="step-icon">
                    <LoaderCircle
                      size={16}
                      className="spinner"
                    />
                  </div>

                  <div>
                    <strong>
                      Finding places
                    </strong>

                    <p>
                      AI is identifying destinations.
                    </p>
                  </div>

                </div>

                <div className="processing-step">

                  <div className="step-icon">
                    <CalendarDays size={16} />
                  </div>

                  <div>
                    <strong>
                      Organizing your trip
                    </strong>

                    <p>
                      Your itinerary will be prepared next.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </main>
        </>
      )}

      {/* =========================
          PLACES SCREEN
      ========================= */}

      {screen === "places" && (
        <>
          <nav className="navbar">
            <div className="logo">
              <div className="logo-icon">
                <MapPin size={20} />
              </div>

              <span>Triply</span>
            </div>

            <div className="profile">
              S
            </div>
          </nav>

          <main className="places-page">

            <div className="places-content">

              <div className="badge">
                <Sparkles size={14} />
                AI EXTRACTION COMPLETE
              </div>

              <h1>
                We found your
                <br />
                <span>travel places.</span>
              </h1>

              <p className="subtitle">
                Review the places Triply discovered from
                your uploaded files.
              </p>

              <div className="places-header">

                <div>
                  <MapPin size={18} />

                  <strong>
                    {places.length}{" "}
                    {places.length === 1
                      ? "place"
                      : "places"}{" "}
                    found
                  </strong>
                </div>

                <span>
                  AI DETECTED
                </span>

              </div>

              {places.length === 0 ? (
                <div className="empty-places">

                  <MapPin size={32} />

                  <h3>
                    No places found
                  </h3>

                  <p>
                    Gemini could not confidently identify
                    a specific destination from your files.
                  </p>

                </div>
              ) : (
                <div className="places-list">

                  {places.map((place) => (
                    <div
                      className="place-card"
                      key={place.id}
                    >

                      <div className="place-icon">
                        <MapPin size={20} />
                      </div>

                      <div className="place-info">

                        <h3>
                          {place.name}
                        </h3>

                        <p>
                          {place.location}
                        </p>

                        <span className="place-source">
                          From {place.source}
                        </span>

                      </div>

                      <div className="place-actions">

                        <button
                          className="remove-place"
                          onClick={() =>
                            removePlace(place.id)
                          }
                          title="Remove place"
                        >
                          <X size={17} />
                        </button>

                      </div>

                    </div>
                  ))}

                </div>
              )}

              {places.length > 0 && (
                <button
                  className="places-continue"
                  onClick={handlePlacesContinue}
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              )}

            </div>

          </main>
        </>
      )}

      {/* =========================
          SETTINGS SCREEN
      ========================= */}

      {screen === "settings" && (
        <>
          <nav className="navbar">
            <div className="logo">
              <div className="logo-icon">
                <MapPin size={20} />
              </div>

              <span>Triply</span>
            </div>

            <div className="profile">
              S
            </div>
          </nav>

          <main className="settings-page">

            <div className="settings-content">

              <div className="badge">
                <Compass size={14} />
                TRIP SETTINGS
              </div>

              <h1>
                Let's plan your
                <br />
                <span>perfect trip.</span>
              </h1>

              <p className="subtitle">
                Tell Triply a little about your trip.
              </p>

              <div className="setting-group">

                <label>
                  Trip name
                </label>

                <div className="input-wrapper">

                  <MapPin size={18} />

                  <input
                    type="text"
                    value={tripName}
                    onChange={(event) =>
                      setTripName(event.target.value)
                    }
                    placeholder="My Trip"
                  />

                </div>

              </div>

              <div className="setting-group">

                <label>
                  Number of Days
                </label>

                <div className="days-options">

                  {[2, 3, 4, 5].map((number) => (
                    <button
                      key={number}
                      className={
                        days === number
                          ? "day-option selected"
                          : "day-option"
                      }
                      onClick={() =>
                        setDays(number)
                      }
                    >
                      <CalendarDays size={15} />
                      {number} Days
                    </button>
                  ))}

                </div>

              </div>

              <div className="setting-group">

                <label>
                  Planning Style
                </label>

                <div className="style-options">

                  <button
                    className={
                      style === "relaxed"
                        ? "style-option selected"
                        : "style-option"
                    }
                    onClick={() =>
                      setStyle("relaxed")
                    }
                  >
                    <Coffee size={20} />

                    <div>
                      <strong>
                        Relaxed
                      </strong>

                      <span>
                        Fewer places, more free time
                      </span>
                    </div>

                  </button>

                  <button
                    className={
                      style === "balanced"
                        ? "style-option selected"
                        : "style-option"
                    }
                    onClick={() =>
                      setStyle("balanced")
                    }
                  >
                    <Compass size={20} />

                    <div>
                      <strong>
                        Balanced
                      </strong>

                      <span>
                        A mix of exploring and relaxing
                      </span>
                    </div>

                  </button>

                  <button
                    className={
                      style === "packed"
                        ? "style-option selected"
                        : "style-option"
                    }
                    onClick={() =>
                      setStyle("packed")
                    }
                  >
                    <Zap size={20} />

                    <div>
                      <strong>
                        Packed
                      </strong>

                      <span>
                        See as much as possible
                      </span>
                    </div>

                  </button>

                </div>

              </div>

              <div className="settings-summary">

                <div>
                  <MapPin size={15} />
                  {places.length} places
                </div>

                <div>
                  <CalendarDays size={15} />
                  {days} days
                </div>

                <div>
                  <Compass size={15} />
                  {style}
                </div>

              </div>

              <button
                className="generate-button"
                onClick={handleGenerate}
              >
                Generate My Trip
                <Sparkles size={17} />
              </button>

            </div>

          </main>
        </>
      )}

      {/* =========================
          ITINERARY SCREEN
      ========================= */}

      {screen === "itinerary" && (
        <>
          <nav className="navbar">
            <div className="logo">
              <div className="logo-icon">
                <MapPin size={20} />
              </div>

              <span>Triply</span>
            </div>

            <div className="profile">
              S
            </div>
          </nav>

          <main className="itinerary-page">

            <div className="itinerary-content">

              <div className="itinerary-top">

                <div>

                  <div className="badge">
                    <Sparkles size={14} />
                    YOUR AI ITINERARY
                  </div>

                  <h1>
                    {tripName}
                  </h1>

                  <p className="itinerary-subtitle">
                    {days} days · {style} planning ·{" "}
                    {places.length} places
                  </p>

                </div>

                <div className="trip-icon">
                  <Compass size={28} />
                </div>

              </div>

              <div className="ai-summary">

                <div className="summary-icon">
                  <Sparkles size={19} />
                </div>

                <div>
                  <strong>
                    Your trip is ready
                  </strong>

                  <p>
                    Triply has organized your saved
                    places into a {days}-day itinerary.
                  </p>
                </div>

              </div>

              {dayGroups.map((dayPlaces, index) => (
                <section
                  className="day-section"
                  key={index}
                >

                  <div className="day-header">

                    <div className="day-number">
                      {index + 1}
                    </div>

                    <div>

                      <h2>
                        Day {index + 1}
                      </h2>

                      <p>
                        {dayPlaces.length} places
                        to explore
                      </p>

                    </div>

                  </div>

                  <div className="timeline">

                    <div className="timeline-item">

                      <div className="timeline-dot">
                        <Coffee size={16} />
                      </div>

                      <div className="timeline-content">

                        <span className="time">
                          8:30 AM
                        </span>

                        <h3>
                          Breakfast
                        </h3>

                        <p>
                          Start your day with a relaxed
                          breakfast nearby.
                        </p>

                        <span className="duration">
                          1 hour
                        </span>

                      </div>

                    </div>

                    {dayPlaces.map((place, placeIndex) => (
                      <div
                        className="timeline-item"
                        key={place.id}
                      >

                        <div className="timeline-dot">
                          <MapPin size={16} />
                        </div>

                        <div className="timeline-content">

                          <span className="time">
                            {10 + placeIndex}:00 AM
                          </span>

                          <h3>
                            {place.name}
                          </h3>

                          <p>
                            Explore {place.name} and
                            enjoy the experience.
                          </p>

                          <span className="duration">
                            2 hours
                          </span>

                        </div>

                      </div>
                    ))}

                    <div className="timeline-item">

                      <div className="timeline-dot">
                        <Coffee size={16} />
                      </div>

                      <div className="timeline-content">

                        <span className="time">
                          8:00 PM
                        </span>

                        <h3>
                          Dinner
                        </h3>

                        <p>
                          End the day with a good meal
                          and some time to relax.
                        </p>

                        <span className="duration">
                          1.5 hours
                        </span>

                      </div>

                    </div>

                  </div>

                </section>
              ))}

              <div className="itinerary-footer">

                <p>
                  Want to change your places or
                  trip settings?
                </p>

                <button
                  className="new-trip-button"
                  onClick={() =>
                    setScreen("places")
                  }
                >
                  <Pencil size={16} />
                  Edit Places
                </button>

                <button
                  className="new-trip-button"
                  onClick={() =>
                    setScreen("home")
                  }
                >
                  New Trip
                  <ArrowRight size={16} />
                </button>

              </div>

            </div>

          </main>
        </>
      )}

    </div>
  );
}

export default App;