# TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# MAKE SURE DOCKERFILE DOES NOT INCLUDE FIREBASE API JSON FILE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!

from helpers import convert_heic_to_jpeg
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import FileResponse
import os
from config import MEDIA_DIR
from typing import List
from dependencies import get_current_user
import time

router = APIRouter()

@router.get("/media/{filename}")
async def get_media(filename: str):
	"""Serve an image or video file."""
	file_path = os.path.join(MEDIA_DIR, filename)
	if not os.path.exists(file_path):
		raise HTTPException(status_code=404, detail="File not found")

	return FileResponse(file_path, media_type="image/jpeg")

@router.post("/media")
async def create_media(file: UploadFile = File(), user_data: dict = Depends(get_current_user)):
	"""Upload one or more media files."""

	# Check if the file above 10MB limit
	if(file.size/1000000 > 10):
		raise HTTPException(status_code=400, detail="File size exceeds 10 MB limit")

	# Get file extension and check if it's allowed
	file_extension = os.path.splitext(file.filename)[1].lower() if file.filename else ""
	allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.heic']
	if file_extension not in allowed_extensions:
		raise HTTPException(status_code=400, detail=f"File extension {file_extension} not allowed")

	# Generate a unique filename by adding a timestamp
	timestamp = int(time.time())
	file_name = f"{os.path.splitext(file.filename)[0]}_{timestamp}{file_extension}"
	
	# Make sure the media directory exists
	os.makedirs(MEDIA_DIR, exist_ok=True)
	
	# Create final file path
	file_path = os.path.join(MEDIA_DIR, file_name)
	
	try:
		# If it's a HEIC file, convert it to JPEG
		if file_extension == '.heic':
			await convert_heic_to_jpeg(file, file_path)
			file_name = f"{os.path.splitext(file_name)[0]}.jpg"
		else:
			# For regular files, save directly
			with open(file_path, "wb") as f:
				while contents := await file.read(1024):
					f.write(contents)
	except Exception as e:
		print(f"Error uploading file: {str(e)}")
		raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")
	finally:
		await file.close()

	return {"message": f"Successfully uploaded file", "url": f"media/{file_name}"}