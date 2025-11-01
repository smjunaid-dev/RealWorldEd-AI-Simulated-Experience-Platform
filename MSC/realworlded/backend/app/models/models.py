from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")


class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mode = Column(String, nullable=False)  # "education" or "business"
    status = Column(String, default="active")  # "active", "completed", "paused"
    
    # Education mode fields
    subject = Column(String, nullable=True)
    application = Column(String, nullable=True)
    project_idea = Column(Text, nullable=True)
    
    # Business mode fields
    business_type = Column(String, nullable=True)
    location = Column(String, nullable=True)
    business_idea = Column(Text, nullable=True)
    
    # Common fields
    current_stage = Column(String, default="started")
    session_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    messages = relationship("Message", back_populates="session", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="session", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # "user", "mentor", "client", "evaluator"
    content = Column(Text, nullable=False)
    agent_type = Column(String, nullable=True)  # Specific agent that sent the message
    message_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    session = relationship("Session", back_populates="messages")


class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    
    # Scores
    technical_score = Column(Float, nullable=True)
    communication_score = Column(Float, nullable=True)
    creativity_score = Column(Float, nullable=True)
    business_sense_score = Column(Float, nullable=True)
    overall_score = Column(Float, nullable=True)
    
    # Feedback
    strengths = Column(JSON, nullable=True)  # List of strengths
    improvements = Column(JSON, nullable=True)  # List of areas to improve
    detailed_feedback = Column(Text, nullable=True)
    
    # Metadata
    evaluation_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="reports")
    session = relationship("Session", back_populates="reports")
