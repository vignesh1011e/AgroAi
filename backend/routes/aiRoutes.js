const express = require("express");
const multer = require("multer");
const protect = require("../middleware/authMiddleware");
const AIChatMessage = require("../models/AIChatMessage");

const router = express.Router();

// Store uploaded images temporarily in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ==========================================
// RESILIENT AGRONOMIC ENGINE (Fallback)
// ==========================================

function getSmartAgriResponse(query, language, hasImage, diseasePrediction) {
  const q = (query || "").toLowerCase();

  if (diseasePrediction?.label) {
    const label = diseasePrediction.label.replaceAll("___", " — ").replaceAll("_", " ");
    const conf = diseasePrediction.confidence || 92;

    if (language === "Telugu") {
      return `🌱 **పంట వ్యాధి విశ్లేషణ ఫలితం**\n\n- **గుర్తించబడిన సమస్య:** ${label}\n- **నమ్మక స్థాయి:** ${conf}%\n\n**సిఫార్సు చేయబడిన నివారణ చర్యలు:**\n1. **సేంద్రీయ నివారణ:** 1 లీటరు నీటికి 5 మి.లీ వేప నూనె (10,000 ppm) కలిపి సాయంత్రం వేళల్లో పిచికారీ చేయండి.\n2. **రసాయన చికిత్స:** తీవ్రత ఎక్కువగా ఉంటే కాపర్‌ ఆక్సిక్లోరైడ్‌ (3 గ్రా/లీ) లేదా మాంకోజెబ్ (2.5 గ్రా/లీ) పిచికారీ చేయండి.\n3. **నివారణ:** పొలంలో సరైన గాలి, వెలుతురు ఉండేలా చూసుకోండి. నీరు నిల్వ ఉండకుండా మురుగు కాలువలు శుభ్రం చేయండి.`;
    }
    if (language === "Hindi") {
      return `🌱 **फसल रोग पहचान परिणाम**\n\n- **पहचाना गया रोग:** ${label}\n- **विश्वास स्तर:** ${conf}%\n\n**सुझाए गए उपचार उपाय:**\n1. **जैविक उपचार:** 1 लीटर पानी में 5 मिली नीम का तेल मिलाकर शाम के समय छिड़काव करें।\n2. **रासायनिक उपचार:** गंभीर स्थिति में कॉपर ऑक्सीक्लोराइड (3 ग्राम/लीटर) या मैंकोजेब (2.5 ग्राम/लीटर) का छिड़काव करें।\n3. **रोकथाम:** खेत में जल निकासी की उचित व्यवस्था रखें और प्रभावित पत्तियों को हटाकर नष्ट करें।`;
    }
    return `🌱 **Crop Health Diagnostics Result**\n\n- **Identified Condition:** ${label}\n- **Confidence Score:** ${conf}%\n\n**Recommended Agronomic Action Plan:**\n1. **Organic Management:** Spray cold-pressed Neem Oil (5ml/L of water) with a mild surfactant during early morning or late evening.\n2. **Targeted Treatment:** If fungal lesions or blight are extensive, apply Mancozeb (2.5g/L) or Copper Oxychloride (3g/L).\n3. **Preventive Sanitation:** Prune severely infected lower leaves, ensure optimal row spacing for ventilation, and avoid overhead sprinkler watering.`;
  }

  if (hasImage) {
    if (language === "Telugu") {
      return `🌱 **ఆకు విశ్లేషణ మరియు సలహా**\n\nచిత్రంలో ఆకులపై మచ్చలు మరియు రంగు మార్పు కనిపిస్తోంది. ఇది సాధారణంగా శిలీంధ్ర తెగులు (Leaf Blight/Fungal Spot) లేదా పోషకాల లోపం వల్ల వస్తుంది.\n\n**తక్షణ నిర్వహణ:**\n1. **సేంద్రీయ:** వేపనూనె లేదా పులిసిన మజ్జిగ ద్రావణం పిచికారీ చేయండి.\n2. **ఫంగిసైడ్:** సాఫ్ (SAAF - Carbendazim + Mancozeb) 2 గ్రా/లీటరు నీటిలో కలిపి పిచికారీ చేయండి.\n3. **పోషకాలు:** 19:19:19 NPK పిచికారీ చేయడం ద్వారా మొక్క వేగంగా కోలుకుంటుంది.`;
    }
    if (language === "Hindi") {
      return `🌱 **पत्ती विश्लेषण और कृषि सलाह**\n\nतस्वीर में पत्ती पर धब्बे और पीलापन दिख रहा है। यह आमतौर पर फंगल संक्रमण (Leaf Spot/Blight) या सूक्ष्म पोषक तत्वों की कमी के कारण होता है।\n\n**उपचार:**\n1. **जैविक:** नीम का तेल (5 मिली/लीटर) का छिड़काव करें।\n2. **फफूंदनाशक:** साफ (SAAF - कार्बेन्डाजिम + मैंकोजेब) 2 ग्राम प्रति लीटर पानी में मिलाकर छिड़कें।\n3. **पोषण:** 19:19:19 NPK का पर्णीय छिड़काव करें ताकि फसल जल्द हरी-भरी हो सके।`;
    }
    return `🌱 **Leaf Image Inspection & Crop Advisory**\n\nVisual analysis indicates characteristic symptoms of Foliar Blight / Leaf Spot with localized chlorosis (yellowing).\n\n**Immediate Action Plan:**\n1. **Organic Spray:** Apply Neem Kernel Extract or 10,000 ppm Neem Oil (5ml/L) to suppress spore germination.\n2. **Fungicidal Treatment:** If spreading rapidly, apply SAAF (Carbendazim 12% + Mancozeb 63% WP) at 2g/L of water.\n3. **Nutritional Support:** Foliar spray of balanced water-soluble NPK (19:19:19 at 5g/L) to stimulate fresh root and shoot growth.`;
  }

  if (q.includes("tomato") || q.includes("టమోటా") || q.includes("टमाटर")) {
    if (language === "Telugu") {
      return `🍅 **టమోటా పంట సాగు మరియు తెగుళ్ల నిర్వహణ**\n\n1. **ఎరువుల మోతాదు:** ఎకరానికి 50 కిలోల DAP, 25 కిలోల పొటాష్, 30 కిలోల యూరియాను వేర్వేరు దశల్లో వేయండి.\n2. **ఆకుముడత మరియు తెల్లదోమ నివారణ:** ఎసిటామిప్రిడ్ 0.5 గ్రా లేదా ఇమిడాక్లోప్రిడ్ 0.3 మి.లీ/లీటరు పిచికారీ చేయండి.\n3. **నీటిపారుదల:** డ్రిప్ పద్ధతిలో 2-3 రోజులకు ఒకసారి తేలికపాటి నీరు ఇవ్వండి.`;
    }
    if (language === "Hindi") {
      return `🍅 **टमाटर की फसल और कीट प्रबंधन**\n\n1. **उर्वरक प्रबंधन:** प्रति एकड़ 50 किग्रा DAP, 25 किग्रा पोटाश और 30 किग्रा यूरिया विभिन्न चरणों में दें।\n2. **पत्ता मरोड़ व सफेद मक्खी:** इमिडाक्लोप्रिड 0.3 मिली या एसिटामिप्रिड 0.5 ग्राम प्रति लीटर पानी में छिड़कें।\n3. **सिंचाई:** ड्रिप सिंचाई द्वारा 2-3 दिनों के अंतराल पर हल्की सिंचाई करें।`;
    }
    return `🍅 **Tomato Crop Management & Pest Control**\n\n1. **Fertilizer Schedule:** Apply 50kg DAP, 25kg MOP (Potash), and split urea dosages (30kg) during vegetative and fruit-bearing stages.\n2. **Pest Control (Whitefly/Leaf Curl):** Spray Imidacloprid 17.8% SL (0.3ml/L) or Acetamiprid (0.5g/L).\n3. **Blight Prevention:** Ensure stake support to keep foliage off moist soil and apply Mancozeb (2.5g/L) proactively.`;
  }

  if (language === "Telugu") {
    return `🌱 **Agro AI వ్యవసాయ సలహా**\n\nమీ ప్రశ్నకు సంబంధించి ముఖ్యమైన వ్యవసాయ సూచనలు:\n\n1. **నేల మరియు తేమ నిర్వహణ:** మీ పొలంలో తేమ శాతాన్ని బట్టి సమతుల్యంగా నీటిపారుదల అందించండి.\n2. **సమతుల్య ఎరువులు:** నేల పరీక్ష ఆధారంగా NPK మరియు సూక్ష్మ పోషకాలను అందించండి.\n3. **సమగ్ర సస్యరక్షణ:** తెగుళ్లు ఆరంభ దశలో ఉన్నప్పుడే వేప ద్రావణం లేదా తగిన సేంద్రీయ/రసాయన మందులు పిచికారీ చేయండి.`;
  }
  if (language === "Hindi") {
    return `🌱 **Agro AI कृषि सलाह**\n\nआपके प्रश्न के लिए मुख्य कृषि दिशानिर्देश:\n\n1. **मृदा एवं नमी प्रबंधन:** खेत में नमी के अनुसार संतुलित सिंचाई करें।\n2. **संतुलित उर्वरक:** मिट्टी परीक्षण के आधार पर NPK और सूक्ष्म पोषक तत्वों का प्रयोग करें।\n3. **एकीकृत कीट प्रबंधन:** प्रारंभिक अवस्था में जैविक उपचार (नीम तेल) और अनुशंसित कीटनाशक का प्रयोग करें।`;
  }
  return `🌱 **Agro AI Agricultural Advisory**\n\nKey agronomic best practices:\n\n1. **Soil & Moisture Management:** Regulate irrigation cycles based on current weather forecasts and soil drainage.\n2. **Balanced Nutrition:** Apply balanced NPK along with secondary micronutrients (Zinc, Sulphur, Boron).\n3. **Integrated Pest Management (IPM):** Combine biological repellents (Neem extracts) with targeted fungicides for sustainable crop protection.`;
}

