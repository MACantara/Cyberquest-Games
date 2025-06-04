from flask import Flask, render_template, redirect, url_for, request, session
import sqlite3
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', os.urandom(24))

# Use in-memory database for serverless environment
def get_db_connection():
    conn = sqlite3.connect(':memory:')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            progress INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    return conn

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/campaign")
def campaign():
    # Example: get user progress if logged in
    progress = session.get("progress", 0)
    return render_template("campaign.html", progress=progress)

@app.route("/ending")
def ending():
    return render_template("levels/ending/ending.html")

@app.route("/level/<int:level_id>")
def level(level_id):
    # Route to specific level templates
    if level_id == 1:
        return render_template("levels/level-1/level-1.html", level_id=level_id)
    elif level_id == 2:
        return render_template("levels/level-2/level-2.html", level_id=level_id)
    elif level_id == 3:
        return render_template("levels/level-3/level-3.html", level_id=level_id)
    elif level_id == 4:
        return render_template("levels/level-4/level-4.html", level_id=level_id)
    elif level_id == 5:
        return render_template("levels/level-5/level-5.html", level_id=level_id)
    elif level_id == 6:
        return render_template("levels/level-6/level-6.html", level_id=level_id)
    elif level_id == 7:
        return render_template("levels/level-7/level-7.html", level_id=level_id)
    elif level_id == 8:
        return render_template("levels/level-8/level-8.html", level_id=level_id)
    elif level_id == 9:
        return render_template("levels/level-9/level-9.html", level_id=level_id)
    elif level_id == 10:
        return render_template("levels/level-10/level-10.html", level_id=level_id)
    else:
        # For levels not yet implemented, use generic template
        return render_template("levels/level.html", level_id=level_id)

# For Vercel deployment
if __name__ == "__main__":
    app.run(debug=True)

# Export the app for Vercel
def handler(request):
    return app(request.environ, lambda status, headers: None)
