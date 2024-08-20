import flask
from flask import Flask, request, render_template
from flask_cors import CORS
import os
import subprocess

app = Flask(__name__)
CORS(app)

@app.route("/")
def main():
    return render_template("main.html")

@app.route("/camera/<userid>/<isMob>", methods=['GET'])
@app.route("/camera/<userid>/<isMob>/<androidPath>", methods=['GET'])
def camera(userid, isMob, androidPath="empty"):
    print("android path python app.py :", androidPath)
    subprocess.Popen(['python', 'app/main.py', userid, isMob, androidPath])
    return '1'

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True, use_reloader=False)
