export const translations = {
  en: {
    dashboard: {
      greeting: 'Good Morning Satish 👋 | Your Farm Status',
      welcome: "Welcome back, here's your farm's command center.",
      weather: {
        title: 'Weather',
        description: 'Current & 3-day forecast.',
      },
      activeCrop: {
        title: 'Active Crop: Tomato',
        description: 'Flowering stage, 45 days remaining.',
      },
      viewDetails: 'View Details',
    },
  },
  te: {
    dashboard: {
      greeting: 'శుభోదయం సతీష్ 👋 | మీ పంట స్థితి',
      welcome: 'తిరిగి స్వాగతం, ఇక్కడ మీ వ్యవసాయ క్షేత్రం యొక్క కమాండ్ సెంటర్ ఉంది.',
      weather: {
        title: 'వాతావరణం',
        description: 'ప్రస్తుత & 3-రోజుల సూచన.',
      },
      activeCrop: {
        title: 'క్రియాశీల పంట: టమోటా',
        description: 'పూత దశ, 45 రోజులు మిగిలి ఉన్నాయి.',
      },
      viewDetails: 'వివరాలను వీక్షించండి',
    },
  },
  hi: {
    dashboard: {
      greeting: 'सुप्रभात सतीश 👋 | आपके खेत की स्थिति',
      welcome: 'वापस स्वागत है, यहाँ आपके खेत का कमांड सेंटर है।',
      weather: {
        title: 'मौसम',
        description: 'वर्तमान और 3-दिन का पूर्वानुमान।',
      },
      activeCrop: {
        title: 'सक्रिय फसल: टमाटर',
        description: 'फूल आने की अवस्था, 45 दिन शेष।',
      },
      viewDetails: 'विवरण देखें',
    },
  },
};

export type Translations = typeof translations;
