# Python backend contract stubs

The frontend is currently rendered from the exact Figma SVG screens. These files define the contract that a future Python backend can implement without changing the visual frontend.

Expected base URL: `/api`

Required endpoints:

- `GET /api/detections`
- `GET /api/detections/{id}`
- `GET /api/system/messages`
- `GET /api/statistics`
- `GET /api/cameras`
- `GET /api/models`

Runtime assets already prepared:

- model: `runtime/models/PPE_312_yolo12_l.pt`
- local camera video: `runtime/videos/test-camera-source.mp4`
- detection config: `runtime/detection.config.json`

The backend should read `runtime/detection.config.json`, use `model.id = ppe_312_yolo12_l`, and use the local video path instead of RTSP.
