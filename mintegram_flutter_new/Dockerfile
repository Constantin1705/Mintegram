# Flutter Web Dockerfile
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Flutter
RUN git clone https://github.com/flutter/flutter.git -b stable /flutter
ENV PATH="/flutter/bin:${PATH}"

# Pre-download Flutter dependencies
RUN flutter precache --web
RUN flutter config --enable-web

WORKDIR /app

# Copy pubspec files
COPY pubspec.yaml pubspec.lock* ./

# Copy lib directory
COPY lib/ ./lib/

# Copy web directory
COPY web/ ./web/

# Copy assets if they exist
COPY assets/ ./assets/ || true

# Debug: Verify files
RUN echo "=== Checking copied files ===" && \
    ls -la /app/pubspec.yaml && \
    ls -la /app/lib/main.dart && \
    echo "Files copied successfully"

# Get dependencies
RUN flutter pub get

# Build Flutter web app
RUN flutter build web --release

EXPOSE 8080

# Serve the built web app
CMD ["flutter", "run", "-d", "web-server", "--web-port=8080", "--web-hostname=0.0.0.0"]
