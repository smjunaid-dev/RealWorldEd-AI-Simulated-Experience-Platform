from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ==================== USER SCHEMAS ====================
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


# ==================== SESSION SCHEMAS ====================
class SessionCreate(BaseModel):
    mode: str  # "education" or "business"
    subject: Optional[str] = None
    business_type: Optional[str] = None


class SessionUpdate(BaseModel):
    status: Optional[str] = None
    subject: Optional[str] = None
    application: Optional[str] = None
    project_idea: Optional[str] = None
    business_type: Optional[str] = None
    location: Optional[str] = None
    business_idea: Optional[str] = None
    current_stage: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class SessionResponse(BaseModel):
    id: int
    user_id: int
    mode: str
    status: str
    subject: Optional[str] = None
    application: Optional[str] = None
    project_idea: Optional[str] = None
    business_type: Optional[str] = None
    location: Optional[str] = None
    business_idea: Optional[str] = None
    current_stage: str
    metadata: Optional[Dict[str, Any]] = Field(None, alias='session_metadata')
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        populate_by_name = True


# ==================== MESSAGE SCHEMAS ====================
class MessageCreate(BaseModel):
    content: str
    role: str = "user"


class MessageResponse(BaseModel):
    id: int
    session_id: int
    role: str
    content: str
    agent_type: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = Field(None, alias='message_metadata')
    created_at: datetime
    
    class Config:
        from_attributes = True
        populate_by_name = True


# ==================== CHAT SCHEMAS ====================
class ChatRequest(BaseModel):
    message: str
    session_id: int


class ChatResponse(BaseModel):
    message: str
    agent_type: str
    session_update: Optional[Dict[str, Any]] = None


# ==================== REPORT SCHEMAS ====================
class ReportResponse(BaseModel):
    id: int
    user_id: int
    session_id: int
    technical_score: Optional[float] = None
    communication_score: Optional[float] = None
    creativity_score: Optional[float] = None
    business_sense_score: Optional[float] = None
    overall_score: Optional[float] = None
    strengths: Optional[List[str]] = None
    improvements: Optional[List[str]] = None
    detailed_feedback: Optional[str] = None
    evaluation_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== EDUCATION MODE SCHEMAS ====================
class SubjectSelection(BaseModel):
    subject: str  # "cpp", "java", "python", etc.


class ApplicationSelection(BaseModel):
    application: str  # "gaming", "web", "ai", etc.


class ProjectSubmission(BaseModel):
    project_completed: bool
    notes: Optional[str] = None


# ==================== BUSINESS MODE SCHEMAS ====================
class BusinessTypeSelection(BaseModel):
    business_type: str  # "food", "clothing", "tech", etc.


class LocationInput(BaseModel):
    location: str


class BusinessIdeaSubmission(BaseModel):
    business_idea: str
    budget: Optional[float] = None


# ==================== EVALUATION SCHEMAS ====================
class EvaluationRequest(BaseModel):
    session_id: int


class EvaluationResponse(BaseModel):
    report: ReportResponse
    feedback_message: str
