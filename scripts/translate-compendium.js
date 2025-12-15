/**
 * Module Foundry VTT - Conan AI Translator
 * Traduit automatiquement les compendiums en utilisant DeepSeek v3.1 via Ollama
 */

class ConanAITranslator {
  constructor() {
    this.ollamaUrl = "http://localhost:11434";
    this.model = "deepseek-v3.1:671b-cloud";
    this.translationQuality = 0.7;
    this.translationCache = new Map();
  }

  /**
   * Initialise le module
   */
  static init() {
    console.log("Conan AI Translator | Initialisation du module");
    
    // Enregistrer la commande de traduction
    game.settings.register("conan-ai-translator", "ollamaUrl", {
      name: "URL Ollama",
      hint: "URL de votre instance Ollama (par défaut: http://localhost:11434)",
      scope: "world",
      config: true,
      type: String,
      default: "http://localhost:11434"
    });

    game.settings.register("conan-ai-translator", "model", {
      name: "Modèle Ollama",
      hint: "Nom du modèle Ollama à utiliser",
      scope: "world",
      config: true,
      type: String,
      default: "deepseek-v3.1:671b-cloud"
    });

    game.settings.register("conan-ai-translator", "translationQuality", {
      name: "Qualité de traduction",
      hint: "Préfère des traductions plus créatives et naturelles (élevé) ou plus littérales (faible)",
      scope: "world",
      config: true,
      type: Number,
      range: {
        min: 0.3,
        max: 0.9,
        step: 0.1
      },
      default: 0.7
    });

    // Ajouter le bouton dans le menu des compendiums
    Hooks.on("renderCompendiumDirectory", (app, html, data) => {
      const button = $(`
        <button class="conan-translate-all" title="${game.i18n.localize("CONAN_TRANSLATOR.TranslateAll")}">
          <i class="fas fa-language"></i> ${game.i18n.localize("CONAN_TRANSLATOR.TranslateAll")}
        </button>
      `);
      
      html.find(".directory-header").append(button);
      button.on("click", () => ConanAITranslator.showTranslateDialog());
    });
  }

