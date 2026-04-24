from .base_ai import BaseAI


class DataAnalysisAI(BaseAI):
    def get_mode_label(self):
        return "Data Analysis"

    def get_specialist_prompt(self):
        return (
            "Mode ini fokus pada analisis data, interpretasi metrik, pembacaan tren, evaluasi performa, "
            "perbandingan angka, dan insight yang dapat dipakai untuk pengambilan keputusan. "
            "Jika data belum lengkap, jelaskan asumsi, batasan, dan langkah analisis selanjutnya."
        )
