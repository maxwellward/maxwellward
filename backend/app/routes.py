from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import FileResponse
import os
from config import MEDIA_DIR
from typing import List
from dependencies import get_current_user

router = APIRouter()

@router.get("/media/{filename}")
async def get_media(filename: str):
	"""Serve an image or video file."""
	file_path = os.path.join(MEDIA_DIR, filename)
	
	# Log contents of media directory
	print(f"Media directory: {MEDIA_DIR}")
	print(f"Looking for file: {filename}")
	if os.path.exists(MEDIA_DIR):
		files = os.listdir(MEDIA_DIR)
		print(f"Files in media directory: {files}")
	else:
		print(f"Media directory does not exist: {MEDIA_DIR}")

	if not os.path.exists(file_path):
		raise HTTPException(status_code=404, detail="File not found")

	return FileResponse(file_path)

# TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# MAKE SURE DOCKERFILE DOES NOT INCLUDE FIREBASE API JSON FILE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!

# TODO: File size limits
# TODO: Authentication
# TODO: Sanitize filenames (secure-filename)
# TODO: Check media dir exists and do proper error handling

@router.post("/media")
async def create_media(name: str = '', file: UploadFile = File(), user_data: dict = Depends(get_current_user)):
	"""Upload one or more media files."""

	# Get file extension
	file_extension = os.path.splitext(file.filename)[1].lower() if file.filename else ""

	# You might want to validate allowed extensions
	allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov']
	if file_extension not in allowed_extensions:
		raise HTTPException(status_code=400, detail=f"File extension {file_extension} not allowed")
 
	file_name = f"{name}{file_extension}"
 
	# Check if file with this name already exists
	if name:
		existing_file_path = os.path.join(MEDIA_DIR, file_name)
		if os.path.exists(existing_file_path):
			raise HTTPException(status_code=409, detail=f"A file with name {file_name} already exists")

	# Make sure the media directory exists
	os.makedirs(MEDIA_DIR, exist_ok=True)
 
	file_path = os.path.join(MEDIA_DIR, f"{name}{file_extension}")
	try:
		with open(file_path, "wb") as f:
			while contents := await file.read(1024):
				f.write(contents)
	except Exception:
		return {"message": "There was an error uploading the file(s)"}
	finally:
		await file.close()

	return {"message": f"Successfully uploaded file", "url": f"http://127.0.0.1:8000/media/{file_name}"}