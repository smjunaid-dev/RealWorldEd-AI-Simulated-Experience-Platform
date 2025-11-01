from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.models import User, Session as SessionModel, Message
from app.schemas.schemas import ChatRequest, ChatResponse, MessageResponse
from app.api.deps import get_current_user
from app.agents.agents import MentorAgent, ClientAgent, ScenarioGenerator

router = APIRouter()

# Initialize agents
mentor_agent = MentorAgent()
client_agent = ClientAgent()
scenario_generator = ScenarioGenerator()


@router.post("/", response_model=ChatResponse)
async def send_message(
    chat_data: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message and get AI response"""
    
    # Get session
    session = db.query(SessionModel).filter(
        SessionModel.id == chat_data.session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Save user message
    user_message = Message(
        session_id=session.id,
        role="user",
        content=chat_data.message
    )
    db.add(user_message)
    db.commit()
    
    # Get chat history
    chat_history = db.query(Message).filter(
        Message.session_id == session.id
    ).order_by(Message.created_at).all()
    
    history_dict = [
        {"role": msg.role, "content": msg.content}
        for msg in chat_history
    ]
    
    # Prepare context
    context = {
        "mode": session.mode,
        "subject": session.subject,
        "application": session.application,
        "project_idea": session.project_idea,
        "business_type": session.business_type,
        "location": session.location,
        "business_idea": session.business_idea,
        "current_stage": session.current_stage
    }
    
    # Determine which agent to use based on stage
    if session.current_stage in ["started", "subject_selected", "application_selected", "guidance"]:
        agent = mentor_agent
        agent_type = "mentor"
    elif session.current_stage in ["testing", "simulation"]:
        agent = client_agent
        agent_type = "client"
    else:
        agent = mentor_agent
        agent_type = "mentor"
    
    # Generate AI response
    ai_response = await agent.generate_response(
        chat_data.message,
        context,
        history_dict
    )
    
    # Save AI message
    ai_message = Message(
        session_id=session.id,
        role=agent_type,
        content=ai_response,
        agent_type=agent_type
    )
    db.add(ai_message)
    db.commit()
    
    # Prepare session update info
    session_update = None
    
    # Auto-detect stage transitions
    user_msg_lower = chat_data.message.lower()
    if session.mode == "education":
        if session.current_stage == "started" and any(keyword in user_msg_lower for keyword in ["c++", "java", "python", "javascript"]):
            session_update = {"current_stage": "subject_selected"}
        elif "project" in user_msg_lower and "done" in user_msg_lower:
            session_update = {"current_stage": "testing"}
    elif session.mode == "business":
        if session.current_stage == "started" and any(keyword in user_msg_lower for keyword in ["food", "clothing", "tech", "retail"]):
            session_update = {"current_stage": "business_selected"}
        elif "ready" in user_msg_lower and "pitch" in user_msg_lower:
            session_update = {"current_stage": "simulation"}
    
    return ChatResponse(
        message=ai_response,
        agent_type=agent_type,
        session_update=session_update
    )


@router.get("/{session_id}/messages", response_model=List[MessageResponse])
def get_session_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all messages for a session"""
    
    # Verify session belongs to user
    session = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    messages = db.query(Message).filter(
        Message.session_id == session_id
    ).order_by(Message.created_at).all()
    
    return messages


@router.post("/scenario/{session_id}")
async def generate_scenario(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a new scenario for testing"""
    
    # Get session
    session = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Prepare context
    context = {
        "mode": session.mode,
        "subject": session.subject,
        "project_idea": session.project_idea,
        "business_type": session.business_type,
        "location": session.location,
        "business_idea": session.business_idea
    }
    
    # Generate scenario
    scenario = await scenario_generator.generate_scenario(context)
    
    # Save as client message
    scenario_message = Message(
        session_id=session.id,
        role="client",
        content=scenario,
        agent_type="scenario"
    )
    db.add(scenario_message)
    
    # Update session stage
    session.current_stage = "simulation"
    db.commit()
    
    return {
        "scenario": scenario,
        "message": "New scenario generated. Respond to continue the simulation."
    }
