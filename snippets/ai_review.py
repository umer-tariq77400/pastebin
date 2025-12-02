import os
from google import genai
from google.genai import types

def review_code(code_content):
    """
    Uses Google Gemini to review the provided code snippet.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "Error: GEMINI_API_KEY is not set."

    client = genai.Client(api_key=api_key)

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
            model="gemini-2.5-flash",
            contents=[prompt],
            config=types.GenerateContentConfig(
                temperature=0.7,
            )
        )
        return response.text
    except Exception as e:
        return f"Error communicating with AI: {str(e)}"
