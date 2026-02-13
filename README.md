# AccessiLens 👁️

> Assistant d'accessibilité intelligent alimenté par Google Gemini 3.
> Projet soumis pour le **Hackathon Régional RamadanIA**.

## 📋 Description

AccessiLens transforme la caméra du smartphone en un assistant vocal intelligent pour les personnes malvoyantes. Contrairement aux détecteurs d'objets classiques, il utilise l'IA Générative (Gemini) pour comprendre le **contexte** d'une scène, estimer les distances et retrouver des objets spécifiques.

## ✨ Fonctionnalités

- **Mode Scène :** Description de l'environnement pour la navigation et la sécurité (détection d'obstacles).
- **Mode Objet :** Recherche intelligente d'objets spécifiques (ex: "Trouve mes clés").
- **Multilingue :** Support complet du Français 🇫🇷, Anglais 🇺🇸 et Arabe 🇸🇦.
- **Accessibilité :** Interface à haut contraste, retour haptique (vibrations) et vocal (TTS).
- **IA Générative :** Utilise `gemini-3-flash-preview` pour une analyse rapide et naturelle.

## 🚀 Installation

1.  Cloner le projet.
2.  Installer les dépendances :
    ```bash
    npm install
    ```
3.  Configurer la clé API :
    *   Créer un fichier `.env` à la racine.
    *   Ajouter : `API_KEY=votre_cle_google_ai_studio`
4.  Lancer le projet :
    ```bash
    npm start
    ```

## 🛠️ Stack Technique

*   **Framework :** React 19
*   **Styles :** Tailwind CSS
*   **AI Model :** Google Gemini 3 Flash (via `@google/genai`)
*   **Icons :** Lucide React
*   **Browser APIs :** MediaStream (Caméra), Web Speech API (TTS), Vibration API.

## 📄 Licence

MIT
