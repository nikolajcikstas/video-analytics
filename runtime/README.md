# Runtime stubs

These files are prepared for the backend contract:

- `models/PPE_312_yolo12_l.pt` is the local model file.
- `videos/test-camera-source.mp4` is the local camera source extracted from `test_video.zip`.
- `detection.config.json` disables RTSP and points detection to the project-local video path.
- `add_models/PPE_312_yolo12_l.model.json` is the model registration payload for the future `add_models` import.

The real `fill db` command is not present in this frontend workspace, so it must be run from the backend repository when that repository is available.
