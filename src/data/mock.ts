import cameraMain from "../assets/screens/camera-main.jpg";
import cameraDetection from "../assets/screens/camera-detection.jpg";
import thumb1 from "../assets/screens/thumb-1.jpg";
import thumb2 from "../assets/screens/thumb-2.jpg";
import thumb3 from "../assets/screens/thumb-3.jpg";
import thumb4 from "../assets/screens/thumb-4.jpg";
import thumb5 from "../assets/screens/thumb-5.jpg";
import thumb6 from "../assets/screens/thumb-6.jpg";

export type StatusKind = "danger" | "warning" | "info" | "muted" | "success";

export type Detection = {
  id: string;
  image: string;
  title: string;
  type: string;
  object: string;
  date: string;
  relative: string;
  master: string;
  brigade: string;
  zone: string;
  camera: string;
  l1: "Нарушение" | "Ошибка ИИ" | "Ожидает обработки";
  l2: "Нарушение" | "Ошибка ИИ" | "Ожидает обработки" | "Просрочено";
  violators: string;
  due: string;
  remaining: string;
};

export const gjl = {
  user: {
    initials: "АЗ",
    name: "Захаров-Добровольский А. В.",
    line: "Л2"
  },
  counters: {
    all: 122,
    pending: 4,
    expiring: 2,
    cameraEvents: 0
  }
};

export const tr = {
  contractVersion: "draft",
  endpointPrefix: "/api/tr/video-analytics",
  notes: "Контракт будет заменён после согласования бэкенда"
};

export const detections: Detection[] = [
  {
    id: "A79099",
    image: thumb1,
    title: "Нет каски",
    type: "Средства индивидуальной защиты",
    object: "Буровая Осташковичи 123",
    date: "10.03.2027 14:52:35",
    relative: "54 минуты назад",
    master: "Иванов С. Р.",
    brigade: "Бригада №2",
    zone: "Цех №1",
    camera: "CAM928",
    l1: "Нарушение",
    l2: "Ожидает обработки",
    violators: "—",
    due: "до 16.03.2027 12:02",
    remaining: "Осталось 1 часа"
  },
  {
    id: "A79096",
    image: thumb2,
    title: "Нет каски",
    type: "Средства индивидуальной защиты",
    object: "Буровая Осташковичи 123",
    date: "10.03.2027 14:52:35",
    relative: "2 часа назад",
    master: "Иванов С. Р.",
    brigade: "Бригада №2",
    zone: "Цех №1",
    camera: "CAM928",
    l1: "Нарушение",
    l2: "Нарушение",
    violators: "Семёнов А. В. • 12345678",
    due: "16.03.2027 12:02",
    remaining: ""
  },
  {
    id: "B79095",
    image: thumb3,
    title: "Нахождение на столе ротора при работе талевой системы при её подъёме",
    type: "Запрещённые зоны",
    object: "Буровая Осташковичи 123",
    date: "10.03.2027 14:52:35",
    relative: "2 часа назад",
    master: "Иванов С. Р.",
    brigade: "Бригада №2",
    zone: "Цех №1",
    camera: "CAM928",
    l1: "Нарушение",
    l2: "Нарушение",
    violators: "—",
    due: "16.03.2027 12:02",
    remaining: ""
  },
  {
    id: "C79095",
    image: thumb4,
    title: "Нет заводского обтиратора при спускоподъёмных операциях",
    type: "Оборудование или инструмент",
    object: "Буровая Осташковичи 123",
    date: "10.03.2027 14:52:35",
    relative: "4 часа назад",
    master: "Иванов С. Р.",
    brigade: "Бригада №2",
    zone: "Цех №1",
    camera: "CAM928",
    l1: "Нарушение",
    l2: "Ошибка ИИ",
    violators: "—",
    due: "16.03.2027 12:02",
    remaining: ""
  },
  {
    id: "D79095",
    image: thumb5,
    title: "Работа без удерживающих металлических крючков",
    type: "Технические операции",
    object: "Буровая Осташковичи 123",
    date: "10.03.2027 14:52:35",
    relative: "4 часа назад",
    master: "Иванов С. Р.",
    brigade: "Бригада №2",
    zone: "Цех №1",
    camera: "CAM928",
    l1: "Нарушение",
    l2: "Нарушение",
    violators: "Иванов И. Р. • 12345678, Константинопольский С. Р.",
    due: "16.03.2027 12:02",
    remaining: ""
  },
  {
    id: "C79095",
    image: thumb6,
    title: "Установка ниппеля в муфту трубы без смазки",
    type: "Оборудование или инструмент",
    object: "Буровая Осташковичи 123",
    date: "10.03.2027 14:52:35",
    relative: "7 часов назад",
    master: "Иванов С. Р.",
    brigade: "Бригада №2",
    zone: "Цех №1",
    camera: "CAM928",
    l1: "Нарушение",
    l2: "Просрочено",
    violators: "—",
    due: "до 16.03.2027 12:02",
    remaining: "56:22"
  }
];

export const detailDetection = {
  ...detections[1],
  status: "Ожидает обработки",
  title: "Нет каски",
  cameraImage: cameraMain,
  detectionImage: cameraDetection,
  occurredAt: "13 марта 2027 10:53:55",
  receivedAt: "15 марта 2027 12:02",
  processUntil: "до 16 марта 2027 12:02",
  comments: [
    {
      level: "Л1",
      initials: "СИ",
      author: "Иванов С. Р.",
      meta: "Мастер буровой • Бригада № 2",
      status: "Нарушение",
      text: "Цех плохо освещён, сложно определить, что происходит в кадре"
    },
    {
      level: "Л2",
      initials: "АЗ",
      author: "Захаров-Добровольский А. В.",
      meta: "Заместитель начальника ЦИТС",
      status: "Ошибка ИИ",
      text: "Цех действительно плохо освещён, скорее всего сотрудник не нарушил"
    }
  ]
};

export const reportBars = [
  { label: "Январь", value: 8 },
  { label: "Февраль", value: 14 },
  { label: "Март", value: 12 },
  { label: "Апрель", value: 4 },
  { label: "Май", value: 12 },
  { label: "Июнь", value: 13 },
  { label: "Июль", value: 8 },
  { label: "Август", value: 12 },
  { label: "Сентябрь", value: 8 },
  { label: "Октябрь", value: 14 },
  { label: "Ноябрь", value: 13 },
  { label: "Декабрь", value: 6 }
];

export const categories = [
  { label: "Нет каски", danger: 36, warning: 12, info: 6 },
  { label: "Запрещённые зоны", danger: 22, warning: 8, info: 4 },
  { label: "Оборудование или инструмент", danger: 18, warning: 13, info: 9 },
  { label: "Технические операции", danger: 15, warning: 6, info: 3 },
  { label: "Средства индивидуальной защиты", danger: 12, warning: 9, info: 7 }
];
