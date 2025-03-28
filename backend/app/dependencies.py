from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin.auth import verify_id_token

auth_scheme = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    token = credentials.credentials
    
    try:
        decoded_token = verify_id_token(token)
        
        if not decoded_token:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        
        return decoded_token
    except Exception as e:
        print(e)
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e
