from core.ollama_client import (
    generate_response,
    generate_stream,
    get_default_model_name,
    list_available_model_names,
)
from memory.db_memory import DBMemory

AUTO_MODEL_PRIORITY = {
    "general": ["openai/gpt-oss-20b", "llama-3.1-8b-instant", "llama3:latest", "mistral:latest"],
    "code": ["openai/gpt-oss-20b", "qwen/qwen3-32b", "llama3:latest", "mistral:latest"],
    "english_tutor": ["openai/gpt-oss-20b", "llama-3.1-8b-instant", "mistral:latest", "llama3:latest"],
    "business": ["openai/gpt-oss-20b", "llama-3.3-70b-versatile", "mistral:latest", "llama3:latest"],
    "creative": ["llama-3.3-70b-versatile", "openai/gpt-oss-20b", "mistral:latest", "llama3:latest"],
    "data_analysis": ["qwen/qwen3-32b", "openai/gpt-oss-20b", "llama3:latest", "mistral:latest"],
    "chatbot": ["llama-3.1-8b-instant", "openai/gpt-oss-20b", "mistral:latest", "llama3:latest"],
    "vision": ["openai/gpt-oss-20b", "llama-3.3-70b-versatile", "llama3:latest", "mistral:latest"],
    "automation": ["openai/gpt-oss-20b", "llama-3.1-8b-instant", "mistral:latest", "llama3:latest"],
    "researcher": ["llama-3.3-70b-versatile", "openai/gpt-oss-20b", "llama3:latest", "mistral:latest"],
}


