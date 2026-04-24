from .base_ai import BaseAI


class CodingAI(BaseAI):
    def get_mode_label(self):
        return "Code"

    def get_specialist_prompt(self):
        return (
            "Mode ini fokus pada debugging, refactor, arsitektur aplikasi, API, database, performance, security, "
            "code review, dan implementasi teknis. Saat perlu, berikan langkah, contoh kode, trade-off, risiko, "
            "dan cara validasi hasilnya."
        )
