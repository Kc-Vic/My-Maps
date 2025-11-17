// 1. Initialize the map (centered on Nigeria)
var map = L.map('map').setView([9.08, 8.68], 6);

// 2. Add the base map tile layer
// This URL points to CARTO's "Positron" light gray map
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

// 3. Define the 15 ECOWAS country codes (ISO A3 3-letter codes)
const ecowasCodes = [
  "BEN", "BFA", "CPV", "CIV", "GMB", "GHA", "GIN", "GNB",
  "LBR", "MLI", "NER", "NGA", "SEN", "SLE", "TGO"
];

// (NEW) Define countries that have withdrawn
const withdrawnCodes = [
  "NER", // Niger
  "MLI", // Mali
  "BFA"  // Burkina Faso
];

// 4. (NEW) CREATE OUR CUSTOM DATA OBJECT
// Data based on 2025 UNPD projections (used by WorldPop)
// Chairmanship list is compiled from ECOWAS records.
const ecowasData = {
  "BEN": {
    headOfState: "Patrice Guillaume Athanase Talon",
    population: "13 M",
    previousChairs: [
      { name: "Mathieu Kérékou", years: "1982–1983" },
      { name: "Nicéphore Soglo", years: "1993–1994" }
    ]
  },
  "BFA": {
    headOfState: "Ibrahim Traoré (Interim)",
    population: "24.1 M",
    previousChairs: [
      { name: "Blaise Compaoré", years: "1990–1991 & 2007–2008" }
    ]
  },
  "CPV": {
    headOfState: "José Maria Neves",
    population: "0.5 M",
    previousChairs: [] // Cabo Verde has not held the chair
  },
  "CIV": {
    headOfState: "Alassane Ouattara",
    population: "27 M",
    previousChairs: [
      { name: "Alassane Ouattara", years: "2012–2014" }
    ]
  },
  "GMB": {
    headOfState: "Adama Barrow",
    population: "2 M",
    previousChairs: [
      { name: "Dawda Jawara", years: "1989–1990 & 1991-1992" }
    ]
  },
  "GHA": {
    headOfState: "John Dramani Mahama",
    population: "27 M",
    previousChairs: [
      { name: "Jerry John Rawlings", years: "1994–1996" },
      { name: "John Agyekum Kufuor", years: "2003–2005" },
      { name: "John Dramani Mahama", years: "2014–2015" },
      { name: "Nana Akufo-Addo", years: "2020–2022" }
    ]
  },
  "GIN": {
    headOfState: "Mamady Doumbouya (Interim)",
    population: "15.1 M",
    previousChairs: [
      { name: "Ahmed Sékou Touré", years: "1983–1984" },
      { name: "Lansana Conté", years: "1984–1985" }
    ]
  },
  "GNB": {
    headOfState: "Umaro Sissoco Embaló",
    population: "2.2 M",
    previousChairs: [
      { name: "Umaro Sissoco Embaló", years: "2022–2023" }
    ]
  },
  "LBR": {
    headOfState: "Joseph Boakai",
    population: "5.7 M",
    previousChairs: [
      { name: "Madam Ellen Johnson Sirleaf", years: "2016–2017" }
    ]
  },
  "MLI": {
    headOfState: "Assimi Goïta (Interim)",
    population: "25.2 M",
    previousChairs: [
      { name: "Alpha Oumar Konaré", years: "1999-2001" }
    ]
  },
  "NER": {
    headOfState: "Abdourahamane Tchiani (Interim)",
    population: "27.9 M",
    previousChairs: [
      { name: "Mamadou Tandja", years: "2005–2007" },
      { name: "Mahamadou Issoufou", years: "2019–2020" }
    ]
  },
  "NGA": {
    headOfState: "Bola Tinubu",
    population: "237.5 M",
    previousChairs: [
      { name: "Olusegun Obasanjo", years: "1978–1979" },
      { name: "Muhammadu Buhari", years: "1985 (July-Aug)" },
      { name: "Ibrahim Babangida", years: "1985–1989" },
      { name: "Sani Abacha", years: "1996–1998" },
      { name: "Abdulsalami Abubakar", years: "1998–1999" },
      { name: "Umaru Musa Yar'Adua", years: "2008–2010" },
      { name: "Goodluck Jonathan", years: "2010–2012" },
      { name: "Muhammadu Buhari", years: "2018–2019" },
      { name: "Bola Tinubu", years: "2023–2025" }
    ]
  },
  "SEN": {
    headOfState: "Bassirou Diomaye Faye",
    population: "18.9 M",
    previousChairs: [
      { name: "Léopold Sédar Senghor", years: "1979–1980" },
      { name: "Abdou Diouf", years: "1992–1993" },
      { name: "Abdoulaye Wade", years: "2001–2003" },
      { name: "Macky Sall", years: "2015–2016" }
    ]
  },
  "SLE": {
    headOfState: "Julius Maada Bio",
    population: "8.8 M",
    previousChairs: [
      { name: "Siaka Stevens", years: "1981–1982" },
      { name: "Julius Maada Bio", years: "2025-Present" }
    ]
  },
  "TGO": {
    headOfState: "Faure Gnassingbé",
    population: "9.7 M",
    previousChairs: [
      { name: "Gnassingbé Eyadéma", years: "1977–1978 & 1980–1981 & 1999" },
      { name: "Faure Gnassingbé", years: "2017–2018" }
    ]
  }
};

