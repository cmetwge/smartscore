import openai, json
RUBRIC = [...]  # same JSON you used in Make

def score_transcript(text):
    prompt = f"Apply this rubric: {RUBRIC}\n\nTranscript:\n{text}\n\nReturn only JSON."
    resp = openai.ChatCompletion.create(model="gpt-4o-mini",
                                        messages=[{"role":"system","content":"You are QA expert."},
                                                  {"role":"user","content":prompt}],
                                        temperature=0)
    return json.loads(resp.choices[0].message.content)
