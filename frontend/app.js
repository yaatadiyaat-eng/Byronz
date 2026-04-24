const STORAGE_KEYS = {
  chats: "byronz_chats",
  session: "byronz_session_id",
  mode: "byronz_mode",
  settings: "byronz_settings"
};

const APP_RELEASE = Object.freeze({
  versionName: String(window.BYRONZ_RELEASE?.versionName || "1.2.0"),
  versionCode: Number(window.BYRONZ_RELEASE?.versionCode || 120),
  androidPackageId: String(window.BYRONZ_RELEASE?.appId || "ai.byronz.app"),
  appName: String(window.BYRONZ_RELEASE?.appName || "Byronz")
});

const MODE_CONFIG = {
  general: {
    requestMode: "general",
    label: { indonesian: "Smart", english: "Smart" },
    placeholder: {
      indonesian: "Tanyakan sesuatu ke Byronz...",
      english: "Ask Byronz anything..."
    },
    focus: {
      indonesian: "jawaban umum yang rapi.",
      english: "clean general answers."
    }
  },
  code: {
    requestMode: "code",
    label: { indonesian: "Code", english: "Code" },
    placeholder: {
      indonesian: "Minta bantuan coding, debug, atau refactor...",
      english: "Ask for coding, debugging, or refactor help..."
    },
    focus: {
      indonesian: "debugging dan implementasi teknis.",
      english: "debugging and technical implementation."
    }
  },
  english_tutor: {
    requestMode: "english_tutor",
    label: { indonesian: "English", english: "English" },
    placeholder: {
      indonesian: "Latihan grammar, speaking, atau writing...",
      english: "Practice grammar, speaking, or writing..."
    },
    focus: {
      indonesian: "latihan grammar dan writing.",
      english: "grammar and writing practice."
    }
  },
  business: {
    requestMode: "business",
    label: { indonesian: "Bisnis", english: "Business" },
    placeholder: {
      indonesian: "Tanya strategi bisnis, branding, atau growth...",
      english: "Ask about business strategy, branding, or growth..."
    },
    focus: {
      indonesian: "strategi dan keputusan bisnis.",
      english: "strategy and business decisions."
    }
  },
  creative: {
    requestMode: "creative",
    label: { indonesian: "Creative", english: "Creative" },
    placeholder: {
      indonesian: "Minta ide, konsep, atau copywriting...",
      english: "Ask for ideas, concepts, or copywriting..."
    },
    focus: {
      indonesian: "ide dan konsep kreatif.",
      english: "ideas and creative concepts."
    }
  },
  data_analysis: {
    requestMode: "data_analysis",
    label: { indonesian: "Data", english: "Data" },
    placeholder: {
      indonesian: "Analisis metrik, tren, atau data...",
      english: "Analyze metrics, trends, or data..."
    },
    focus: {
      indonesian: "insight dan pembacaan data.",
      english: "insights and data reading."
    }
  },
  chatbot: {
    requestMode: "chatbot",
    label: { indonesian: "Bot", english: "Bot" },
    placeholder: {
      indonesian: "Rancang flow chatbot atau FAQ...",
      english: "Design a chatbot flow or FAQ..."
    },
    focus: {
      indonesian: "flow chatbot dan intent.",
      english: "chatbot flow and intent."
    }
  },
  vision: {
    requestMode: "vision",
    label: { indonesian: "Vision", english: "Vision" },
    placeholder: {
      indonesian: "Bahas UI, layout, atau visual...",
      english: "Discuss UI, layout, or visual direction..."
    },
    focus: {
      indonesian: "layout dan visual.",
      english: "layout and visual direction."
    }
  },
  automation: {
    requestMode: "automation",
    label: { indonesian: "Auto", english: "Auto" },
    placeholder: {
      indonesian: "Buat workflow atau SOP...",
      english: "Build a workflow or SOP..."
    },
    focus: {
      indonesian: "workflow dan SOP.",
      english: "workflow and SOP."
    }
  },
  researcher: {
    requestMode: "researcher",
    label: { indonesian: "Riset", english: "Research" },
    placeholder: {
      indonesian: "Minta riset atau rangkuman mendalam...",
      english: "Ask for research or a deep summary..."
    },
    focus: {
      indonesian: "riset dan sintesis.",
      english: "research and synthesis."
    }
  }
};

const ATTACHMENT_DEFAULT_PROMPTS = {
  general: {
    indonesian: "Analisis lampiran ini dan jelaskan poin pentingnya dengan jelas.",
    english: "Analyze this attachment and explain the important points clearly."
  },
  code: {
    indonesian: "Analisis file ini, temukan masalah penting, lalu berikan solusi teknis yang tepat.",
    english: "Analyze this file, identify important issues, and provide the right technical solution."
  },
  english_tutor: {
    indonesian: "Analisis lampiran ini dan bantu saya belajar English berdasarkan isi file atau gambar ini.",
    english: "Analyze this attachment and help me learn English from its content."
  },
  business: {
    indonesian: "Analisis lampiran ini dari sudut pandang bisnis dan berikan insight yang bisa dipakai.",
    english: "Analyze this attachment from a business perspective and give actionable insights."
  },
  creative: {
    indonesian: "Analisis lampiran ini untuk menemukan ide, arah kreatif, dan perbaikan yang menarik.",
    english: "Analyze this attachment to uncover ideas, creative direction, and meaningful improvements."
  },
  data_analysis: {
    indonesian: "Analisis lampiran ini seperti seorang analis data dan jelaskan insight utamanya.",
    english: "Analyze this attachment like a data analyst and explain the main insights."
  },
  chatbot: {
    indonesian: "Analisis lampiran ini untuk menyusun flow chatbot, intent, atau pola percakapan yang lebih baik.",
    english: "Analyze this attachment to improve chatbot flows, intents, or conversation patterns."
  },
  vision: {
    indonesian: "Analisis lampiran ini dari sisi visual, UI, layout, dan kualitas tampilannya.",
    english: "Analyze this attachment from a visual, UI, layout, and presentation perspective."
  },
  automation: {
    indonesian: "Analisis lampiran ini lalu ubah menjadi workflow, SOP, atau langkah otomatis yang rapi.",
    english: "Analyze this attachment and turn it into a clean workflow, SOP, or automation plan."
  },
  researcher: {
    indonesian: "Analisis lampiran ini secara mendalam lalu rangkum temuan pentingnya.",
    english: "Analyze this attachment deeply and summarize the most important findings."
  }
};

const AUTO_MODEL_PRIORITY = {
  general: ["openai/gpt-oss-20b", "llama-3.1-8b-instant", "llama3:latest", "mistral:latest"],
  code: ["openai/gpt-oss-20b", "qwen/qwen3-32b", "llama3:latest", "mistral:latest"],
  english_tutor: ["openai/gpt-oss-20b", "llama-3.1-8b-instant", "llama3:latest", "mistral:latest"],
  business: ["openai/gpt-oss-20b", "llama-3.3-70b-versatile", "llama3:latest", "mistral:latest"],
  creative: ["llama-3.3-70b-versatile", "openai/gpt-oss-20b", "mistral:latest", "llama3:latest"],
  data_analysis: ["qwen/qwen3-32b", "openai/gpt-oss-20b", "llama3:latest", "mistral:latest"],
  chatbot: ["llama-3.1-8b-instant", "openai/gpt-oss-20b", "mistral:latest", "llama3:latest"],
  vision: ["openai/gpt-oss-20b", "llama-3.3-70b-versatile", "llama3:latest", "mistral:latest"],
  automation: ["openai/gpt-oss-20b", "llama-3.1-8b-instant", "llama3:latest", "mistral:latest"],
  researcher: ["llama-3.3-70b-versatile", "openai/gpt-oss-20b", "llama3:latest", "mistral:latest"]
};

const MODE_ALIASES = {
  general: "general",
  smart: "general",
  chat: "general",
  knowledge: "general",
  umum: "general",
  code: "code",
  coding: "code",
  programmer: "code",
  english: "english_tutor",
  tutor: "english_tutor",
  english_tutor: "english_tutor",
  business: "business",
  bisnis: "business",
  creative: "creative",
  design: "creative",
  data: "data_analysis",
  analysis: "data_analysis",
  analytics: "data_analysis",
  data_analysis: "data_analysis",
  chatbot: "chatbot",
  bot: "chatbot",
  vision: "vision",
  visual: "vision",
  automation: "automation",
  workflow: "automation",
  researcher: "researcher",
  research: "researcher"
};

const RESPONSE_STYLES = [
  {
    key: "casual",
    label: { indonesian: "Casual", english: "Casual" },
    description: {
      indonesian: "Jawaban lebih santai dan cepat dicerna.",
      english: "More relaxed and easy to read."
    }
  },
  {
    key: "balanced",
    label: { indonesian: "Balanced", english: "Balanced" },
    description: {
      indonesian: "Jawaban seimbang dan nyaman dibaca.",
      english: "Balanced and comfortable to read."
    }
  },
  {
    key: "formal",
    label: { indonesian: "Formal", english: "Formal" },
    description: {
      indonesian: "Jawaban lebih formal dan profesional.",
      english: "More formal and professional."
    }
  }
];

const BEHAVIOR_LABELS = {
  task_focused: { indonesian: "Task Focused", english: "Task Focused" },
  creative: { indonesian: "Creative", english: "Creative" },
  custom: { indonesian: "Custom Instructions", english: "Custom Instructions" }
};

