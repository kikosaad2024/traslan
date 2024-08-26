from flask import Flask, request, redirect, url_for, render_template, send_from_directory
from moviepy.editor import VideoFileClip
import stripe
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['RESULT_FOLDER'] = 'results'

# استبدل 'YOUR_STRIPE_SECRET_KEY' بمفتاح Stripe الخاص بك
stripe.api_key = 'YOUR_STRIPE_SECRET_KEY'

def convert_to_reels(input_file, output_file):
    clip = VideoFileClip(input_file)
    short_clip = clip.subclip(0, 60)
    resized_clip = short_clip.resize(height=1920)
    resized_clip = resized_clip.crop(x_center=960, width=1080)
    resized_clip.write_videofile(output_file, codec='libx264')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_video():
    file = request.files['video']
    if file:
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], 'input_video.mp4')
        output_path = os.path.join(app.config['RESULT_FOLDER'], 'output_video.mp4')
        file.save(input_path)
        convert_to_reels(input_path, output_path)
        return redirect(url_for('success'))

@app.route('/success')
def success():
    return render_template('success.html')

@app.route('/subscribe')
def subscribe():
    return render_template('subscribe.html')

@app.route('/uploads/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/results/<filename>')
def download_result(filename):
    return send_from_directory(app.config['RESULT_FOLDER'], filename)

if __name__ == "__main__":
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    if not os.path.exists(app.config['RESULT_FOLDER']):
        os.makedirs(