class BaseAI:
    def __init__(self, model="mistral:latest"):
        self.model = model

    def get_mode_label(self):
        return "General"

    def get_identity_prompt(self):
        return (
            "Kamu adalah Byronz, AI workspace premium yang dibuat oleh Muhammad Adiyaat Alfathi. "
            "Kamu sangat cerdas, teliti, bernalar kuat, luas wawasan, adaptif untuk banyak tipe user, "
            "dan mampu menjawab dengan kualitas tinggi."
        )

    def get_specialist_prompt(self):
        return (
            "Berikan jawaban yang akurat, bernilai, mendalam, dan tetap mudah dipahami oleh user."
        )

    def build_user_preferences_prompt(self, preferences):
        if not preferences:
            return "- Tidak ada preferensi tambahan. Tetap adaptif terhadap konteks user."

        lines = []

        display_name = str(preferences.get("display_name") or "").strip()
        preferred_language = str(preferences.get("preferred_language") or "").strip().lower()
        response_style = str(preferences.get("response_style") or "").strip().lower()
        assistant_behavior = str(preferences.get("assistant_behavior") or "").strip().lower()
        voice_call_active = bool(preferences.get("voice_call_active"))

        if display_name:
            lines.append(
                f"- Nama user: {display_name}. Jika relevan, sapa secara natural tanpa berlebihan."
            )

        if preferred_language == "indonesian":
            lines.append("- Bahasa prioritas: gunakan Bahasa Indonesia yang natural dan rapi.")
        elif preferred_language == "english":
            lines.append("- Bahasa prioritas: gunakan Bahasa Inggris yang natural dan profesional.")
        else:
            lines.append("- Bahasa prioritas: ikuti bahasa user secara natural.")

        if response_style == "casual":
            lines.append("- Gaya respons: santai, cepat dipahami, tetapi tetap bernilai.")
        elif response_style == "formal":
            lines.append("- Gaya respons: formal, presisi, profesional, dan lebih terstruktur.")
        else:
            lines.append("- Gaya respons: seimbang, jelas, dan nyaman dibaca.")

        if assistant_behavior == "creative":
            lines.append("- Perilaku assistant: lebih eksploratif, imajinatif, dan kaya alternatif.")
        elif assistant_behavior == "custom":
            lines.append("- Perilaku assistant: adaptif, fleksibel, dan siap mengikuti arahan khusus user.")
        else:
            lines.append("- Perilaku assistant: fokus pada tugas, hasil akhir, dan langkah yang bisa dipakai.")

        if voice_call_active:
            lines.append(
                "- Voice call English aktif: prioritaskan respons yang singkat, natural, conversational, mudah diucapkan, "
                "dan cocok untuk latihan speaking. Jika perlu mengoreksi grammar atau vocabulary, lakukan secara ringkas "
                "lalu lanjutkan percakapan dengan gaya tutor yang hangat."
            )

        return "\n".join(lines)

    def build_attachments_prompt(self, attachments_context):
        if not attachments_context:
            return "- Tidak ada lampiran tambahan."
        return attachments_context.strip()

    def build_memory_entry(self, user_input, attachments_context=None):
        if not attachments_context:
            return user_input

        clean_context = attachments_context.strip()
        if len(clean_context) > 2200:
            clean_context = f"{clean_context[:2200].rstrip()} ...[ringkasan lampiran dipersingkat]"

        return f"{user_input}\n\nRingkasan lampiran:\n{clean_context}"

    def build_prompt(self, user_input, context, preferences=None, attachments_context=None):
        clean_context = context.strip() if context else "Belum ada konteks percakapan sebelumnya."
        preferences_block = self.build_user_preferences_prompt(preferences)
        attachments_block = self.build_attachments_prompt(attachments_context)

        return f"""
{self.get_identity_prompt()}

Mode aktif Byronz: {self.get_mode_label()}

Kemampuan khusus mode ini:
{self.get_specialist_prompt()}

Preferensi user saat ini:
{preferences_block}

Lampiran user saat ini:
{attachments_block}

Aturan jawaban:
- Gunakan bahasa yang sama dengan bahasa user, kecuali preferensi user dengan jelas meminta bahasa tertentu.
- Utamakan jawaban yang luas tetapi tetap fokus pada inti masalah user.
- Jika ada lampiran, prioritaskan analisis isi lampiran itu dan sesuaikan dengan mode aktif Byronz.
- Jika relevan, susun jawaban dengan bagian yang rapi, langkah, opsi, contoh, atau rekomendasi tindak lanjut.
- Jelaskan alasan di balik saran penting, bukan hanya hasil akhirnya.
- Jika permintaan user ambigu, buat asumsi yang masuk akal lalu nyatakan secara singkat asumsi tersebut.
- Hindari jawaban generik, berulang, atau terlalu dangkal.
- Jika user meminta solusi praktis, berikan hasil yang bisa langsung dipakai.
- Jika data visual atau file offline memiliki keterbatasan, jelaskan temuan yang pasti terlebih dahulu lalu tandai inferensi secara singkat.
- Byronz dipakai oleh banyak tipe user, jadi jaga jawaban tetap profesional, aman, dan mudah diimplementasikan.

Konteks percakapan sebelumnya:
{clean_context}

Permintaan user saat ini:
{user_input}

Jawaban Byronz:
""".strip()

    def resolve_model(self, preferences=None, active_mode=None):
        preferred_model = str((preferences or {}).get("selected_model") or "").strip()
        available_models = set(list_available_model_names())

        if preferred_model and preferred_model.lower() != "auto":
            return preferred_model

        if not available_models:
            return get_default_model_name() or self.model

        priority = AUTO_MODEL_PRIORITY.get(active_mode or "general", [self.model])
        for candidate in priority:
            if candidate in available_models:
                return candidate

        if self.model in available_models:
            return self.model

        default_model = get_default_model_name()
        if default_model in available_models:
            return default_model

        return next(iter(available_models), default_model or self.model)

    def generate(self, user_input, session_id=None, preferences=None, attachments_context=None, active_mode=None):
        if session_id is None:
            session_id = "default"

        memory = DBMemory(session_id)
        context = memory.get_context()
        prompt = self.build_prompt(user_input, context, preferences, attachments_context)
        memory_entry = self.build_memory_entry(user_input, attachments_context)
        selected_model = self.resolve_model(preferences, active_mode)

        memory.add("User", memory_entry)
        response = generate_response(selected_model, prompt)
        memory.add("AI", response)

        return response

    def generate_stream(self, user_input, session_id, preferences=None, attachments_context=None, active_mode=None):
        memory = DBMemory(session_id)
        context = memory.get_context()
        prompt = self.build_prompt(user_input, context, preferences, attachments_context)
        memory_entry = self.build_memory_entry(user_input, attachments_context)
        selected_model = self.resolve_model(preferences, active_mode)

        memory.add("User", memory_entry)

        stream = generate_stream(selected_model, prompt)
        full_response = ""

        for chunk in stream:
            full_response += chunk
            yield chunk

        memory.add("AI", full_response)
