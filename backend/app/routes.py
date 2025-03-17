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
async def create_media(files: List[UploadFile] = File(...), user_data: dict = Depends(get_current_user)):
	print(user_data)
	"""Upload one or more media files."""
	for file in files:
		file_path = os.path.join(MEDIA_DIR, file.filename)
		try:
			with open(file_path, "wb") as f:
				while contents := await file.read(1024):
					f.write(contents)
		except Exception:
			return {"message": "There was an error uploading the file(s)"}
		finally:
			await file.close()

	return {"message": f"Successfully uploaded {len(files)} file(s)"}