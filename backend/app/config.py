import os
from dotenv import load_dotenv

load_dotenv()

MEDIA_DIR = os.getenv("MEDIA_DIR", "./app/media")  # Default folder
