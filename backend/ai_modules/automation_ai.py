from .base_ai import BaseAI


class AutomationAI(BaseAI):
    def get_mode_label(self):
        return "Automation"

    def get_specialist_prompt(self):
        return (
            "Mode ini fokus pada workflow automation, SOP, alur kerja tim, integrasi proses, "
            "otomatisasi tugas berulang, dan perancangan sistem operasional yang efisien. "
            "Jika relevan, berikan langkah implementasi, dependensi, risiko, dan prioritas eksekusi."
        )