const UI_TEXT = {
  indonesian: {
    commandMenuLabel: "Conversation vault",
    commandMenuTitle: "Chat Control",
    commandMenuCaption: "Riwayat percakapan Byronz tersimpan rapi di sini.",
    newChatBtn: "+ New Chat",
    exportBtn: "Export Chat",
    historyTitle: "History Chat",
    historySearchLabel: "Search history",
    historySearchPlaceholder: "Cari percakapan...",
    settingsMenuLabel: "Byronz workspace",
    settingsMenuTitle: "Offline Settings",
    settingsMenuCaption: "Pengaturan inti Byronz untuk penggunaan offline yang ringkas.",
    profileTitle: "Profile",
    displayNameLabel: "Display Name",
    profileNamePlaceholder: "Nama pengguna",
    languageLabel: "Language",
    languageAuto: "Auto Detect",
    languageIndonesian: "Bahasa Indonesia",
    languageEnglish: "English",
    themeTitle: "Theme",
    currentThemeLabel: "Current Theme",
    layoutTitle: "Layout Density",
    layoutNote: "Agar tampilan tetap muat rapi di satu frame.",
    responseStyleTitle: "Response Style",
    historySettingsTitle: "History",
    chatRetentionTitle: "Chat Retention",
    chatRetentionDesc: "Simpan histori chat secara lokal untuk dipakai kembali.",
    clearHistoryBtn: "Clear History",
    behaviorTitle: "Assistant Behavior",
    behaviorNote: "Atur karakter jawaban Byronz dengan tampilan yang tetap bersih.",
    appUpdateTitle: "App Updates",
    appUpdateVersionLabel: "Versi Saat Ini",
    appUpdateBtnCheck: "Periksa Update",
    appUpdateBtnDownload: "Unduh Update",
    appUpdateBtnInstall: "Pasang Update",
    appUpdateBtnChecking: "Memeriksa...",
    appUpdateBtnDownloading: "Mengunduh...",
    appUpdateBtnInstalling: "Memasang...",
    appUpdateStatusIdle: "Setelah Byronz rilis di Google Play, update Android bisa dicek dari dalam aplikasi ini.",
    appUpdateStatusChecking: "Byronz sedang mengecek update terbaru dari Google Play.",
    appUpdateStatusUpToDate: "Aplikasi sudah di versi terbaru.",
    appUpdateStatusReadyFlexible: "Update baru tersedia dan siap diunduh.",
    appUpdateStatusReadyImmediate: "Update penting tersedia dan akan dipasang lewat alur Google Play.",
    appUpdateStatusDownloaded: "Update sudah selesai diunduh. Tekan tombol untuk memasang.",
    appUpdateStatusDownloading: "Sedang mengunduh update.",
    appUpdateStatusInstalling: "Sedang memasang update.",
    appUpdateStatusCanceled: "Pembaruan dibatalkan. Anda bisa menjalankannya lagi kapan saja.",
    appUpdateStatusFailed: "Proses update belum berhasil.",
    appUpdateStatusAndroidOnly: "Fitur ini aktif di aplikasi Android native. Setelah rilis Play Store, user bisa update dari dalam aplikasi.",
    appUpdateStatusUnavailable: "Layanan update Android belum tersedia di perangkat ini.",
    appUpdateStatusIssue: "Update belum bisa dicek.",
    creatorTitle: "Creator",
    creatorCopy: "Byronz adalah AI offline workspace untuk chat, code, creative, bisnis, dan riset.",
    creatorCardAria: "Buka profil creator",
    creatorOpenHint: "Klik untuk melihat profil creator.",
    creatorModalLabel: "Creator",
    creatorRolePill: "App Creator / Developer",
    creatorTagline: '"Membangun aplikasi yang modern, bermanfaat, dan mudah digunakan."',
    creatorEmailLabel: "Email",
    creatorFocusLabel: "Fokus Bidang",
    creatorFocusValue: "UI/UX Design - Python - Mobile App",
    creatorVersionLabel: "Versi Aplikasi",
    creatorVersionValue: "v1.2.0 (Build 120)",
    creatorPrimaryActionLabel: "Hubungi & Ikuti",
    creatorPlatformTitle: "Pilih Platform",
    creatorPlatformCaption: "Pilih platform untuk terhubung dengan creator",
    creatorPlatformNoteDefault: "Pilih platform yang paling sesuai untuk melihat aktivitas creator.",
    creatorPlatformClose: "Tutup",
    creatorPlatformInstagramDesc: "Lihat profil dan konten terbaru",
    creatorPlatformWhatsappDesc: "Chat langsung dengan creator",
    creatorPlatformGithubDesc: "Lihat kode dan kontribusi",
    creatorPlatformTiktokDesc: "Tonton video dan konten kreatif",
    creatorPlatformInstagramTooltip: "Update visual Byronz & konten terbaru.",
    creatorPlatformWhatsappTooltip: "Channel tercepat untuk percakapan langsung.",
    creatorPlatformGithubTooltip: "Jelajahi code, build, dan kontribusi.",
    creatorPlatformTiktokTooltip: "Cuplikan ide kreatif dan behind the build.",
    creatorModalCloseAria: "Tutup profil creator",
    creatorSheetCloseAria: "Tutup platform",
    brandDockSubtext: "Offline AI",
    workspaceEyebrow: "Offline AI Workspace",
    workspaceTitle: "Byronz",
    sessionIdle: "Pilih mode, lalu mulai chat.",
    emptyStateKicker: "Byronz",
    emptyStateTitle: "Mulai percakapan.",
    emptyStateCopy: "Dibuat oleh Muhammad Adiyaat Alfathi.",
    ambientWidgetLabel: "Live",
    ambientStatusLoading: "Mengambil cuaca...",
    ambientStatusLive: "Waktu dan cuaca real-time",
    ambientStatusLocationOff: "Aktifkan lokasi untuk cuaca",
    ambientStatusUnavailable: "Cuaca sementara tidak tersedia",
    ambientLocationLabel: "Lokasi",
    ambientLocationFallback: "Zona waktu lokal",
    ambientWeatherLabel: "Cuaca",
    ambientWeatherLoading: "Mengambil data...",
    ambientWeatherPermission: "Izinkan lokasi untuk cuaca real-time",
    ambientWeatherUnavailable: "Belum ada data cuaca",
    ambientTemperatureLabel: "Suhu",
    inputKicker: "Prompt",
    sendBtn: "Send",
    historyEmpty: "Belum ada riwayat percakapan.",
    historyEmptySearch: "Tidak ada percakapan yang cocok dengan pencarian ini.",
    noChatToExport: "Belum ada chat aktif untuk diekspor.",
    noHistoryToClear: "Belum ada history chat yang bisa dibersihkan.",
    clearHistoryConfirm: "Hapus seluruh history Byronz?",
    deleteChatConfirm: "Hapus chat",
    retentionDisabled: "Histori lokal Byronz dimatikan untuk sesi berikutnya.",
    thinking: "Thinking...",
    waitingResponse: "Byronz sedang menyiapkan jawaban...",
    streamStopped: "Streaming dihentikan karena sesi berubah.",
    backendError: "Terjadi masalah saat menghubungi backend Byronz. Periksa server atau pengaturan API aplikasi.",
    copiedBy: "Byronz",
    youLabel: "You",
    footerMode: "Mode",
    footerModel: "Model",
    footerStyle: "Style",
    footerTheme: "Theme",
    footerFocus: "Fokus",
    updatedAt: "diperbarui",
    messages: "pesan",
    messageShort: "msg",
    openChatAria: "Buka chat",
    deleteChatAria: "Hapus chat",
    themeLight: "Light",
    themeDark: "Dark",
    modelPickerLabel: "AI Model",
    modelAuto: "Auto Best",
    modelLoading: "Memuat model...",
    modelUnavailable: "Hanya Auto tersedia",
    attachmentButtonLabel: "Tambah file atau gambar",
    attachmentFileLabel: "File",
    attachmentImageLabel: "Image",
    removeAttachmentAria: "Hapus lampiran",
    attachmentLimitReached: "Maksimal 5 lampiran per pesan.",
    englishCallButton: "Call",
    englishCallStopButton: "End",
    englishCallStandby: "English Call siap.",
    englishCallReady: "English Call aktif.",
    englishCallListening: "Listening...",
    englishCallThinking: "Thinking...",
    englishCallSpeaking: "Speaking...",
    englishCallUnsupported: "Voice call belum didukung browser ini.",
    englishCallPermission: "Izinkan mikrofon untuk English Call.",
    englishCallError: "Voice call terputus. Coba lagi.",
    englishCallStartAria: "Mulai English Call",
    englishCallStopAria: "Akhiri English Call"
  },
  english: {
    commandMenuLabel: "Conversation vault",
    commandMenuTitle: "Chat Control",
    commandMenuCaption: "Your Byronz conversations are stored here.",
    newChatBtn: "+ New Chat",
    exportBtn: "Export Chat",
    historyTitle: "Chat History",
    historySearchLabel: "Search history",
    historySearchPlaceholder: "Search conversations...",
    settingsMenuLabel: "Byronz workspace",
    settingsMenuTitle: "Offline Settings",
    settingsMenuCaption: "Core Byronz settings for a cleaner offline experience.",
    profileTitle: "Profile",
    displayNameLabel: "Display Name",
    profileNamePlaceholder: "User name",
    languageLabel: "Language",
    languageAuto: "Auto Detect",
    languageIndonesian: "Bahasa Indonesia",
    languageEnglish: "English",
    themeTitle: "Theme",
    currentThemeLabel: "Current Theme",
    layoutTitle: "Layout Density",
    layoutNote: "Keeps the interface neat inside one frame.",
    responseStyleTitle: "Response Style",
    historySettingsTitle: "History",
    chatRetentionTitle: "Chat Retention",
    chatRetentionDesc: "Store chat history locally for reuse.",
    clearHistoryBtn: "Clear History",
    behaviorTitle: "Assistant Behavior",
    behaviorNote: "Adjust Byronz behavior while keeping the UI clean.",
    appUpdateTitle: "App Updates",
    appUpdateVersionLabel: "Current Version",
    appUpdateBtnCheck: "Check Update",
    appUpdateBtnDownload: "Download Update",
    appUpdateBtnInstall: "Install Update",
    appUpdateBtnChecking: "Checking...",
    appUpdateBtnDownloading: "Downloading...",
    appUpdateBtnInstalling: "Installing...",
    appUpdateStatusIdle: "Once Byronz is live on Google Play, Android updates can be checked from inside the app.",
    appUpdateStatusChecking: "Byronz is checking Google Play for the latest update.",
    appUpdateStatusUpToDate: "The app is already on the latest version.",
    appUpdateStatusReadyFlexible: "A new update is available and ready to download.",
    appUpdateStatusReadyImmediate: "An important update is available and will install through Google Play.",
    appUpdateStatusDownloaded: "The update has finished downloading. Tap the button to install it.",
    appUpdateStatusDownloading: "Downloading the update.",
    appUpdateStatusInstalling: "Installing the update.",
    appUpdateStatusCanceled: "The update was canceled. You can start it again anytime.",
    appUpdateStatusFailed: "The update process did not finish successfully.",
    appUpdateStatusAndroidOnly: "This feature is active in the native Android app. After Play Store launch, users can update from inside the app.",
    appUpdateStatusUnavailable: "Android update services are not available on this device yet.",
    appUpdateStatusIssue: "The update check could not be completed.",
    creatorTitle: "Creator",
    creatorCopy: "Byronz is an offline AI workspace for chat, code, creative work, business, and research.",
    creatorCardAria: "Open creator profile",
    creatorOpenHint: "Click to view the creator profile.",
    creatorModalLabel: "Creator",
    creatorRolePill: "App Creator / Developer",
    creatorTagline: '"Building modern, useful, and easy-to-use apps."',
    creatorEmailLabel: "Email",
    creatorFocusLabel: "Focus Area",
    creatorFocusValue: "UI/UX Design - Python - Mobile App",
    creatorVersionLabel: "App Version",
    creatorVersionValue: "v1.2.0 (Build 120)",
    creatorPrimaryActionLabel: "Contact & Follow",
    creatorPlatformTitle: "Choose Platform",
    creatorPlatformCaption: "Pick a platform to connect with the creator",
    creatorPlatformNoteDefault: "Choose the platform that fits the creator journey you want to see.",
    creatorPlatformClose: "Close",
    creatorPlatformInstagramDesc: "See the latest profile and content",
    creatorPlatformWhatsappDesc: "Open a direct chat channel",
    creatorPlatformGithubDesc: "Browse code and contributions",
    creatorPlatformTiktokDesc: "Watch creative videos and clips",
    creatorPlatformInstagramTooltip: "Visual Byronz updates and fresh content.",
    creatorPlatformWhatsappTooltip: "The fastest channel for direct conversation.",
    creatorPlatformGithubTooltip: "Explore code, builds, and contributions.",
    creatorPlatformTiktokTooltip: "Creative clips and behind-the-build moments.",
    creatorModalCloseAria: "Close creator profile",
    creatorSheetCloseAria: "Close platforms",
    brandDockSubtext: "Offline AI",
    workspaceEyebrow: "Offline AI Workspace",
    workspaceTitle: "Byronz",
    sessionIdle: "Choose a mode and start chatting.",
    emptyStateKicker: "Byronz",
    emptyStateTitle: "Start a conversation.",
    emptyStateCopy: "Created by Muhammad Adiyaat Alfathi.",
    ambientWidgetLabel: "Live",
    ambientStatusLoading: "Loading weather...",
    ambientStatusLive: "Live time and weather",
    ambientStatusLocationOff: "Allow location for weather",
    ambientStatusUnavailable: "Weather is temporarily unavailable",
    ambientLocationLabel: "Location",
    ambientLocationFallback: "Local time zone",
    ambientWeatherLabel: "Weather",
    ambientWeatherLoading: "Loading data...",
    ambientWeatherPermission: "Allow location access for live weather",
    ambientWeatherUnavailable: "Weather data unavailable",
    ambientTemperatureLabel: "Temperature",
    inputKicker: "Prompt",
    sendBtn: "Send",
    historyEmpty: "No saved conversations yet.",
    historyEmptySearch: "No conversations match this search.",
    noChatToExport: "No active chat to export.",
    noHistoryToClear: "There is no chat history to clear.",
    clearHistoryConfirm: "Delete all Byronz history?",
    deleteChatConfirm: "Delete chat",
    retentionDisabled: "Local Byronz history has been disabled for future sessions.",
    thinking: "Thinking...",
    waitingResponse: "Byronz is preparing a response...",
    streamStopped: "Streaming stopped because the session changed.",
    backendError: "There was a problem reaching the Byronz backend. Check the server or the app API configuration.",
    copiedBy: "Byronz",
    youLabel: "You",
    footerMode: "Mode",
    footerModel: "Model",
    footerStyle: "Style",
    footerTheme: "Theme",
    footerFocus: "Focus",
    updatedAt: "updated",
    messages: "messages",
    messageShort: "msg",
    openChatAria: "Open chat",
    deleteChatAria: "Delete chat",
    themeLight: "Light",
    themeDark: "Dark",
    modelPickerLabel: "AI Model",
    modelAuto: "Auto Best",
    modelLoading: "Loading models...",
    modelUnavailable: "Only Auto is available",
    attachmentButtonLabel: "Add a file or image",
    attachmentFileLabel: "File",
    attachmentImageLabel: "Image",
    removeAttachmentAria: "Remove attachment",
    attachmentLimitReached: "Maximum 5 attachments per message.",
    englishCallButton: "Call",
    englishCallStopButton: "End",
    englishCallStandby: "English Call ready.",
    englishCallReady: "English Call is active.",
    englishCallListening: "Listening...",
    englishCallThinking: "Thinking...",
    englishCallSpeaking: "Speaking...",
    englishCallUnsupported: "Voice call is not supported in this browser.",
    englishCallPermission: "Allow microphone access for English Call.",
    englishCallError: "Voice call was interrupted. Try again.",
    englishCallStartAria: "Start English Call",
    englishCallStopAria: "End English Call"
  }
};

const DEFAULT_SETTINGS = {
  displayName: "",
  preferredLanguage: "auto",
  selectedModel: "auto",
  themePreference: "dark",
  density: "comfortable",
  responseStyle: "balanced",
  assistantBehavior: "task_focused",
  chatRetention: true
};

