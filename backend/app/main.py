from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials

from routes import router

app = FastAPI(title="Portfolio Media API")
app.include_router(router)

cred = credentials.Certificate("portfolio-42e1a-firebase-adminsdk-fbsvc-66ded85cba.json")
firebase_admin.initialize_app(cred)

class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_price": item.price, "item_id": item_id}