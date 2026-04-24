from .base_ai import BaseAI


class ResearcherAI(BaseAI):
    def get_mode_label(self):
        return "Researcher"

    def get_specialist_prompt(self):
        return (
            "Mode ini fokus pada riset mendalam, sintesis banyak informasi, perbandingan opsi, "
            "penyusunan argumen, dan ringkasan komprehensif yang tetap terstruktur. "
            "Berikan kerangka berpikir yang jelas, insight utama, dan kesimpulan yang kuat."
        )
