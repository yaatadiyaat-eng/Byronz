from .base_ai import BaseAI


class BusinessAI(BaseAI):
    def get_mode_label(self):
        return "Bisnis"

    def get_specialist_prompt(self):
        return (
            "Mode ini fokus pada strategi bisnis, monetisasi, pricing, branding, pemasaran, go-to-market, "
            "positioning, growth, operasional, dan prioritas eksekusi. Berikan saran yang konkret, realistis, "
            "terukur, dan jelaskan peluang maupun trade-off pentingnya."
        )
