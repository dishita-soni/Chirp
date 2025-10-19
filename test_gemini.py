#!/usr/bin/env python3
"""Test Gemini API configuration"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
print(f'API Key found: {api_key[:20]}...' if api_key else 'No API key found')

# Test the model name currently in the code
try:
    genai.configure(api_key=api_key)
    print('\nTesting model: gemini-2.5-flash-lite')
    model = genai.GenerativeModel('gemini-2.5-flash-lite')
    response = model.generate_content('Say hello')
    print(f'Success! Response: {response.text}')
except Exception as e:
    print(f'Error with gemini-2.5-flash-lite: {e}')

# Test with standard model name
try:
    print('\nTesting model: gemini-1.5-flash')
    model2 = genai.GenerativeModel('gemini-1.5-flash')
    response2 = model2.generate_content('Say hello in JSON format')
    print(f'Success! Response: {response2.text}')
except Exception as e:
    print(f'Error with gemini-1.5-flash: {e}')
