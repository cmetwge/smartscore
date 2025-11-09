from fastapi.responses import HTMLResponse

@app.get("/", response_class=HTMLResponse)
def home():
    with open("index.html") as f:
        return HTMLResponse(content=f.read())
from fastapi import FastAPI, File, Form, UploadFile, BackgroundTasks
from app.pipeline import process_batch
import uuid, os

app = FastAPI()

@app.post("/upload")
async def upload(background_tasks: BackgroundTasks,
                 files: list[UploadFile] = File(...),
                 email: str = Form(...),
                 company: str = Form(...)):
    job_id = str(uuid.uuid4())
    background_tasks.add_task(process_batch, files, email, company, job_id)
    return {"detail": "Report cooking. Check email in ~5 min."}
