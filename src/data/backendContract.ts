export const backendContract = {
  apiBaseUrl: "/api",
  model: {
    id: "ppe_312_yolo12_l",
    path: "runtime/models/PPE_312_yolo12_l.pt"
  },
  camera: {
    id: "cam-local-312",
    sourceType: "file",
    sourcePath: "runtime/videos/test-camera-source.mp4",
    loop: true,
    rtspUrl: null
  },
  detection: {
    confidenceThreshold: 0.34,
    iouThreshold: 0.48,
    writeFrames: true,
    writeMode: "continuous",
    restartOnEnd: true
  },
  endpoints: {
    detections: "/detections",
    detectionDetail: "/detections/:id",
    statistics: "/statistics",
    systemMessages: "/system/messages",
    models: "/models",
    cameras: "/cameras"
  }
} as const;
