#!/bin/bash
export PATH="/root/.local/bin:$PATH" # access poetry

echo "Running CyCARLA Server from Docker"

cd /workspaces/cycarla/cycarla-server

poetry install
poetry run python3 cycarla_server/main.py
