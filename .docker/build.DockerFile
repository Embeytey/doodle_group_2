FROM alpine:latest

LABEL org.opencontainers.image.source=https://github.com/doodle-user-friendly-team/doodle-user-friendly
LABEL org.opencontainers.image.description="The user-friendly, simul-planning version of Doodle"

WORKDIR /app

COPY doodle_django/ .
COPY requirements.txt .
COPY .docker/start_script.sh .

# install needed dependencies
RUN apk update && \
    apk add --no-cache npm python3 py3-pip && \
    python -m ensurepip && \
    pip install --upgrade pip setuptools && \
    pip install -r requirements.txt && \
    npm ci --prefix ./doodle_react && \
    chmod +x start_script.sh

EXPOSE 3000/tcp
EXPOSE 3000/udp
EXPOSE 8000/tcp
EXPOSE 8000/udp

ENTRYPOINT [ "./start_script.sh" ]
