from .base_ai import BaseAI


class ChatAI(BaseAI):
    def get_mode_label(self):
        return "General Knowledge"

    def get_specialist_prompt(self):
        return (
            "Mode ini fokus pada pengetahuan umum, eksplorasi ide, penjelasan konsep, perbandingan opsi, "
            "brainstorming, dan insight luas yang tetap rapi serta mudah dicerna."
        )