  /**
   * Affiche le dialogue de traduction
   */
  static async showTranslateDialog() {
    const template = "modules/conan-ai-translator/templates/translate-dialog.html";
    const html = await renderTemplate(template, {
      compendiums: this.getAvailableCompendiums()
    });

    const dialog = new Dialog({
      title: game.i18n.localize("CONAN_TRANSLATOR.DialogTitle"),
      content: html,
      buttons: {
        translate: {
          icon: '<i class="fas fa-language"></i>',
          label: game.i18n.localize("CONAN_TRANSLATOR.Translate"),
          callback: async (html) => {
            const selected = Array.from(html.find("input[type='checkbox']:checked"))
              .map(cb => cb.value);
            await ConanAITranslator.translateCompendiums(selected);
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("CONAN_TRANSLATOR.Cancel")
        }
      },
      default: "translate",
      close: () => {}
    });
    
    dialog.render(true);
    
    // Ajouter les gestionnaires d'événements pour les boutons select-all/select-none
    dialog.element.find(".select-all").on("click", () => {
      dialog.element.find("input[type='checkbox']").prop("checked", true);
    });
    
    dialog.element.find(".select-none").on("click", () => {
      dialog.element.find("input[type='checkbox']").prop("checked", false);
    });
  }

  /**
   * Récupère la liste des compendiums disponibles
   */
  static getAvailableCompendiums() {
    return game.packs.filter(pack => 
      pack.metadata.system === "conan2d20" && 
      pack.metadata.name.includes("-fr")
    ).map(pack => ({
      id: pack.metadata.id,
      name: pack.metadata.label,
      type: pack.metadata.type
    }));
  }

  /**
   * Traduit plusieurs compendiums
   */
  static async translateCompendiums(compendiumIds) {
    const translator = new ConanAITranslator();
    translator.ollamaUrl = game.settings.get("conan-ai-translator", "ollamaUrl");
    translator.model = game.settings.get("conan-ai-translator", "model");
    translator.translationQuality = game.settings.get("conan-ai-translator", "translationQuality");

    // Vérifier la connexion Ollama
    if (!await translator.checkOllamaConnection()) {
      ui.notifications.error(game.i18n.localize("CONAN_TRANSLATOR.Errors.OllamaNotAvailable"));
      return;
    }

    const progressDialog = new Dialog({
      title: game.i18n.localize("CONAN_TRANSLATOR.ProgressTitle"),
      content: `<div class="conan-translate-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
        <p class="progress-text">Initialisation...</p>
      </div>`,
      buttons: {},
      close: () => {}
    });
    progressDialog.render(true);

    let totalItems = 0;
    let translatedItems = 0;

    try {
      for (const compendiumId of compendiumIds) {
        const pack = game.packs.get(compendiumId);
        if (!pack) continue;

        const items = await pack.getDocuments();
        totalItems += items.length;

        for (const item of items) {
          try {
            await translator.translateItem(item, pack);
            translatedItems++;
            
            // Mettre à jour la barre de progression
            const progress = (translatedItems / totalItems) * 100;
            progressDialog.element.find(".progress-fill").css("width", `${progress}%`);
            progressDialog.element.find(".progress-text").text(
              `${translatedItems}/${totalItems} éléments traduits - ${item.name}`
            );
          } catch (error) {
            console.error(`Erreur lors de la traduction de ${item.name}:`, error);
          }
        }
      }

      progressDialog.close();
      ui.notifications.info(
        game.i18n.format("CONAN_TRANSLATOR.Success", { count: translatedItems })
      );
    } catch (error) {
      progressDialog.close();
      ui.notifications.error(
        game.i18n.format("CONAN_TRANSLATOR.Errors.TranslationFailed", { error: error.message })
      );
    }
  }

  /**
   * Traduit un élément individuel
   */
  async translateItem(item, pack) {
    const fieldsToTranslate = this.getFieldsToTranslate(item);
    const updateData = {};
    
    // Contexte pour améliorer la traduction
    const context = {
      itemType: item.documentName || item.type || "Item",
      itemName: item.name || "élément sans nom",
      packName: pack.metadata.label || pack.metadata.name
    };
    
    for (const field of fieldsToTranslate) {
      const originalText = this.getFieldValue(item, field);
      if (!originalText || originalText.trim() === "") continue;

      // Déterminer le type de champ pour le contexte
      const fieldType = this.getFieldType(field);
      const fieldContext = { ...context, fieldType };

      // Vérifier le cache (avec contexte pour éviter les traductions inappropriées)
      const cacheKey = `${field}:${originalText}`;
      let translated;
      
      if (this.translationCache.has(cacheKey)) {
        translated = this.translationCache.get(cacheKey);
      } else {
        // Traduire avec Ollama avec contexte
        translated = await this.translateText(originalText, fieldContext);
        this.translationCache.set(cacheKey, translated);
        
        // Petite pause pour éviter de surcharger Ollama
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Construire l'objet de mise à jour
      const parts = field.split(".");
      if (parts.length === 1) {
        updateData[field] = translated;
      } else {
        const systemPath = parts.slice(1).join(".");
        if (!updateData.system) updateData.system = {};
        this.setNestedValue(updateData.system, systemPath, translated);
      }
    }

    // Sauvegarder l'élément
    if (Object.keys(updateData).length > 0) {
      await item.update(updateData);
    }
  }

  /**
   * Détermine le type de champ pour améliorer le contexte de traduction
   */
  getFieldType(fieldPath) {
    if (fieldPath === "name") return "nom/titre";
    if (fieldPath === "description") return "description générale";
    if (fieldPath.includes("system.description")) return "description système";
    if (fieldPath.includes("system.effects")) return "effet/capacité";
    if (fieldPath.includes("system.biography")) return "biographie";
    if (fieldPath.includes("content")) return "contenu narratif";
    if (fieldPath.includes("system")) return "donnée système";
    return "texte général";
  }

  /**
   * Définit une valeur imbriquée dans un objet
   */
  setNestedValue(obj, path, value) {
    const parts = path.split(".");
    const lastPart = parts.pop();
    let target = obj;

    for (const part of parts) {
      if (!target[part]) {
        target[part] = {};
      }
      target = target[part];
    }

    target[lastPart] = value;
  }

  /**
   * Détermine les champs à traduire selon le type d'élément
   */
  getFieldsToTranslate(item) {
    const baseFields = ["name", "description"];
    const typeSpecificFields = {
      Item: ["system.description", "system.effects", "system.notes"],
      Actor: ["system.biography", "system.details.biography"],
      JournalEntry: ["name", "content"],
      RollTable: ["description", "formula"],
      Scene: ["name", "notes"]
    };

    const fields = [...baseFields];
    const docName = item.documentName || item.type;
    
    if (typeSpecificFields[docName]) {
      fields.push(...typeSpecificFields[docName]);
    }
    
    // Chercher aussi dans system pour des champs textuels supplémentaires
    if (item.system) {
      this.findTextFieldsInSystem(item.system, fields, "system");
    }

    return [...new Set(fields)]; // Éviter les doublons
  }

  /**
   * Trouve récursivement les champs textuels dans system
   */
  findTextFieldsInSystem(obj, fields, prefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === "string" && value.trim().length > 0) {
        // Ignorer les IDs, références, et valeurs numériques
        if (!key.match(/^(id|_id|uuid|reference|source|img|icon)$/i) && 
            !value.match(/^[0-9]+$/) &&
            value.length > 3) {
          if (!fields.includes(fullPath)) {
            fields.push(fullPath);
          }
        }
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        this.findTextFieldsInSystem(value, fields, fullPath);
      }
    }
  }

  /**
   * Récupère la valeur d'un champ (support des chemins imbriqués)
   */
  getFieldValue(item, fieldPath) {
    const parts = fieldPath.split(".");
    let value;
    
    // Gérer les champs système (system.*)
    if (parts[0] === "system") {
      value = item.system || item.data?.system;
      parts.shift(); // Retirer "system" du chemin
    } else {
      // Champs de base (name, description, etc.)
      value = item;
    }
    
    if (!value) return null;
    
    for (const part of parts) {
      if (value && typeof value === "object" && part in value) {
        value = value[part];
      } else {
        return null;
      }
    }
    
    return typeof value === "string" ? value : null;
  }

