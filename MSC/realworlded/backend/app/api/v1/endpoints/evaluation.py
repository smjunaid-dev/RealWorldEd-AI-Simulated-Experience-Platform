from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.models import User, Session as SessionModel, Message, Report
from app.schemas.schemas import EvaluationRequest, EvaluationResponse, ReportResponse
from app.api.deps import get_current_user
from app.agents.agents import EvaluatorAgent

router = APIRouter()

# Initialize evaluator agent
evaluator = EvaluatorAgent()


@router.post("/", response_model=EvaluationResponse)
async def evaluate_session(
    eval_request: EvaluationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Evaluate a session and generate a report"""
    
    # Get session
    session = db.query(SessionModel).filter(
        SessionModel.id == eval_request.session_id,
        SessionModel.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Get all messages
    messages = db.query(Message).filter(
        Message.session_id == session.id
    ).order_by(Message.created_at).all()
    
    if len(messages) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough conversation data to evaluate. Continue the session first."
        )
    
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
    
    # Convert messages to dict
    messages_dict = [
        {
            "role": msg.role,
            "content": msg.content,
            "agent_type": msg.agent_type
        }
        for msg in messages
    ]
    
    # Evaluate session
    evaluation = await evaluator.evaluate_session(messages_dict, context)
    
    # Create report
    report = Report(
        user_id=current_user.id,
        session_id=session.id,
        technical_score=evaluation.get("technical_score"),
        communication_score=evaluation.get("communication_score"),
        creativity_score=evaluation.get("creativity_score"),
        business_sense_score=evaluation.get("technical_score"),  # Use same for business
        overall_score=evaluation.get("overall_score"),
        strengths=evaluation.get("strengths"),
        improvements=evaluation.get("improvements"),
        detailed_feedback=evaluation.get("detailed_feedback"),
        evaluation_data=evaluation
    )
    
    db.add(report)
    
    # Mark session as completed
    session.status = "completed"
    
    db.commit()
    db.refresh(report)
    
    # Generate feedback message
    feedback_message = f"""🎉 Evaluation Complete!

**Overall Score: {report.overall_score}/10**

📊 Detailed Scores:
- Technical/Business Skills: {report.technical_score}/10
- Communication: {report.communication_score}/10
- Creativity: {report.creativity_score}/10

✅ **Strengths:**
{chr(10).join(f"• {s}" for s in report.strengths)}

🎯 **Areas for Improvement:**
{chr(10).join(f"• {i}" for i in report.improvements)}

💬 **Detailed Feedback:**
{report.detailed_feedback}

Keep practicing to improve your skills! 🚀"""
    
    return EvaluationResponse(
        report=report,
        feedback_message=feedback_message
    )


@router.get("/reports", response_model=List[ReportResponse])
def get_user_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all reports for current user"""
    reports = db.query(Report).filter(
        Report.user_id == current_user.id
    ).order_by(Report.created_at.desc()).all()
    
    return reports


@router.get("/reports/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific report"""
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == current_user.id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    return report


@router.get("/session/{session_id}/report", response_model=ReportResponse)
def get_session_report(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get report for a specific session"""
    
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
    
    report = db.query(Report).filter(
        Report.session_id == session_id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No report found for this session. Complete the evaluation first."
        )
    
    return report
