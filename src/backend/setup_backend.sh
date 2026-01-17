#!/usr/bin/env bash
set -e  # bricht ab bei Fehlern


# venv
if [ ! -d "venv" ]; then
    echo "make venv"
    python3 -m venv venv
else
    echo "venv existiert bereits"
fi

source venv/bin/activate

# abhängigkeiten installieren
pip install --upgrade pip

if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "requirements.txt nicht gefunden"
    pip install fastapi uvicorn sqlalchemy
fi

uvicorn main:app --reload
