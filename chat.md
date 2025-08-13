class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    type: Literal["text", "image"]
    timestamp: int


class ChatRequest(BaseModel):
    message: str
    timestamp: int
    history: List[Message]
    preferences: Optional[Dict[str, Any]] = None
    request_id: Optional[str] = None  # Optional request ID from frontend
    integration_in_progress: bool = False
    image_url: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: int
    settings_updated: bool = False
    integration_in_progress: bool = False


@router.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: Request,
    user_id: Annotated[str, Depends(get_current_user)],
    supabase: Annotated[SupabaseClient, Depends(get_supabase_client)],
    json_data: str = Form(...),
) -> ChatResponse:
    try:
        request_data = ChatRequest(**json.loads(json_data))
        image_url = None  # Initialize image_url variable for scope access throughout function
        

