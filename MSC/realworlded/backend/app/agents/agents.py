from typing import Dict, List, Optional, Any
from google import genai
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class BaseAgent:
    """Base class for all AI agents"""
    
    def __init__(self, role: str, goal: str, backstory: str):
        self.role = role
        self.goal = goal
        self.backstory = backstory
        # Initialize the new Gemini client
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None
        
    async def generate_response(
        self,
        user_message: str,
        context: Dict[str, Any],
        chat_history: List[Dict[str, str]] = None
    ) -> str:
        """Generate a response based on user message and context"""
        if not self.client:
            return self._fallback_response(user_message, context)
        
        try:
            # Build the system prompt
            system_prompt = f"""You are {self.role}.
Goal: {self.goal}
Backstory: {self.backstory}

Current Context:
{self._format_context(context)}

Remember to stay in character and help the user achieve their learning goals."""
            
            # Build conversation history
            conversation = []
            if chat_history:
                for msg in chat_history[-10:]:  # Last 10 messages for context
                    if msg["role"] == "user":
                        conversation.append(f"User: {msg['content']}")
                    elif msg["role"] in ["mentor", "client", "evaluator"]:
                        conversation.append(f"Assistant: {msg['content']}")
            
            # Build full prompt
            full_prompt = system_prompt + "\n\n"
            if conversation:
                full_prompt += "\n".join(conversation) + "\n\n"
            full_prompt += f"User: {user_message}\n\nAssistant:"
            
            # Generate response using new SDK
            response = self.client.models.generate_content(
                model="gemini-2.0-flash-exp",
                contents=full_prompt
            )
            return response.text
            
        except Exception as e:
            logger.error(f"Error generating response from {self.role}: {str(e)}")
            return self._fallback_response(user_message, context)
    
    def _format_context(self, context: Dict[str, Any]) -> str:
        """Format context dictionary into readable string"""
        formatted = []
        for key, value in context.items():
            if value:
                formatted.append(f"- {key.replace('_', ' ').title()}: {value}")
        return "\n".join(formatted) if formatted else "No additional context"
    
    def _fallback_response(self, user_message: str, context: Dict[str, Any]) -> str:
        """Fallback response when LLM is not available"""
        return f"I'm {self.role}, and I'm here to help you. However, I'm currently in demo mode. Please configure your Gemini API key to enable full AI capabilities."


class MentorAgent(BaseAgent):
    """AI Mentor that guides and teaches users"""
    
    def __init__(self):
        super().__init__(
            role="AI Mentor",
            goal="Guide students through real-world learning experiences, provide project ideas, and offer supportive feedback",
            backstory="You are an experienced educator and industry professional who has mentored hundreds of students. You understand both theoretical concepts and practical applications. You're patient, encouraging, and always provide actionable guidance."
        )
    
    def _fallback_response(self, user_message: str, context: Dict[str, Any]) -> str:
        """Specific fallback for mentor"""
        mode = context.get("mode", "education")
        
        if mode == "education":
            subject = context.get("subject", "programming")
            return f"""Hello! I'm your AI Mentor, here to guide you through {subject}.

I can help you with:
📚 Understanding real-world applications
💡 Getting project ideas
🛠️ Learning how to implement projects
📊 Preparing for real-world scenarios

What would you like to explore today?

(Note: Full AI capabilities will be enabled once you configure your Gemini API key)"""
        else:
            business_type = context.get("business_type", "business")
            return f"""Hello! I'm your Business Mentor, ready to help you explore the {business_type} industry.

I can help you with:
💼 Understanding market opportunities
🎯 Developing unique business ideas
📈 Planning your business strategy
💰 Budget and financial planning

What aspect of your business idea would you like to discuss?

(Note: Full AI capabilities will be enabled once you configure your Gemini API key)"""


class ClientAgent(BaseAgent):
    """AI Client/Investor that simulates real-world interactions"""
    
    def __init__(self):
        super().__init__(
            role="Client/Investor",
            goal="Simulate realistic client or investor interactions to test user's communication and problem-solving skills",
            backstory="You are a demanding but fair client/investor who asks tough questions. You want to see competence, clear communication, and problem-solving ability. You provide challenging scenarios that help users prepare for real-world situations."
        )
    
    def _fallback_response(self, user_message: str, context: Dict[str, Any]) -> str:
        """Specific fallback for client"""
        mode = context.get("mode", "education")
        
        if mode == "education":
            return """I'm reviewing your project. Let me ask you some questions:

1. What happens if the application crashes in production?
2. How would you handle user feedback requesting new features?
3. Can you explain your debugging process?

(Note: Full AI simulation will be enabled once you configure your Gemini API key)"""
        else:
            return """I'm interested in your business idea. Let me ask you some tough questions:

1. Why should I invest in your business?
2. What makes your idea different from existing competitors?
3. How do you plan to acquire your first 100 customers?
4. What's your expected ROI in the first year?

(Note: Full AI simulation will be enabled once you configure your Gemini API key)"""


