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

# Copy entire directory (respecting .dockerignore)
COPY . .

# Check if pubspec.yaml exists
RUN if [ ! -f ./pubspec.yaml ]; then \
      echo "ERROR: pubspec.yaml not found in $(pwd)"; \
      echo "Available files:"; \
      ls -la /app/; \
      exit 1; \
    fi

# Check if lib directory exists
RUN if [ ! -d ./lib ]; then \
      echo "ERROR: lib/ directory not found"; \
      exit 1; \
    fi

# Check if main.dart exists
RUN if [ ! -f ./lib/main.dart ]; then \
      echo "ERROR: lib/main.dart not found"; \
      ls -la ./lib/; \
      exit 1; \
    fi && \
    echo "✓ All required files found"

# Get dependencies
RUN flutter pub get

# Build Flutter web app
RUN flutter build web --release

EXPOSE 8080

# Serve the built web app
CMD ["flutter", "run", "-d", "web-server", "--web-port=8080", "--web-hostname=0.0.0.0"]
