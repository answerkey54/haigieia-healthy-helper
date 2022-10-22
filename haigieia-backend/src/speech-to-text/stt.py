import whisper
import sys
 
def speech_to_text():
    
    path = sys.argv[1]
    model_type = sys.argv[2]
    print("Path ", path)
    # load the model
    model = whisper.load_model(model_type)
    audio = whisper.load_audio(path)
    audio = whisper.pad_or_trim(audio)
    mel = whisper.log_mel_spectrogram(audio).to(model.device)
    options = whisper.DecodingOptions(fp16=False)
    result = whisper.decode(model, mel, options)
    print(str(result.text))
    sys.stdout.flush()

if __name__ == "__main__":
    speech_to_text()
   
