import { AppMode, Language } from './types';

export const SYSTEM_INSTRUCTION = "Tu es AccessiLens. Réponds UNIQUEMENT en texte brut. JAMAIS de JSON. JAMAIS de Markdown. Juste le texte à prononcer.";

export const PROMPTS: Record<Language, Record<AppMode, string>> = {
  fr: {
    [AppMode.SCENE]: `
ANALYSE cette image et décris la scène pour la NAVIGATION :
RÈGLES :
1. DÉCRIS les éléments IMPORTANTS (position, distance).
2. MENTIONNE les OBSTACLES ou DANGERS.
3. TON rassurant et naturel.
4. PAS DE JSON. PAS DE MARKDOWN. TEXTE BRUT SEULEMENT.

EXEMPLE :
"Tu es dans une cuisine. Devant toi à 1,5 mètre, un comptoir. Attention, une chaise à droite."

DÉCRIS MAINTENANT :
`,
    [AppMode.OBJECT]: `
L'utilisateur cherche : "{OBJET}"
MISSION : Localise avec PRÉCISION.
SI TROUVÉ : Position, distance, repères.
SI NON TROUVÉ : Dis ce qui est visible.
PAS DE JSON. TEXTE BRUT SEULEMENT.

CHERCHE MAINTENANT :
`
  },
  en: {
    [AppMode.SCENE]: `
ANALYZE this image and describe the scene for NAVIGATION:
RULES:
1. DESCRIBE important elements (position, distance).
2. MENTION OBSTACLES or HAZARDS.
3. Natural and reassuring TONE.
4. NO JSON. NO MARKDOWN. PLAIN TEXT ONLY.

EXAMPLE:
"You are in a kitchen. Directly in front of you at 1.5 meters is a counter. Watch out for a chair on your right."

DESCRIBE NOW:
`,
    [AppMode.OBJECT]: `
User is looking for: "{OBJET}"
MISSION: Locate with PRECISION.
IF FOUND: Position, distance, visual cues.
IF NOT FOUND: List what is visible.
NO JSON. PLAIN TEXT ONLY.

SEARCH NOW:
`
  },
  ar: {
    [AppMode.SCENE]: `
حلل هذه الصورة وصف المشهد للتنقل:
القواعد:
1. ابدأ بنوع المكان.
2. صف العناصر المهمة (الموقع، المسافة).
3. اذكر العوائق أو المخاطر.
4. لا تستخدم JSON. نص عادي فقط.

مثال:
"أنت في غرفة المعيشة. أمامك أريكة على بعد مترين. احذر من الطاولة الصغيرة على يمينك."

صف الآن:
`,
    [AppMode.OBJECT]: `
المستخدم يبحث عن: "{OBJET}"
المهمة: تحديد الموقع بدقة.
إذا وجدته: الموقع، المسافة، العلامات المميزة.
إذا لم تجده: اذكر ما هو مرئي.
لا تستخدم JSON. نص عادي فقط.

ابحث الآن:
`
  }
};

export const MODE_LABELS: Record<Language, Record<AppMode, string>> = {
  fr: {
    [AppMode.SCENE]: "Scène",
    [AppMode.OBJECT]: "Objet",
  },
  en: {
    [AppMode.SCENE]: "Scene",
    [AppMode.OBJECT]: "Object",
  },
  ar: {
    [AppMode.SCENE]: "مشهد",
    [AppMode.OBJECT]: "غرض",
  }
};

export const UI_LABELS: Record<Language, any> = {
  fr: {
    start: "DÉMARRER",
    pause: "PAUSE",
    repeat: "RÉPÉTER",
    live: "EN DIRECT",
    ready: "PRÊT",
    analyzing: "Analyse...",
    searchPrompt: "Que cherchez-vous ?",
    searchPlaceholder: "ex: mes clés...",
    validate: "VALIDER",
    cancel: "ANNULER",
    cameraError: "Impossible d'accéder à la caméra.",
    cameraPermission: "Veuillez autoriser l'accès à la caméra.",
    welcome: "AccessiLens démarré.",
    objectSearchStart: "Recherche de : ",
    objectSearchSwipe: ". Balayez lentement.",
    modeChange: "Mode activé : "
  },
  en: {
    start: "START",
    pause: "PAUSE",
    repeat: "REPEAT",
    live: "LIVE",
    ready: "READY",
    analyzing: "Analyzing...",
    searchPrompt: "What are you looking for?",
    searchPlaceholder: "e.g., my keys...",
    validate: "GO",
    cancel: "CANCEL",
    cameraError: "Cannot access camera.",
    cameraPermission: "Please allow camera access.",
    welcome: "AccessiLens started.",
    objectSearchStart: "Searching for: ",
    objectSearchSwipe: ". Scan slowly.",
    modeChange: "Mode activated: "
  },
  ar: {
    start: "ابدأ",
    pause: "توقف",
    repeat: "كرر",
    live: "مباشر",
    ready: "جاهز",
    analyzing: "جاري التحليل...",
    searchPrompt: "عما تبحث؟",
    searchPlaceholder: "مثال: مفاتيحي...",
    validate: "تأكيد",
    cancel: "إلغاء",
    cameraError: "لا يمكن الوصول للكاميرا",
    cameraPermission: "يرجى السماح بالوصول للكاميرا",
    welcome: "بدأ التطبيق",
    objectSearchStart: "جاري البحث عن: ",
    objectSearchSwipe: ". حرك الكاميرا ببطء.",
    modeChange: "الوضع: "
  }
};

export const ANALYSIS_INTERVAL_MS = 3500;