import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

from tools.inventory_tools import get_low_stock_inventory
from tools.supplier_tools import get_product_suppliers


# =========================================================
# 1. LOAD ENVIRONMENT
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not configured")


# =========================================================
# 2. GEMINI CLIENT
# =========================================================

client = genai.Client(api_key=api_key)


# =========================================================
# 3. TOOL DECLARATIONS
# =========================================================

supplychain_tools = types.Tool(
    function_declarations=[
        # -------------------------------------------------
        # Tool 1: Low Stock Inventory
        # -------------------------------------------------
        types.FunctionDeclaration(
            name="get_low_stock_inventory",
            description=(
                "Returns products whose current stock is "
                "at or below their reorder level. "
                "Use this when the user asks about low-stock, "
                "reorder, or inventory-risk products."
            ),
            parameters=types.Schema(
                type="OBJECT",
                properties={}
            )
        ),

        # -------------------------------------------------
        # Tool 2: Product Suppliers
        # -------------------------------------------------
        types.FunctionDeclaration(
            name="get_product_suppliers",
            description=(
                "Returns all suppliers that provide a specific "
                "product. Results include supplier name, price, "
                "delivery lead time, and minimum order quantity."
            ),
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "product_id": types.Schema(
                        type="INTEGER",
                        description="The database ID of the product."
                    )
                },
                required=["product_id"]
            )
        )
    ]
)


# =========================================================
# 4. TOOL MAPPING
# =========================================================

AVAILABLE_TOOLS = {
    "get_low_stock_inventory": get_low_stock_inventory,
    "get_product_suppliers": get_product_suppliers
}


# =========================================================
# 5. SUPPLYCHAIN AGENT
# =========================================================

def ask_supplychain_agent(user_message: str):

    # Conversation history sent to Gemini
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=user_message)
            ]
        )
    ]

    # Safety limit so the agent cannot loop forever
    max_tool_calls = 10

    for _ in range(max_tool_calls):

        # -------------------------------------------------
        # Ask Gemini what to do next
        # -------------------------------------------------

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                tools=[supplychain_tools],
                system_instruction=(
                    "You are SupplyChain AI, an intelligent "
                    "supply-chain assistant.\n\n"

                    "You have access to tools that provide real "
                    "inventory and supplier information.\n\n"

                    "Always use tools when the user asks about "
                    "actual inventory, stock levels, suppliers, "
                    "prices, lead times, or other database information.\n\n"

                    "Never invent inventory or supplier data.\n\n"

                    "If additional information is needed, continue "
                    "using the available tools before answering.\n\n"

                    "Give a clear and concise final answer after "
                    "you have gathered the required information."
                )
            )
        )

        # -------------------------------------------------
        # Add Gemini response to conversation
        # -------------------------------------------------

        contents.append(response.candidates[0].content)

        # -------------------------------------------------
        # Find requested tool calls
        # -------------------------------------------------

        function_calls = []

        for part in response.candidates[0].content.parts:

            if part.function_call:
                function_calls.append(part.function_call)

        # -------------------------------------------------
        # No tool call = Gemini has finished
        # -------------------------------------------------

        if not function_calls:

            return {
                "type": "final",
                "response": response.text
            }

        # -------------------------------------------------
        # Execute requested tools
        # -------------------------------------------------

        for function_call in function_calls:

            tool_name = function_call.name
            tool_args = function_call.args or {}

            print(
                f"[AGENT] Calling tool: {tool_name}"
            )

            print(
                f"[AGENT] Arguments: {tool_args}"
            )

            # ---------------------------------------------
            # Check that tool exists
            # ---------------------------------------------

            if tool_name not in AVAILABLE_TOOLS:

                tool_result = {
                    "error": f"Unknown tool: {tool_name}"
                }

                print(
                    f"[AGENT] Unknown tool: {tool_name}"
                )

            else:

                try:

                    tool_function = AVAILABLE_TOOLS[tool_name]

                    # Execute actual Python function
                    tool_result = tool_function(**tool_args)

                    print(
                        f"[AGENT] Tool completed: {tool_name}"
                    )

                except Exception as error:

                    print(
                        f"[AGENT] Tool failed: {error}"
                    )

                    tool_result = {
                        "error": str(error)
                    }

            # ---------------------------------------------
            # Send tool result back to Gemini
            # ---------------------------------------------

            contents.append(
                types.Content(
                    role="tool",
                    parts=[
                        types.Part.from_function_response(
                            name=tool_name,
                            response={
                                "result": tool_result
                            }
                        )
                    ]
                )
            )

    # =====================================================
    # Agent exceeded tool-call limit
    # =====================================================

    return {
        "type": "error",
        "message": (
            "Agent reached the maximum tool-call limit "
            "without completing the request."
        )
    }