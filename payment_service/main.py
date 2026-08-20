from fastapi import FastAPI

app = FastAPI(
    title="Payment Service",
    version="1.0.0",
)


@app.get("/")
async def root():
    return {"message": "Payment service is running"}