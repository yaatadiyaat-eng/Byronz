from .base_ai import BaseAI


class ChatbotAI(BaseAI):
    def get_mode_label(self):
        return "Chatbot"

    def get_specialist_prompt(self):
        return (
            "Mode ini fokus pada desain chatbot, persona assistant, prompt system, flow percakapan, "
            "FAQ automation, escalation path, dan pengalaman user dalam percakapan terstruktur. "
            "Saat perlu, berikan contoh flow, intent, fallback, dan struktur respons."
        )
