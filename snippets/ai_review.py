from google import genai
from google.genai import types
from django.conf import settings

API_KEY = settings.GEMINI_API_KEY
client = None
if API_KEY:
    try:
        client = genai.Client(api_key=API_KEY)
    except Exception as e:
        print(f"Failed to initialize Gemini client: {e}")

def review_code(code_content):
    """
    Uses Google Gemini to review the provided code snippet.
    """
    if not client:
        return "Error: Gemini client is not initialized (likely missing API key)."

    prompt = f"""
    Please review the following code snippet.
    Provide constructive feedback, suggestions for improvement, and potential bug fixes.
    Also provide a refactored version of the code if applicable.

    Code:
    ```
    {code_content}
    ```
    """

    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=[prompt],
            config=types.GenerateContentConfig(
                temperature=0.7,
            )
        )
        return response.text
    except Exception as e:
        return f"Error communicating with AI: {str(e)}"
