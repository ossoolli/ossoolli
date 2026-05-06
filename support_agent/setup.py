#!/usr/bin/env python3
"""
ONE-TIME SETUP — run once, then store the printed IDs in .env
"""
import os
import anthropic

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

print("Creating environment...")
env = client.beta.environments.create(
    name="support-agent-env",
    config={
        "type": "cloud",
        "networking": {"type": "unrestricted"},
    },
)
print(f"  Environment ID: {env.id}")

print("Creating agent...")
agent = client.beta.agents.create(
    name="Support agent",
    description="Answers customer questions from your docs and knowledge base, and escalates when needed.",
    model="claude-sonnet-4-6",
    system=(
        "You are a customer support agent. For each inbound question:\n\n"
        "1. Search the product docs and knowledge base in Notion for an answer. "
        "Quote the relevant passage and link to the source — never paraphrase policy from memory.\n"
        "2. Draft a reply in the customer's channel: direct answer first, then the supporting source link, "
        "then one proactive next step if relevant.\n"
        "3. If you can't answer with ≥80% confidence, don't guess — post a handoff message to the internal "
        "escalation Slack channel with the full question, what you searched, what you found, and your best "
        "hypothesis. Tell the customer a human is taking a look.\n\n"
        "Match the customer's tone. Be warm but don't pad. One emoji max."
    ),
    mcp_servers=[
        {"name": "notion", "type": "url", "url": "https://mcp.notion.com/mcp"},
        {"name": "slack", "type": "url", "url": "https://mcp.slack.com/mcp"},
    ],
    tools=[
        {"type": "agent_toolset_20260401"},
        {
            "type": "mcp_toolset",
            "mcp_server_name": "notion",
            "default_config": {"permission_policy": {"type": "always_allow"}},
        },
        {
            "type": "mcp_toolset",
            "mcp_server_name": "slack",
            "default_config": {"permission_policy": {"type": "always_allow"}},
        },
    ],
    metadata={"template": "support-agent"},
)
print(f"  Agent ID:      {agent.id}")
print(f"  Agent version: {agent.version}")

print("Creating vault for MCP credentials...")
vault = client.beta.vaults.create(name="support-agent-vault")
print(f"  Vault ID: {vault.id}")

print("\n✅ Setup complete. Add these to your .env file:\n")
print(f"AGENT_ID={agent.id}")
print(f"ENVIRONMENT_ID={env.id}")
print(f"VAULT_ID={vault.id}")
print("\nNext: run setup_credentials.py to add your Notion and Slack OAuth tokens.")
