#!/usr/bin/env python3
"""
Add Notion and Slack OAuth credentials to the vault.
Run this after setup.py once you have your OAuth tokens.

Required env vars:
  VAULT_ID              — from setup.py output
  NOTION_ACCESS_TOKEN   — Notion OAuth access token
  NOTION_REFRESH_TOKEN  — Notion OAuth refresh token
  NOTION_CLIENT_ID      — your Notion OAuth app client ID
  SLACK_ACCESS_TOKEN    — Slack OAuth access token
  SLACK_REFRESH_TOKEN   — Slack OAuth refresh token
  SLACK_CLIENT_ID       — your Slack OAuth app client ID
  SLACK_CLIENT_SECRET   — your Slack OAuth app client secret
"""
import os
import anthropic

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
vault_id = os.environ["VAULT_ID"]

print("Adding Notion credential...")
notion_cred = client.beta.vaults.credentials.create(
    vault_id,
    display_name="Notion MCP",
    auth={
        "type": "mcp_oauth",
        "mcp_server_url": "https://mcp.notion.com/mcp",
        "access_token": os.environ["NOTION_ACCESS_TOKEN"],
        "refresh": {
            "refresh_token": os.environ["NOTION_REFRESH_TOKEN"],
            "client_id": os.environ["NOTION_CLIENT_ID"],
            "token_endpoint": "https://api.notion.com/v1/oauth/token",
            "token_endpoint_auth": {"type": "none"},
        },
    },
)
print(f"  Notion credential ID: {notion_cred.id}")

print("Adding Slack credential...")
slack_cred = client.beta.vaults.credentials.create(
    vault_id,
    display_name="Slack MCP",
    auth={
        "type": "mcp_oauth",
        "mcp_server_url": "https://mcp.slack.com/mcp",
        "access_token": os.environ["SLACK_ACCESS_TOKEN"],
        "refresh": {
            "refresh_token": os.environ["SLACK_REFRESH_TOKEN"],
            "client_id": os.environ["SLACK_CLIENT_ID"],
            "token_endpoint": "https://slack.com/api/oauth.v2.access",
            "token_endpoint_auth": {
                "type": "client_secret_post",
                "client_secret": os.environ["SLACK_CLIENT_SECRET"],
            },
        },
    },
)
print(f"  Slack credential ID: {slack_cred.id}")

print("\n✅ Credentials added. The vault is ready.")
