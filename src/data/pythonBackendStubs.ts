export type DetectionScreen = {
  id: string;
  title: string;
  file: string;
  width: number;
  height: number;
};

export type DetectionStatus = "pending" | "violation" | "ai_error" | "expired";
export type DetectionFilterKey =
  | "forbiddenZones"
  | "noHelmet"
  | "noGlasses"
  | "noGloves"
  | "noUniform"
  | "jacketOpen"
  | "uniformUntucked"
  | "techOps"
  | "equipment";

export type ReviewDto = {
  level: "l1" | "l2" | "l3";
  reviewer: string;
  position: string;
  status: Exclude<DetectionStatus, "pending">;
  reviewedAt: string;
  comment?: string;
  violators?: string[];
};

export type DetectionDto = {
  id: string;
  title: string;
  type: string;
  filterKey: DetectionFilterKey;
  status: DetectionStatus;
  objectName: string;
  master: string;
  brigade: string;
  zoneName: string;
  zoneKey: "zone1" | "zone2";
  cameraId: string;
  cameraName: string;
  cameraFilterKey: "cam001" | "cam002" | "cam003" | "cam004" | "cam005" | "cam006";
  detectedAt: string;
  deadlineAt: string | null;
  receivedAt: string;
  imageUrl: string;
  videoUrl?: string;
  imagePosition: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  violators: string[];
  reviews: ReviewDto[];
};

export const MOCK_NOW = "2027-03-15T12:02:00+03:00";