const elements = {
  mainPanel: document.getElementById("mainPanel"),
  commandMenu: document.getElementById("commandMenu"),
  brandMenu: document.getElementById("brandMenu"),
  menuBackdrop: document.getElementById("menuBackdrop"),
  brandDockBtn: document.getElementById("brandDockBtn"),
  menuBtn: document.getElementById("menuBtn"),
  closeBrandMenuBtn: document.getElementById("closeBrandMenuBtn"),
  closeMenuBtn: document.getElementById("closeMenuBtn"),
  chatContainer: document.getElementById("chatContainer"),
  emptyState: document.getElementById("emptyState"),
  emptyStateKicker: document.getElementById("emptyStateKicker"),
  emptyStateTitle: document.getElementById("emptyStateTitle"),
  emptyStateCopy: document.getElementById("emptyStateCopy"),
  sessionStatus: document.getElementById("sessionStatus"),
  footerSummary: document.getElementById("footerSummary"),
  modeHint: document.getElementById("modeHint"),
  input: document.getElementById("userInput"),
  modelPickerLabel: document.getElementById("modelPickerLabel"),
  modelSelect: document.getElementById("modelSelect"),
  attachmentBtn: document.getElementById("attachmentBtn"),
  englishCallBtn: document.getElementById("englishCallBtn"),
  englishCallBtnLabel: document.getElementById("englishCallBtnLabel"),
  englishCallStatus: document.getElementById("englishCallStatus"),
  attachmentTray: document.getElementById("attachmentTray"),
  fileInput: document.getElementById("fileInput"),
  composerForm: document.getElementById("composerForm"),
  sendBtn: document.getElementById("sendBtn"),
  sendBtnLabel: document.getElementById("sendBtnLabel"),
  newChatBtn: document.getElementById("newChatBtn"),
  exportBtn: document.getElementById("exportBtn"),
  historySearch: document.getElementById("historySearch"),
  chatList: document.getElementById("chatList"),
  chatCount: document.getElementById("chatCount"),
  toggleBtn: document.getElementById("toggleMode"),
  themeIcon: document.getElementById("themeIcon"),
  themeLabel: document.getElementById("themeLabel"),
  profileNameInput: document.getElementById("profileNameInput"),
  languageSelect: document.getElementById("languageSelect"),
  settingsThemePreview: document.getElementById("settingsThemePreview"),
  responseStyleRange: document.getElementById("responseStyleRange"),
  responseStyleDescription: document.getElementById("responseStyleDescription"),
  styleLabelCasual: document.getElementById("styleLabelCasual"),
  styleLabelBalanced: document.getElementById("styleLabelBalanced"),
  styleLabelFormal: document.getElementById("styleLabelFormal"),
  chatRetentionToggle: document.getElementById("chatRetentionToggle"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  commandMenuLabel: document.getElementById("commandMenuLabel"),
  commandMenuTitle: document.getElementById("commandMenuTitle"),
  commandMenuCaption: document.getElementById("commandMenuCaption"),
  historyTitle: document.getElementById("historyTitle"),
  historySearchLabel: document.getElementById("historySearchLabel"),
  settingsMenuLabel: document.getElementById("settingsMenuLabel"),
  settingsMenuTitle: document.getElementById("settingsMenuTitle"),
  settingsMenuCaption: document.getElementById("settingsMenuCaption"),
  profileTitle: document.getElementById("profileTitle"),
  displayNameLabel: document.getElementById("displayNameLabel"),
  languageLabel: document.getElementById("languageLabel"),
  themeTitle: document.getElementById("themeTitle"),
  currentThemeLabel: document.getElementById("currentThemeLabel"),
  layoutTitle: document.getElementById("layoutTitle"),
  layoutNote: document.getElementById("layoutNote"),
  responseStyleTitle: document.getElementById("responseStyleTitle"),
  historySettingsTitle: document.getElementById("historySettingsTitle"),
  chatRetentionTitle: document.getElementById("chatRetentionTitle"),
  chatRetentionDesc: document.getElementById("chatRetentionDesc"),
  behaviorTitle: document.getElementById("behaviorTitle"),
  behaviorNote: document.getElementById("behaviorNote"),
  appUpdateTitle: document.getElementById("appUpdateTitle"),
  appUpdateVersionLabel: document.getElementById("appUpdateVersionLabel"),
  appUpdateVersionValue: document.getElementById("appUpdateVersionValue"),
  appUpdateStatus: document.getElementById("appUpdateStatus"),
  appUpdateBtn: document.getElementById("appUpdateBtn"),
  creatorCardTrigger: document.getElementById("creatorCardTrigger"),
  creatorTitle: document.getElementById("creatorTitle"),
  creatorCopy: document.getElementById("creatorCopy"),
  creatorName: document.getElementById("creatorName"),
  creatorOpenHint: document.getElementById("creatorOpenHint"),
  creatorModal: document.getElementById("creatorModal"),
  creatorModalBackdrop: document.getElementById("creatorModalBackdrop"),
  closeCreatorModalBtn: document.getElementById("closeCreatorModalBtn"),
  creatorModalLabel: document.getElementById("creatorModalLabel"),
  creatorRolePill: document.getElementById("creatorRolePill"),
  creatorTagline: document.getElementById("creatorTagline"),
  creatorEmailLabel: document.getElementById("creatorEmailLabel"),
  creatorFocusLabel: document.getElementById("creatorFocusLabel"),
  creatorFocusValue: document.getElementById("creatorFocusValue"),
  creatorVersionLabel: document.getElementById("creatorVersionLabel"),
  creatorVersionValue: document.getElementById("creatorVersionValue"),
  creatorPlatformSheet: document.getElementById("creatorPlatformSheet"),
  creatorPlatformTitle: document.getElementById("creatorPlatformTitle"),
  creatorPlatformCaption: document.getElementById("creatorPlatformCaption"),
  creatorPlatformNote: document.getElementById("creatorPlatformNote"),
  creatorPlatformInstagramDesc: document.getElementById("creatorPlatformInstagramDesc"),
  creatorPlatformWhatsappDesc: document.getElementById("creatorPlatformWhatsappDesc"),
  creatorPlatformGithubDesc: document.getElementById("creatorPlatformGithubDesc"),
  creatorPlatformTiktokDesc: document.getElementById("creatorPlatformTiktokDesc"),
  creatorPlatformInstagramTooltip: document.getElementById("creatorPlatformInstagramTooltip"),
  creatorPlatformWhatsappTooltip: document.getElementById("creatorPlatformWhatsappTooltip"),
  creatorPlatformGithubTooltip: document.getElementById("creatorPlatformGithubTooltip"),
  creatorPlatformTiktokTooltip: document.getElementById("creatorPlatformTiktokTooltip"),
  brandDockSubtext: document.getElementById("brandDockSubtext"),
  workspaceEyebrow: document.getElementById("workspaceEyebrow"),
  workspaceTitle: document.getElementById("workspaceTitle"),
  inputKicker: document.getElementById("inputKicker"),
  ambientWidgetLabel: document.getElementById("ambientWidgetLabel"),
  ambientStatus: document.getElementById("ambientStatus"),
  ambientTime: document.getElementById("ambientTime"),
  ambientDate: document.getElementById("ambientDate"),
  ambientLocationLabel: document.getElementById("ambientLocationLabel"),
  ambientLocation: document.getElementById("ambientLocation"),
  ambientWeatherLabel: document.getElementById("ambientWeatherLabel"),
  ambientWeather: document.getElementById("ambientWeather"),
  ambientTemperatureLabel: document.getElementById("ambientTemperatureLabel"),
  ambientTemperature: document.getElementById("ambientTemperature")
};

const modeButtons = Array.from(document.querySelectorAll(".mode-chip"));
const themePreferenceButtons = Array.from(document.querySelectorAll("[data-theme-pref]"));
const densityButtons = Array.from(document.querySelectorAll("[data-density]"));
const behaviorButtons = Array.from(document.querySelectorAll("[data-behavior]"));
const languageOptions = {
  auto: elements.languageSelect.querySelector('option[value="auto"]'),
  indonesian: elements.languageSelect.querySelector('option[value="indonesian"]'),
  english: elements.languageSelect.querySelector('option[value="english"]')
};
const creatorPlatformButtons = Array.from(document.querySelectorAll(".creator-platform-card"));
const CREATOR_PLATFORM_NOTE_KEYS = {
  instagram: "creatorPlatformInstagramTooltip",
  whatsapp: "creatorPlatformWhatsappTooltip",
  github: "creatorPlatformGithubTooltip",
  tiktok: "creatorPlatformTiktokTooltip"
};
const DEFAULT_LOCAL_API_BASE = "http://127.0.0.1:8000";
const CapacitorBridge = window.Capacitor || null;
const CapacitorPlugins = CapacitorBridge?.Plugins || {};
const NativeGeolocationPlugin = CapacitorPlugins.Geolocation || null;
const NativeSpeechRecognitionPlugin = CapacitorPlugins.SpeechRecognition || null;
const NativeTextToSpeechPlugin = CapacitorPlugins.TextToSpeech || null;
const NativeAppUpdatePlugin = CapacitorPlugins.ByronzAppUpdate || null;

let settings = loadSettings();
let chats = loadChats();
let sessionId = localStorage.getItem(STORAGE_KEYS.session) || chats[0]?.id || createSessionId();
let currentMode = normalizeMode(localStorage.getItem(STORAGE_KEYS.mode) || "general");
let historyFilter = "";
let isStreaming = false;
let currentStreamController = null;
let isMenuOpen = false;
let isBrandMenuOpen = false;
let isCreatorModalOpen = false;
let activeCreatorPlatform = "";
let pendingAttachments = [];
let availableModels = [];
const MAX_ATTACHMENTS = 5;
const WEATHER_REFRESH_INTERVAL = 15 * 60 * 1000;
const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let ambientClockTimer = null;
let ambientWeatherTimer = null;
const ambientState = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
  locationLabel: "",
  temperature: null,
  weatherCode: null,
  isDay: true,
  statusKey: "ambientStatusLoading",
  permissionDenied: false,
  loading: false,
  lastUpdatedAt: 0
};
const voiceCallState = {
  supported: Boolean(
    (SpeechRecognitionConstructor && window.speechSynthesis)
      || (isNativeSpeechRecognitionSupported() && isNativeTextToSpeechSupported())
  ),
  active: false,
  listening: false,
  speaking: false,
  pauseRequested: false,
  restartTimer: 0,
  recognition: null,
  nativeListenerHandles: [],
  usingNativeRecognition: false,
  finalTranscript: "",
  interimTranscript: "",
  lastError: ""
};
const appUpdateState = {
  supported: Boolean(isNativeCapacitorPlatform() && NativeAppUpdatePlugin?.getInfo),
  checking: false,
  initialized: false,
  updateAvailable: false,
  downloaded: false,
  flexibleAllowed: false,
  immediateAllowed: false,
  availableVersionCode: null,
  currentVersionName: APP_RELEASE.versionName,
  currentVersionCode: APP_RELEASE.versionCode,
  installStatusLabel: "",
  updateAvailabilityLabel: "",
  bytesDownloaded: 0,
  totalBytesToDownload: 0,
  lastError: "",
  lastFlowResult: "",
  listenerHandle: null
};

const API_BASE_URL = detectApiBaseUrl();

initializeApp();

function initializeApp() {
  updateViewportHeight();
  registerServiceWorker();
  applyThemePreference(settings.themePreference, { persist: false });
  applyDensity(settings.density, { persist: false });
  renderModelOptions();
  syncSettingsUI();
  applyUIText();
  bindEvents();
  startAmbientExperience();
  selectMode(currentMode, { persist: false, updateActiveChat: false });
  saveSessionId();

  const activeChat = findChat(sessionId);
  if (activeChat && activeChat.messages.length) {
    loadChat(activeChat.id, { closePanels: false });
  } else {
    resetChatStage();
  }

  renderChats();
  closeAllMenus();
  updateSessionStatus();
  updateFooterState();
  syncEnglishCallUi();
  syncAppUpdateUI();
  void setupAppUpdateSupport();
  loadAvailableModels();
  refreshAmbientWeather(true);
}

function normalizeApiBaseUrl(value) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return "";
  }
  return normalized.replace(/\/+$/, "");
}

function detectApiBaseUrl() {
  const configuredBase = normalizeApiBaseUrl(
    window.BYRONZ_CONFIG?.apiBaseUrl
      || document.querySelector('meta[name="byronz-api-base"]')?.content
  );

  if (configuredBase) {
    return configuredBase;
  }

  if (window.location.protocol === "file:") {
    return DEFAULT_LOCAL_API_BASE;
  }

  const hostname = String(window.location.hostname || "").toLowerCase();
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
  if (isLocalHost && window.location.port && window.location.port !== "8000") {
    return DEFAULT_LOCAL_API_BASE;
  }

  return "";
}

function isNativeCapacitorPlatform() {
  return Boolean(CapacitorBridge?.isNativePlatform?.());
}

function isNativeSpeechRecognitionSupported() {
  return Boolean(isNativeCapacitorPlatform() && NativeSpeechRecognitionPlugin?.start);
}

function isNativeTextToSpeechSupported() {
  return Boolean(isNativeCapacitorPlatform() && NativeTextToSpeechPlugin?.speak);
}

function isNativeGeolocationSupported() {
  return Boolean(isNativeCapacitorPlatform() && NativeGeolocationPlugin?.getCurrentPosition);
}

function isNativeAndroidPlatform() {
  return Boolean(isNativeCapacitorPlatform() && String(CapacitorBridge?.getPlatform?.() || "").toLowerCase() === "android");
}

function isNativeAppUpdateSupported() {
  return Boolean(isNativeAndroidPlatform() && NativeAppUpdatePlugin?.getInfo);
}

function buildVersionLabel(versionName = APP_RELEASE.versionName, versionCode = APP_RELEASE.versionCode) {
  const safeVersionName = String(versionName || APP_RELEASE.versionName || "").trim() || APP_RELEASE.versionName;
  const safeVersionCode = Number.isFinite(Number(versionCode)) ? Number(versionCode) : APP_RELEASE.versionCode;
  const displayVersion = safeVersionName.toLowerCase().startsWith("v") ? safeVersionName : `v${safeVersionName}`;
  return `${displayVersion} (Build ${safeVersionCode})`;
}

function normalizeAppUpdateError(error) {
  if (!error) {
    return getUiLanguage() === "english"
      ? "Unable to reach Google Play update service."
      : "Layanan update Google Play belum bisa dijangkau.";
  }

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  const message = String(error?.message || error?.localizedMessage || "").trim();
  if (message) {
    return message;
  }

  return getUiLanguage() === "english"
    ? "Unable to reach Google Play update service."
    : "Layanan update Google Play belum bisa dijangkau.";
}

function syncAppUpdateStateFromPayload(payload = {}) {
  if (!payload || typeof payload !== "object") {
    return;
  }

  if (typeof payload.nativeSupported === "boolean") {
    appUpdateState.supported = payload.nativeSupported;
  }
  if (typeof payload.currentVersionName === "string" && payload.currentVersionName.trim()) {
    appUpdateState.currentVersionName = payload.currentVersionName.trim();
  }
  if (payload.currentVersionCode != null && Number.isFinite(Number(payload.currentVersionCode))) {
    appUpdateState.currentVersionCode = Number(payload.currentVersionCode);
  }
  if (payload.availableVersionCode != null && Number.isFinite(Number(payload.availableVersionCode))) {
    appUpdateState.availableVersionCode = Number(payload.availableVersionCode);
  }
  if (typeof payload.updateAvailable === "boolean") {
    appUpdateState.updateAvailable = payload.updateAvailable;
  }
  if (typeof payload.downloaded === "boolean") {
    appUpdateState.downloaded = payload.downloaded;
  }
  if (typeof payload.flexibleAllowed === "boolean") {
    appUpdateState.flexibleAllowed = payload.flexibleAllowed;
  }
  if (typeof payload.immediateAllowed === "boolean") {
    appUpdateState.immediateAllowed = payload.immediateAllowed;
  }
  if (typeof payload.installStatusLabel === "string") {
    appUpdateState.installStatusLabel = payload.installStatusLabel;
  }
  if (typeof payload.updateAvailabilityLabel === "string") {
    appUpdateState.updateAvailabilityLabel = payload.updateAvailabilityLabel;
  }
  if (payload.bytesDownloaded != null && Number.isFinite(Number(payload.bytesDownloaded))) {
    appUpdateState.bytesDownloaded = Number(payload.bytesDownloaded);
  }
  if (payload.totalBytesToDownload != null && Number.isFinite(Number(payload.totalBytesToDownload))) {
    appUpdateState.totalBytesToDownload = Number(payload.totalBytesToDownload);
  }
  if (payload.event === "flowResult" && typeof payload.flowResult === "string") {
    appUpdateState.lastFlowResult = payload.flowResult;
  } else if (payload.event === "info") {
    appUpdateState.lastFlowResult = "";
  }

  appUpdateState.initialized = true;
  appUpdateState.lastError = "";
}

function getAppUpdateStatusMessage() {
  if (!isNativeAndroidPlatform()) {
    return t("appUpdateStatusAndroidOnly");
  }

  if (!NativeAppUpdatePlugin || !appUpdateState.supported) {
    return t("appUpdateStatusUnavailable");
  }

  if (appUpdateState.checking) {
    return t("appUpdateStatusChecking");
  }

  if (appUpdateState.installStatusLabel === "downloading") {
    if (appUpdateState.totalBytesToDownload > 0) {
      const progress = Math.min(
        100,
        Math.max(0, Math.round((appUpdateState.bytesDownloaded / appUpdateState.totalBytesToDownload) * 100))
      );
      return `${t("appUpdateStatusDownloading")} ${progress}%`;
    }
    return t("appUpdateStatusDownloading");
  }

  if (appUpdateState.installStatusLabel === "installing") {
    return t("appUpdateStatusInstalling");
  }

  if (appUpdateState.downloaded) {
    return t("appUpdateStatusDownloaded");
  }

  if (appUpdateState.lastFlowResult === "canceled") {
    return t("appUpdateStatusCanceled");
  }

  if (appUpdateState.lastFlowResult === "failed") {
    return appUpdateState.lastError
      ? `${t("appUpdateStatusFailed")} ${appUpdateState.lastError}`
      : t("appUpdateStatusFailed");
  }

  if (appUpdateState.lastError) {
    return `${t("appUpdateStatusIssue")} ${appUpdateState.lastError}`;
  }

  if (appUpdateState.updateAvailable) {
    const availableBuild = Number.isFinite(Number(appUpdateState.availableVersionCode))
      ? ` ${getUiLanguage() === "english" ? "Play build" : "Build Play"} ${Number(appUpdateState.availableVersionCode)}.`
      : "";

    if (appUpdateState.immediateAllowed && !appUpdateState.flexibleAllowed) {
      return `${t("appUpdateStatusReadyImmediate")}${availableBuild}`;
    }

    return `${t("appUpdateStatusReadyFlexible")}${availableBuild}`;
  }

  if (appUpdateState.initialized) {
    return t("appUpdateStatusUpToDate");
  }

  return t("appUpdateStatusIdle");
}

