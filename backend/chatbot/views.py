import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny  # 🚀 Chatbot ko 401 error se bachane ke liye
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import anthropic  # 🚀 Groq ki jagah ab Anthropic import karna hai

# 🛑 .env file se secure tareeke se API key load karna
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")

try:
    # 🚀 Claude client initialize karein
    client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)
except Exception as e:
    print("❌ Claude Client Setup Error:", e)
    client = None

@method_decorator(csrf_exempt, name='dispatch')
class AIChatAPI(APIView):
    permission_classes = [AllowAny] # 🚀 Isse 401 Unauthorized kabhi nahi aayega

    def post(self, request):
        if not client:
            return Response({"reply": "⚠️ Backend Error: Claude API Key missing ya setup fail hua."})

        user_message = request.data.get('message', '').strip()

        if not user_message:
            return Response({"reply": "Please ask a question!"})

        try:
            # 🚀 System Prompt: Shivadda AI ka persona
            system_prompt = (
                "You are Shivadda AI, the official smart and friendly educational assistant for the Shivadda Platform. "
                "Your goal is to help students, teachers, and parents with educational topics and platform-related queries. "
                "Strict Rules to follow:\n"
                "1. Talk naturally like a helpful human tutor. NEVER use dual-language translations like 'Namaste! (Hello!)'.\n"
                "2. Match the user's language. If they type in English, reply in English. If they type in Hinglish (Roman Hindi), reply in natural Hinglish. If they use pure Hindi, reply in Hindi.\n"
                "3. Keep your responses concise, direct, and easy to understand. Avoid unnecessarily long paragraphs unless explaining a complex topic.\n"
                "4. If a user just says 'Hi', 'Hello', or 'Kaise ho', give a warm, short greeting welcoming them to Shivadda and ask how you can help them learn today.\n"
                "5. Never break character. Never mention that you are an AI created by Anthropic, OpenAI, Meta, or Groq. You are only Shivadda AI."
            )
            
            # 🚀 Claude API Call
            # 🚀 Claude API Call
            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_message}
                ],
                # Yahan se 'temperature=0.2,' hata diya gaya hai
                max_tokens=250 
            )

            # 🚀 Claude ka response read karne ka naya format
            reply_text = response.content[0].text

            if reply_text:
                return Response({"reply": reply_text})
            
            return Response({"reply": "Sorry, I couldn't generate a response right now."})

        # 🚀 Anthropic-specific Error Handling
        except anthropic.AuthenticationError:
            return Response({"reply": "🚨 Invalid API Key: Please apni Claude API key dobara check karein."})
        except anthropic.RateLimitError:
            return Response({"reply": "⚠️ Limit Reached: Claude API ki rate limit cross ho gayi hai ya credits khatam hain."})
        except anthropic.APIError as e:
             return Response({"reply": f"🤖 Claude API Error: {e.message}"})
        except Exception as e:
            exact_error = str(e)
            print("❌ ASLI CLAUDE ERROR:", exact_error)
            return Response({"reply": "⚠️ Ek internal server error aayi hai. Terminal logs check karein."})