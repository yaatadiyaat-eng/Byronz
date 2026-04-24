from ai_modules.automation_ai import AutomationAI
from ai_modules.business_ai import BusinessAI
from ai_modules.chatbot_ai import ChatbotAI
from ai_modules.chat_ai import ChatAI
from ai_modules.coding_ai import CodingAI
from ai_modules.creative_ai import CreativeAI
from ai_modules.data_analysis_ai import DataAnalysisAI
from ai_modules.english_tutor_ai import EnglishTutorAI
from ai_modules.researcher_ai import ResearcherAI
from ai_modules.vision_ai import VisionAI
from core.ollama_client import generate_response


class AIRouter:
    def __init__(self):
        self.chat_ai = ChatAI()
        self.coding_ai = CodingAI()
        self.business_ai = BusinessAI()
        self.english_tutor_ai = EnglishTutorAI()
        self.creative_ai = CreativeAI()
        self.data_analysis_ai = DataAnalysisAI()
        self.chatbot_ai = ChatbotAI()
        self.vision_ai = VisionAI()
        self.automation_ai = AutomationAI()
        self.researcher_ai = ResearcherAI()

    def route(
        self,
        prompt: str,
        session_id: str,
        mode: str | None = None,
        preferences: dict | None = None,
        attachments_context: str | None = None,
    ):
        category = self.normalize_mode(mode) or self.classify_prompt(prompt)
        target_ai = self.select_ai_by_category(category)
        return target_ai.generate(prompt, session_id, preferences, attachments_context, category)

    def smart_route(
        self,
        prompt: str,
        session_id: str,
        mode: str | None = None,
        preferences: dict | None = None,
        attachments_context: str | None = None,
    ):
        category = self.normalize_mode(mode) or self.classify_prompt(prompt)
        target_ai = self.select_ai_by_category(category)
        return target_ai.generate(prompt, session_id, preferences, attachments_context, category)

    def smart_route_stream(
        self,
        prompt: str,
        session_id: str,
        mode: str | None = None,
        preferences: dict | None = None,
        attachments_context: str | None = None,
    ):
        category = self.normalize_mode(mode) or self.classify_prompt(prompt)
        target_ai = self.select_ai_by_category(category)
        return target_ai.generate_stream(prompt, session_id, preferences, attachments_context, category)

    def select_specialist(self, prompt: str, mode: str | None = None):
        category = self.normalize_mode(mode) or self.classify_prompt(prompt)
        return self.select_ai_by_category(category)

    def select_ai_by_category(self, category: str):

        if category == "code":
            return self.coding_ai
        if category == "business":
            return self.business_ai
        if category == "english_tutor":
            return self.english_tutor_ai
        if category == "creative":
            return self.creative_ai
        if category == "data_analysis":
            return self.data_analysis_ai
        if category == "chatbot":
            return self.chatbot_ai
        if category == "vision":
            return self.vision_ai
        if category == "automation":
            return self.automation_ai
        if category == "researcher":
            return self.researcher_ai
        return self.chat_ai

    def normalize_mode(self, mode: str | None):
        if not mode:
            return None

        normalized_value = mode.strip().lower().replace(" ", "_")
        aliases = {
            "general": "general",
            "chat": "general",
            "smart": "general",
            "umum": "general",
            "knowledge": "general",
            "code": "code",
            "coding": "code",
            "business": "business",
            "bisnis": "business",
            "english": "english_tutor",
            "tutor": "english_tutor",
            "english_tutor": "english_tutor",
            "creative": "creative",
            "design": "creative",
            "data": "data_analysis",
            "analysis": "data_analysis",
            "analytics": "data_analysis",
            "data_analysis": "data_analysis",
            "chatbot": "chatbot",
            "bot": "chatbot",
            "vision": "vision",
            "visual": "vision",
            "automation": "automation",
            "workflow": "automation",
            "research": "researcher",
            "researcher": "researcher",
        }
        return aliases.get(normalized_value)

    def classify_prompt(self, prompt: str):
        prompt_lower = prompt.lower()

        keyword_map = {
            "code": (
                "code", "coding", "bug", "error", "api", "backend", "frontend", "react",
                "javascript", "python", "database", "sql", "html", "css", "program", "debug",
                "fungsi", "kode", "refactor", "deploy", "server", "fastapi", "node", "query"
            ),
            "business": (
                "bisnis", "marketing", "branding", "penjualan", "sales", "strategi", "startup",
                "monetisasi", "revenue", "profit", "pasar", "market", "produk", "go to market",
                "investor", "pricing", "customer", "akuisisi", "retensi", "operasional"
            ),
            "english_tutor": (
                "english", "grammar", "speaking", "vocabulary", "pronunciation", "ielts", "toefl",
                "translate", "translation", "essay", "writing", "conversation", "bahasa inggris"
            ),
            "creative": (
                "creative", "copywriting", "branding idea", "storytelling", "konten", "campaign",
                "iklan", "headline", "script", "nama brand", "slogan", "konsep kreatif"
            ),
            "data_analysis": (
                "data", "analysis", "analytics", "dashboard", "metric", "metrik", "trend", "tren",
                "report", "laporan", "kpi", "chart", "grafik", "dataset"
            ),
            "chatbot": (
                "chatbot", "bot", "faq", "persona", "prompt system", "assistant flow", "conversation flow",
                "fallback", "intent", "customer support bot"
            ),
            "vision": (
                "ui", "ux", "layout", "visual", "screenshot", "design review", "interface",
                "wireframe", "landing page", "warna", "tampilan"
            ),
            "automation": (
                "automation", "workflow", "sop", "otomasi", "pipeline", "alur kerja", "process",
                "integrasi", "notifikasi otomatis", "task automation"
            ),
            "researcher": (
                "research", "riset", "compare", "comparison", "benchmark", "ringkas jurnal",
                "literature", "sintesis", "deep dive", "analisis mendalam"
            ),
        }

        scores = {
            category: sum(keyword in prompt_lower for keyword in keywords)
            for category, keywords in keyword_map.items()
        }

        best_category = max(scores, key=scores.get)
        if scores[best_category] > 0:
            return best_category

        classifier_prompt = f"""
Klasifikasikan prompt user berikut ke salah satu label ini saja:
code, english_tutor, business, creative, data_analysis, chatbot, vision, automation, researcher, general.
Jawab hanya dengan satu label, tanpa penjelasan tambahan.

Prompt user:
{prompt}

Label:
""".strip()

        category = generate_response(self.chat_ai.model, classifier_prompt).strip().lower()
        return self.normalize_mode(category) or "general"