function syncAppUpdateUI() {
  const versionLabel = buildVersionLabel(appUpdateState.currentVersionName, appUpdateState.currentVersionCode);
  const nativeReady = isNativeAppUpdateSupported() && appUpdateState.supported;
  let buttonLabel = t("appUpdateBtnCheck");
  let buttonDisabled = !nativeReady;

  if (appUpdateState.checking) {
    buttonLabel = t("appUpdateBtnChecking");
    buttonDisabled = true;
  } else if (appUpdateState.installStatusLabel === "downloading") {
    buttonLabel = t("appUpdateBtnDownloading");
    buttonDisabled = true;
  } else if (appUpdateState.installStatusLabel === "installing") {
    buttonLabel = t("appUpdateBtnInstalling");
    buttonDisabled = true;
  } else if (appUpdateState.downloaded) {
    buttonLabel = t("appUpdateBtnInstall");
    buttonDisabled = false;
  } else if (appUpdateState.updateAvailable) {
    buttonLabel = t("appUpdateBtnDownload");
    buttonDisabled = !nativeReady;
  }

  elements.appUpdateTitle.textContent = t("appUpdateTitle");
  elements.appUpdateVersionLabel.textContent = t("appUpdateVersionLabel");
  elements.appUpdateVersionValue.textContent = versionLabel;
  elements.appUpdateStatus.textContent = getAppUpdateStatusMessage();
  elements.appUpdateBtn.textContent = buttonLabel;
  elements.appUpdateBtn.disabled = buttonDisabled;
}

async function refreshAppUpdateInfo() {
  if (!isNativeAppUpdateSupported()) {
    syncAppUpdateUI();
    return;
  }

  if (appUpdateState.checking) {
    return;
  }

  appUpdateState.checking = true;
  appUpdateState.lastFlowResult = "";
  syncAppUpdateUI();

  try {
    const payload = await NativeAppUpdatePlugin.getInfo();
    syncAppUpdateStateFromPayload(payload);
  } catch (error) {
    appUpdateState.initialized = true;
    appUpdateState.lastError = normalizeAppUpdateError(error);
  } finally {
    appUpdateState.checking = false;
    syncAppUpdateUI();
  }
}

function handleNativeAppUpdateEvent(payload = {}) {
  if (payload?.event === "error") {
    appUpdateState.initialized = true;
    appUpdateState.checking = false;
    appUpdateState.lastError = normalizeAppUpdateError(payload?.message);
    syncAppUpdateUI();
    return;
  }

  syncAppUpdateStateFromPayload(payload);
  appUpdateState.checking = false;
  syncAppUpdateUI();
}

async function handleAppUpdateAction() {
  if (!isNativeAppUpdateSupported()) {
    syncAppUpdateUI();
    return;
  }

  if (appUpdateState.checking) {
    return;
  }

  if (!appUpdateState.updateAvailable && !appUpdateState.downloaded) {
    await refreshAppUpdateInfo();
    return;
  }

  appUpdateState.checking = true;
  appUpdateState.lastError = "";
  appUpdateState.lastFlowResult = "";
  syncAppUpdateUI();

  try {
    let payload;

    if (appUpdateState.downloaded) {
      payload = await NativeAppUpdatePlugin.completeFlexibleUpdate();
      appUpdateState.installStatusLabel = "installing";
    } else if (appUpdateState.immediateAllowed && !appUpdateState.flexibleAllowed) {
      payload = await NativeAppUpdatePlugin.startImmediateUpdate();
    } else {
      payload = await NativeAppUpdatePlugin.startFlexibleUpdate();
    }

    syncAppUpdateStateFromPayload(payload);
  } catch (error) {
    appUpdateState.initialized = true;
    appUpdateState.lastError = normalizeAppUpdateError(error);
  } finally {
    appUpdateState.checking = false;
    syncAppUpdateUI();
  }
}

async function setupAppUpdateSupport() {
  syncAppUpdateUI();

  if (!isNativeAppUpdateSupported()) {
    return;
  }

  try {
    appUpdateState.listenerHandle = await NativeAppUpdatePlugin.addListener("updateStateChanged", (payload) => {
      handleNativeAppUpdateEvent(payload);
    });
  } catch (error) {
    appUpdateState.lastError = normalizeAppUpdateError(error);
    syncAppUpdateUI();
    return;
  }

  await refreshAppUpdateInfo();
}

function normalizePermissionStatus(value) {
  return String(value || "").trim().toLowerCase();
}

function isPermissionGranted(value) {
  return normalizePermissionStatus(value) === "granted";
}

async function ensureNativeSpeechPermission() {
  if (!isNativeSpeechRecognitionSupported()) {
    return false;
  }

  try {
    const current = await NativeSpeechRecognitionPlugin.checkPermissions?.();
    if (isPermissionGranted(current?.speechRecognition)) {
      return true;
    }
  } catch (error) {
    // Continue with request flow.
  }

  try {
    const requested = await NativeSpeechRecognitionPlugin.requestPermissions?.();
    return isPermissionGranted(requested?.speechRecognition);
  } catch (error) {
    return false;
  }
}

async function ensureNativeGeolocationPermission() {
  if (!isNativeGeolocationSupported()) {
    return false;
  }

  try {
    const current = await NativeGeolocationPlugin.checkPermissions?.();
    if (isPermissionGranted(current?.location) || isPermissionGranted(current?.coarseLocation)) {
      return true;
    }
  } catch (error) {
    // Continue with request flow.
  }

  try {
    const requested = await NativeGeolocationPlugin.requestPermissions?.();
    return isPermissionGranted(requested?.location) || isPermissionGranted(requested?.coarseLocation);
  } catch (error) {
    return false;
  }
}

function buildApiUrl(path) {
  const normalizedPath = String(path || "").startsWith("/")
    ? String(path)
    : `/${String(path || "")}`;

  if (!API_BASE_URL) {
    return normalizedPath;
  }

  return new URL(normalizedPath, `${API_BASE_URL}/`).toString();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Keep the app usable even when service worker registration fails.
    });
  }, { once: true });
}

function bindEvents() {
  elements.composerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await sendMessage();
  });

  elements.newChatBtn.addEventListener("click", () => createNewChat());
  elements.exportBtn.addEventListener("click", () => exportChat());
  elements.toggleBtn.addEventListener("click", () => toggleQuickTheme());
  elements.menuBtn.addEventListener("click", () => toggleMenu());
  elements.brandDockBtn.addEventListener("click", () => toggleBrandMenu());
  elements.creatorCardTrigger.addEventListener("click", () => openCreatorModal());
  elements.creatorCardTrigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCreatorModal();
    }
  });
  elements.attachmentBtn.addEventListener("click", () => elements.fileInput.click());
  elements.englishCallBtn.addEventListener("click", () => toggleEnglishCall());
  elements.appUpdateBtn.addEventListener("click", async () => {
    await handleAppUpdateAction();
  });
  elements.fileInput.addEventListener("change", (event) => {
    handleAttachmentSelection(event.target.files);
  });
  elements.closeMenuBtn.addEventListener("click", () => closeMenu(true));
  elements.closeBrandMenuBtn.addEventListener("click", () => closeBrandMenu(true));
  elements.menuBackdrop.addEventListener("click", () => closeAllMenus());
  elements.creatorModalBackdrop.addEventListener("click", () => closeCreatorModal(true));
  elements.closeCreatorModalBtn.addEventListener("click", () => closeCreatorModal(true));
  creatorPlatformButtons.forEach((button) => {
    button.addEventListener("click", () => selectCreatorPlatform(button.dataset.platform || ""));
  });

  elements.historySearch.addEventListener("input", (event) => {
    historyFilter = event.target.value.trim().toLowerCase();
    renderChats();
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectMode(button.dataset.mode);
      elements.input.focus();
    });
  });

  themePreferenceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyThemePreference(button.dataset.themePref || "dark");
    });
  });

  densityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyDensity(button.dataset.density || "comfortable");
    });
  });

  behaviorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      settings.assistantBehavior = button.dataset.behavior || "task_focused";
      persistSettings();
      syncBehaviorUI();
      updateFooterState();
      updateSessionStatus();
    });
  });

  elements.responseStyleRange.addEventListener("input", () => {
    const selectedStyle = RESPONSE_STYLES[Number(elements.responseStyleRange.value)]?.key || "balanced";
    settings.responseStyle = selectedStyle;
    persistSettings();
    syncResponseStyleUI();
    updateFooterState();
    updateSessionStatus();
  });

  elements.profileNameInput.addEventListener("input", () => {
    settings.displayName = elements.profileNameInput.value.trim();
    persistSettings();
    updateSessionStatus();
  });

  elements.modelSelect.addEventListener("change", () => {
    settings.selectedModel = normalizeSelectedModel(elements.modelSelect.value);
    persistSettings();
    renderModelOptions();
    updateFooterState();
    updateSessionStatus();
  });

  elements.languageSelect.addEventListener("change", () => {
    settings.preferredLanguage = elements.languageSelect.value;
    persistSettings();
    applyUIText();
    updateFooterState();
    updateSessionStatus();
    renderChats();
  });

  bindToggleButton(elements.chatRetentionToggle, "chatRetention", handleChatRetentionChange);
  elements.clearHistoryBtn.addEventListener("click", () => clearAllHistory());

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isCreatorModalOpen) {
      closeCreatorModal(true);
      return;
    }

    if (event.key === "Escape" && (isMenuOpen || isBrandMenuOpen)) {
      closeAllMenus();
    }
  });

  window.addEventListener("resize", () => {
    updateViewportHeight();
    scrollToLatest();
    updateAmbientClock();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateAmbientClock();
      refreshAmbientWeather();
    }
  });
}

function bindToggleButton(button, key, callback = null) {
  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    settings[key] = !settings[key];
    persistSettings();
    syncToggleState(button, settings[key]);

    if (typeof callback === "function") {
      callback(settings[key]);
    }
  });
}

function getUiLanguage() {
  if (settings.preferredLanguage === "english") {
    return "english";
  }
  if (settings.preferredLanguage === "indonesian") {
    return "indonesian";
  }

  const browserLanguage = (navigator.language || "").toLowerCase();
  return browserLanguage.startsWith("en") ? "english" : "indonesian";
}

function t(key) {
  return UI_TEXT[getUiLanguage()][key];
}

function getModeConfig(mode = currentMode) {
  return MODE_CONFIG[normalizeMode(mode)] || MODE_CONFIG.general;
}

function getModeLabel(mode = currentMode) {
  const config = getModeConfig(mode);
  return config.label[getUiLanguage()];
}

function getModeFocus(mode = currentMode) {
  return getModeConfig(mode).focus[getUiLanguage()];
}

function getModePlaceholder(mode = currentMode) {
  return getModeConfig(mode).placeholder[getUiLanguage()];
}

function normalizeSelectedModel(value) {
  const normalizedValue = String(value || "auto").trim();
  return normalizedValue || "auto";
}

function prettifyModelName(modelName) {
  const normalizedName = String(modelName || "").trim();
  const providerlessName = normalizedName.includes("/")
    ? normalizedName.split("/").pop()
    : normalizedName;
  const baseName = String(providerlessName || "").split(":", 1)[0].replace(/[-_]+/g, " ").trim();
  if (!baseName) {
    return "Model";
  }

  const aliases = {
    llama3: "Llama 3",
    mistral: "Mistral",
    "openai/gpt-oss-20b": "GPT OSS 20B",
    "openai/gpt-oss-120b": "GPT OSS 120B",
    "llama-3.1-8b-instant": "Llama 3.1 8B Instant",
    "llama-3.3-70b-versatile": "Llama 3.3 70B Versatile",
    "qwen/qwen3-32b": "Qwen3 32B",
    "groq/compound-mini": "Groq Compound Mini"
  };

  return aliases[normalizedName.toLowerCase()]
    || aliases[providerlessName.toLowerCase()]
    || aliases[baseName.toLowerCase()]
    || baseName.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRecommendedModelName(mode = currentMode) {
  const priorities = AUTO_MODEL_PRIORITY[normalizeMode(mode)] || AUTO_MODEL_PRIORITY.general;
  const availableNames = availableModels.map((model) => model.name);

  for (const candidate of priorities) {
    if (!availableNames.length || availableNames.includes(candidate)) {
      return candidate;
    }
  }

  return availableNames[0] || "auto";
}

function getResolvedModelName() {
  const selectedModel = normalizeSelectedModel(settings.selectedModel);
  if (selectedModel !== "auto") {
    return selectedModel;
  }
  return getRecommendedModelName(currentMode);
}

function getResolvedModelLabel() {
  const resolvedModelName = getResolvedModelName();
  if (resolvedModelName === "auto") {
    return t("modelAuto");
  }

  const matchedModel = availableModels.find((model) => model.name === resolvedModelName);
  return matchedModel?.label || prettifyModelName(resolvedModelName);
}

function renderModelOptions() {
  const previousValue = normalizeSelectedModel(settings.selectedModel);
  elements.modelSelect.innerHTML = "";

  const autoOption = document.createElement("option");
  autoOption.value = "auto";
  autoOption.textContent = t("modelAuto");
  elements.modelSelect.appendChild(autoOption);

  availableModels.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.name;
    option.textContent = model.label || prettifyModelName(model.name);
    elements.modelSelect.appendChild(option);
  });

  const optionExists = previousValue === "auto"
    || availableModels.some((model) => model.name === previousValue);

  settings.selectedModel = optionExists ? previousValue : "auto";
  if (settings.selectedModel !== previousValue) {
    persistSettings();
  }
  elements.modelSelect.value = settings.selectedModel;
}