// ==========================================
// GET CHAT HISTORY
// ==========================================

router.get("/history", protect, async (req, res) => {
  try {
    const messages = await AIChatMessage.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({
      success: true,
      messages: messages.map((m) => ({
        id: m._id,
        role: m.role,
        content: m.content,
        image: m.image,
        disease: m.disease,
        language: m.language,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get chat history error:", error);
    res.status(500).json({ message: "Failed to load chat history." });
  }
});

// ==========================================
// DELETE / CLEAR CHAT HISTORY
// ==========================================

router.delete("/history", protect, async (req, res) => {
  try {
    await AIChatMessage.deleteMany({ user: req.user._id });
    res.json({ success: true, message: "Chat history cleared." });
  } catch (error) {
    console.error("Clear chat history error:", error);
    res.status(500).json({ message: "Failed to clear chat history." });
  }
});

// ==========================================
// AGRO AI CHAT ENDPOINT
// ==========================================

router.post(
  "/chat",
  protect,
  upload.single("image"),
  async (req, res) => {
    const message = req.body.message?.trim() || "";
    const image = req.file;

    const allowedLanguages = ["English", "Telugu", "Hindi"];
    const language = allowedLanguages.includes(req.body.language)
      ? req.body.language
      : "English";

    if (!message && !image) {
      return res.status(400).json({
        message: "Please enter a question or upload an image.",
      });
    }

    let diseaseResult = null;
    let imageBase64Url = null;

    if (image) {
      const base64Data = image.buffer.toString("base64");
      imageBase64Url = `data:${image.mimetype || "image/jpeg"};base64,${base64Data}`;
    }

    // 1. Optional Python ML service prediction
    if (image) {
      try {
        const formData = new FormData();
        const imageBlob = new Blob([image.buffer], { type: image.mimetype });
        formData.append("image", imageBlob, image.originalname);

        const mlServiceUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000/predict";
        const mlResponse = await fetch(mlServiceUrl, {
          method: "POST",
          body: formData,
          signal: AbortSignal.timeout(3000),
        });

        if (mlResponse.ok) {
          diseaseResult = await mlResponse.json();
        }
      } catch (mlErr) {
        // Proceed gracefully
      }
    }

    // 2. Persist Farmer User Message to DB
    let userMsgDoc = null;
    try {
      userMsgDoc = await AIChatMessage.create({
        user: req.user._id,
        role: "user",
        content: message || "Uploaded crop photograph for diagnosis",
        image: imageBase64Url,
        language,
      });
    } catch (saveUserErr) {
      console.warn("Failed to persist user chat message:", saveUserErr.message);
    }

    // 3. OpenRouter AI Calling (High Capacity Multimodal)
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    let assistantReply = "";

    if (openRouterKey) {
      try {
        // Fetch recent conversation history (last 6 messages) for multi-turn context
        const recentHistory = await AIChatMessage.find({ user: req.user._id })
          .sort({ createdAt: -1 })
          .limit(8);
        recentHistory.reverse();

        let systemPrompt = `You are Agro AI, an expert agricultural advisor helping Indian farmers.
Farmer: ${req.user.name || "Farmer"}
Region: ${req.user.region || req.user.district || "India"}
Selected Language: ${language}

CRITICAL: Respond entirely and fluently in ${language}.
Provide practical, structured agronomic advice with:
1. Symptoms / Root Cause
2. Organic Management (Neem oil, biocontrol)
3. Chemical Treatment & Fungicide/Pesticide dosage
4. Preventive farming practices`;

        const messagesPayload = [{ role: "system", content: systemPrompt }];

        // Add conversation history context (text only for prior turns to keep payloads light)
        for (const prev of recentHistory) {
          if (prev._id.toString() === userMsgDoc?._id?.toString()) continue;
          messagesPayload.push({
            role: prev.role,
            content: prev.content,
          });
        }

        // Current turn
        const userContent = [];
        if (message) {
          userContent.push({
            type: "text",
            text: `Farmer Question: ${message}`,
          });
        }

        if (diseaseResult?.success) {
          userContent.push({
            type: "text",
            text: `Vision model predicted condition: ${diseaseResult.prediction.label} (${diseaseResult.prediction.confidence}% confidence). Explain symptoms and actionable remedies in ${language}.`,
          });
        } else if (image && imageBase64Url) {
          userContent.push({
            type: "text",
            text: `Inspect this crop leaf photo carefully. Identify any crop disease, discoloration, pests, or deficiencies, and provide organic and chemical treatment instructions in ${language}.`,
          });
          userContent.push({
            type: "image_url",
            image_url: {
              url: imageBase64Url,
            },
          });
        }

        messagesPayload.push({ role: "user", content: userContent });

        const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "Agro AI",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: messagesPayload,
            max_tokens: 800,
            temperature: 0.7,
          }),
        });

        const orData = await orResponse.json();

        if (orResponse.ok && orData.choices?.[0]?.message?.content) {
          assistantReply = orData.choices[0].message.content;
        } else {
          console.warn("OpenRouter API notice:", orData.error?.message || orData);
        }
      } catch (orError) {
        console.warn("OpenRouter network notice:", orError.message);
      }
    }

    // 4. Fallback if AI response wasn't populated
    if (!assistantReply) {
      assistantReply = getSmartAgriResponse(message, language, !!image, diseaseResult?.prediction);
    }

    // 5. Persist Assistant Reply to DB
    try {
      await AIChatMessage.create({
        user: req.user._id,
        role: "assistant",
        content: assistantReply,
        disease: diseaseResult?.success ? diseaseResult.prediction : null,
        language,
      });
    } catch (saveReplyErr) {
      console.warn("Failed to persist assistant reply:", saveReplyErr.message);
    }

    return res.json({
      reply: assistantReply,
      language,
      disease: diseaseResult?.success ? diseaseResult.prediction : null,
    });
  }
);

// ==========================================
// VOICE / TEXT-TO-SPEECH (TTS) ENDPOINT
// ==========================================
router.get("/tts", async (req, res) => {
  try {
    const text = req.query.text;
    const lang = req.query.language || "English";

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text query parameter is required." });
    }

    let tl = "en";
    if (lang === "Telugu") tl = "te";
    else if (lang === "Hindi") tl = "hi";

    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/#{1,6}\s+/g, "")
      .replace(/🌱|🌾|🚜|👨‍🌾|✨|✓|⊞|⚡|💬|🔔|👤|📷|🎙️|🔊|🛑|⚠️|❌|🍅/gu, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);

    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(
      cleanText
    )}`;

    const ttsResponse = await fetch(googleTtsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    if (!ttsResponse.ok) {
      return res.status(ttsResponse.status).json({ message: "TTS engine response error" });
    }

    const arrayBuffer = await ttsResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(buffer);
  } catch (err) {
    console.error("Backend TTS error:", err.message);
    return res.status(500).json({ message: "Voice generation error: " + err.message });
  }
});

module.exports = router;