// 5. Define a style for our ECOWAS polygons
const ecowasStyle = {
  color: "#006400",       // Dark green border
  weight: 2,             // Border weight
  opacity: 1,
  fillColor: "#008000",    // Green fill color
  fillOpacity: 0.1      // A bit transparent
};

// (NEW) Define a style for withdrawn countries
const withdrawnStyle = {
  color: "#A00000",       // Dark red border
  weight: 2,
  opacity: 1,
  fillColor: "#DC143C",    // Crimson red fill
  fillOpacity: 0.4
};

// 6. Define the URL for the world countries GeoJSON data
const geoJsonUrl = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

// 7. Use the fetch() API to load the external GeoJSON file
fetch(geoJsonUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // 'data' is now the full GeoJSON object

    // (Debugging logs - you can remove these if you want)
    if (data.features && data.features.length > 0) {
      console.log("Properties of first country:", data.features[0].properties);
    }

    // 8. Filter the GeoJSON to get only ECOWAS countries
    const ecowasFeatures = data.features.filter(feature => {
      if (feature && feature.properties && feature.properties['ISO3166-1-Alpha-3']) {
        // Use the correct property name we found
        return ecowasCodes.includes( feature.properties['ISO3166-1-Alpha-3'] );
      }
      return false;
    });

    console.log("Found this many ECOWAS countries:", ecowasFeatures.length);

    // 9. (MODIFIED) Create the GeoJSON object
    const ecowasGeoJSON = {
      type: "FeatureCollection",
      features: ecowasFeatures
    };

// 10. (MODIFIED) Add the polygons and popups to the map
    L.geoJSON(ecowasGeoJSON, {
      
      // (MODIFIED) Apply style based on country's status
      style: function(feature) {
        const code = feature.properties['ISO3166-1-Alpha-3'];
        if (withdrawnCodes.includes(code)) {
          return withdrawnStyle; // Apply red style
        } else {
          return ecowasStyle; // Apply green style
        }
      },
      
      // (MODIFIED) This function runs for each country to add popups
      onEachFeature: function(feature, layer) {
        
        // 1. Get data from the GeoJSON
        const code = feature.properties['ISO3166-1-Alpha-3'];
        const countryName = feature.properties.name;
        
        // 2. Look up our custom data
        const customData = ecowasData[code];
        
        // 3. (MODIFIED) Determine status and build the popup
        let status = "Member";
        let statusColor = "#006400"; // Green
        
        if (withdrawnCodes.includes(code)) {
          status = "Withdrawn";
          statusColor = "#DC143C"; // Red
        }
        
        // 4. Build the HTML for the popup
        let popupContent = `<b style="font-size: 1.1em;">${countryName}</b>`;
        
        // Add the new Status line
        popupContent += `<br><b>Status:</b> <span style="color: ${statusColor};">${status}</span>`;
        
        if (customData) {
          // Add the rest of the custom data
          popupContent += `<br><b>Head of State:</b> ${customData.headOfState}`;
          popupContent += `<br><b>Population:</b> ~${customData.population}`;
          
          // --- Section to add chairs ---
          popupContent += `<br><br><b>Previous ECOWAS Chairs:</b>`;
          if (customData.previousChairs.length > 0) {
            popupContent += `<ul style="margin: 5px 0 0 20px; padding: 0;">`; // Start an HTML list
            customData.previousChairs.forEach(chair => {
              popupContent += `<li>${chair.name} (${chair.years})</li>`;
            });
            popupContent += `</ul>`; // End the HTML list
          } else {
            popupContent += ` (None)`;
          }
          // --- End of chairs section ---

        } else {
          popupContent += `<br>Extra data not found.`;
        }

    // 5. Bind the popup to the country's layer
    layer.bindPopup(popupContent);
  }
}).addTo(map);

  })
  .catch(error => {
    // Log an error to the console if the file fails to load
    console.error('Error loading GeoJSON data:', error);
  });