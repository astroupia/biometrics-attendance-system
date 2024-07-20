# Use Node.js as the base image (which already includes npm)
FROM node:14

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    FLASK_ENV=development \
    FLASK_DEBUG=1

# Install system dependencies and Python
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libboost-python-dev \
    libboost-thread-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libsm6 \
    libxext6 \
    libxrender-dev \
    curl \
    libasound2-dev \
    && rm -rf /var/lib/apt/lists/*

# Set up the working directory
WORKDIR /app

# Copy the entire project directory
COPY . /app

# Install Python dependencies
RUN pip3 install --upgrade pip && \
    pip3 install -r requirements.txt

# Install Node.js dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Create a start script
RUN echo '#!/bin/bash\n\
python3 .app/app.py & \
npm start' > /app/start.sh && chmod +x /app/start.sh

# Expose ports (adjust if your app uses different ports)
EXPOSE 5000 3000

# Start both applications
CMD ["/app/start.sh"]
