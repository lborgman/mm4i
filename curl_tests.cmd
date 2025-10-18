@echo TESTING HF WITH CURL
@call ..\..\nongit\mm4i\ai_env.cmd
@rem set KEY_HF
@rem echo API Key: KEY_HF=%KEY_HF%

@rem set MODEL=zai-org/GLM-4.6
@rem set MODEL=google/flan-t5-base
@rem set MODEL=mistralai/Mistral-Nemo-Instruct-2407
@rem set MODEL=facebook/bart-large
@rem set MODEL=gpt2
@rem set MODEL=t5-small
@rem curl -v -X POST "https://api-inference.huggingface.co/models/%MODEL%" -H "Authorization: Bearer %KEY_HF%" -H "Content-Type: application/json" -d "{\"inputs\": \"Test prompt\"}" -o response.txt > curl_debug.txt 2>&1

@rem curl -v https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium
@rem -X POST ^

@rem curl -v https://api-inference.huggingface.co/models/%MODEL% ^
@rem   -d "{\"inputs": "The goal of life is\"}" ^
@rem   -H "Authorization: Bearer %KEY_HF%" ^
@rem   -H "Content-Type: application/json" ^
@rem   -o temp.html 2> curl_debug.txt


@echo API Key: KEY_GROQ=%KEY_GROQ%
@rem curl -X POST "https://api.groq.com/openai/v1/chat/completions" ^
@rem  -H "Authorization: Bearer %KEY_GROQ%" ^
@rem  -H "Content-Type: application/json" ^
@rem  -d "{\"model\": \"llama-3.1-8b-instant\", \"messages\": [{\"role\": \"user\", \"content\": \"Generate a valid JSON mindmap (no extra text) for an article about AI in healthcare:\\n{\\n  \\\"root\\\": {\\n    \\\"title\\\": \\\"AI in Healthcare\\\",\\n    \\\"children\\\": []\\n  }\\n}\"}], \"max_tokens\": 300, \"temperature\": 0.1}" ^
@rem  -o response.txt > curl_debug.txt 2>&1

curl -X POST "https://mm4i.vercel.app/api/call-groq" ^
  -H "Content-Type: application/json" ^
  -d "{\"userPrompt\":\"1. If this prompt does not end with ----, consider it incomplete and notify the user that the prompt appears to be cut off.;\\n2. Summarize the article (or video) \\\"https://en.wikipedia.org/wiki/Self-compassion\\\" into one mind map and output a strict, parse-ready JSON node array (flat; fields: id, name, parentid, and notes).;\\n3. Optional field \\\"notes\\\": For details, markdown format.;\\n4. Give as much details as in a text summary.;\\n5. Limit the hierarchy to max depth 4 levels.;\\n6. Return only valid JSON (no text before or after).;\\n7. Preserve escaped newlines (\\n) inside string values for JSON validity; they should represent Markdown line breaks when rendered.;\\n8. ----\",\"max_tokens\":3000,\"temperature\":0.1}" > response.json