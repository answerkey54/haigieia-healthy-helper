# Speech to Text Module
## Uses OpenAPI Whisper (https://github.com/openai/whisper)

# Installation
### Make sure Rust is installed (https://www.rust-lang.org/learn/get-started)
'''
# Make sure the tokenizers can be built with Rust
pip install setuptools-rust
'''

### Install ffmpeg (used for the audio files)
'''
# on Ubuntu or Debian
sudo apt update && sudo apt install ffmpeg

# on Arch Linux
sudo pacman -S ffmpeg

# on MacOS using Homebrew (https://brew.sh/)
brew install ffmpeg

# on Windows using Chocolatey (https://chocolatey.org/)
choco install ffmpeg

# on Windows using Scoop (https://scoop.sh/)
scoop install ffmpeg
'''

### Install Whisper
'''
pip install git+https://github.com/openai/whisper.git 
'''