async function loadAvailableModels() {
  try {
    const response = await fetch(buildApiUrl("/models"));
    if (!response.ok) {
      throw new Error("Model endpoint unavailable");
    }

    const payload = await response.json();
    const models = Array.isArray(payload.models) ? payload.models : [];
    availableModels = models
      .filter((item) => item && typeof item.name === "string" && item.name.trim())
      .map((item) => ({
        name: item.name.trim(),
        label: typeof item.label === "string" && item.label.trim()
          ? item.label.trim()
          : prettifyModelName(item.name)
      }));
  } catch (error) {
    availableModels = [];
  }

  renderModelOptions();
  updateFooterState();
  updateSessionStatus();
}

function createSessionId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeMode(mode) {
  if (!mode) {
    return "general";
  }

  const normalizedValue = String(mode).trim().toLowerCase().replace(/\s+/g, "_");
  return MODE_ALIASES[normalizedValue] || "general";
}

function normalizeSettings(rawSettings) {
  const nextSettings = { ...DEFAULT_SETTINGS };

  if (!rawSettings || typeof rawSettings !== "object") {
    return nextSettings;
  }

  if (typeof rawSettings.displayName === "string") {
    nextSettings.displayName = rawSettings.displayName.trim();
  }

  if (["auto", "indonesian", "english"].includes(rawSettings.preferredLanguage)) {
    nextSettings.preferredLanguage = rawSettings.preferredLanguage;
  }

  if (typeof rawSettings.selectedModel === "string" && rawSettings.selectedModel.trim()) {
    nextSettings.selectedModel = rawSettings.selectedModel.trim();
  }

  if (["light", "dark"].includes(rawSettings.themePreference)) {
    nextSettings.themePreference = rawSettings.themePreference;
  }

  if (["comfortable", "compact", "minimal"].includes(rawSettings.density)) {
    nextSettings.density = rawSettings.density;
  }

  if (RESPONSE_STYLES.some((style) => style.key === rawSettings.responseStyle)) {
    nextSettings.responseStyle = rawSettings.responseStyle;
  }

  if (Object.prototype.hasOwnProperty.call(BEHAVIOR_LABELS, rawSettings.assistantBehavior)) {
    nextSettings.assistantBehavior = rawSettings.assistantBehavior;
  }

  if (typeof rawSettings.chatRetention === "boolean") {
    nextSettings.chatRetention = rawSettings.chatRetention;
  }

  return nextSettings;
}

function safeParse(rawValue) {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
}

function loadSettings() {
  return normalizeSettings(safeParse(localStorage.getItem(STORAGE_KEYS.settings)));
}

