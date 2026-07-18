import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def chat_with_gemini(request):
    # Check if we received a conversation or a single message
    conversation = request.data.get('conversation')
    single_message = request.data.get('message')

    if not conversation and not single_message:
        return Response({'error': 'Message or conversation is required'}, status=400)

    api_key = settings.GEMINI_API_KEY
    if not api_key:
        logger.error("GEMINI_API_KEY is not set.")
        return Response({'error': 'Server configuration error'}, status=500)

    # Build the payload for Gemini
    if conversation:
        contents = conversation
    else:
        contents = [
            {
                "role": "user",
                "parts": [{"text": single_message}]
            }
        ]

    # 🆕 ADD A SYSTEM INSTRUCTION at the beginning of the conversation
    system_instruction = {
        "role": "user",
        "parts": [{
            "text": "IMPORTANT: Please respond in plain text only. Do NOT use any markdown formatting like hashtags (#), asterisks (*), backticks (`), or bullet points. Just respond with clean, plain text."
        }]
    }

    # Prepend the system instruction to the conversation
    contents.insert(0, system_instruction)

    model_name = "gemini-flash-latest"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"

    payload = {
        "contents": contents
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        reply = data['candidates'][0]['content']['parts'][0]['text']
        return Response({'reply': reply})
    except requests.exceptions.RequestException as e:
        logger.error(f"Gemini API request error: {str(e)}")
        error_detail = str(e)
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_json = e.response.json()
                if e.response.status_code == 429:
                    return Response({'error': 'Quota exceeded. Please wait a few minutes.'}, status=429)
                error_detail = error_json
            except:
                error_detail = e.response.text
        return Response({'error': error_detail}, status=500)
    except (KeyError, IndexError) as e:
        logger.error(f"Unexpected response format: {str(e)}")
        return Response({'error': 'Unexpected response from AI service'}, status=500)