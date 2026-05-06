#!/usr/bin/env python3
"""
Runtime — create a session and handle a customer question.

Usage:
  python run.py "How do I reset my password?"

Required env vars:
  ANTHROPIC_API_KEY
  AGENT_ID        — from setup.py output
  ENVIRONMENT_ID  — from setup.py output
  VAULT_ID        — from setup.py output
"""
import os
import sys
import anthropic


def run_support_session(question: str) -> None:
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    agent_id = os.environ["AGENT_ID"]
    environment_id = os.environ["ENVIRONMENT_ID"]
    vault_id = os.environ["VAULT_ID"]

    print(f"Starting session for: {question!r}\n")

    session = client.beta.sessions.create(
        agent=agent_id,
        environment_id=environment_id,
        vault_ids=[vault_id],
        title=f"Support: {question[:60]}",
    )

    # Stream-first: open before sending to avoid missing early events
    with client.beta.sessions.events.stream(session_id=session.id) as stream:
        client.beta.sessions.events.send(
            session_id=session.id,
            events=[
                {
                    "type": "user.message",
                    "content": [{"type": "text", "text": question}],
                }
            ],
        )

        for event in stream:
            if event.type == "agent.message":
                for block in event.content:
                    if block.type == "text":
                        print(block.text, end="", flush=True)

            elif event.type == "agent.mcp_tool_use":
                tool_label = f"{event.mcp_server_name}/{event.name}"
                print(f"\n[tool: {tool_label}]", flush=True)

            elif event.type == "session.status_idle":
                stop_type = event.stop_reason.type if event.stop_reason else "unknown"
                if stop_type != "requires_action":
                    print(f"\n\n[Session idle — {stop_type}]")
                    break

            elif event.type == "session.status_terminated":
                print("\n[Session terminated]")
                break

            elif event.type == "session.error":
                print(f"\n[Error: {event}]")
                break


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run.py \"<customer question>\"")
        sys.exit(1)

    question = " ".join(sys.argv[1:])
    run_support_session(question)
