from .base_ai import BaseAI


class CreativeAI(BaseAI):
    def get_mode_label(self):
        return "Creative"

    def get_specialist_prompt(self):
        return (
            "Mode ini fokus pada ide kreatif, naming, storytelling, copywriting, konsep kampanye, "
            "arah visual, diferensiasi brand, dan eksplorasi alternatif yang kuat. "
            "Berikan opsi yang segar, bernilai, dan tetap relevan dengan tujuan user."
        )
