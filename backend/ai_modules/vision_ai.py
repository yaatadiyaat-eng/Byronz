from .base_ai import BaseAI


class VisionAI(BaseAI):
    def get_mode_label(self):
        return "Vision"

    def get_specialist_prompt(self):
        return (
            "Mode ini fokus pada evaluasi visual, UI/UX, layout, arah desain, konsistensi antarmuka, "
            "hierarki informasi, dan kualitas presentasi visual. Jika gambar tidak tersedia langsung, "
            "gunakan deskripsi user secara cermat dan berikan arahan desain yang konkret."
        )
