from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
import smtplib
from email.mime.text import MIMEText
import os
from fastapi.middleware.cors import CORSMiddleware
import jwt
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

class User(BaseModel):
    name: str
    email: str
    password: str
class Otp(BaseModel):
    otp: str


generate_otp_list=[]
def create_jwt_token():
    # Define the payload with user email and user status as verified
    payload = {
        "userStatus": "verified",
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(payload, "2244330097b741aa3917e6365036aa29c91ac937cb11090b0078a246b8977fca", algorithm="HS256")
    return token
def generate_otp() -> str:
    otp = str(random.randint(100000, 999999))
    generate_otp_list.append(otp)
    return otp

def send_email(email: str, otp: str):
    smtp_server = 'smtp.gmail.com'
    smtp_port = 465
    smtp_user = 'meharaliaftab0306@gmail.com'
    smtp_password = 'xoca shle qulr odoi'

    msg = MIMEText(f'Your OTP is: {otp}')
    msg['Subject'] = 'Your OTP Code'
    msg['From'] = smtp_user
    msg['To'] = email

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            print(f"Connecting to the SMTP server: {smtp_server}:{smtp_port}")
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
            print(f"Sent OTP {otp} to {email}")
            return {"isok": True}, 200 
    except smtplib.SMTPException as e:
        print(f"SMTP error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"SMTP error: {str(e)}")
    except Exception as e:
        print(f"An error occurred while sending email: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


@app.post("/sign-up/")
async def sign_up(user: User):
    getotp = generate_otp()
    print(f"Generated OTP: {getotp}")
    send_email(user.email, getotp)
    return {"message": "OTP sent successfully", "isok": True, "status": 200}

@app.post("/verify-otp/")
async def verify_otp(requestotp: Otp):
    print(f"Request OTP: {requestotp.otp}")
    print(f"Generated OTP: {generate_otp_list}")
    if requestotp.otp in generate_otp_list:
        generate_otp_list.remove(requestotp.otp)
        token = create_jwt_token()
        return {"message": "OTP verified successfully", "isok": True, "status": 200, "token": token}
    else:
        return {"message": "OTP verification failed", "isok": False, "status": 400}

@app.get("/")
async def root():
    return {"message": "Welcome to the OTP Sender API"}