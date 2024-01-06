# Use Ubuntu latest as the base image
FROM ubuntu:22.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Update apt repositories and install necessary packages
# Replace 'your-packages' with the actual list of packages you need
RUN apt-get update && apt-get install -y \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Install bluez to access bluetoothctl from container
RUN apt-get update && apt-get install -y \
    bluez \
    && rm -rf /var/lib/apt/lists/*

# Install poetry
COPY pyproject.toml /
RUN apt-get update \
    && apt-get install -y curl python3-pip  \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && export PATH="/root/.local/bin:$PATH" \
    && poetry install

# Install fonts for pygame
RUN apt-get update \ 
    && apt-get install -y fontconfig \
    && rm -rf /var/lib/apt/lists/*

# Install cv2 dependency
RUN apt-get update \
    && apt-get install -y libgl1 \
    && rm -rf /var/lib/apt/lists/*

RUN PATH="/root/.local/bin:$PATH"

# Run any additional commands here if necessary

# Set the default command to bash
CMD ["bash"]