  /**
   * Définit la valeur d'un champ (support des chemins imbriqués)
   */
  setFieldValue(item, fieldPath, value) {
    const parts = fieldPath.split(".");
    const lastPart = parts.pop();
    let target = item.data || item;

    for (const part of parts) {
      if (!target[part]) {
        target[part] = {};
      }
      target = target[part];
    }

    target[lastPart] = value;
  }

  /**
   * Traduit un texte en utilisant Ollama avec un prompt optimisé pour des traductions naturelles
   */
  async translateText(text, context = {}) {
    const { itemType, itemName, fieldType } = context;
    
    // Construire un prompt contextuel et détaillé
    const prompt = `Tu es un traducteur professionnel spécialisé dans les jeux de rôle fantasy, particulièrement l'univers de Conan le Barbare de Robert E. Howard.

CONTEXTE:
- Type d'élément: ${itemType || "élément de jeu"}
- Nom de l'élément: ${itemName || "non spécifié"}
- Type de champ: ${fieldType || "texte général"}

INSTRUCTIONS DE TRADUCTION:
1. Traduis le texte en français de manière NATURELLE et FLUIDE, pas mot à mot
2. Adapte le style au contexte : utilise un langage épique et immersif pour l'univers de Conan
3. Conserve le ton original : dramatique, héroïque, sombre, ou descriptif selon le contexte
4. Utilise un vocabulaire riche et varié, adapté à l'univers fantasy/héroïque
5. Pour les descriptions de capacités/effets : sois précis et clair, utilise le vocabulaire du jeu de rôle
6. Pour les noms de lieux, personnages, créatures : conserve-les en anglais si ce sont des noms propres établis
7. Pour les termes techniques de jeu (dice, skill, attribute, etc.) : utilise les équivalents français courants en JdR
8. Évite les anglicismes inutiles, privilégie les termes français naturels
9. Si le texte contient des règles mécaniques, traduis-les de manière claire et précise
10. Assure-toi que la traduction sonne NATURELLE en français, comme si elle avait été écrite directement en français

IMPORTANT:
- Ne traduis PAS les noms propres de personnages, lieux, ou créatures célèbres de l'univers Conan
- Ne traduis PAS les noms de compétences/attributs si ce sont des termes techniques du système (garder en anglais ou utiliser la terminologie officielle)
- Réponds UNIQUEMENT avec la traduction finale, sans explication, sans commentaire, sans guillemets

TEXTE À TRADUIRE:
${text}

TRADUCTION FRANÇAISE:`;

    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: this.translationQuality,  // Qualité ajustable pour des traductions naturelles
            top_p: 0.9,        // Diversité contrôlée
            top_k: 40,         // Qualité des réponses
            num_predict: 2048   // Longueur maximale de réponse
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      let translation = data.response.trim();
      
      // Nettoyer la réponse (enlever les préfixes possibles)
      translation = translation.replace(/^(TRADUCTION FRANÇAISE|Traduction|Translation|Réponse):\s*/i, "");
      translation = translation.replace(/^["']|["']$/g, ""); // Enlever les guillemets
      translation = translation.replace(/\n{3,}/g, "\n\n"); // Normaliser les sauts de ligne
      
      // Post-traitement pour améliorer la qualité
      translation = this.postProcessTranslation(translation, context);
      
      return translation.trim();
    } catch (error) {
      console.error("Erreur de traduction Ollama:", error);
      throw error;
    }
  }

  /**
   * Post-traitement de la traduction pour améliorer la qualité
   */
  postProcessTranslation(translation, context) {
    // Corrections courantes
    let processed = translation;
    
    // Remplacer les termes techniques mal traduits
    const technicalTerms = {
      // Garder certains termes techniques en anglais si c'est la convention
      "d20": "d20",
      "2d20": "2d20",
      "D20": "d20",
      "2D20": "2d20"
    };
    
    // Normaliser l'espacement autour de la ponctuation
    processed = processed.replace(/\s+([,.;:!?])/g, "$1");
    processed = processed.replace(/([,.;:!?])([^\s])/g, "$1 $2");
    
    // Corriger les espaces insécables avant certains signes
    processed = processed.replace(/\s+([:;!?])/g, "\u00A0$1");
    
    // Normaliser les guillemets français
    processed = processed.replace(/"/g, '"');
    processed = processed.replace(/'/g, "'");
    
    // S'assurer que les listes sont bien formatées
    processed = processed.replace(/\n\s*[-•]\s*/g, "\n- ");
    
    return processed;
  }

  /**
   * Vérifie la connexion à Ollama
   */
  async checkOllamaConnection() {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: "GET"
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Initialiser le module au chargement
Hooks.once("ready", () => {
  ConanAITranslator.init();
});