class EvaluatorAgent(BaseAgent):
    """AI Evaluator that assesses performance and provides feedback"""
    
    def __init__(self):
        super().__init__(
            role="AI Evaluator",
            goal="Objectively assess user responses, measure performance across multiple dimensions, and provide constructive feedback",
            backstory="You are an experienced evaluator who has assessed thousands of professionals. You provide fair, detailed, and actionable feedback that helps people improve. You measure technical skills, communication ability, creativity, and business acumen."
        )
    
    async def evaluate_session(
        self,
        messages: List[Dict[str, str]],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Evaluate an entire session and generate scores"""
        mode = context.get("mode", "education")
        
        if not self.client:
            return self._fallback_evaluation(mode)
        
        try:
            evaluation_prompt = f"""Analyze this conversation and evaluate the user's performance.

Mode: {mode}
Context: {self._format_context(context)}

Conversation:
{self._format_messages(messages)}

Provide a detailed evaluation with scores (0-10) for:
1. Technical Skills / Business Acumen (depending on mode)
2. Communication Clarity
3. Creativity and Problem Solving
4. Overall Performance

Also provide:
- 3 key strengths
- 3 areas for improvement
- Detailed feedback paragraph

Format your response as JSON:
{{
    "technical_score": 0-10,
    "communication_score": 0-10,
    "creativity_score": 0-10,
    "overall_score": 0-10,
    "strengths": ["strength1", "strength2", "strength3"],
    "improvements": ["improvement1", "improvement2", "improvement3"],
    "detailed_feedback": "paragraph of feedback"
}}"""
            
            response = self.client.models.generate_content(
                model="gemini-2.0-flash-exp",
                contents=evaluation_prompt
            )
            result_text = response.text
            
            # Try to parse JSON response
            import json
            try:
                evaluation = json.loads(result_text)
            except:
                # If not valid JSON, create structured response
                evaluation = self._fallback_evaluation(mode)
            
            return evaluation
            
        except Exception as e:
            logger.error(f"Error in evaluation: {str(e)}")
            return self._fallback_evaluation(mode)
    
    def _format_messages(self, messages: List[Dict[str, str]]) -> str:
        """Format messages for evaluation"""
        formatted = []
        for msg in messages:
            role = msg.get("role", "unknown")
            content = msg.get("content", "")
            formatted.append(f"{role.upper()}: {content}")
        return "\n\n".join(formatted)
    
    def _fallback_evaluation(self, mode: str) -> Dict[str, Any]:
        """Fallback evaluation when LLM is not available"""
        if mode == "education":
            return {
                "technical_score": 7.5,
                "communication_score": 8.0,
                "creativity_score": 7.0,
                "overall_score": 7.5,
                "strengths": [
                    "Shows good understanding of core concepts",
                    "Communicates ideas clearly",
                    "Demonstrates problem-solving approach"
                ],
                "improvements": [
                    "Practice more real-world debugging scenarios",
                    "Improve technical depth in explanations",
                    "Work on handling edge cases"
                ],
                "detailed_feedback": "You've shown a solid understanding of the subject matter and demonstrated good communication skills. To improve further, focus on practical application and handling unexpected scenarios. Keep practicing with real-world projects!"
            }
        else:
            return {
                "technical_score": 8.0,
                "communication_score": 7.5,
                "creativity_score": 8.5,
                "overall_score": 8.0,
                "strengths": [
                    "Innovative business idea with clear differentiation",
                    "Good understanding of target market",
                    "Strong enthusiasm and passion"
                ],
                "improvements": [
                    "Develop more detailed financial projections",
                    "Strengthen ROI explanation",
                    "Provide more concrete market research data"
                ],
                "detailed_feedback": "Your business idea shows promise and creativity. You've articulated your vision well and shown understanding of your market. To make your pitch stronger, focus on the financial aspects and back up your claims with data. Practice explaining your ROI more clearly to potential investors."
            }


class ScenarioGenerator:
    """Generates dynamic real-world scenarios"""
    
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None
    
    async def generate_scenario(self, context: Dict[str, Any]) -> str:
        """Generate a realistic scenario based on context"""
        mode = context.get("mode", "education")
        
        if not self.client:
            return self._fallback_scenario(mode, context)
        
        try:
            if mode == "education":
                prompt = f"""Generate a realistic client feedback scenario for a student who built a {context.get('project_idea', 'software project')}.

The scenario should:
1. Present a realistic problem or client concern
2. Be specific and detailed
3. Test the student's problem-solving and communication skills
4. Be appropriate for someone learning {context.get('subject', 'programming')}

Generate just the scenario in 2-3 sentences from the client's perspective."""
            else:
                prompt = f"""Generate a tough investor question for someone pitching a {context.get('business_type', 'business')} business in {context.get('location', 'the area')}.

The business idea: {context.get('business_idea', 'a new business venture')}

Generate a challenging but fair question that tests:
1. Business understanding
2. Market knowledge
3. Financial planning
4. Strategic thinking

Generate just the question from an investor's perspective."""
            
            response = self.client.models.generate_content(
                model="gemini-2.0-flash-exp",
                contents=prompt
            )
            return response.text
            
        except Exception as e:
            logger.error(f"Error generating scenario: {str(e)}")
            return self._fallback_scenario(mode, context)
    
    def _fallback_scenario(self, mode: str, context: Dict[str, Any]) -> str:
        """Fallback scenario when LLM is not available"""
        if mode == "education":
            return "A client reports that your application crashes when they try to save their work. They're frustrated and need a fix immediately. How would you handle this situation?"
        else:
            return "I'm concerned about your pricing strategy. Your competitors are offering similar products at 30% lower prices. How do you justify your pricing, and what's your plan to compete?"
