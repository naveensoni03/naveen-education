from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import google.generativeai as genai
from datetime import datetime, timedelta
import threading

API_KEY = "YOUR_API_KEY_HERE"
genai.configure(api_key=API_KEY)

# 🔒 Global state
CACHED_MODEL = None
LAST_MODEL_CHECK = None
QUOTA_BLOCKED = False
QUOTA_RESET_TIME = None
LOCK = threading.Lock()

@method_decorator(csrf_exempt, name='dispatch')
class AIChatAPI(APIView):
    def post(self, request):
        global CACHED_MODEL, LAST_MODEL_CHECK, QUOTA_BLOCKED, QUOTA_RESET_TIME

        user_message = request.data.get('message', '').strip()
        current_time = datetime.now().astimezone().strftime("%Y-%m-%d %H:%M")

        system_instruction = (
            f"Current Time: {current_time}. "
            "You are Shivadda AI, an expert academic tutor. "
            "Only answer coding, math, science, and education-related questions. "
            "Be concise and helpful."
        )

        # 🔕 HARD BLOCK IF QUOTA HIT
        with LOCK:
            if QUOTA_BLOCKED:
                if QUOTA_RESET_TIME and datetime.now() < QUOTA_RESET_TIME:
                    return Response({
                        "reply": "⚠️ AI daily limit reached. I'm still here — ask coding, math, or science questions and I'll respond normally!"
                    })
                else:
                    # Reset block after wait
                    QUOTA_BLOCKED = False
                    QUOTA_RESET_TIME = None

        # 🔍 MODEL SELECT (CACHED)
        try:
            if not CACHED_MODEL or not LAST_MODEL_CHECK or datetime.now() - LAST_MODEL_CHECK > timedelta(hours=6):
                models = [m.name for m in genai.list_models() if "generateContent" in m.supported_generation_methods]
                preference = [
                    "models/gemini-2.0-flash",
                    "models/gemini-flash-latest",
                    "models/gemini-pro-latest"
                ]
                for p in preference:
                    if p in models:
                        CACHED_MODEL = p
                        break
                if not CACHED_MODEL and models:
                    CACHED_MODEL = models[0]
                LAST_MODEL_CHECK = datetime.now()

        except Exception:
            CACHED_MODEL = None

        # 🚫 If no model found
        if not CACHED_MODEL:
            return Response({"reply": "AI temporarily unavailable. Please try later."})

        # 🚀 GENERATE RESPONSE
        try:
            model = genai.GenerativeModel(
                model_name=CACHED_MODEL,
                system_instruction=system_instruction
            )

            response = model.generate_content(
                user_message,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=300
                )
            )

            if response.text:
                return Response({"reply": response.text})

            return Response({"reply": "No response generated."})

        except Exception as e:
            error_msg = str(e).lower()

            # 🛑 QUOTA HIT — PERMANENT BLOCK MODE
            if "quota" in error_msg or "429" in error_msg:
                with LOCK:
                    QUOTA_BLOCKED = True
                    QUOTA_RESET_TIME = datetime.now() + timedelta(seconds=60)

                return Response({
                    "reply": "⚠️ AI daily limit reached. I'm still here — ask coding, math, or science questions and I'll respond normally!"
                })

            return Response({"reply": "System error. Please try again."})