export const mockDetections: DetectionDto[] = [
  {
    id: "A79099",
    title: "Нет каски",
    type: "Средства индивидуальной защиты",
    filterKey: "noHelmet",
    status: "pending",
    objectName: "Осташковичи 123",
    master: "Иванов С. Р.",
    brigade: "№2",
    zoneName: "Зона №1",
    zoneKey: "zone1",
    cameraId: "CAM005",
    cameraName: "Камера у входа",
    cameraFilterKey: "cam005",
    detectedAt: "2027-03-15T12:01:00+03:00",
    receivedAt: "2027-03-15T12:01:00+03:00",
    deadlineAt: "2027-03-16T12:02:00+03:00",
    imageUrl: "/detection-camera.png",
    videoUrl: "/media/detection-source.mp4",
    imagePosition: "68% 31%",
    boundingBox: { x: 48, y: 29, width: 22, height: 45 },
    violators: [],
    reviews: []
  },
  {
    id: "C79095",
    title: "Установка ниппеля в муфту трубы без смазки",
    type: "Оборудование или инструмент",
    filterKey: "equipment",
    status: "pending",
    objectName: "Осташковичи 123",
    master: "Иванов С. Р.",
    brigade: "№2",
    zoneName: "Зона №1",
    zoneKey: "zone1",
    cameraId: "CAM004",
    cameraName: "Камера у оборудования",
    cameraFilterKey: "cam004",
    detectedAt: "2027-03-15T08:02:00+03:00",
    receivedAt: "2027-03-15T08:02:00+03:00",
    deadlineAt: "2027-03-15T12:58:22+03:00",
    imageUrl: "/detection-camera.png",
    imagePosition: "54% 27%",
    violators: [],
    reviews: []
  },
  {
    id: "A79098",
    title: "Нет каски",
    type: "Средства индивидуальной защиты",
    filterKey: "noHelmet",
    status: "pending",
    objectName: "Осташковичи 123",
    master: "Иванов С. Р.",
    brigade: "№2",
    zoneName: "Зона №2",
    zoneKey: "zone2",
    cameraId: "CAM001",
    cameraName: "Камера у оборудования",
    cameraFilterKey: "cam001",
    detectedAt: "2027-03-15T07:42:00+03:00",
    receivedAt: "2027-03-15T07:42:00+03:00",
    deadlineAt: "2027-03-17T12:02:00+03:00",
    imageUrl: "/detection-camera.png",
    imagePosition: "69% 31%",
    violators: [],
    reviews: []
  },
  {
    id: "A79097",
    title: "Специальная куртка не застёгнута",
    type: "Средства индивидуальной защиты",
    filterKey: "jacketOpen",
    status: "pending",
    objectName: "Осташковичи 123",
    master: "Иванов С. Р.",
    brigade: "№2",
    zoneName: "Зона №2",
    zoneKey: "zone2",
    cameraId: "CAM002",
    cameraName: "Станок",
    cameraFilterKey: "cam002",
    detectedAt: "2027-03-14T14:52:35+03:00",
    receivedAt: "2027-03-14T14:52:35+03:00",
    deadlineAt: "2027-03-18T12:02:00+03:00",
    imageUrl: "/detection-camera.png",
    imagePosition: "24% 45%",
    violators: [],
    reviews: [
      {
        level: "l1",
        reviewer: "Иванов С. Р.",
        position: "Мастер буровой • Бригада № 2",
        status: "violation",
        reviewedAt: "2027-03-14T16:45:00+03:00",
        comment: "Цех плохо освещён, сложно определить, что происходит в кадре",
        violators: ["Константинопольский С. Р.", "Романов И. Р."]
      },
      {
        level: "l2",
        reviewer: "Захаров-Добровольский А. В.",
        position: "Заместитель начальника ЦИТС",
        status: "ai_error",
        reviewedAt: "2027-03-15T12:02:00+03:00",
        comment: "Цех действительно плохо освещён, скорее всего сотрудник не нарушил"
      }
    ]
  },
  {
    id: "A79096",
    title: "Нет каски",
    type: "Средства индивидуальной защиты",
    filterKey: "noHelmet",
    status: "violation",
    objectName: "Осташковичи 123",
    master: "Иванов С. Р.",
    brigade: "№2",
    zoneName: "Зона №1",
    zoneKey: "zone1",
    cameraId: "CAM202",
    cameraName: "Камера у стола",
    cameraFilterKey: "cam002",
    detectedAt: "2027-03-10T14:48:52+03:00",
    receivedAt: "2027-03-10T14:48:52+03:00",
    deadlineAt: null,
    imageUrl: "/detection-camera.png",
    imagePosition: "68% 31%",
    violators: ["Семёнов А. В. • 12345678"],
    reviews: [{ level: "l1", reviewer: "Иванов С. Р.", position: "Мастер буровой • Бригада № 2", status: "violation", reviewedAt: "2027-03-14T16:45:00+03:00", comment: "Цех плохо освещён, сложно определить, что происходит в кадре", violators: ["Константинопольский С. Р.", "Романов И. Р."] }]
  },
  {
    id: "B79095",
    title: "Нахождение на столе ротора при работе талевой системы при её подъёме",
    type: "Запрещённые зоны",
    filterKey: "forbiddenZones",
    status: "violation",
    objectName: "Осташковичи 123",
    master: "Иванов С. Р.",
    brigade: "№2",
    zoneName: "Зона №1",
    zoneKey: "zone1",
    cameraId: "CAM005",
    cameraName: "Камера у входа",
    cameraFilterKey: "cam005",
    detectedAt: "2027-03-10T13:48:44+03:00",
    receivedAt: "2027-03-10T13:48:44+03:00",
    deadlineAt: null,
    imageUrl: "/detection-camera.png",
    imagePosition: "50% 62%",
    violators: [],
    reviews: []
  },
  {
    id: "D79095",
    title: "Работа без удерживающих металлических крючков",
    type: "Технические операции",
    filterKey: "techOps",
    status: "violation",
    objectName: "Осташковичи 123",
    master: "Иванов С. Р.",
    brigade: "№2",
    zoneName: "Зона №1",
    zoneKey: "zone1",
    cameraId: "THV21",
    cameraName: "Тепловизор у оборудования",
    cameraFilterKey: "cam004",
    detectedAt: "2027-03-09T12:10:09+03:00",
    receivedAt: "2027-03-09T12:10:09+03:00",
    deadlineAt: null,
    imageUrl: "/detection-camera.png",
    imagePosition: "50% 62%",
    violators: ["Иванов И. Р. • 12345678"],
    reviews: []
  },
  {
    id: "A79095",
    title: "Специальная одежда не заправлена",
    type: "Средства индивидуальной защиты",
    filterKey: "uniformUntucked",
    status: "ai_error",
    objectName: "Осташковичи 123",
    master: "Иванов С. Р.",
    brigade: "№2",
    zoneName: "Зона №1",
    zoneKey: "zone1",
    cameraId: "CAM202",
    cameraName: "Камера у стола",
    cameraFilterKey: "cam002",
    detectedAt: "2027-03-09T16:33:20+03:00",
    receivedAt: "2027-03-09T16:33:20+03:00",
    deadlineAt: null,
    imageUrl: "/detection-camera.png",
    imagePosition: "24% 45%",
    violators: [],
    reviews: []
  }
];

export const pythonBackendContract = {
  version: "python-backend-stub/v2",
  baseUrl: "/api",
  endpoints: {
    detections: { method: "GET", path: "/api/detections" },
    detectionById: { method: "GET", path: "/api/detections/{id}" },
    reviewDetection: { method: "POST", path: "/api/detections/{id}/reviews" },
    detectionEvents: { method: "GET", path: "/api/events/detections", transport: "sse" },
    systemMessages: { method: "GET", path: "/api/system/messages" },
    statistics: { method: "GET", path: "/api/statistics" }
  },
  model: { id: "ppe_312_yolo12_l", localPath: "runtime/models/PPE_312_yolo12_l.pt" },
  camera: { id: "cam-local-312", sourceType: "file", localPath: "runtime/videos/test-camera-source.mp4", loop: true },
  videoAnalysis: { sampleEveryFrames: 125, assumedFps: 25, event: "detection.frame.analyzed" }
} as const;
