#!/bin/bash
export PATH="/root/.local/bin:$PATH" # access poetry

echo "Running CyCARLA Backend from Docker"

cd /workspaces/cycarla/cycarla-backend

echo "Will connect to Carla Backend at $CARLA_SIM_IP:$CARLA_SIM_PORT"

poetry install
poetry run python3 cycarla_backend/main.py
