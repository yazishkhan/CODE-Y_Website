from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import requests
from datetime import datetime
import os
import time
import uuid

        # Import configuration for the api communication i need to call it for json
from config import JUDGE0_API_KEY

app = Flask(__name__)

        # New: Secret key for session management and making the session for diff user....
app.secret_key = 'orPUu+br5JseZvasMHSjBjbpt6qqKBZY'

    # New: MariaDB connection URI for my kali machine
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:password@localhost/coding_web"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Flask-Mail configuration
#app.config['MAIL_SERVER'] = 'smtp.gmail.com'
#app.config['MAIL_PORT'] = 587
#app.config['MAIL_USE_TLS'] = True
#app.config['MAIL_USERNAME'] = "EMAIL"
#app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

db = SQLAlchemy(app)
mail = Mail(app)

    # Database model for storing the output
class CodeSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    output = db.Column(db.Text, nullable=False) # Changed from source_code to output
    language_id = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<CodeSubmission {self.id}>'

@app.before_request
def make_session_permanent():
    session.permanent = True

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/coding_window')
def coding_window():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    
    user_id = session['user_id']
    
    # Retrieve the last 2 code submissions for the user
    previous_codes = CodeSubmission.query.filter_by(user_id=user_id).order_by(CodeSubmission.timestamp.desc()).limit(2).all()
    
    return render_template('coding_window.html', previous_codes=previous_codes)

@app.route('/run_code', methods=['POST'])
def run_code():
    data = request.json
    source_code = data.get('code')
    language_id = data.get('language_id')
    user_input = data.get('input')
    
    user_id = session.get('user_id', 'guest_user')
    
    headers = {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    }

    payload = {
        "source_code": source_code,
        "language_id": language_id,
        "stdin": user_input
    }
    
    url = "https://judge0-ce.p.rapidapi.com/submissions"
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        
        try:
            token = response.json().get('token')
        except requests.exceptions.JSONDecodeError:
            return jsonify({
                'output': 'Error from Judge0 API: Invalid response format. Please check your API key and connection.',
                'status': 'error'
            }), 500

        url_status = f"{url}/{token}?base64_encoded=false&fields=status_id,stdout,stderr,compile_output,time,memory"
        
        while True:
            result_response = requests.get(url_status, headers=headers)
            result_response.raise_for_status()
            
            try:
                result = result_response.json()
            except requests.exceptions.JSONDecodeError:
                return jsonify({
                    'output': 'Error from Judge0 API: Invalid response format during polling.',
                    'status': 'error'
                }), 500

            if 'status_id' not in result:
                 return jsonify({
                    'output': f"Unexpected API response: {result}",
                    'status': 'error'
                }), 500
            
            status_id = result['status_id']
            if status_id <= 2:
                time.sleep(1)
            else:
                break
        
        output = result.get('stdout') or result.get('stderr') or result.get('compile_output')

            # New: Save the output to the database ------ for web interaction
        new_submission = CodeSubmission(user_id=user_id, output=output, language_id=language_id)
        db.session.add(new_submission)
        db.session.commit()
    
        # Deletion logic to keep only the last two submissions remember db session ok .......
        all_user_codes = CodeSubmission.query.filter_by(user_id=user_id).order_by(CodeSubmission.timestamp.asc()).all()
        if len(all_user_codes) > 2:
            oldest_code = all_user_codes[0]
            db.session.delete(oldest_code)
            db.session.commit()
        
        return jsonify({
            'output': output,
            'status': 'success'
        })
    except requests.exceptions.RequestException as e:
        return jsonify({
            'output': f"Error: {e}",
            'status': 'error'
        }), 500

@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.json
    subject = data.get('subject')
    body = data.get('body')
    user_email = data.get('email')

    try:
        msg = Message(subject, sender=user_email, recipients=["Add-Your-Email"])
        msg.body = f"From: {user_email}\n\n{body}"
        mail.send(msg)
        return jsonify({'message': 'Email sent successfully!'}), 200
    except Exception as e:
        return jsonify({'message': f'Failed to send email: {str(e)}'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True,host='0.0.0.0') # host exposing the localhost......... to acces the web on same network.......
