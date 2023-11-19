#!/bin/bash
export PATH="/root/.local/bin:$PATH" # access poetry

echo "Running CyCARLA Server from Docker"

cd /workspaces/cycarla/cycarla-server

echo "Will connect to Carla Server at $CARLA_SIM_IP:$CARLA_SIM_PORT"

poetry install
poetry run python3 cycarla_server/main.py