function persistSettings() {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

function getActualTheme(preference = settings.themePreference) {
  return preference === "light" ? "light" : "dark";
}

function applyThemePreference(preference, options = {}) {
  const { persist = true } = options;
  settings.themePreference = preference === "light" ? "light" : "dark";

  const actualTheme = getActualTheme();
  const isLight = actualTheme === "light";

  document.body.dataset.theme = actualTheme;
  elements.themeIcon.innerHTML = isLight ? "&#9728;" : "&#9790;";
  elements.themeLabel.textContent = isLight ? t("themeLight") : t("themeDark");
  elements.toggleBtn.setAttribute("aria-label", isLight ? "Aktifkan dark mode" : "Aktifkan light mode");
  elements.settingsThemePreview.textContent = isLight ? t("themeLight") : t("themeDark");

  themePreferenceButtons.forEach((button) => {
    const isActive = button.dataset.themePref === settings.themePreference;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (persist) {
    persistSettings();
  }
}

function toggleQuickTheme() {
  applyThemePreference(getActualTheme() === "dark" ? "light" : "dark");
}

function applyDensity(density, options = {}) {
  const { persist = true } = options;
  settings.density = ["comfortable", "compact", "minimal"].includes(density) ? density : "comfortable";
  document.body.dataset.density = settings.density;

  densityButtons.forEach((button) => {
    const isActive = button.dataset.density === settings.density;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (persist) {
    persistSettings();
  }
}

function syncSettingsUI() {
  elements.profileNameInput.value = settings.displayName;
  elements.languageSelect.value = settings.preferredLanguage;
  elements.modelSelect.value = normalizeSelectedModel(settings.selectedModel);
  syncResponseStyleUI();
  syncBehaviorUI();
  syncToggleState(elements.chatRetentionToggle, settings.chatRetention);
}

function syncResponseStyleUI() {
  const styleIndex = Math.max(0, RESPONSE_STYLES.findIndex((style) => style.key === settings.responseStyle));
  const activeStyle = RESPONSE_STYLES[styleIndex] || RESPONSE_STYLES[1];

  elements.responseStyleRange.value = String(styleIndex);
  elements.responseStyleDescription.textContent = activeStyle.description[getUiLanguage()];

  [elements.styleLabelCasual, elements.styleLabelBalanced, elements.styleLabelFormal].forEach((label, index) => {
    label.classList.toggle("active", index === styleIndex);
  });
}

function syncBehaviorUI() {
  behaviorButtons.forEach((button) => {
    const isActive = button.dataset.behavior === settings.assistantBehavior;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function syncToggleState(button, enabled) {
  button.setAttribute("aria-pressed", String(enabled));
  const switchElement = button.querySelector(".toggle-switch");
  if (switchElement) {
    switchElement.classList.toggle("on", enabled);
  }
}

function applyUIText() {
  document.documentElement.lang = getUiLanguage() === "english" ? "en" : "id";

  elements.commandMenuLabel.textContent = t("commandMenuLabel");
  elements.commandMenuTitle.textContent = t("commandMenuTitle");
  elements.commandMenuCaption.textContent = t("commandMenuCaption");
  elements.newChatBtn.textContent = t("newChatBtn");
  elements.exportBtn.textContent = t("exportBtn");
  elements.historyTitle.textContent = t("historyTitle");
  elements.historySearchLabel.textContent = t("historySearchLabel");
  elements.historySearch.placeholder = t("historySearchPlaceholder");
  elements.settingsMenuLabel.textContent = t("settingsMenuLabel");
  elements.settingsMenuTitle.textContent = t("settingsMenuTitle");
  elements.settingsMenuCaption.textContent = t("settingsMenuCaption");
  elements.profileTitle.textContent = t("profileTitle");
  elements.displayNameLabel.textContent = t("displayNameLabel");
  elements.profileNameInput.placeholder = t("profileNamePlaceholder");
  elements.languageLabel.textContent = t("languageLabel");
  languageOptions.auto.textContent = t("languageAuto");
  languageOptions.indonesian.textContent = t("languageIndonesian");
  languageOptions.english.textContent = t("languageEnglish");
  elements.themeTitle.textContent = t("themeTitle");
  elements.currentThemeLabel.textContent = t("currentThemeLabel");
  elements.layoutTitle.textContent = t("layoutTitle");
  elements.layoutNote.textContent = t("layoutNote");
  elements.responseStyleTitle.textContent = t("responseStyleTitle");
  elements.historySettingsTitle.textContent = t("historySettingsTitle");
  elements.chatRetentionTitle.textContent = t("chatRetentionTitle");
  elements.chatRetentionDesc.textContent = t("chatRetentionDesc");
  elements.clearHistoryBtn.textContent = t("clearHistoryBtn");
  elements.behaviorTitle.textContent = t("behaviorTitle");
  elements.behaviorNote.textContent = t("behaviorNote");
  elements.appUpdateTitle.textContent = t("appUpdateTitle");
  elements.appUpdateVersionLabel.textContent = t("appUpdateVersionLabel");
  elements.creatorCardTrigger.setAttribute("aria-label", t("creatorCardAria"));
  elements.creatorTitle.textContent = t("creatorTitle");
  elements.creatorCopy.textContent = t("creatorCopy");
  elements.creatorOpenHint.textContent = t("creatorOpenHint");
  elements.creatorModalLabel.textContent = t("creatorModalLabel");
  elements.creatorRolePill.textContent = t("creatorRolePill");
  elements.creatorTagline.textContent = t("creatorTagline");
  elements.creatorEmailLabel.textContent = t("creatorEmailLabel");
  elements.creatorFocusLabel.textContent = t("creatorFocusLabel");
  elements.creatorFocusValue.textContent = t("creatorFocusValue");
  elements.creatorVersionLabel.textContent = t("creatorVersionLabel");
  elements.creatorVersionValue.textContent = buildVersionLabel(APP_RELEASE.versionName, APP_RELEASE.versionCode);
  elements.creatorPlatformTitle.textContent = t("creatorPlatformTitle");
  elements.creatorPlatformCaption.textContent = t("creatorPlatformCaption");
  const activeNoteKey = CREATOR_PLATFORM_NOTE_KEYS[activeCreatorPlatform] || "creatorPlatformNoteDefault";
  elements.creatorPlatformNote.textContent = t(activeNoteKey);
  elements.closeCreatorModalBtn.setAttribute("aria-label", t("creatorModalCloseAria"));
  elements.creatorPlatformInstagramDesc.textContent = t("creatorPlatformInstagramDesc");
  elements.creatorPlatformWhatsappDesc.textContent = t("creatorPlatformWhatsappDesc");
  elements.creatorPlatformGithubDesc.textContent = t("creatorPlatformGithubDesc");
  elements.creatorPlatformTiktokDesc.textContent = t("creatorPlatformTiktokDesc");
  elements.creatorPlatformInstagramTooltip.textContent = t("creatorPlatformInstagramTooltip");
  elements.creatorPlatformWhatsappTooltip.textContent = t("creatorPlatformWhatsappTooltip");
  elements.creatorPlatformGithubTooltip.textContent = t("creatorPlatformGithubTooltip");
  elements.creatorPlatformTiktokTooltip.textContent = t("creatorPlatformTiktokTooltip");
  elements.brandDockSubtext.textContent = t("brandDockSubtext");
  elements.workspaceEyebrow.textContent = t("workspaceEyebrow");
  elements.workspaceTitle.textContent = t("workspaceTitle");
  elements.modelPickerLabel.textContent = t("modelPickerLabel");
  elements.emptyStateKicker.textContent = t("emptyStateKicker");
  elements.emptyStateTitle.textContent = t("emptyStateTitle");
  elements.emptyStateCopy.textContent = t("emptyStateCopy");
  elements.ambientWidgetLabel.textContent = t("ambientWidgetLabel");
  elements.ambientLocationLabel.textContent = t("ambientLocationLabel");
  elements.ambientWeatherLabel.textContent = t("ambientWeatherLabel");
  elements.ambientTemperatureLabel.textContent = t("ambientTemperatureLabel");
  elements.inputKicker.textContent = t("inputKicker");
  elements.attachmentBtn.setAttribute("aria-label", t("attachmentButtonLabel"));
  elements.attachmentBtn.setAttribute("title", t("attachmentButtonLabel"));
  setSendButtonLabel(isStreaming ? t("thinking") : t("sendBtn"));
  renderModelOptions();
  syncResponseStyleUI();
  renderPendingAttachments();
  renderAmbientWidget();
  updateAmbientClock();
  applyThemePreference(settings.themePreference, { persist: false });
  syncEnglishCallUi();
  syncAppUpdateUI();
}

function setSendButtonLabel(label) {
  elements.sendBtnLabel.textContent = label;
  elements.sendBtn.setAttribute("aria-label", label);
}

function isEnglishMode(mode = currentMode) {
  return normalizeMode(mode) === "english_tutor";
}

function isEnglishCallActive() {
  return isEnglishMode() && voiceCallState.active;
}

function getEnglishCallStatusKey() {
  if (!voiceCallState.supported) {
    return "englishCallUnsupported";
  }
  if (voiceCallState.lastError === "not-allowed" || voiceCallState.lastError === "service-not-allowed") {
    return "englishCallPermission";
  }
  if (voiceCallState.lastError && voiceCallState.lastError !== "no-speech" && voiceCallState.lastError !== "aborted") {
    return "englishCallError";
  }
  if (voiceCallState.speaking) {
    return "englishCallSpeaking";
  }
  if (isStreaming && isEnglishCallActive()) {
    return "englishCallThinking";
  }
  if (voiceCallState.listening) {
    return "englishCallListening";
  }
  if (isEnglishCallActive()) {
    return "englishCallReady";
  }
  return "englishCallStandby";
}

function syncEnglishCallUi() {
  const showEnglishCall = isEnglishMode();
  const isActive = isEnglishCallActive();
  const statusKey = getEnglishCallStatusKey();
  const statusStateMap = {
    englishCallStandby: "ready",
    englishCallReady: "ready",
    englishCallListening: "listening",
    englishCallThinking: "thinking",
    englishCallSpeaking: "speaking",
    englishCallUnsupported: "unsupported",
    englishCallPermission: "error",
    englishCallError: "error"
  };

  elements.englishCallBtn.classList.toggle("hidden", !showEnglishCall);
  elements.englishCallStatus.classList.toggle("hidden", !showEnglishCall);

  if (!showEnglishCall) {
    return;
  }

  elements.englishCallBtn.disabled = !voiceCallState.supported;
  elements.englishCallBtn.classList.toggle("active", isActive);
  elements.englishCallBtn.setAttribute("aria-pressed", String(isActive));
  elements.englishCallBtn.setAttribute("aria-label", t(isActive ? "englishCallStopAria" : "englishCallStartAria"));
  elements.englishCallBtnLabel.textContent = t(isActive ? "englishCallStopButton" : "englishCallButton");
  elements.englishCallStatus.dataset.state = statusStateMap[statusKey] || "ready";
  elements.englishCallStatus.textContent = t(statusKey);
}

function toggleEnglishCall() {
  if (!isEnglishMode()) {
    return;
  }
  if (isEnglishCallActive()) {
    stopEnglishCall();
    return;
  }
  startEnglishCall();
}

function startEnglishCall() {
  if (!voiceCallState.supported || !isEnglishMode()) {
    syncEnglishCallUi();
    return;
  }

  voiceCallState.active = true;
  voiceCallState.lastError = "";
  window.clearTimeout(voiceCallState.restartTimer);
  voiceCallState.restartTimer = 0;
  void stopEnglishCallSpeechOutput();
  syncEnglishCallUi();
  void startEnglishListening();
}

function stopEnglishCall() {
  voiceCallState.active = false;
  voiceCallState.listening = false;
  voiceCallState.speaking = false;
  voiceCallState.pauseRequested = true;
  voiceCallState.lastError = "";
  voiceCallState.finalTranscript = "";
  voiceCallState.interimTranscript = "";
  window.clearTimeout(voiceCallState.restartTimer);
  voiceCallState.restartTimer = 0;

  if (voiceCallState.recognition) {
    try {
      voiceCallState.recognition.abort();
    } catch (error) {
      // Recognition may already be inactive.
    }
  }

  void stopNativeEnglishListening(true);
  void stopEnglishCallSpeechOutput();
  syncEnglishCallUi();
}

function pauseEnglishCallListening() {
  if (!voiceCallState.listening) {
    return;
  }

  voiceCallState.pauseRequested = true;
  if (voiceCallState.usingNativeRecognition) {
    void stopNativeEnglishListening(true);
    return;
  }

  if (!voiceCallState.recognition) {
    return;
  }

  try {
    voiceCallState.recognition.abort();
  } catch (error) {
    // Recognition may already be inactive.
  }
}

function clearEnglishCallDraft() {
  voiceCallState.finalTranscript = "";
  voiceCallState.interimTranscript = "";
}

function scheduleEnglishListening(delay = 520) {
  if (!isEnglishCallActive() || isStreaming || voiceCallState.speaking) {
    return;
  }

  window.clearTimeout(voiceCallState.restartTimer);
  voiceCallState.restartTimer = window.setTimeout(() => {
    void startEnglishListening();
  }, delay);
}

async function clearNativeEnglishListeners() {
  const handles = Array.isArray(voiceCallState.nativeListenerHandles)
    ? voiceCallState.nativeListenerHandles
    : [];

  voiceCallState.nativeListenerHandles = [];

  await Promise.all(
    handles.map(async (handle) => {
      try {
        await handle?.remove?.();
      } catch (error) {
        // Ignore listener cleanup errors.
      }
    })
  );

  try {
    await NativeSpeechRecognitionPlugin?.removeAllListeners?.();
  } catch (error) {
    // Ignore plugin listener cleanup errors.
  }
}

async function stopNativeEnglishListening(removeListeners = false) {
  if (!isNativeSpeechRecognitionSupported()) {
    return;
  }

  try {
    await NativeSpeechRecognitionPlugin.stop();
  } catch (error) {
    // Ignore stop errors when recognizer is already inactive.
  }

  if (removeListeners) {
    await clearNativeEnglishListeners();
    voiceCallState.usingNativeRecognition = false;
  }
}

async function finalizeEnglishListeningSession(recognizedText, { lastError = "", pauseRequested = false } = {}) {
  voiceCallState.listening = false;
  voiceCallState.pauseRequested = false;
  clearEnglishCallDraft();
  syncEnglishCallUi();

  if (!voiceCallState.active || !isEnglishMode()) {
    return;
  }

  if (pauseRequested) {
    return;
  }

  if (recognizedText && !isStreaming) {
    elements.input.value = recognizedText;
    await sendMessage({ source: "voice" });
    return;
  }

  if (lastError === "not-allowed" || lastError === "service-not-allowed") {
    syncEnglishCallUi();
    return;
  }

  if (lastError && lastError !== "no-speech" && lastError !== "aborted") {
    voiceCallState.lastError = "";
    syncEnglishCallUi();
    scheduleEnglishListening(900);
    return;
  }

  voiceCallState.lastError = "";
  scheduleEnglishListening();
}

async function startNativeEnglishListening() {
  if (!isNativeSpeechRecognitionSupported()) {
    return false;
  }

  const permissionGranted = await ensureNativeSpeechPermission();
  if (!permissionGranted) {
    voiceCallState.lastError = "not-allowed";
    syncEnglishCallUi();
    return true;
  }

  try {
    const availability = await NativeSpeechRecognitionPlugin.available?.();
    if (availability && availability.available === false) {
      voiceCallState.lastError = "unsupported";
      syncEnglishCallUi();
      return true;
    }
  } catch (error) {
    // Continue and let start handle runtime issues.
  }

  await clearNativeEnglishListeners();
  clearEnglishCallDraft();
  voiceCallState.lastError = "";
  voiceCallState.usingNativeRecognition = true;

  const partialHandle = await NativeSpeechRecognitionPlugin.addListener("partialResults", (data) => {
    const transcript = Array.isArray(data?.matches)
      ? String(data.matches[0] || "").trim()
      : "";
    if (!transcript) {
      return;
    }

    voiceCallState.finalTranscript = transcript;
    voiceCallState.interimTranscript = "";
    elements.input.value = transcript;
  });

  const listeningHandle = await NativeSpeechRecognitionPlugin.addListener("listeningState", ({ status }) => {
    if (status === "started") {
      voiceCallState.listening = true;
      voiceCallState.lastError = "";
      syncEnglishCallUi();
      return;
    }

    if (status !== "stopped") {
      return;
    }

    const recognizedText = `${voiceCallState.finalTranscript} ${voiceCallState.interimTranscript}`.trim();
    const pauseRequested = voiceCallState.pauseRequested;
    const lastError = voiceCallState.lastError;

    void clearNativeEnglishListeners();
    voiceCallState.usingNativeRecognition = false;
    void finalizeEnglishListeningSession(recognizedText, { lastError, pauseRequested });
  });

  voiceCallState.nativeListenerHandles = [partialHandle, listeningHandle];

  try {
    await NativeSpeechRecognitionPlugin.start({
      language: "en-US",
      maxResults: 1,
      prompt: "Speak with Byronz",
      partialResults: true,
      popup: false
    });
  } catch (error) {
    voiceCallState.lastError = "unknown";
    voiceCallState.listening = false;
    voiceCallState.usingNativeRecognition = false;
    await clearNativeEnglishListeners();
    syncEnglishCallUi();
  }

  return true;
}

function ensureEnglishRecognition() {
  if (voiceCallState.recognition || !SpeechRecognitionConstructor) {
    return voiceCallState.recognition;
  }

  const recognition = new SpeechRecognitionConstructor();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.addEventListener("start", () => {
    voiceCallState.listening = true;
    voiceCallState.lastError = "";
    syncEnglishCallUi();
  });

  recognition.addEventListener("result", (event) => {
    let nextFinal = voiceCallState.finalTranscript;
    let nextInterim = "";

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      const transcript = String(result[0]?.transcript || "").trim();
      if (!transcript) {
        continue;
      }

      if (result.isFinal) {
        nextFinal = `${nextFinal} ${transcript}`.trim();
      } else {
        nextInterim = `${nextInterim} ${transcript}`.trim();
      }
    }

    voiceCallState.finalTranscript = nextFinal;
    voiceCallState.interimTranscript = nextInterim;
    elements.input.value = `${nextFinal} ${nextInterim}`.trim();
  });

  recognition.addEventListener("error", (event) => {
    voiceCallState.lastError = event.error || "unknown";
    voiceCallState.listening = false;
    syncEnglishCallUi();
  });

  recognition.addEventListener("end", async () => {
    voiceCallState.listening = false;
    const recognizedText = voiceCallState.finalTranscript.trim();
    const lastError = voiceCallState.lastError;
    const pauseRequested = voiceCallState.pauseRequested;
    await finalizeEnglishListeningSession(recognizedText, { lastError, pauseRequested });
  });

  voiceCallState.recognition = recognition;
  return recognition;
}

async function startEnglishListening() {
  if (!isEnglishCallActive() || isStreaming || voiceCallState.speaking) {
    return;
  }

  if (isNativeSpeechRecognitionSupported()) {
    await startNativeEnglishListening();
    return;
  }

  const recognition = ensureEnglishRecognition();
  if (!recognition || voiceCallState.listening) {
    return;
  }

  clearEnglishCallDraft();
  voiceCallState.lastError = "";
  window.clearTimeout(voiceCallState.restartTimer);
  voiceCallState.restartTimer = 0;

  try {
    recognition.start();
  } catch (error) {
    if (error && error.name === "InvalidStateError") {
      return;
    }
    voiceCallState.lastError = "unknown";
    syncEnglishCallUi();
  }
}

function stripMarkdownForSpeech(text) {
  return String(text || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickEnglishVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  return voices.find((voice) => String(voice.lang || "").toLowerCase().startsWith("en"))
    || voices.find((voice) => /english/i.test(String(voice.name || "")))
    || null;
}

function speakEnglishCallResponse(text) {
  if (!isEnglishCallActive()) {
    return Promise.resolve();
  }

  const speechText = stripMarkdownForSpeech(text);
  if (!speechText) {
    return Promise.resolve();
  }

  voiceCallState.speaking = true;
  voiceCallState.lastError = "";
  syncEnglishCallUi();

  if (isNativeTextToSpeechSupported()) {
    return (async () => {
      try {
        await stopEnglishCallSpeechOutput();
        await NativeTextToSpeechPlugin.speak({
          text: speechText,
          lang: "en-US",
          rate: 1,
          pitch: 1,
          volume: 1,
          queueStrategy: 0
        });
      } finally {
        voiceCallState.speaking = false;
        syncEnglishCallUi();
        if (isEnglishCallActive()) {
          scheduleEnglishListening(360);
        }
      }
    })();
  }

  if (!window.speechSynthesis) {
    voiceCallState.speaking = false;
    syncEnglishCallUi();
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speechText);
    const selectedVoice = pickEnglishVoice();

    utterance.lang = selectedVoice?.lang || "en-US";
    utterance.voice = selectedVoice || null;
    utterance.rate = 1.02;
    utterance.pitch = 1;

    const finishSpeaking = () => {
      voiceCallState.speaking = false;
      syncEnglishCallUi();
      if (isEnglishCallActive()) {
        scheduleEnglishListening(360);
      }
      resolve();
    };

    utterance.addEventListener("end", finishSpeaking, { once: true });
    utterance.addEventListener("error", finishSpeaking, { once: true });
    window.speechSynthesis.speak(utterance);
  });
}

async function stopEnglishCallSpeechOutput() {
  try {
    await NativeTextToSpeechPlugin?.stop?.();
  } catch (error) {
    // Ignore native TTS stop errors.
  }

  try {
    window.speechSynthesis?.cancel();
  } catch (error) {
    // Ignore browser TTS stop errors.
  }
}

function startAmbientExperience() {
  updateAmbientClock();
  renderAmbientWidget();

  if (ambientClockTimer) {
    window.clearInterval(ambientClockTimer);
  }
  ambientClockTimer = window.setInterval(updateAmbientClock, 1000);

  if (ambientWeatherTimer) {
    window.clearInterval(ambientWeatherTimer);
  }
  ambientWeatherTimer = window.setInterval(() => {
    refreshAmbientWeather();
  }, WEATHER_REFRESH_INTERVAL);
}

function getAmbientLocale() {
  return getUiLanguage() === "english" ? "en-US" : "id-ID";
}

function updateAmbientClock() {
  const now = new Date();
  const timezone = ambientState.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const locale = getAmbientLocale();
  let timeText = "--:--:--";
  let dateText = "--";

  try {
    const timeParts = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: timezone
    }).formatToParts(now);

    const partMap = Object.fromEntries(
      timeParts
        .filter((part) => ["hour", "minute", "second"].includes(part.type))
        .map((part) => [part.type, part.value])
    );

    timeText = `${partMap.hour || "--"}:${partMap.minute || "--"}:${partMap.second || "--"}`;
    dateText = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: timezone
    }).format(now);
  } catch (error) {
    timeText = now.toLocaleTimeString(locale, { hour12: false });
    dateText = now.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  elements.ambientTime.textContent = timeText;
  elements.ambientDate.textContent = dateText;
}

function renderAmbientWidget() {
  elements.ambientWidgetLabel.textContent = t("ambientWidgetLabel");
  elements.ambientStatus.textContent = t(ambientState.statusKey);
  elements.ambientLocationLabel.textContent = t("ambientLocationLabel");
  elements.ambientWeatherLabel.textContent = t("ambientWeatherLabel");
  elements.ambientTemperatureLabel.textContent = t("ambientTemperatureLabel");
  elements.ambientLocation.textContent = ambientState.locationLabel || resolveAmbientLocationLabel(ambientState.timezone);
  elements.ambientWeather.textContent = getAmbientWeatherText();
  elements.ambientTemperature.textContent = Number.isFinite(ambientState.temperature)
    ? `${Math.round(ambientState.temperature)}\u00B0C`
    : "--\u00B0C";
}

function getAmbientWeatherText() {
  if (Number.isFinite(ambientState.weatherCode)) {
    return describeWeatherCode(ambientState.weatherCode, ambientState.isDay);
  }
  if (ambientState.permissionDenied) {
    return t("ambientWeatherPermission");
  }
  if (ambientState.loading) {
    return t("ambientWeatherLoading");
  }
  return t("ambientWeatherUnavailable");
}

function resolveAmbientLocationLabel(timezone) {
  const formatted = formatTimezoneLocation(timezone || ambientState.timezone);
  return formatted || t("ambientLocationFallback");
}

function formatTimezoneLocation(timezone) {
  const value = String(timezone || "").trim();
  if (!value) {
    return "";
  }

  const parts = value.split("/").filter(Boolean);
  const city = (parts.at(-1) || value).replace(/_/g, " ");
  return city || value;
}

function describeWeatherCode(code, isDay) {
  const language = getUiLanguage();

  if (code === 0) {
    return language === "english"
      ? (isDay ? "Clear sky" : "Clear night")
      : (isDay ? "Langit cerah" : "Malam cerah");
  }
  if (code === 1) {
    return language === "english" ? "Mostly clear" : "Cerah berawan";
  }
  if (code === 2) {
    return language === "english" ? "Partly cloudy" : "Berawan sebagian";
  }
  if (code === 3) {
    return language === "english" ? "Overcast" : "Mendung";
  }
  if ([45, 48].includes(code)) {
    return language === "english" ? "Fog" : "Berkabut";
  }
  if ([51, 53, 55].includes(code)) {
    return language === "english" ? "Drizzle" : "Gerimis";
  }
  if ([56, 57].includes(code)) {
    return language === "english" ? "Freezing drizzle" : "Gerimis beku";
  }
  if ([61, 63, 65].includes(code)) {
    return language === "english" ? "Rain" : "Hujan";
  }
  if ([66, 67].includes(code)) {
    return language === "english" ? "Freezing rain" : "Hujan beku";
  }
  if ([71, 73, 75, 77].includes(code)) {
    return language === "english" ? "Snow" : "Salju";
  }
  if ([80, 81, 82].includes(code)) {
    return language === "english" ? "Rain showers" : "Hujan singkat";
  }
  if ([85, 86].includes(code)) {
    return language === "english" ? "Snow showers" : "Salju singkat";
  }
  if (code === 95) {
    return language === "english" ? "Thunderstorm" : "Badai petir";
  }
  if ([96, 99].includes(code)) {
    return language === "english" ? "Storm with hail" : "Badai es";
  }
  return language === "english" ? "Local weather" : "Cuaca lokal";
}

function getBrowserPosition(options) {
  if (isNativeGeolocationSupported()) {
    return getNativePosition(options);
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function getNativePosition(options) {
  const permissionGranted = await ensureNativeGeolocationPermission();
  if (!permissionGranted) {
    const permissionError = new Error("Geolocation permission denied");
    permissionError.code = 1;
    throw permissionError;
  }

  return NativeGeolocationPlugin.getCurrentPosition({
    enableHighAccuracy: Boolean(options?.enableHighAccuracy),
    timeout: Number.isFinite(options?.timeout) ? options.timeout : 10000,
    maximumAge: Number.isFinite(options?.maximumAge) ? options.maximumAge : 0
  });
}

function buildWeatherUrl(latitude, longitude) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude.toFixed(4));
  url.searchParams.set("longitude", longitude.toFixed(4));
  url.searchParams.set("current", "temperature_2m,weather_code,is_day");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("timezone", "auto");
  return url.toString();
}

function buildAmbientLocationUrl(latitude, longitude) {
  const url = new URL(buildApiUrl("/ambient-location"), window.location.href);
  url.searchParams.set("latitude", latitude.toFixed(6));
  url.searchParams.set("longitude", longitude.toFixed(6));
  url.searchParams.set("language", getUiLanguage() === "english" ? "en" : "id");
  return url.toString();
}

async function fetchLocationLabel(latitude, longitude) {
  try {
    const response = await fetch(buildAmbientLocationUrl(latitude, longitude));
    if (!response.ok) {
      throw new Error("Ambient location request failed");
    }

    const payload = await response.json();
    return typeof payload.label === "string" ? payload.label.trim() : "";
  } catch (error) {
    return "";
  }
}

async function refreshAmbientWeather(force = false) {
  if (ambientState.loading) {
    return;
  }
  if (ambientState.permissionDenied && !force) {
    return;
  }
  if (!force && ambientState.lastUpdatedAt && (Date.now() - ambientState.lastUpdatedAt) < WEATHER_REFRESH_INTERVAL) {
    return;
  }
  if (!navigator.geolocation && !isNativeGeolocationSupported()) {
    ambientState.statusKey = "ambientStatusUnavailable";
    renderAmbientWidget();
    return;
  }

  ambientState.loading = true;
  ambientState.statusKey = "ambientStatusLoading";
  renderAmbientWidget();

  try {
    const position = await getBrowserPosition({
      enableHighAccuracy: false,
      timeout: 9000,
      maximumAge: WEATHER_REFRESH_INTERVAL
    });

    const latitude = Number(position.coords.latitude);
    const longitude = Number(position.coords.longitude);
    const [response, resolvedLocationLabel] = await Promise.all([
      fetch(buildWeatherUrl(latitude, longitude)),
      fetchLocationLabel(latitude, longitude)
    ]);

    if (!response.ok) {
      throw new Error("Weather request failed");
    }

    const payload = await response.json();
    const current = payload.current || {};
    const nextWeatherCode = Number(current.weather_code);
    const nextTemperature = Number(current.temperature_2m);

    ambientState.permissionDenied = false;
    ambientState.temperature = Number.isFinite(nextTemperature) ? nextTemperature : null;
    ambientState.weatherCode = Number.isFinite(nextWeatherCode) ? nextWeatherCode : null;
    ambientState.isDay = Number(current.is_day) !== 0;
    ambientState.timezone = typeof payload.timezone === "string" && payload.timezone.trim()
      ? payload.timezone.trim()
      : ambientState.timezone;
    ambientState.locationLabel = resolvedLocationLabel || resolveAmbientLocationLabel(payload.timezone);
    ambientState.statusKey = ambientState.weatherCode === null && ambientState.temperature === null
      ? "ambientStatusUnavailable"
      : "ambientStatusLive";
    ambientState.lastUpdatedAt = Date.now();
  } catch (error) {
    if (error && error.code === 1) {
      ambientState.permissionDenied = true;
      ambientState.statusKey = "ambientStatusLocationOff";
    } else if (!ambientState.lastUpdatedAt) {
      ambientState.statusKey = "ambientStatusUnavailable";
    }

    if (!ambientState.locationLabel) {
      ambientState.locationLabel = resolveAmbientLocationLabel(ambientState.timezone);
    }
  } finally {
    ambientState.loading = false;
    renderAmbientWidget();
    updateAmbientClock();
  }
}

function updateViewportHeight() {
  document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
}

function openMenu() {
  isBrandMenuOpen = false;
  isMenuOpen = true;
  syncPanelState();
  elements.historySearch.focus();
}

function closeMenu(returnFocus = false) {
  isMenuOpen = false;
  syncPanelState();
  if (returnFocus) {
    elements.menuBtn.focus();
  }
}

function toggleMenu() {
  if (isMenuOpen) {
    closeMenu(true);
    return;
  }
  openMenu();
}

function openBrandMenu() {
  isMenuOpen = false;
  isBrandMenuOpen = true;
  syncPanelState();
  elements.profileNameInput.focus();
}

function closeBrandMenu(returnFocus = false) {
  isBrandMenuOpen = false;
  syncPanelState();
  if (returnFocus) {
    elements.brandDockBtn.focus();
  }
}

function toggleBrandMenu() {
  if (isBrandMenuOpen) {
    closeBrandMenu(true);
    return;
  }
  openBrandMenu();
}

function closeAllMenus() {
  isMenuOpen = false;
  isBrandMenuOpen = false;
  syncPanelState();
}

function openCreatorModal() {
  closeAllMenus();
  isCreatorModalOpen = true;
  selectCreatorPlatform(activeCreatorPlatform);
  syncCreatorModalState();
  elements.closeCreatorModalBtn.focus();
}

function closeCreatorModal(returnFocus = false) {
  isCreatorModalOpen = false;
  syncCreatorModalState();
  if (returnFocus) {
    elements.brandDockBtn.focus();
  }
}

function selectCreatorPlatform(platform) {
  const resolvedPlatform = creatorPlatformButtons.some((button) => button.dataset.platform === platform)
    ? platform
    : "";
  activeCreatorPlatform = resolvedPlatform;
  const noteKey = CREATOR_PLATFORM_NOTE_KEYS[activeCreatorPlatform] || "creatorPlatformNoteDefault";

  creatorPlatformButtons.forEach((button) => {
    const isActive = Boolean(activeCreatorPlatform) && button.dataset.platform === activeCreatorPlatform;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  elements.creatorPlatformNote.textContent = t(noteKey);
}

function syncCreatorModalState() {
  elements.creatorModal.classList.toggle("hidden", !isCreatorModalOpen);
  elements.creatorModal.setAttribute("aria-hidden", String(!isCreatorModalOpen));
  elements.creatorCardTrigger.setAttribute("aria-expanded", String(isCreatorModalOpen));
  syncPanelState();
}

function syncPanelState() {
  const hasOpenPanel = isMenuOpen || isBrandMenuOpen || isCreatorModalOpen;

  elements.mainPanel.classList.toggle("menu-open", isMenuOpen);
  elements.mainPanel.classList.toggle("brand-menu-open", isBrandMenuOpen);
  elements.commandMenu.setAttribute("aria-hidden", String(!isMenuOpen));
  elements.brandMenu.setAttribute("aria-hidden", String(!isBrandMenuOpen));
  elements.menuBtn.setAttribute("aria-expanded", String(isMenuOpen));
  elements.brandDockBtn.setAttribute("aria-expanded", String(isBrandMenuOpen));
  document.body.classList.toggle("no-scroll", hasOpenPanel);
}

function selectMode(mode, options = {}) {
  const { persist = true, updateActiveChat = true } = options;
  const previousMode = currentMode;
  currentMode = normalizeMode(mode);

  if (previousMode === "english_tutor" && currentMode !== "english_tutor") {
    stopEnglishCall();
  }

  modeButtons.forEach((button) => {
    const isActive = normalizeMode(button.dataset.mode) === currentMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (persist) {
    localStorage.setItem(STORAGE_KEYS.mode, currentMode);
  }

  if (updateActiveChat) {
    const activeChat = findChat(sessionId);
    if (activeChat) {
      activeChat.mode = currentMode;
      activeChat.updatedAt = Date.now();
      persistChats();
      renderChats();
    }
  }

  updateFooterState();
  updateSessionStatus();
  syncEnglishCallUi();
}

function getCurrentStyle() {
  return RESPONSE_STYLES.find((style) => style.key === settings.responseStyle) || RESPONSE_STYLES[1];
}

function updateFooterState() {
  const currentStyle = getCurrentStyle();
  const themeLabelText = getActualTheme() === "light" ? t("themeLight") : t("themeDark");
  const modelLabelText = getResolvedModelLabel();

  elements.footerSummary.textContent = `${t("footerMode")}: ${getModeLabel()} | ${t("footerModel")}: ${modelLabelText} | ${t("footerStyle")}: ${currentStyle.label[getUiLanguage()]} | ${t("footerTheme")}: ${themeLabelText}`;
  elements.modeHint.textContent = `${t("footerFocus")} ${getModeLabel()}: ${getModeFocus()}`;
  elements.input.placeholder = isStreaming ? t("waitingResponse") : getModePlaceholder();
}

function loadChats() {
  if (!settings.chatRetention) {
    localStorage.removeItem(STORAGE_KEYS.chats);
    return [];
  }

  const rawChats = safeParse(localStorage.getItem(STORAGE_KEYS.chats));
  if (!Array.isArray(rawChats)) {
    return [];
  }

  return rawChats
    .map((chat) => normalizeChat(chat))
    .filter(Boolean)
    .sort((left, right) => right.updatedAt - left.updatedAt);
}

function normalizeChat(chat) {
  if (!chat || typeof chat !== "object") {
    return null;
  }

  const id = String(chat.id || "").trim();
  if (!id) {
    return null;
  }

  const messages = Array.isArray(chat.messages)
    ? chat.messages.map(normalizeMessage).filter(Boolean)
    : [];

  return {
    id,
    mode: normalizeMode(chat.mode || "general"),
    title: deriveChatTitle(messages, chat.title),
    preview: deriveChatPreview(messages),
    messages,
    createdAt: toTimestamp(chat.createdAt),
    updatedAt: toTimestamp(chat.updatedAt)
  };
}

function normalizeMessage(message) {
  if (!message || typeof message !== "object") {
    return null;
  }

  const roleValue = String(message.role || "").trim().toLowerCase();
  const role = roleValue === "assistant" ? "ai" : roleValue;
  const content = typeof message.content === "string" ? message.content.trim() : "";

  if (!content || (role !== "user" && role !== "ai")) {
    return null;
  }

  return { role, content };
}

function findChat(id) {
  return chats.find((chat) => chat.id === id);
}

function saveSessionId() {
  localStorage.setItem(STORAGE_KEYS.session, sessionId);
}

function persistChats() {
  chats = [...chats].sort((left, right) => right.updatedAt - left.updatedAt);

  if (settings.chatRetention) {
    localStorage.setItem(STORAGE_KEYS.chats, JSON.stringify(chats));
  } else {
    localStorage.removeItem(STORAGE_KEYS.chats);
  }

  saveSessionId();
}

function deriveChatTitle(messages, fallbackTitle = "") {
  const firstUserMessage = messages.find((message) => message.role === "user");
  return cleanPreviewText(fallbackTitle || firstUserMessage?.content || "New Chat").slice(0, 46);
}

function deriveChatPreview(messages) {
  const lastMessage = messages.at(-1);
  return cleanPreviewText(lastMessage?.content || "").slice(0, 96);
}

function cleanPreviewText(text) {
  return String(text || "")
    .replace(/[`*_>#~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toTimestamp(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsedValue = Date.parse(value);
    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }
  return Date.now();
}

function upsertActiveChat(seedContent = "") {
  let activeChat = findChat(sessionId);

  if (!activeChat) {
    activeChat = {
      id: sessionId,
      mode: currentMode,
      title: deriveChatTitle([], seedContent),
      preview: cleanPreviewText(seedContent),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    chats.unshift(activeChat);
  }

  return activeChat;
}

function recordMessage(role, content) {
  const normalizedContent = typeof content === "string" ? content.trim() : "";
  if (!normalizedContent) {
    return;
  }

  const activeChat = upsertActiveChat(normalizedContent);
  activeChat.mode = currentMode;
  activeChat.messages.push({ role, content: normalizedContent });
  activeChat.title = deriveChatTitle(activeChat.messages, activeChat.title);
  activeChat.preview = deriveChatPreview(activeChat.messages);
  activeChat.updatedAt = Date.now();

  persistChats();
  renderChats();
  updateSessionStatus(activeChat);
}

function clearChatMessages() {
  elements.chatContainer.querySelectorAll(".message-row").forEach((node) => node.remove());
}

function toggleDashboard(visible) {
  elements.emptyState.classList.toggle("hidden", !visible);
  elements.emptyState.setAttribute("aria-hidden", String(!visible));
}

function resetChatStage() {
  clearChatMessages();
  toggleDashboard(true);
  updateSessionStatus();
  updateFooterState();
}

function renderMessage(text, role, options = {}) {
  toggleDashboard(false);

  const row = document.createElement("article");
  row.className = `message-row ${role}`;

  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.textContent = role === "user" ? (settings.displayName || t("youLabel")) : t("copiedBy");

  const bubble = document.createElement("div");
  bubble.className = `message ${role}${options.pending ? " pending" : ""}`;

  if (role === "ai") {
    setAiMessageContent(bubble, text || t("waitingResponse"));
  } else {
    bubble.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
  }

  row.append(meta, bubble);
  elements.chatContainer.appendChild(row);
  scrollToLatest(true);
  return bubble;
}

function setAiMessageContent(element, text) {
  element.innerHTML = renderMarkdown(text);

  element.querySelectorAll("pre code").forEach((block) => {
    if (window.hljs) {
      window.hljs.highlightElement(block);
    }
  });

  addCopyButtons(element);
}

function renderMarkdown(text) {
  if (window.marked) {
    return window.marked.parse(text);
  }
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function addCopyButtons(scope) {
  scope.querySelectorAll("pre").forEach((preBlock) => {
    if (preBlock.querySelector(".copy-btn")) {
      return;
    }

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "copy-btn";
    copyButton.textContent = "Copy";

    copyButton.addEventListener("click", async () => {
      const codeElement = preBlock.querySelector("code");
      const textToCopy = codeElement ? codeElement.innerText : preBlock.innerText;

      try {
        await copyText(textToCopy);
        copyButton.textContent = "Copied";
      } catch (error) {
        copyButton.textContent = "Failed";
      }

      window.setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 1400);
    });

    preBlock.appendChild(copyButton);
  });
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "true");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

function scrollToLatest(force = false) {
  requestAnimationFrame(() => {
    const remainingSpace = elements.chatContainer.scrollHeight - elements.chatContainer.scrollTop - elements.chatContainer.clientHeight;
    if (force || remainingSpace < 220) {
      elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
    }
  });
}

function handleAttachmentSelection(fileList) {
  const incomingFiles = Array.from(fileList || []);
  if (!incomingFiles.length) {
    return;
  }

  const existingKeys = new Set(
    pendingAttachments.map((attachment) => `${attachment.name}:${attachment.size}:${attachment.lastModified}`)
  );

  let remainingSlots = MAX_ATTACHMENTS - pendingAttachments.length;
  let addedCount = 0;

  incomingFiles.forEach((file) => {
    if (remainingSlots <= 0) {
      return;
    }

    const attachmentKey = `${file.name}:${file.size}:${file.lastModified}`;
    if (existingKeys.has(attachmentKey)) {
      return;
    }

    pendingAttachments.push(createPendingAttachment(file));
    existingKeys.add(attachmentKey);
    remainingSlots -= 1;
    addedCount += 1;
  });

  if (addedCount < incomingFiles.length) {
    elements.sessionStatus.textContent = t("attachmentLimitReached");
  }

  elements.fileInput.value = "";
  renderPendingAttachments();
  updateFooterState();
}

function createPendingAttachment(file) {
  const isImage = String(file.type || "").startsWith("image/");

  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
    file,
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
    isImage,
    previewUrl: isImage ? URL.createObjectURL(file) : ""
  };
}

function renderPendingAttachments() {
  elements.attachmentTray.innerHTML = "";
  elements.attachmentTray.classList.toggle("hidden", pendingAttachments.length === 0);

  pendingAttachments.forEach((attachment) => {
    const chip = document.createElement("div");
    chip.className = "attachment-chip";

    if (attachment.isImage && attachment.previewUrl) {
      const thumb = document.createElement("img");
      thumb.className = "attachment-thumb";
      thumb.src = attachment.previewUrl;
      thumb.alt = attachment.name;
      chip.appendChild(thumb);
    } else {
      const icon = document.createElement("div");
      icon.className = "attachment-icon";
      icon.textContent = t("attachmentFileLabel").slice(0, 3).toUpperCase();
      chip.appendChild(icon);
    }

    const meta = document.createElement("div");
    meta.className = "attachment-meta";

    const name = document.createElement("span");
    name.className = "attachment-name";
    name.textContent = attachment.name;

    const size = document.createElement("span");
    size.className = "attachment-size";
    size.textContent = `${attachment.isImage ? t("attachmentImageLabel") : t("attachmentFileLabel")} | ${formatFileSize(attachment.size)}`;

    meta.append(name, size);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "attachment-remove";
    removeButton.textContent = "x";
    removeButton.setAttribute("aria-label", `${t("removeAttachmentAria")} ${attachment.name}`);
    removeButton.addEventListener("click", () => removePendingAttachment(attachment.id));

    chip.append(meta, removeButton);
    elements.attachmentTray.appendChild(chip);
  });
}

function removePendingAttachment(attachmentId) {
  const nextAttachments = [];

  pendingAttachments.forEach((attachment) => {
    if (attachment.id === attachmentId) {
      revokeAttachmentPreview(attachment);
      return;
    }
    nextAttachments.push(attachment);
  });

  pendingAttachments = nextAttachments;
  renderPendingAttachments();
  updateFooterState();
}

function revokeAttachmentPreview(attachment) {
  if (attachment && attachment.previewUrl) {
    URL.revokeObjectURL(attachment.previewUrl);
  }
}

function clearPendingAttachments() {
  pendingAttachments.forEach(revokeAttachmentPreview);
  pendingAttachments = [];
  elements.fileInput.value = "";
  renderPendingAttachments();
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const scaled = bytes / (1024 ** unitIndex);
  const precision = scaled >= 10 || unitIndex === 0 ? 0 : 1;
  return `${scaled.toFixed(precision)} ${units[unitIndex]}`;
}

function getDefaultAttachmentPrompt(mode = currentMode) {
  const prompts = ATTACHMENT_DEFAULT_PROMPTS[normalizeMode(mode)] || ATTACHMENT_DEFAULT_PROMPTS.general;
  return prompts[getUiLanguage()];
}

function buildUserMessagePreview(text, attachments) {
  const cleanText = typeof text === "string" ? text.trim() : "";
  if (!attachments.length) {
    return cleanText;
  }

  const attachmentNames = attachments.map((attachment) => attachment.name).join(", ");
  if (!cleanText) {
    return `[${t("attachmentFileLabel")}] ${attachmentNames}`;
  }

  return `${cleanText}\n\n[${t("attachmentFileLabel")}] ${attachmentNames}`;
}

async function requestStreamingResponse(prompt, requestSessionId, requestMode, attachments) {
  if (attachments.length) {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("session_id", requestSessionId);
    formData.append("mode", getModeConfig(requestMode).requestMode);
    formData.append("preferences", JSON.stringify(buildPreferencesPayload()));

    attachments.forEach((attachment) => {
      formData.append("files", attachment.file, attachment.file.name);
    });

    return fetch(buildApiUrl("/ask-stream-upload"), {
      method: "POST",
      body: formData,
      signal: currentStreamController.signal
    });
  }

  return fetch(buildApiUrl("/ask-stream"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      session_id: requestSessionId,
      mode: getModeConfig(requestMode).requestMode,
      preferences: buildPreferencesPayload()
    }),
    signal: currentStreamController.signal
  });
}

async function sendMessage(options = {}) {
  const { source = "text" } = options;

  if (isStreaming) {
    return;
  }

  const text = elements.input.value.trim();
  const attachments = [...pendingAttachments];

  if (!text && !attachments.length) {
    elements.input.focus();
    return;
  }

  const prompt = text || getDefaultAttachmentPrompt(currentMode);
  const userMessagePreview = buildUserMessagePreview(text, attachments);
  const shouldContinueEnglishCall = isEnglishCallActive() && !attachments.length;

  if (shouldContinueEnglishCall) {
    pauseEnglishCallListening();
  }

  elements.input.value = "";
  clearPendingAttachments();
  renderMessage(userMessagePreview, "user");
  recordMessage("user", userMessagePreview);

  const aiBubble = renderMessage(t("waitingResponse"), "ai", { pending: true });
  const requestSessionId = sessionId;
  const requestMode = currentMode;

  setStreamingState(true);
  currentStreamController = new AbortController();

  try {
    const response = await requestStreamingResponse(prompt, requestSessionId, requestMode, attachments);

    if (!response.ok || !response.body) {
      throw new Error("Streaming response tidak tersedia.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      fullText += decoder.decode(value, { stream: true });
      setAiMessageContent(aiBubble, fullText || t("waitingResponse"));
      scrollToLatest();
    }

    fullText += decoder.decode();
    const finalText = fullText.trim() || t("waitingResponse");
    aiBubble.classList.remove("pending");
    setAiMessageContent(aiBubble, finalText);

    if (requestSessionId === sessionId) {
      recordMessage("ai", finalText);
    }

    if (shouldContinueEnglishCall && requestSessionId === sessionId && requestMode === "english_tutor") {
      await speakEnglishCallResponse(finalText);
    }
  } catch (error) {
    aiBubble.classList.remove("pending");
    aiBubble.textContent = error.name === "AbortError" ? t("streamStopped") : t("backendError");
  } finally {
    currentStreamController = null;
    setStreamingState(false);
    renderChats();
    updateSessionStatus();
    if (shouldContinueEnglishCall && source !== "voice" && isEnglishCallActive() && !voiceCallState.speaking) {
      scheduleEnglishListening();
    }
    elements.input.focus();
  }
}

function buildPreferencesPayload() {
  return {
    display_name: settings.displayName || null,
    preferred_language: settings.preferredLanguage,
    selected_model: normalizeSelectedModel(settings.selectedModel),
    response_style: settings.responseStyle,
    assistant_behavior: settings.assistantBehavior,
    voice_call_active: isEnglishCallActive()
  };
}

function setStreamingState(active) {
  isStreaming = active;
  elements.sendBtn.disabled = active;
  elements.attachmentBtn.disabled = active;
  elements.sendBtn.dataset.busy = active ? "true" : "false";
  setSendButtonLabel(active ? t("thinking") : t("sendBtn"));
  elements.input.placeholder = active ? t("waitingResponse") : getModePlaceholder();
  syncEnglishCallUi();
}

function stopStreaming() {
  if (currentStreamController) {
    currentStreamController.abort();
  }
}

function createNewChat() {
  stopStreaming();
  sessionId = createSessionId();
  historyFilter = "";
  elements.historySearch.value = "";
  elements.input.value = "";
  clearPendingAttachments();
  saveSessionId();
  resetChatStage();
  renderChats();
  closeAllMenus();
  elements.input.focus();
}

function loadChat(id, options = {}) {
  const { closePanels = true } = options;
  stopStreaming();

  const chat = findChat(id);
  sessionId = id;
  saveSessionId();
  clearPendingAttachments();
  clearChatMessages();

  if (!chat || !chat.messages.length) {
    resetChatStage();
    renderChats();
    if (closePanels) {
      closeAllMenus();
    }
    return;
  }

  selectMode(chat.mode || "general", { persist: true, updateActiveChat: false });
  toggleDashboard(false);

  chat.messages.forEach((message) => renderMessage(message.content, message.role));

  renderChats();
  updateSessionStatus(chat);
  scrollToLatest(true);

  if (closePanels) {
    closeAllMenus();
  }
}

function renderChats() {
  elements.chatList.innerHTML = "";

  const storedChats = chats.filter((chat) => chat.messages.length);
  const filteredChats = storedChats.filter((chat) => {
    const haystack = `${chat.title} ${chat.preview} ${getModeLabel(chat.mode)}`.toLowerCase();
    return !historyFilter || haystack.includes(historyFilter);
  });

  elements.chatCount.textContent = String(storedChats.length);

  if (!filteredChats.length) {
    const emptyCard = document.createElement("div");
    emptyCard.className = "chat-list-empty";
    emptyCard.textContent = historyFilter ? t("historyEmptySearch") : t("historyEmpty");
    elements.chatList.appendChild(emptyCard);
    return;
  }

  filteredChats.forEach((chat) => {
    const card = document.createElement("article");
    card.className = `chat-card${chat.id === sessionId ? " active" : ""}`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${t("openChatAria")} ${chat.title}`);

    card.addEventListener("click", () => loadChat(chat.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        loadChat(chat.id);
      }
    });

    const title = document.createElement("div");
    title.className = "chat-card-title";
    title.textContent = chat.title;

    const preview = document.createElement("div");
    preview.className = "chat-card-preview";
    preview.textContent = chat.preview;

    const meta = document.createElement("div");
    meta.className = "chat-card-meta";

    const modeBadge = document.createElement("span");
    modeBadge.className = "chat-mode-badge";
    modeBadge.textContent = getModeLabel(chat.mode);

    const details = document.createElement("span");
    details.textContent = `${chat.messages.length} ${t("messageShort")} | ${formatTimestamp(chat.updatedAt)}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "chat-card-delete";
    deleteButton.textContent = "x";
    deleteButton.setAttribute("aria-label", `${t("deleteChatAria")} ${chat.title}`);
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteChat(chat.id);
    });

    meta.append(modeBadge, details);
    card.append(title, preview, meta, deleteButton);
    elements.chatList.appendChild(card);
  });
}

function deleteChat(id) {
  const chat = findChat(id);
  if (!chat) {
    return;
  }

  if (!window.confirm(`${t("deleteChatConfirm")} "${chat.title}"?`)) {
    return;
  }

  chats = chats.filter((item) => item.id !== id);
  persistChats();

  if (sessionId === id) {
    const nextChat = chats[0];
    if (nextChat) {
      loadChat(nextChat.id, { closePanels: false });
    } else {
      createNewChat();
    }
    return;
  }

  renderChats();
  updateSessionStatus();
}

function clearAllHistory() {
  if (!chats.length) {
    elements.sessionStatus.textContent = t("noHistoryToClear");
    return;
  }

  if (!window.confirm(t("clearHistoryConfirm"))) {
    return;
  }

  chats = [];
  localStorage.removeItem(STORAGE_KEYS.chats);
  createNewChat();
  renderChats();
  updateSessionStatus();
}

function handleChatRetentionChange(enabled) {
  if (!enabled) {
    localStorage.removeItem(STORAGE_KEYS.chats);
    renderChats();
    elements.sessionStatus.textContent = t("retentionDisabled");
    return;
  }

  persistChats();
  renderChats();
  updateSessionStatus();
}

function updateSessionStatus(chat = findChat(sessionId)) {
  const currentStyle = getCurrentStyle();
  const behaviorLabel = BEHAVIOR_LABELS[settings.assistantBehavior][getUiLanguage()];
  const greetingName = settings.displayName ? `${settings.displayName}, ` : "";
  const modelLabel = getResolvedModelLabel();

  if (!chat || !chat.messages.length) {
    elements.sessionStatus.textContent = `${greetingName}${getModeLabel()} | ${currentStyle.label[getUiLanguage()]} | ${behaviorLabel} | ${modelLabel}`;
    return;
  }

  const messageLabel = chat.messages.length === 1
    ? `1 ${getUiLanguage() === "english" ? "message" : "pesan"}`
    : `${chat.messages.length} ${t("messages")}`;

  elements.sessionStatus.textContent = `${getModeLabel(chat.mode)} | ${chat.title} | ${messageLabel} | ${modelLabel} | ${t("updatedAt")} ${formatTimestamp(chat.updatedAt)}`;
}

function formatTimestamp(timestamp) {
  const locale = getUiLanguage() === "english" ? "en-US" : "id-ID";
  const date = new Date(timestamp || Date.now());
  const isSameDay = date.toDateString() === new Date().toDateString();

  return new Intl.DateTimeFormat(locale, isSameDay
    ? { hour: "2-digit", minute: "2-digit" }
    : { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

function exportChat() {
  const chat = findChat(sessionId);
  if (!chat || !chat.messages.length) {
    elements.sessionStatus.textContent = t("noChatToExport");
    return;
  }

  const lines = [
    `# ${chat.title}`,
    `${t("footerMode")}: ${getModeLabel(chat.mode)}`,
    `${t("footerStyle")}: ${getCurrentStyle().label[getUiLanguage()]}`,
    ""
  ];

  chat.messages.forEach((message) => {
    lines.push(message.role === "user" ? `${settings.displayName || t("youLabel")}:` : `${t("copiedBy")}:`);
    lines.push(message.content);
    lines.push("");
  });

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${slugify(chat.title) || "byronz-chat"}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
  closeMenu(false);
}

function slugify(text) {
  return String(text || "chat")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
