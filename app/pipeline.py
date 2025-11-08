import asyncio, aiofiles, openai, boto3, pandas as pd, os, json
from weasyprint import HTML
from app.scorer import score_transcript
from jinja2 import Template
import matplotlib.pyplot as plt, base64, io, tempfile

openai.api_key = os.getenv("OPENAI_API_KEY")
s3 = boto3.client("s3", endpoint_url=os.getenv("R2_ENDPOINT"))

async def process_batch(files, email, company, job_id):
    scores = []
    for file in files:
        async with aiofiles.tempfile.NamedTemporaryFile(delete=False) as tmp:
            await tmp.write(await file.read())
            tmp_path = tmp.name
        transcript = await asyncio.to_thread(transcribe, tmp_path)
        os.remove(tmp_path)
        result = await asyncio.to_thread(score_transcript, transcript)
        scores.append(result)
    pdf_url = await asyncio.to_thread(build_pdf, scores, company, job_id)
    send_email(email, pdf_url)

def transcribe(path):
    with open(path, "rb") as audio:
        return openai.Audio.transcribe("whisper-1", audio)["text"]

def build_pdf(scores, company, job_id):
    df = pd.DataFrame([s["rubric"] for s in scores])
    avg = df.mean()
    labels = avg.index; values = avg.values
    fig, ax = plt.subplots(figsize=(3,3), subplot_kw=dict(projection='polar'))
    ax.plot(labels, values); ax.fill(labels, values, alpha=0.3)
    buf = io.BytesIO(); plt.savefig(buf, format='png', bbox_inches='tight'); buf.seek(0); plt.close()
    radar_b64 = base64.b64encode(buf.read()).decode()

    template_str = open("app/templates/report.html").read()
    html = Template(template_str).render(company=company, avg_score=avg.mean(),
                                         radar_b64=radar_b64,
                                         coaching=scores[0]["top3Coaching"])
    pdf = HTML(string=html).write_pdf()
    key = f"reports/{job_id}.pdf"
    s3.put_object(Bucket=os.getenv("R2_BUCKET"), Key=key, Body=pdf, ContentType="application/pdf")
    return f"{os.getenv('R2_PUBLIC')}/{key}"

def send_email(to, url):
    ses = boto3.client("ses", region_name="us-east-1")
    body = f"Hi there,\n\nYour QA Snapshot PDF is ready: {url}\n\nCheers,\nQA Robot"
    ses.send_email(Source=os.getenv("SES_SENDER"),
                   Destination={"ToAddresses":[to]},
                   Message={"Subject":{"Data":"QA Snapshot ready"},
                            "Body":{"Text":{"Data":body}}})
