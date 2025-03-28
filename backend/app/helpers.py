import os
import tempfile
from fastapi import UploadFile, HTTPException
from PIL import Image
from pillow_heif import register_heif_opener

# Register the HEIF opener with PIL
register_heif_opener()

async def convert_heic_to_jpeg(file: UploadFile, file_path: str):
    # Create a temporary file to store the uploaded content
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                # Read and write the file in chunks
                contents = await file.read()
                temp_file.write(contents)
                temp_file_path = temp_file.name
            
            try:
                with Image.open(temp_file_path) as img:
                    # Convert to RGB if needed
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    # Save as JPEG
                    converted_path = f"{os.path.splitext(file_path)[0]}.jpg"
                    img.save(converted_path, 'JPEG', quality=85)
            except Exception as e:
                print(f"HEIC conversion error: {str(e)}")
                raise HTTPException(status_code=400, detail=f"Error converting HEIC image: {str(e)}")
            finally:
                # Clean up the temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)