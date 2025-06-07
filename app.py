from flask import Flask, render_template, redirect, url_for, request, session
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', os.urandom(24))

@app.route("/")
def index():
    return render_template("index.html", is_level_page=False)

@app.route("/campaign")
def campaign():
    # Example: get user progress if logged in
    progress = session.get("progress", 0)
    return render_template("campaign.html", progress=progress, is_level_page=False)

@app.route("/ending")
def ending():
    return render_template("levels/ending/ending.html", is_level_page=True)

@app.route("/level/<int:level_id>")
def level(level_id):
    # Route to specific level templates - all levels use hamburger navigation
    if level_id == 1:
        return render_template("levels/level-1/level-1.html", level_id=level_id, is_level_page=True)
    elif level_id == 2:
        return render_template("levels/level-2/level-2.html", level_id=level_id, is_level_page=True)
    elif level_id == 3:
        return render_template("levels/level-3/level-3.html", level_id=level_id, is_level_page=True)
    elif level_id == 4:
        return render_template("levels/level-4/level-4.html", level_id=level_id, is_level_page=True)
    elif level_id == 5:
        return render_template("levels/level-5/level-5.html", level_id=level_id, is_level_page=True)
    elif level_id == 6:
        return render_template("levels/level-6/level-6.html", level_id=level_id, is_level_page=True)
    elif level_id == 7:
        return render_template("levels/level-7/level-7.html", level_id=level_id, is_level_page=True)
    elif level_id == 8:
        return render_template("levels/level-8/level-8.html", level_id=level_id, is_level_page=True)
    elif level_id == 9:
        return render_template("levels/level-9/level-9.html", level_id=level_id, is_level_page=True)
    elif level_id == 10:
        return render_template("levels/level-10/level-10.html", level_id=level_id, is_level_page=True)
    else:
        # For levels not yet implemented, use generic template
        return render_template("levels/level.html", level_id=level_id, is_level_page=True)

# For local development
if __name__ == "__main__":
    app.run(debug=True)
