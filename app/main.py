from fastapi import FastAPI, File, Form, UploadFile, BackgroundTasks
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from app.pipeline import process_batch
import stripe, os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")   # ➋ the key you added in Railway

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
def home():
    with open("app/index.html", "r") as f:
        return HTMLResponse(content=f.read())

class CheckoutReq(BaseModel):
    email: str
    company: str
    fileCount: int

@app.post("/create-checkout-session")
def create_session(payload: CheckoutReq):
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        mode='payment',
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {'name': 'QA Snapshot – 50 calls'},
                'unit_amount': 29900,   # $299 in cents
            },
            'quantity': 1,
        }],
        customer_email=payload.email,
        metadata={'company': payload.company},
        success_url='https://YOUR_DOMAIN.up.railway.app/?success=1',
        cancel_url='https://YOUR_DOMAIN.up.railway.app/?canceled=1',
    )
    return {"sessionId": session.id}

@app.post("/upload")
async def upload(background_tasks: BackgroundTasks,
                 files: list[UploadFile] = File(...),
                 email: str = Form(...),
                 company: str = Form(...)):
    job_id = str(uuid.uuid4())
    background_tasks.add_task(process_batch, files, email, company, job_id)
    return {"detail": "Report cooking. Check email in ~5 min."}
