import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { MOCK_NOW, mockDetections, pythonBackendContract, type DetectionDto, type DetectionScreen, type ReviewDto } from "./data/pythonBackendStubs";
import { DetectionSidebar, NativeDetectionDetail, NativeDetectionsList } from "./NativeDetections";

type HotspotAction =
  | "toggleFilters"
  | "closeFilters"
  | "clearFilters"
  | "toggleFilterItem"
  | "openRoleList"
  | "selectListTab"
  | "cycleRole"
  | "openDetail"
  | "next"
  | "prev"
  | "variantNext"
  | "detailStateOne"
  | "detailStateTwo"
  | "statsState"
  | "stub";

type Hotspot = {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  to?: Screen;
  action?: HotspotAction;
  filterKey?: FilterKey;
  listTab?: ListTab;
};

type UserRole = "l1" | "l2" | "l3";
type ListTab = "all" | "pending" | "expiring";
type PeriodFilter = "all" | "today" | "week" | "month";
type FilterKey =
  | "forbiddenZones"
  | "ppe"
  | "noHelmet"
  | "noGlasses"
  | "noGloves"
  | "noUniform"
  | "jacketOpen"
  | "uniformUntucked"
  | "techOps"
  | "equipment"
  | "zone1"
  | "zone2"
  | "cam001"
  | "cam002"
  | "cam003"
  | "cam004"
  | "cam005"
  | "cam006"
  | "statusPending"
  | "statusViolation"
  | "statusAi"
  | "statusOverdue";

const svgBase = "/figma-app-svg/";

const screens = {
  home: {
    id: "home",
    title: "Начальный экран",
    file: "Начальный экран.svg",
    width: 1920,
    height: 1602
  },
  home1: {
    id: "home-1",
    title: "Начальный экран - состояние 1",
    file: "Начальный экран-1.svg",
    width: 1920,
    height: 1512
  },
  home2: {
    id: "home-2",
    title: "Начальный экран - состояние 2",
    file: "Начальный экран-2.svg",
    width: 1920,
    height: 1666
  },
  home3: {
    id: "home-3",
    title: "Начальный экран - состояние 3",
    file: "Начальный экран-3.svg",
    width: 1920,
    height: 1602
  },
  system: {
    id: "system",
    title: "Состояние системы",
    file: "Состояние системы.svg",
    width: 1130,
    height: 344
  },
  list: {
    id: "detections-l1",
    title: "Обнаружения L1",
    file: "Обнаружения L1 (Фильтры не применены).svg",
    width: 1920,
    height: 980
  },
  listAlt: {
    id: "detections-l1-alt",
    title: "Обнаружения L1 - состояние",
    file: "Обнаружения L1 (Фильтры не применены)-1.svg",
    width: 1920,
    height: 980
  },
  listFiltered: {
    id: "detections-l1-filtered",
    title: "Обнаружения L1 - фильтр применен",
    file: "Обнаружения L1 (Фильтр применены).svg",
    width: 1920,
    height: 980
  },
  listFilteredAlt: {
    id: "detections-l1-filtered-alt",
    title: "Обнаружения L1 - фильтр применен, состояние",
    file: "Обнаружения L1 (Фильтр применены)-1.svg",
    width: 1920,
    height: 980
  },
  l2List: {
    id: "detections-l2",
    title: "Обнаружения L2",
    file: "Обнаружения L2.svg",
    width: 1920,
    height: 980
  },
  l3List: {
    id: "detections-l3",
    title: "Обнаружения L3",
    file: "Обнаружения L3.svg",
    width: 1920,
    height: 980
  },
  adminList: {
    id: "detections-admin",
    title: "Обнаружения Админ",
    file: "Обнаружения Админ.svg",
    width: 1920,
    height: 980
  },
  detail: {
    id: "detection-detail",
    title: "Обнаружение",
    file: "Обнаружение.svg",
    width: 1920,
    height: 1358
  },
  detail1: {
    id: "detection-detail-1",
    title: "Обнаружение - состояние 1",
    file: "Обнаружение-1.svg",
    width: 1920,
    height: 1316
  },
  detail2: {
    id: "detection-detail-2",
    title: "Обнаружение - состояние 2",
    file: "Обнаружение-2.svg",
    width: 1920,
    height: 1348
  },
  stats: {
    id: "stats",
    title: "Статистика",
    file: "Статистика.svg",
    width: 1920,
    height: 1792
  },
  stats1: {
    id: "stats-1",
    title: "Статистика - состояние 1",
    file: "Статистика-1.svg",
    width: 1920,
    height: 2092
  },
  stats2: {
    id: "stats-2",
    title: "Статистика - состояние 2",
    file: "Статистика-2.svg",
    width: 1920,
    height: 2092
  },
  l1Panel: {
    id: "l1-panel",
    title: "Л1",
    file: "Л1.svg",
    width: 504,
    height: 846
  },
  l2Panel: {
    id: "l2-panel",
    title: "Л2",
    file: "Л2.svg",
    width: 504,
    height: 1212
  },
  l2PanelAlt: {
    id: "l2-panel-alt",
    title: "Л2 - состояние",
    file: "Л2-1.svg",
    width: 504,
    height: 1082
  },
  adminPanel: {
    id: "admin-panel",
    title: "Админ",
    file: "Админ.svg",
    width: 504,
    height: 1139
  },
  adminPanel1: {
    id: "admin-panel-1",
    title: "Админ - состояние 1",
    file: "Админ-1.svg",
    width: 504,
    height: 1257
  },
  adminPanel2: {
    id: "admin-panel-2",
    title: "Админ - состояние 2",
    file: "Админ-2.svg",
    width: 504,
    height: 1139
  },
  adminPanel3: {
    id: "admin-panel-3",
    title: "Админ - состояние 3",
    file: "Админ-3.svg",
    width: 504,
    height: 897
  },
  chunksPlateau: {
    id: "chunks-plateau",
    title: "Плато кусков",
    file: "Плато кусков.svg",
    width: 1548,
    height: 2036
  },
  componentsPlateau: {
    id: "components-plateau",
    title: "Плато компонентов",
    file: "Плато компонентов.svg",
    width: 9101,
    height: 12664
  },
  navVertical: {
    id: "nav-vertical",
    title: "Вертикальная навигация",
    file: "nav-v.svg",
    width: 1860,
    height: 60
  },
  crop6: {
    id: "figma-crop-6",
    title: "Фрагмент макета 6",
    file: "image 6.svg",
    width: 1025,
    height: 246
  },
  crop7: {
    id: "figma-crop-7",
    title: "Фрагмент макета 7",
    file: "image 7.svg",
    width: 1011,
    height: 411
  },
  crop8: {
    id: "figma-crop-8",
    title: "Фрагмент макета 8",
    file: "image 8.svg",
    width: 1019,
    height: 507
  },
  crop9: {
    id: "figma-crop-9",
    title: "Фрагмент макета 9",
    file: "image 9.svg",
    width: 1023,
    height: 437
  },
  crop10: {
    id: "figma-crop-10",
    title: "Фрагмент макета 10",
    file: "image 10.svg",
    width: 1025,
    height: 469
  },
  biAnalyticsDashboard: {
    id: "bi-analytics-dashboard",
    title: "BI-аналитика",
    file: "bi-analytics-dashboard.png",
    width: 1315,
    height: 1275
  },
  noteStatus: {
    id: "note-status",
    title: "Пометка по статусам",
    file: "Л1 установил статус Ошибка, а Л2 изменил его на Нарушение, мастер в обнаружении будет видеть только свой статус, а в статистике это обнар.svg",
    width: 444,
    height: 108
  },
  noteL3: {
    id: "note-l3",
    title: "Пометка Л3",
    file: "Л3 «Нарушения по бригадам»_ сводку по типам и видам нарушения для каждого нарушителя в выбранной бригаде. (+ с указанием неопределённых).svg",
    width: 444,
    height: 612
  },
  noteReports: {
    id: "note-reports",
    title: "Пометка по отчетам",
    file: "мастере, о статусах обнаружения, которые установили первые линии реагирования Ждём, какие нужны отчёты и графики за период времени, как.svg",
    width: 444,
    height: 406
  },
  notePolish: {
    id: "note-polish",
    title: "Важные детали и полишинг",
    file: "Важные детали и полишинг Детали_ тонкий пробел, тонкий неразрывный пробел Генератор аватарок Фуллскрин плеера Меню профиля_ выход, нас.svg",
    width: 414,
    height: 330
  },
  noteBars: {
    id: "note-bars",
    title: "Столбики за период",
    file: "Столбики за период_\u2028Год_ месяцы\u2028Месяц_ недели\u2028Неделя_ дни\u2028День.svg",
    width: 139,
    height: 90
  }
} satisfies Record<string, DetectionScreen>;

type Screen = keyof typeof screens;

const defaultFilters: Record<FilterKey, boolean> = {
  forbiddenZones: true,
  ppe: true,
  noHelmet: true,
  noGlasses: true,
  noGloves: false,
  noUniform: false,
  jacketOpen: true,
  uniformUntucked: true,
  techOps: false,
  equipment: false,
  zone1: true,
  zone2: true,
  cam001: true,
  cam002: true,
  cam003: false,
  cam004: false,
  cam005: true,
  cam006: true,
  statusPending: true,
  statusViolation: true,
  statusAi: true,
  statusOverdue: true
};

const roleListScreens: Record<UserRole, Record<ListTab, Screen>> = {
  l1: {
    all: "list",
    pending: "list",
    expiring: "list"
  },
  l2: {
    all: "l2List",
    pending: "l2List",
    expiring: "l2List"
  },
  l3: {
    all: "l3List",
    pending: "l3List",
    expiring: "l3List"
  }
};

const roleHomeScreens: Record<UserRole, Screen> = { l1: "home", l2: "home1", l3: "home2" };
const roleDetailScreens: Record<UserRole, Screen> = { l1: "detail", l2: "detail1", l3: "detail2" };
const roleStatsScreens: Record<UserRole, Screen> = { l1: "stats", l2: "stats1", l3: "stats2" };
const roleHeaderScreens: Record<UserRole, Screen> = { l1: "list", l2: "l2List", l3: "l3List" };

const homeScreens = new Set<Screen>(["home", "home1", "home2", "home3"]);
const listScreens = new Set<Screen>(["list", "listAlt", "listFiltered", "listFilteredAlt", "l2List", "l3List"]);
const detailScreens = new Set<Screen>(["detail", "detail1", "detail2"]);
const statsScreens = new Set<Screen>(["stats", "stats1", "stats2", "biAnalyticsDashboard", "crop7", "crop8", "crop9", "crop10"]);

type DetectionRowMeta = {
  id: string;
  sourceIndex: number;
  sourceY: number;
  ageDays: number;
  deadline: "pending" | "expiring" | "closed";
  filterKey: FilterKey;
  zoneKey: "zone1" | "zone2";
  cameraKey: FilterKey;
  statusKey: FilterKey;
};

const l1Rows: DetectionRowMeta[] = [
  { id: "A79099", sourceIndex: 0, sourceY: 98, ageDays: 0, deadline: "pending", filterKey: "noHelmet", zoneKey: "zone1", cameraKey: "cam001", statusKey: "statusPending" },
  { id: "A79098", sourceIndex: 1, sourceY: 203, ageDays: 0, deadline: "closed", filterKey: "noHelmet", zoneKey: "zone1", cameraKey: "cam001", statusKey: "statusPending" },
  { id: "A79097", sourceIndex: 2, sourceY: 308, ageDays: 1, deadline: "closed", filterKey: "noHelmet", zoneKey: "zone1", cameraKey: "cam005", statusKey: "statusPending" },
  { id: "A79096", sourceIndex: 3, sourceY: 413, ageDays: 2, deadline: "pending", filterKey: "noHelmet", zoneKey: "zone1", cameraKey: "cam002", statusKey: "statusViolation" },
  { id: "B79095", sourceIndex: 4, sourceY: 518, ageDays: 3, deadline: "expiring", filterKey: "forbiddenZones", zoneKey: "zone1", cameraKey: "cam005", statusKey: "statusViolation" },
  { id: "C79095", sourceIndex: 5, sourceY: 623, ageDays: 5, deadline: "pending", filterKey: "equipment", zoneKey: "zone1", cameraKey: "cam003", statusKey: "statusAi" },
  { id: "D79095", sourceIndex: 6, sourceY: 728, ageDays: 8, deadline: "expiring", filterKey: "techOps", zoneKey: "zone1", cameraKey: "cam004", statusKey: "statusViolation" },
  { id: "A79095", sourceIndex: 7, sourceY: 833, ageDays: 12, deadline: "pending", filterKey: "uniformUntucked", zoneKey: "zone1", cameraKey: "cam002", statusKey: "statusAi" },
  { id: "E79095", sourceIndex: 7, sourceY: 833, ageDays: 24, deadline: "closed", filterKey: "noUniform", zoneKey: "zone1", cameraKey: "cam001", statusKey: "statusOverdue" }
];

const detectionCopy = {} as Record<string, { date: string; title: string; type: string; zone: string; camera: string; location: string }>;

const ppeFilterKeys: FilterKey[] = ["noHelmet", "noGlasses", "noGloves", "noUniform", "jacketOpen", "uniformUntucked"];

const sidebarHotspots: Hotspot[] = [
  { label: "Начальный экран", x: 0, y: 0, w: 60, h: 60, to: "home" },
  { label: "Обнаружения", x: 0, y: 60, w: 60, h: 60, action: "openRoleList" },
  { label: "Статистика", x: 0, y: 120, w: 60, h: 60, to: "stats" },
  { label: "Настройки", x: 0, y: 180, w: 60, h: 60, to: "adminList" },
  { label: "Плато компонентов", x: 0, y: 240, w: 60, h: 60, to: "componentsPlateau" }
];

const extendedSidebarHotspots: Hotspot[] = sidebarHotspots;

const topCycleHotspots: Hotspot[] = [
  { label: "Предыдущее состояние макета", x: 82, y: 0, w: 46, h: 60, action: "prev" },
  { label: "Следующее состояние макета", x: 128, y: 0, w: 46, h: 60, action: "next" }
];

const listToolbarHotspots: Hotspot[] = [
  { label: "Таб Все", x: 270, y: 0, w: 86, h: 60, action: "selectListTab", listTab: "all" },
  { label: "Таб Ожидают", x: 356, y: 0, w: 154, h: 60, action: "selectListTab", listTab: "pending" },
  { label: "Таб Истекают", x: 510, y: 0, w: 154, h: 60, action: "selectListTab", listTab: "expiring" }
];

const detectionRowHotspots: Hotspot[] = [
  { label: "Открыть обнаружение 1", x: 60, y: 98, w: 1800, h: 105, action: "openDetail" },
  { label: "Открыть обнаружение 2", x: 60, y: 203, w: 1800, h: 105, action: "openDetail" },
  { label: "Открыть обнаружение 3", x: 60, y: 308, w: 1800, h: 105, action: "openDetail" },
  { label: "Открыть обнаружение 4", x: 60, y: 413, w: 1800, h: 105, action: "openDetail" },
  { label: "Открыть обнаружение 5", x: 60, y: 518, w: 1800, h: 105, action: "openDetail" },
  { label: "Открыть обнаружение 6", x: 60, y: 623, w: 1800, h: 105, action: "openDetail" },
  { label: "Открыть обнаружение 7", x: 60, y: 728, w: 1800, h: 105, action: "openDetail" },
  { label: "Открыть обнаружение 8", x: 60, y: 833, w: 1800, h: 105, action: "openDetail" }
];

const filterPanelX = 1370;

const filterPanelHotspots: Hotspot[] = [
  { label: "Закрыть фильтры", x: 1840, y: 16, w: 70, h: 70, action: "closeFilters" },
  { label: "Очистить фильтры", x: 1492, y: 16, w: 70, h: 70, action: "clearFilters" },
  { label: "Период фильтра", x: filterPanelX + 46, y: 108, w: 240, h: 64, action: "stub" },
  { label: "Группа Запрещенные зоны", x: filterPanelX + 44, y: 250, w: 460, h: 56, action: "toggleFilterItem", filterKey: "forbiddenZones" },
  { label: "Группа СИЗ", x: filterPanelX + 44, y: 306, w: 460, h: 56, action: "toggleFilterItem", filterKey: "ppe" },
  { label: "Чекбокс Нет каски", x: filterPanelX + 82, y: 364, w: 420, h: 54, action: "toggleFilterItem", filterKey: "noHelmet" },
  { label: "Чекбокс Нет защитных очков", x: filterPanelX + 82, y: 424, w: 420, h: 54, action: "toggleFilterItem", filterKey: "noGlasses" },
  { label: "Чекбокс Нет перчаток", x: filterPanelX + 82, y: 484, w: 420, h: 54, action: "toggleFilterItem", filterKey: "noGloves" },
  { label: "Чекбокс Нет спецодежды", x: filterPanelX + 82, y: 544, w: 420, h: 54, action: "toggleFilterItem", filterKey: "noUniform" },
  { label: "Чекбокс Специальная куртка", x: filterPanelX + 82, y: 604, w: 420, h: 54, action: "toggleFilterItem", filterKey: "jacketOpen" },
  { label: "Чекбокс Спецодежда не заправлена", x: filterPanelX + 82, y: 664, w: 420, h: 54, action: "toggleFilterItem", filterKey: "uniformUntucked" },
  { label: "Группа Технические операции", x: filterPanelX + 44, y: 724, w: 460, h: 56, action: "toggleFilterItem", filterKey: "techOps" },
  { label: "Группа Оборудование или инструмент", x: filterPanelX + 44, y: 784, w: 460, h: 56, action: "toggleFilterItem", filterKey: "equipment" },
  { label: "Зона 1", x: filterPanelX + 44, y: 908, w: 460, h: 56, action: "toggleFilterItem", filterKey: "zone1" },
  { label: "Зона 2", x: filterPanelX + 44, y: 968, w: 460, h: 56, action: "toggleFilterItem", filterKey: "zone2" },
  { label: "Камера CAM001", x: filterPanelX + 82, y: 1028, w: 420, h: 54, action: "toggleFilterItem", filterKey: "cam001" },
  { label: "Камера CAM002", x: filterPanelX + 82, y: 1088, w: 420, h: 54, action: "toggleFilterItem", filterKey: "cam002" },
  { label: "Камера CAM003", x: filterPanelX + 82, y: 1148, w: 420, h: 54, action: "toggleFilterItem", filterKey: "cam003" },
  { label: "Камера CAM004", x: filterPanelX + 82, y: 1208, w: 420, h: 54, action: "toggleFilterItem", filterKey: "cam004" }
];

type RenderArtifact = { x: number; y: number; flame?: boolean };

const l1ArtifactX = [361.759, 361.759, 361.759, 421, 430, 405, 355, 399, 399];

const screenRenderArtifacts: Partial<Record<Screen, RenderArtifact[]>> = {
  home: [
    { x: 1113, y: 492.05, flame: true },
    { x: 1113, y: 1052.05, flame: true }
  ],
  home1: [
    { x: 1113, y: 402.05, flame: true },
    { x: 1113, y: 962.05, flame: true }
  ],
  home2: [
    { x: 1113, y: 556.05, flame: true },
    { x: 1113, y: 1116.05, flame: true }
  ],
  home3: [
    { x: 1113, y: 492.05, flame: true },
    { x: 1113, y: 1052.05, flame: true }
  ],
  list: [
    ...Array.from({ length: 9 }, (_, index) => ({
      x: l1ArtifactX[index],
      y: 129.05 + index * 105,
      flame: index < 3
    }))
  ],
  listAlt: [
    ...Array.from({ length: 9 }, (_, index) => ({
      x: l1ArtifactX[index],
      y: 129.05 + index * 105,
      flame: index < 3
    }))
  ],
  listFiltered: [
    ...Array.from({ length: 9 }, (_, index) => ({
      x: l1ArtifactX[index],
      y: 129.05 + index * 105,
      flame: index < 3
    }))
  ],
  listFilteredAlt: [{ x: 1412.4, y: 159.05, flame: true }],
  l2Panel: [{ x: 160, y: 666.05, flame: true }],
  l2List: Array.from({ length: 8 }, (_, index) => ({
    x: 1478.8,
    y: 159.05 + index * 105,
    flame: index === 7
  })),
  l3List: [
    ...Array.from({ length: 8 }, (_, index) => ({
      x: 1518.67,
      y: 159.05 + index * 127,
      flame: index < 3
    }))
  ],
  componentsPlateau: [
    { x: 819.759, y: 2331.05 },
    { x: 1389.16, y: 2361.05 },
    { x: 3211.05, y: 3105.05 },
    { x: 3211.05, y: 3682.05 },
    { x: 5163.05, y: 3105.05 },
    { x: 5163.05, y: 3682.05 },
    { x: 4421.25, y: 3835.05 },
    { x: 4461.12, y: 3958.05 },
    { x: 3211.05, y: 3496.05 },
    { x: 5163.05, y: 3496.05 },
    { x: 6413.12, y: 3958.05 },
    { x: 6373.25, y: 3835.05 }
  ],
  detail: [{ x: 1504, y: 642.05 }],
  detail1: [{ x: 1504, y: 600.05 }]
};

const filterCheckboxes: Array<{ key: FilterKey; x: number; y: number }> = [
  { key: "forbiddenZones", x: filterPanelX + 68, y: 272 },
  { key: "ppe", x: filterPanelX + 68, y: 328 },
  { key: "noHelmet", x: filterPanelX + 98, y: 388 },
  { key: "noGlasses", x: filterPanelX + 98, y: 448 },
  { key: "noGloves", x: filterPanelX + 98, y: 508 },
  { key: "noUniform", x: filterPanelX + 98, y: 568 },
  { key: "jacketOpen", x: filterPanelX + 98, y: 628 },
  { key: "uniformUntucked", x: filterPanelX + 98, y: 688 },
  { key: "techOps", x: filterPanelX + 68, y: 748 },
  { key: "equipment", x: filterPanelX + 68, y: 808 },
  { key: "zone1", x: filterPanelX + 68, y: 932 },
  { key: "zone2", x: filterPanelX + 68, y: 992 },
  { key: "cam001", x: filterPanelX + 98, y: 1052 },
  { key: "cam002", x: filterPanelX + 98, y: 1112 },
  { key: "cam003", x: filterPanelX + 98, y: 1172 },
  { key: "cam004", x: filterPanelX + 98, y: 1232 }
];

const headerHotspots: Hotspot[] = [
  { label: "Поиск", x: 1575, y: 0, w: 62, h: 60, action: "stub" },
  { label: "Поделиться", x: 1637, y: 0, w: 62, h: 60, action: "stub" },
  { label: "Профиль", x: 1710, y: 0, w: 165, h: 60, action: "cycleRole" },
  { label: "Предупреждение", x: 1875, y: 0, w: 45, h: 60, action: "stub" }
];

const detailFormHotspots: Hotspot[] = [
  { label: "Статус обнаружения", x: 700, y: 792, w: 260, h: 72, action: "detailStateOne" },
  { label: "Комментарий", x: 680, y: 862, w: 360, h: 120, action: "stub" },
  { label: "Заместитель начальника ЦИТС", x: 1270, y: 760, w: 560, h: 120, action: "stub" },
  { label: "Нижняя карточка решения", x: 1230, y: 980, w: 650, h: 330, action: "detailStateTwo" },
  { label: "Кнопка Это нарушение", x: 1270, y: 1110, w: 235, h: 72, action: "detailStateOne" },
  { label: "Кнопка Это не нарушение", x: 1510, y: 1110, w: 300, h: 72, action: "detailStateTwo" },
  { label: "Кнопка Отправить", x: 1270, y: 1180, w: 170, h: 84, action: "detailStateTwo" }
];

const panelHotspots: Hotspot[] = [
  { label: "Выпадающий список статуса", x: 40, y: 130, w: 420, h: 70, action: "variantNext" },
  { label: "Комментарий панели", x: 40, y: 200, w: 420, h: 180, action: "stub" },
  { label: "Чекбокс панели 1", x: 40, y: 390, w: 420, h: 70, action: "variantNext" },
  { label: "Чекбокс панели 2", x: 40, y: 460, w: 420, h: 70, action: "variantNext" },
  { label: "Кнопка отправки панели", x: 40, y: 540, w: 220, h: 90, action: "variantNext" },
  { label: "Нижняя кнопка панели", x: 40, y: 650, w: 420, h: 130, action: "variantNext" }
];

const statsControlHotspots: Hotspot[] = [
  { label: "Период статистики", x: 80, y: 120, w: 260, h: 80, action: "statsState" },
  { label: "Все нарушители", x: 1500, y: 70, w: 260, h: 80, action: "statsState" },
  { label: "Поделиться статистикой", x: 1760, y: 70, w: 80, h: 80, action: "stub" },
  { label: "Легенда графика", x: 430, y: 520, w: 660, h: 220, action: "statsState" },
  { label: "График динамики", x: 230, y: 180, w: 1570, h: 520, action: "statsState" },
  { label: "График нарушители", x: 80, y: 820, w: 1700, h: 760, action: "statsState" }
];

const stubFullSurface: Hotspot = {
  label: "Интерактивная область-заглушка",
  x: 0,
  y: 0,
  w: 1920,
  h: 980,
  action: "stub"
};

const screenHotspots: Partial<Record<Screen, Hotspot[]>> = {
  home: [
    { ...stubFullSurface, h: 1602 },
    ...extendedSidebarHotspots,
    ...headerHotspots,
    ...topCycleHotspots,
    { label: "Все системные сообщения", x: 1220, y: 360, w: 260, h: 42, to: "system" },
    { label: "Все необработанные обнаружения", x: 500, y: 928, w: 260, h: 44, action: "openRoleList" },
    { label: "Первое необработанное обнаружение", x: 500, y: 500, w: 780, h: 92, action: "openDetail" },
    { label: "Все истекающие обнаружения", x: 500, y: 1460, w: 260, h: 44, action: "selectListTab", listTab: "expiring" }
  ],
  home1: [{ ...stubFullSurface, h: 1512 }, ...extendedSidebarHotspots, ...headerHotspots, ...topCycleHotspots],
  home2: [{ ...stubFullSurface, h: 1666 }, ...extendedSidebarHotspots, ...headerHotspots, ...topCycleHotspots],
  home3: [{ ...stubFullSurface, h: 1602 }, ...extendedSidebarHotspots, ...headerHotspots, ...topCycleHotspots],
  system: [
    { ...stubFullSurface, w: 1130, h: 344 },
    ...topCycleHotspots,
    { label: "К обнаружениям", x: 0, y: 82, w: 240, h: 80, to: "list" }
  ],
  list: [stubFullSurface, ...extendedSidebarHotspots, ...headerHotspots, ...topCycleHotspots, ...listToolbarHotspots, ...detectionRowHotspots],
  listAlt: [stubFullSurface, ...extendedSidebarHotspots, ...headerHotspots, ...topCycleHotspots, ...listToolbarHotspots, ...detectionRowHotspots],
  listFiltered: [
    { ...stubFullSurface, h: 980 },
    ...extendedSidebarHotspots,
    ...headerHotspots,
    ...topCycleHotspots,
    ...listToolbarHotspots,
    ...detectionRowHotspots,
    ...filterPanelHotspots
  ],
  listFilteredAlt: [
    { ...stubFullSurface, h: 980 },
    ...extendedSidebarHotspots,
    ...headerHotspots,
    ...topCycleHotspots,
    ...listToolbarHotspots,
    ...detectionRowHotspots
  ],
  l2List: [stubFullSurface, ...extendedSidebarHotspots, ...headerHotspots, ...topCycleHotspots, ...listToolbarHotspots, ...detectionRowHotspots],
  l3List: [stubFullSurface, ...extendedSidebarHotspots, ...headerHotspots, ...topCycleHotspots, ...listToolbarHotspots, ...detectionRowHotspots],
  adminList: [stubFullSurface, ...extendedSidebarHotspots, ...headerHotspots, ...topCycleHotspots, ...listToolbarHotspots, ...detectionRowHotspots],
  detail: [
    { ...stubFullSurface, h: 1358 },
    ...extendedSidebarHotspots,
    ...headerHotspots,
    ...topCycleHotspots,
    ...detailFormHotspots
  ],
  detail1: [
    { ...stubFullSurface, h: 1316 },
    ...extendedSidebarHotspots,
    ...headerHotspots,
    ...topCycleHotspots,
    ...detailFormHotspots
  ],
  detail2: [
    { ...stubFullSurface, h: 1348 },
    ...extendedSidebarHotspots,
    ...headerHotspots,
    ...topCycleHotspots,
    ...detailFormHotspots
  ],
  stats: [
    { ...stubFullSurface, h: 1792 },
    ...extendedSidebarHotspots,
    ...headerHotspots,
    ...topCycleHotspots,
    ...statsControlHotspots,
    { label: "Переключить состояние статистики", x: 1480, y: 60, w: 360, h: 90, action: "variantNext" }
  ],
  stats1: [
    { ...stubFullSurface, h: 2092 },
    ...extendedSidebarHotspots,
    ...headerHotspots,
    ...topCycleHotspots,
    ...statsControlHotspots,
    { label: "Переключить состояние статистики", x: 1480, y: 60, w: 360, h: 90, action: "variantNext" }
  ],
  stats2: [
    { ...stubFullSurface, h: 2092 },
    ...extendedSidebarHotspots,
    ...headerHotspots,
    ...topCycleHotspots,
    ...statsControlHotspots,
    { label: "Переключить состояние статистики", x: 1480, y: 60, w: 360, h: 90, action: "variantNext" }
  ],
  l1Panel: [{ ...stubFullSurface, w: 504, h: 846 }, ...topCycleHotspots, ...panelHotspots, { label: "К списку L1", x: 0, y: 82, w: 504, h: 80, to: "list" }],
  l2Panel: [{ ...stubFullSurface, w: 504, h: 1212 }, ...topCycleHotspots, ...panelHotspots, { label: "К списку L2", x: 0, y: 82, w: 504, h: 80, to: "l2List" }],
  l2PanelAlt: [{ ...stubFullSurface, w: 504, h: 1082 }, ...topCycleHotspots, ...panelHotspots, { label: "К списку L2", x: 0, y: 82, w: 504, h: 80, to: "l2List" }],
  adminPanel: [{ ...stubFullSurface, w: 504, h: 1139 }, ...topCycleHotspots, ...panelHotspots, { label: "К списку Админ", x: 0, y: 82, w: 504, h: 80, to: "adminList" }],
  adminPanel1: [{ ...stubFullSurface, w: 504, h: 1257 }, ...topCycleHotspots, ...panelHotspots, { label: "К списку Админ", x: 0, y: 82, w: 504, h: 80, to: "adminList" }],
  adminPanel2: [{ ...stubFullSurface, w: 504, h: 1139 }, ...topCycleHotspots, ...panelHotspots, { label: "К списку Админ", x: 0, y: 82, w: 504, h: 80, to: "adminList" }],
  adminPanel3: [{ ...stubFullSurface, w: 504, h: 897 }, ...topCycleHotspots, ...panelHotspots, { label: "К списку Админ", x: 0, y: 82, w: 504, h: 80, to: "adminList" }]
};

function getStatsState(value: Screen): Screen {
  if (value === "stats") return "stats1";
  if (value === "stats1") return "stats2";
  if (value === "stats2") return "biAnalyticsDashboard";
  if (value === "biAnalyticsDashboard") return "crop7";
  if (value === "crop7") return "crop8";
  return "stats";
}

function getVariantScreen(value: Screen): Screen {
  const variants: Partial<Record<Screen, Screen>> = {
    home: "home1",
    home1: "home2",
    home2: "home3",
    home3: "home",
    detail: "detail1",
    detail1: "detail2",
    detail2: "detail",
    stats: "stats1",
    stats1: "stats2",
    stats2: "biAnalyticsDashboard",
    biAnalyticsDashboard: "crop7",
    crop7: "crop8",
    crop8: "stats",
    l1Panel: "l2Panel",
    l2Panel: "l2PanelAlt",
    l2PanelAlt: "adminPanel",
    adminPanel: "adminPanel1",
    adminPanel1: "adminPanel2",
    adminPanel2: "adminPanel3",
    adminPanel3: "adminPanel"
  };

  return variants[value] ?? value;
}

function FlameIcon({ className = "" }: { className?: string }) {
  return <img className={className} src="/icons/fire.svg" alt="" aria-hidden="true" />;
}

function RenderArtifactPatch({ icon, current }: { icon: RenderArtifact; current: DetectionScreen }) {
  const source = encodeURI(`${svgBase}${current.file}`);
  const patchSize = 16;
  return (
    <span
      className="figma-row-fire"
      style={{
        left: `${(icon.x / current.width) * 100}%`,
        top: `${(icon.y / current.height) * 100}%`,
        width: `${(patchSize / current.width) * 100}%`,
        height: `${(patchSize / current.height) * 100}%`
      }}
      aria-hidden="true"
    >
      <svg className="artifact-background" viewBox={`${icon.x + 20} ${icon.y} ${patchSize} ${patchSize}`} preserveAspectRatio="none">
        <image href={source} width={current.width} height={current.height} />
      </svg>
      {icon.flame && <FlameIcon className="artifact-flame" />}
    </span>
  );
}

function FilterCheckboxMark({
  box,
  checked,
  current
}: {
  box: { key: FilterKey; x: number; y: number };
  checked: boolean;
  current: DetectionScreen;
}) {
  return (
    <svg
      className="figma-filter-check"
      viewBox="0 0 24 24"
      style={{
        left: `${(box.x / current.width) * 100}%`,
        top: `${(box.y / current.height) * 100}%`,
        width: `${(24 / current.width) * 100}%`
      }}
      aria-hidden="true"
      data-filter-key={box.key}
      data-checked={checked ? "true" : "false"}
    >
      <rect width="24" height="24" rx="6" fill={checked ? "#10B767" : "#EEF2F8"} />
      {checked && (
        <path
          d="M6.2 12.2L10.1 16L18 7.8"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

const filterLeafKeys: FilterKey[] = [
  "forbiddenZones",
  "noHelmet",
  "noGlasses",
  "noGloves",
  "noUniform",
  "jacketOpen",
  "uniformUntucked",
  "techOps",
  "equipment"
];

const cameraFilterKeys: FilterKey[] = ["cam001", "cam002", "cam003", "cam004", "cam005", "cam006"];
const statusFilterKeys: FilterKey[] = ["statusPending", "statusViolation", "statusAi", "statusOverdue"];

function CheckMark({ checked }: { checked: boolean }) {
  return (
    <span className={`real-checkbox ${checked ? "is-checked" : ""}`} aria-hidden="true">
      {checked && (
        <svg viewBox="0 0 16 16">
          <path d="M3 8.2 6.3 11.4 13 4.8" />
        </svg>
      )}
    </span>
  );
}

function FilterOption({
  filterKey,
  label,
  checked,
  nested = false,
  onToggle
}: {
  filterKey: FilterKey;
  label: string;
  checked: boolean;
  nested?: boolean;
  onToggle: (key: FilterKey) => void;
}) {
  return (
    <button
      type="button"
      className={`filter-option ${nested ? "is-nested" : ""}`}
      onClick={() => onToggle(filterKey)}
      aria-pressed={checked}
    >
      <CheckMark checked={checked} />
      <span>{label}</span>
    </button>
  );
}

function FilterPanel({
  role,
  filters,
  count,
  period,
  onToggle,
  onPeriodChange,
  onClear,
  onClose
}: {
  role: UserRole;
  filters: Record<FilterKey, boolean>;
  count: number;
  period: PeriodFilter;
  onToggle: (key: FilterKey) => void;
  onPeriodChange: (period: PeriodFilter) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const [periodOpen, setPeriodOpen] = useState(false);
  const [roleFields, setRoleFields] = useState({
    object: "Все объекты",
    l1: "Все Л1",
    violator: "Все нарушители",
    statusL1: "Все статусы Л1",
    l2: "Все Л2",
    statusL2: "Все статусы Л2",
    statusL3: "Все статусы Л3"
  });
  const periodLabels: Record<PeriodFilter, string> = {
    all: "За всё время",
    today: "Сегодня",
    week: "За неделю",
    month: "За месяц"
  };
  return (
    <aside className="real-filter-panel" aria-label="Фильтры обнаружений">
      <header className="filter-panel-header">
        <strong>Фильтры • {count}</strong>
        <button type="button" className="filter-icon-button" onClick={onClear} aria-label="Очистить фильтры">
          <svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v6m4-6v6" /></svg>
        </button>
        <button type="button" className="filter-close" onClick={onClose} aria-label="Закрыть фильтры">
          <svg viewBox="0 0 24 24"><path d="m5 5 14 14M19 5 5 19" /></svg>
        </button>
      </header>
      <div className="filter-panel-scroll">
        <span className="filter-section-label">Период</span>
        <button type="button" className="filter-period" onClick={() => setPeriodOpen((value) => !value)} aria-expanded={periodOpen}>
          {periodLabels[period]} <span>⌄</span>
        </button>
        {periodOpen && (
          <div className="filter-period-menu" role="menu">
            {(Object.keys(periodLabels) as PeriodFilter[]).map((item) => (
              <button
                type="button"
                key={item}
                className={item === period ? "is-active" : ""}
                onClick={() => {
                  onPeriodChange(item);
                  setPeriodOpen(false);
                }}
              >
                {periodLabels[item]}
              </button>
            ))}
          </div>
        )}

        <span className="filter-section-label section-gap">Обнаружения</span>
        <FilterOption filterKey="forbiddenZones" label="Запрещённые зоны" checked={filters.forbiddenZones} onToggle={onToggle} />
        <button type="button" className="filter-group-title" onClick={() => onToggle("ppe")} aria-pressed={filters.ppe}>
          <span>⌃</span><CheckMark checked={filters.ppe} /><span>Средства индивидуальной защиты</span>
        </button>
        <FilterOption nested filterKey="noHelmet" label="Нет каски / каска не зафиксирована ремнём" checked={filters.noHelmet} onToggle={onToggle} />
        <FilterOption nested filterKey="noGlasses" label="Нет защитных очков" checked={filters.noGlasses} onToggle={onToggle} />
        <FilterOption nested filterKey="noGloves" label="Нет перчаток" checked={filters.noGloves} onToggle={onToggle} />
        <FilterOption nested filterKey="noUniform" label="Нет спецодежды" checked={filters.noUniform} onToggle={onToggle} />
        <FilterOption nested filterKey="jacketOpen" label="Специальная куртка не застёгнута" checked={filters.jacketOpen} onToggle={onToggle} />
        <FilterOption nested filterKey="uniformUntucked" label="Спецодежда не заправлена" checked={filters.uniformUntucked} onToggle={onToggle} />
        <FilterOption filterKey="techOps" label="Технические операции" checked={filters.techOps} onToggle={onToggle} />
        <FilterOption filterKey="equipment" label="Оборудование или инструмент" checked={filters.equipment} onToggle={onToggle} />

        <span className="filter-section-label section-gap">Зоны и камеры</span>
        <FilterOption filterKey="zone1" label="Зона №1" checked={filters.zone1} onToggle={onToggle} />
        <FilterOption filterKey="zone2" label="Зона №2" checked={filters.zone2} onToggle={onToggle} />
        <FilterOption nested filterKey="cam001" label="CAM001 • Камера у оборудования" checked={filters.cam001} onToggle={onToggle} />
        <FilterOption nested filterKey="cam002" label="CAM002 • Станок" checked={filters.cam002} onToggle={onToggle} />
        <FilterOption nested filterKey="cam003" label="CAM003 • Вход" checked={filters.cam003} onToggle={onToggle} />
        <FilterOption nested filterKey="cam004" label="CAM004" checked={filters.cam004} onToggle={onToggle} />
        <FilterOption nested filterKey="cam005" label="CAM005" checked={filters.cam005} onToggle={onToggle} />
        <FilterOption nested filterKey="cam006" label="CAM006" checked={filters.cam006} onToggle={onToggle} />

        <span className="filter-section-label section-gap">Статусы{role === "l1" ? "" : " Л1"}</span>
        <FilterOption filterKey="statusPending" label="Ожидает обработки" checked={filters.statusPending} onToggle={onToggle} />
        <FilterOption filterKey="statusViolation" label="Нарушение" checked={filters.statusViolation} onToggle={onToggle} />
        <FilterOption filterKey="statusAi" label="Ошибка ИИ" checked={filters.statusAi} onToggle={onToggle} />
        <FilterOption filterKey="statusOverdue" label="Просрочено" checked={filters.statusOverdue} onToggle={onToggle} />

        {role === "l1" && (
          <>
            <span className="filter-section-label section-gap">Нарушитель • Бригада №2</span>
            <select value={roleFields.violator} onChange={(event) => setRoleFields((value) => ({ ...value, violator: event.target.value }))}>
              <option>Все нарушители</option><option>Константинопольский С. Р. • 12345678</option>
            </select>
          </>
        )}

        {role !== "l1" && (
          <>
            <span className="filter-section-label section-gap">Объект</span>
            <select value={roleFields.object} onChange={(event) => setRoleFields((value) => ({ ...value, object: event.target.value }))}>
              <option>Все объекты</option><option>Буровая Осташковичи 123</option>
            </select>
            <span className="filter-section-label section-gap">Л1</span>
            <select value={roleFields.l1} onChange={(event) => setRoleFields((value) => ({ ...value, l1: event.target.value }))}>
              <option>Все Л1</option><option>Иванов С. Р. • Мастер буровой • Бригада №2</option>
            </select>
            <span className="filter-section-label section-gap">Нарушитель</span>
            <select value={roleFields.violator} onChange={(event) => setRoleFields((value) => ({ ...value, violator: event.target.value }))}>
              <option>Все нарушители</option><option>Константинопольский С. Р. • 12345678</option>
            </select>
            <span className="filter-section-label section-gap">Статус Л1</span>
            <select value={roleFields.statusL1} onChange={(event) => setRoleFields((value) => ({ ...value, statusL1: event.target.value }))}>
              <option>Все статусы Л1</option><option>Ожидает обработки</option><option>Нарушение</option><option>Ошибка ИИ</option><option>Просрочено</option>
            </select>
          </>
        )}
        {role === "l3" && (
          <>
            <span className="filter-section-label section-gap">Л2</span>
            <select value={roleFields.l2} onChange={(event) => setRoleFields((value) => ({ ...value, l2: event.target.value }))}>
              <option>Все Л2</option><option>Захаров-Добровольский А. В. • Заместитель начальника ЦИТС</option>
            </select>
            <span className="filter-section-label section-gap">Статус Л2</span>
            <select value={roleFields.statusL2} onChange={(event) => setRoleFields((value) => ({ ...value, statusL2: event.target.value }))}>
              <option>Все статусы Л2</option><option>Ожидает обработки</option><option>Нарушение</option><option>Ошибка ИИ</option><option>Просрочено</option>
            </select>
            <span className="filter-section-label section-gap">Статус Л3 • Вы</span>
            <select value={roleFields.statusL3} onChange={(event) => setRoleFields((value) => ({ ...value, statusL3: event.target.value }))}>
              <option>Все статусы Л3</option><option>Ожидает обработки</option><option>Нарушение</option><option>Ошибка ИИ</option><option>Просрочено</option>
            </select>
          </>
        )}
      </div>
    </aside>
  );
}

function DeadlineMarker({
  source,
  sourceFrame,
  artifactX,
  artifactY,
  cropY,
  rowHeight,
  showFlame
}: {
  source: string;
  sourceFrame: DetectionScreen;
  artifactX: number;
  artifactY: number;
  cropY: number;
  rowHeight: number;
  showFlame: boolean;
}) {
  const patchSize = 16;
  return (
    <span
      className="dynamic-fire"
      style={{
        left: `${((artifactX - 60) / 1860) * 100}%`,
        top: `${((artifactY - cropY) / rowHeight) * 100}%`,
        width: `${(patchSize / 1860) * 100}%`,
        height: `${(patchSize / rowHeight) * 100}%`
      }}
      aria-hidden="true"
    >
      <svg
        className="artifact-background"
        viewBox={`${artifactX + 20} ${artifactY} ${patchSize} ${patchSize}`}
        preserveAspectRatio="none"
      >
        <image href={source} width={sourceFrame.width} height={sourceFrame.height} />
      </svg>
      {showFlame && <FlameIcon className="artifact-flame" />}
    </span>
  );
}

function FilteredRowsOverlay({ rows, sourceScreen, onOpen }: { rows: DetectionRowMeta[]; sourceScreen: Screen; onOpen: () => void }) {
  const sourceFrame = screens[sourceScreen];
  const source = encodeURI(`${svgBase}${sourceFrame.file}`);
  const rowHeight = sourceScreen === "l3List" ? 127 : 105;
  return (
    <div
      className="filtered-rows-overlay"
      data-row-count={rows.length}
      data-row-ids={rows.map((row) => row.id).join(",")}
    >
      {rows.map((row, index) => {
        const cropY = sourceScreen === "l3List" ? 98 + row.sourceIndex * rowHeight : row.sourceY;
        const artifactX = sourceScreen === "l2List"
          ? 1478.8
          : sourceScreen === "l3List"
            ? 1518.67
            : l1ArtifactX[row.sourceIndex] ?? 361.759;
        const artifactY = sourceScreen === "list" || sourceScreen === "listAlt" || sourceScreen === "listFiltered"
          ? 129.05 + row.sourceIndex * 105
          : 159.05 + row.sourceIndex * rowHeight;
        const showFlame = sourceScreen === "l2List"
          ? row.sourceIndex === 7
          : row.sourceIndex < 3;

        return (
        <button
          type="button"
          className="filtered-row"
          key={`${row.sourceY}-${index}`}
          style={{ aspectRatio: `1860 / ${rowHeight}` }}
          onClick={onOpen}
          aria-label={`Открыть отфильтрованное обнаружение ${index + 1}`}
        >
          <svg
            viewBox={`60 ${cropY} 1860 ${rowHeight}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <image href={source} width={sourceFrame.width} height={sourceFrame.height} />
          </svg>
          <DeadlineMarker
            source={source}
            sourceFrame={sourceFrame}
            artifactX={artifactX}
            artifactY={artifactY}
            cropY={cropY}
            rowHeight={rowHeight}
            showFlame={showFlame}
          />
        </button>
        );
      })}
      {rows.length === 0 && <div className="filter-empty">По выбранным фильтрам ничего не найдено</div>}
    </div>
  );
}

function ListTabsOverlay({ active, onSelect }: { active: ListTab; onSelect: (tab: ListTab) => void }) {
  const pendingCount = l1Rows.filter((row) => row.deadline === "pending").length;
  const expiringCount = l1Rows.filter((row) => row.deadline === "expiring").length;
  const tabs: Array<{ key: ListTab; label: string }> = [
    { key: "all", label: "Все" },
    { key: "pending", label: `Ожидают • ${pendingCount}` },
    { key: "expiring", label: `Истекают • ${expiringCount}` }
  ];

  return (
    <div className="list-tabs-overlay" role="tablist" aria-label="Состояние обнаружений">
      {tabs.map((tab) => (
        <button
          type="button"
          role="tab"
          aria-selected={active === tab.key}
          className={active === tab.key ? "is-active" : ""}
          key={tab.key}
          onClick={() => onSelect(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

const roleProfiles: Record<UserRole, { role: string; name: string }> = {
  l1: { role: "Л1", name: "Иванов С. Р." },
  l2: { role: "Л2", name: "Захаров-Добровольский А. В." },
  l3: { role: "Л3", name: "Константинопольская О. В." }
};

function RoleMenu({ currentRole, onSelect }: { currentRole: UserRole; onSelect: (role: UserRole) => void }) {
  return (
    <div className="role-menu" aria-label="Выбор роли">
      {(Object.keys(roleProfiles) as UserRole[]).map((itemRole) => (
        <button
          type="button"
          key={itemRole}
          className={itemRole === currentRole ? "is-active" : ""}
          onClick={() => onSelect(itemRole)}
        >
          <span>{roleProfiles[itemRole].role}</span>
          <strong>{roleProfiles[itemRole].name}</strong>
        </button>
      ))}
    </div>
  );
}

type StatsMenu = "period" | "violators-top" | "violators-dynamics" | null;

function StatsControls({
  current,
  period,
  menu,
  onMenu,
  onPeriod
}: {
  current: DetectionScreen;
  period: string;
  menu: StatsMenu;
  onMenu: (menu: StatsMenu) => void;
  onPeriod: (period: string) => void;
}) {
  const controlStyle = (x: number, y: number, w: number, h: number): CSSProperties => ({
    left: `${(x / current.width) * 100}%`,
    top: `${(y / current.height) * 100}%`,
    width: `${(w / current.width) * 100}%`,
    height: `${(h / current.height) * 100}%`
  });
  const periods = ["За Июнь 2027", "За Май 2027", "За Апрель 2027"];
  const violators = ["Все нарушители", "Иванов И. О.", "Фамилия И. О."];
  return (
    <div className="stats-controls-layer">
      <button type="button" className="stats-period-control" style={controlStyle(250, 0, 250, 60)} onClick={() => onMenu(menu === "period" ? null : "period")}>{period}<span>⌄</span></button>
      <button type="button" className="stats-transparent-control" style={controlStyle(1290, 470, 250, 70)} onClick={() => onMenu(menu === "violators-top" ? null : "violators-top")} aria-label="Фильтр нарушителей по категориям" />
      <button type="button" className="stats-transparent-control" style={controlStyle(1290, 820, 250, 70)} onClick={() => onMenu(menu === "violators-dynamics" ? null : "violators-dynamics")} aria-label="Фильтр нарушителей динамики" />
      {menu === "period" && (
        <div className="stats-native-menu stats-period-popup" style={controlStyle(250, 58, 250, 132)}>
          {periods.map((item) => <button type="button" key={item} className={item === period ? "is-active" : ""} onClick={() => { onPeriod(item); onMenu(null); }}>{item}</button>)}
        </div>
      )}
      {(menu === "violators-top" || menu === "violators-dynamics") && (
        <div className="stats-native-menu stats-violators-popup" style={controlStyle(1290, menu === "violators-top" ? 530 : 880, 250, 132)}>
          {violators.map((item, index) => <button type="button" key={item} className={index === 0 ? "is-active" : ""} onClick={() => onMenu(null)}>{item}</button>)}
        </div>
      )}
    </div>
  );
}

function NativeSidebar({ unread, onHome, onList, onStats, onSettings, onPlateau }: {
  unread: number;
  onHome: () => void;
  onList: () => void;
  onStats: () => void;
  onSettings: () => void;
  onPlateau: () => void;
}) {
  const items = [onHome, onList, onStats, onSettings, onPlateau];
  return (
    <nav className="native-sidebar" aria-label="Основная навигация">
      <svg className="native-sidebar-art" viewBox="0 0 60 980" preserveAspectRatio="none" aria-hidden="true">
        <image href={encodeURI(`${svgBase}${screens.list.file}`)} width="1920" height="980" />
      </svg>
      {items.map((onClick, index) => (
        <button type="button" key={index} onClick={onClick} aria-label={["Начальный экран", "Обнаружения", "Статистика", "Настройки", "Компоненты"][index]}>
          {index < 2 && unread > 0 && <span>{unread}</span>}
        </button>
      ))}
    </nav>
  );
}

function NativeDetectionList({
  role,
  tab,
  rows,
  appliedFilterCount,
  onTab,
  onOpenFilters,
  onOpenRoleMenu,
  onOpenRow,
  onBack,
  onForward
}: {
  role: UserRole;
  tab: ListTab;
  rows: DetectionRowMeta[];
  appliedFilterCount: number;
  onTab: (tab: ListTab) => void;
  onOpenFilters: () => void;
  onOpenRoleMenu: () => void;
  onOpenRow: () => void;
  onBack: () => void;
  onForward: () => void;
}) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("ru");
  const searchedRows = normalized
    ? rows.filter((row) => {
        const copy = detectionCopy[row.id];
        return [row.id, copy.title, copy.type, copy.zone, copy.camera].some((value) => value.toLocaleLowerCase("ru").includes(normalized));
      })
    : rows;
  const pendingCount = l1Rows.filter((row) => row.deadline === "pending").length;
  const expiringCount = l1Rows.filter((row) => row.deadline === "expiring").length;
  const initials = role === "l1" ? "СИ" : role === "l2" ? "АЗ" : "ОК";

  return (
    <div className="native-detection-screen">
      <header className="native-list-header">
        <button type="button" className="native-icon-button" onClick={onBack} aria-label="Назад">‹</button>
        <button type="button" className="native-icon-button" onClick={onForward} aria-label="Вперёд">›</button>
        <strong>Обнаружения</strong>
        <div className="native-list-tabs" role="tablist">
          <button type="button" className={tab === "all" ? "is-active" : ""} onClick={() => onTab("all")}>Все</button>
          <button type="button" className={tab === "pending" ? "is-active" : ""} onClick={() => onTab("pending")}>Ожидают • {pendingCount}</button>
          <button type="button" className={tab === "expiring" ? "is-active" : ""} onClick={() => onTab("expiring")}>Истекают • {expiringCount}</button>
        </div>
        <button type="button" className="native-profile" onClick={onOpenRoleMenu} aria-label="Сменить роль">
          <span>{initials}</span><b>{roleProfiles[role].name}</b><i>• {roleProfiles[role].role.toUpperCase()}</i>
        </button>
      </header>

      <div className="native-list-toolbar">
        <label className="native-search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по ID, объекту, нарушителю" />
        </label>
        <button type="button" className="native-filter-button" onClick={onOpenFilters}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4"/></svg>
          Фильтры{appliedFilterCount > 0 ? ` • ${appliedFilterCount}` : ""}
        </button>
        <button type="button" className="native-level-button" onClick={onOpenRoleMenu}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z"/></svg>
          {roleProfiles[role].role.toUpperCase()}: все
        </button>
      </div>

      <div className={`native-detection-table role-${role}`}>
        <div className="native-table-head">
          <span aria-hidden="true" />
          <span>ID</span><span>Дата и время ↓</span><span>Предполагаемое нарушение</span><span>Тип</span><span>Зона обнаружения</span><span>Камера</span><span>Статус</span>
        </div>
        {searchedRows.map((row) => {
          const copy = detectionCopy[row.id];
          return (
            <button type="button" className="native-table-row" key={row.id} onClick={onOpenRow}>
              <span className="native-thumb"><img src="/detection-camera.png" alt="" style={{ objectPosition: `${18 + row.sourceIndex * 7}% center` }} /></span>
              <span>{row.id}</span>
              <span>{copy.date}<small>{row.ageDays === 0 ? "Сейчас" : row.ageDays === 1 ? "Вчера" : `${row.ageDays} дня назад`}</small></span>
              <span><b>{copy.title}</b></span>
              <span>{copy.type}</span>
              <span>{copy.zone}</span>
              <span>{copy.camera}<small>{copy.location}</small></span>
              <span className="native-row-status">
                {row.deadline === "pending" && <><mark>Ожидает обработки</mark><small>до 16.03.2027 12:02</small></>}
                {row.deadline === "expiring" && <><small>до 13.03.2027 13:04</small><em><FlameIcon /> 56:22</em></>}
                {row.deadline === "closed" && <><mark className="is-closed">Закрыто</mark><small>Обработано</small></>}
              </span>
            </button>
          );
        })}
        {searchedRows.length === 0 && <div className="native-list-empty">По выбранным фильтрам ничего не найдено</div>}
      </div>
    </div>
  );
}

const notificationItems = [
  { title: "Нет каски", id: "A79096", place: "Цех №1 • Cam005 • Камера у входа" },
  { title: "Нахождение на столе ротора при работе талевой системы при её подъёме", id: "B79095", place: "Зона №12 • THV21 • Тепловизор у оборудования" },
  { title: "Нет заводского обтиратора при спускоподъёмных операциях", id: "C79095", place: "Зона буровой №1 • CAM203" },
  { title: "Работа без удерживающих металлических крючков", id: "D79095", place: "Зона буровой №1 • THV21" }
];

function NotificationStack({ dismissed, onDismiss }: { dismissed: Set<number>; onDismiss: (id: number) => void }) {
  return (
    <div className="home-toast-stack" aria-label="Уведомления">
      {notificationItems.map((item, index) => dismissed.has(index) ? null : (
        <article className="home-toast" key={item.id}>
          <img src="/detection-camera.png" alt="" />
          <div><strong>{item.title}</strong><span>{item.id}</span><p>{item.place}</p></div>
          <button type="button" className="toast-close" onClick={() => onDismiss(index)} aria-label={`Закрыть уведомление ${item.id}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5 19 19M19 5 5 19" /></svg>
          </button>
        </article>
      ))}
    </div>
  );
}

type Decision = "violation" | "notViolation";

function DecisionControls({
  decision,
  submitted,
  onSelect,
  onSubmit
}: {
  decision: Decision | null;
  submitted: boolean;
  onSelect: (decision: Decision) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="decision-controls" aria-label="Оценка обнаружения">
      <button
        type="button"
        className={`decision-choice decision-yes ${decision === "violation" ? "is-selected" : ""}`}
        onClick={() => onSelect("violation")}
        aria-pressed={decision === "violation"}
      >
        <span>✓</span> Это нарушение
      </button>
      <button
        type="button"
        className={`decision-choice decision-no ${decision === "notViolation" ? "is-selected" : ""}`}
        onClick={() => onSelect("notViolation")}
        aria-pressed={decision === "notViolation"}
      >
        <span>×</span> Это не нарушение
      </button>
      <button type="button" className="decision-submit" disabled={!decision || submitted} onClick={onSubmit}>
        Отправить
      </button>
    </div>
  );
}

const toastFrames = [
  { id: 0, y: 652 },
  { id: 1, y: 760 },
  { id: 2, y: 868 }
];

function StaticToastControls({ dismissed, onDismiss }: { dismissed: Set<number>; onDismiss: (id: number) => void }) {
  const cleanSource = encodeURI(`${svgBase}${screens.list.file}`);
  return (
    <div className="static-toast-controls">
      {toastFrames.map((toast) =>
        dismissed.has(toast.id) ? (
          <svg
            key={toast.id}
            className="toast-restoration"
            style={{ top: `${(toast.y / 980) * 100}%` }}
            viewBox={`8 ${toast.y} 468 104`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <image href={cleanSource} width="1920" height="980" />
          </svg>
        ) : (
          <button
            type="button"
            key={toast.id}
            className="toast-close-button"
            style={{ top: `${((toast.y + 10) / 980) * 100}%` }}
            onClick={() => onDismiss(toast.id)}
            aria-label={`Закрыть уведомление ${toast.id + 1}`}
          />
        )
      )}
    </div>
  );
}

const detailToastFrames = [988, 1096, 1204];

function DetailToastControls({ dismissed, onDismiss }: { dismissed: Set<number>; onDismiss: (id: number) => void }) {
  return (
    <div className="detail-toast-controls">
      {detailToastFrames.map((y, id) =>
        dismissed.has(id) ? (
          <div
            key={id}
            className="detail-toast-restoration"
            style={{ top: `${((y - 8) / 1316) * 100}%` }}
            aria-hidden="true"
          />
        ) : (
          <button
            type="button"
            key={id}
            className="detail-toast-close-button"
            style={{ top: `${((y + 10) / 1316) * 100}%` }}
            onClick={() => onDismiss(id)}
            aria-label={`Закрыть уведомление ${id + 1}`}
          />
        )
      )}
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [role, setRole] = useState<UserRole>("l1");
  const [listTab, setListTab] = useState<ListTab>("all");
  const [filters, setFilters] = useState<Record<FilterKey, boolean>>(defaultFilters);
  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersDirty, setFiltersDirty] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [decisionSubmitted, setDecisionSubmitted] = useState(false);
  const [statsMenu, setStatsMenu] = useState<StatsMenu>(null);
  const [statsPeriod, setStatsPeriod] = useState("За Июнь 2027");
  const [dismissedToasts, setDismissedToasts] = useState<Set<number>>(new Set());
  const [backStack, setBackStack] = useState<Screen[]>([]);
  const [forwardStack, setForwardStack] = useState<Screen[]>([]);
  const [detections, setDetections] = useState<DetectionDto[]>(() => mockDetections.map((item) => ({ ...item, reviews: item.reviews.map((review) => ({ ...review })) })));
  const [selectedDetectionId, setSelectedDetectionId] = useState(mockDetections[0].id);
  const [designScale, setDesignScale] = useState(() => typeof window === "undefined" ? 1 : window.innerWidth / 1920);
  const current = screens[screen];
  const isRoleList = screen === "list" || screen === "l2List" || screen === "l3List";
  const isDetailScreen = screen === "detail" || screen === "detail1" || screen === "detail2";
  const selectedFilterGroupCount = [
    period !== "all",
    filters.forbiddenZones,
    ppeFilterKeys.some((key) => filters[key]),
    filters.techOps,
    filters.equipment,
    filters.zone1,
    filters.zone2,
    statusFilterKeys.some((key) => filters[key])
  ].filter(Boolean).length;
  const appliedFilterCount = filtersDirty ? selectedFilterGroupCount : 0;
  const filteredRows = useMemo(() => {
    let rows = l1Rows;
    if (listTab === "pending") rows = rows.filter((row) => row.deadline === "pending");
    if (listTab === "expiring") rows = rows.filter((row) => row.deadline === "expiring");
    if (period === "today") rows = rows.filter((row) => row.ageDays === 0);
    if (period === "week") rows = rows.filter((row) => row.ageDays <= 7);
    if (period === "month") rows = rows.filter((row) => row.ageDays <= 30);

    if (filtersDirty) {
      const activeLeaves = filterLeafKeys.filter((key) => filters[key]);
      const activeCameras = cameraFilterKeys.filter((key) => filters[key]);
      const activeZones = (["zone1", "zone2"] as const).filter((key) => filters[key]);
      const activeStatuses = statusFilterKeys.filter((key) => filters[key]);
      rows = rows.filter((row) =>
        (activeLeaves.length === 0 || activeLeaves.includes(row.filterKey)) &&
        (activeCameras.length === 0 || activeCameras.includes(row.cameraKey)) &&
        (activeZones.length === 0 || activeZones.includes(row.zoneKey)) &&
        (activeStatuses.length === 0 || activeStatuses.includes(row.statusKey))
      );
    }

    return rows;
  }, [filters, filtersDirty, listTab, period]);
  const roleDetections = useMemo(() => {
    const roleOrder: UserRole[] = ["l1", "l2", "l3"];
    const roleIndex = roleOrder.indexOf(role);
    return detections.map((item) => {
      const ownReview = item.reviews.find((review) => review.level === role);
      const prerequisitesDone = roleOrder.slice(0, roleIndex).every((level) => item.reviews.some((review) => review.level === level));
      return { ...item, status: ownReview?.status ?? (prerequisitesDone ? "pending" : item.status) } as DetectionDto;
    });
  }, [detections, role]);
  const nativeFilteredDetections = useMemo(() => {
    let rows = roleDetections;
    if (listTab === "pending") rows = rows.filter((row) => row.status === "pending");
    if (listTab === "expiring") {
      rows = rows.filter((row) => row.status === "pending" && row.deadlineAt !== null && new Date(row.deadlineAt).getTime() - new Date(MOCK_NOW).getTime() <= 24 * 60 * 60 * 1000);
    }

    const ageDays = (row: DetectionDto) => Math.floor((new Date(MOCK_NOW).getTime() - new Date(row.detectedAt).getTime()) / 86400000);
    if (period === "today") rows = rows.filter((row) => ageDays(row) === 0);
    if (period === "week") rows = rows.filter((row) => ageDays(row) <= 7);
    if (period === "month") rows = rows.filter((row) => ageDays(row) <= 30);

    if (filtersDirty) {
      const activeTypes = filterLeafKeys.filter((key) => filters[key]);
      const activeCameras = cameraFilterKeys.filter((key) => filters[key]);
      const activeZones = (["zone1", "zone2"] as const).filter((key) => filters[key]);
      const activeStatuses = statusFilterKeys.filter((key) => filters[key]);
      const statusKey = (status: DetectionDto["status"]): FilterKey => status === "pending" ? "statusPending" : status === "violation" ? "statusViolation" : status === "ai_error" ? "statusAi" : "statusOverdue";
      rows = rows.filter((row) =>
        (activeTypes.length === 0 || activeTypes.includes(row.filterKey as FilterKey)) &&
        (activeCameras.length === 0 || activeCameras.includes(row.cameraFilterKey as FilterKey)) &&
        (activeZones.length === 0 || activeZones.includes(row.zoneKey)) &&
        (activeStatuses.length === 0 || activeStatuses.includes(statusKey(row.status)))
      );
    }
    return rows;
  }, [roleDetections, filters, filtersDirty, listTab, period]);
  const selectedDetection = detections.find((item) => item.id === selectedDetectionId) ?? detections[0];
  const selectedRoleDetection = roleDetections.find((item) => item.id === selectedDetectionId) ?? roleDetections[0];
  const notificationCount = useMemo(() => {
    const roleOrder: UserRole[] = ["l1", "l2", "l3"];
    const roleIndex = roleOrder.indexOf(role);
    return detections.filter((item) =>
      !item.reviews.some((review) => review.level === role) &&
      roleOrder.slice(0, roleIndex).every((level) => item.reviews.some((review) => review.level === level)) &&
      (role !== "l1" || item.status === "pending")
    ).length;
  }, [detections, role]);
  const hotspots = useMemo(
    () =>
      screenHotspots[screen] ?? [
        { ...stubFullSurface, w: current.width, h: current.height },
        ...topCycleHotspots,
        ...extendedSidebarHotspots
      ],
    [current.height, current.width, screen]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [screen]);

  useEffect(() => {
    const updateScale = () => setDesignScale(window.innerWidth / 1920);
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const goTo = (target: Screen) => {
    if (target === screen) return;
    setFiltersOpen(false);
    setRoleMenuOpen(false);
    setStatsMenu(null);
    setBackStack((value) => [...value, screen]);
    setForwardStack([]);
    setScreen(target);
    if (target === "detail" || target === "detail1" || target === "detail2") {
      setDecision(null);
      setDecisionSubmitted(false);
    }
  };

  const goToRoleList = (targetRole = role, targetTab = listTab) => {
    goTo(roleListScreens[targetRole][targetTab]);
  };

  const goBack = () => {
    setBackStack((value) => {
      const target = value.at(-1);
      if (!target) return value;
      setForwardStack((forward) => [screen, ...forward]);
      setScreen(target);
      return value.slice(0, -1);
    });
  };

  const goForward = () => {
    setForwardStack((value) => {
      const [target, ...rest] = value;
      if (!target) return value;
      setBackStack((back) => [...back, screen]);
      setScreen(target);
      return rest;
    });
  };

  const navigate = (hotspot: Hotspot) => {
    if (hotspot.to) {
      if (hotspot.to === "home") goTo(roleHomeScreens[role]);
      else if (hotspot.to === "stats") goTo(roleStatsScreens[role]);
      else if (hotspot.to === "list") goToRoleList();
      else goTo(hotspot.to);
      return;
    }

    if (hotspot.action === "openRoleList") {
      goToRoleList();
      return;
    }

    if (hotspot.action === "selectListTab" && hotspot.listTab) {
      setListTab(hotspot.listTab);
      goToRoleList(role, hotspot.listTab);
      return;
    }

    if (hotspot.action === "cycleRole") {
      setRoleMenuOpen((value) => !value);
      setFiltersOpen(false);
      return;
    }

    if (hotspot.action === "toggleFilters") {
      setFiltersOpen(true);
      setRoleMenuOpen(false);
      return;
    }

    if (hotspot.action === "closeFilters") {
      setFiltersOpen(false);
      return;
    }

    if (hotspot.action === "clearFilters") {
      setFilters(
        Object.fromEntries(Object.keys(defaultFilters).map((key) => [key, false])) as Record<FilterKey, boolean>
      );
      setFiltersDirty(false);
      return;
    }

    if (hotspot.action === "toggleFilterItem" && hotspot.filterKey) {
      setFilters((value) => ({ ...value, [hotspot.filterKey as FilterKey]: !value[hotspot.filterKey as FilterKey] }));
      setFiltersDirty(true);
      return;
    }

    if (hotspot.action === "openDetail") {
      goTo(roleDetailScreens[role]);
      return;
    }

    if (hotspot.action === "detailStateOne") {
      goTo("detail1");
      return;
    }

    if (hotspot.action === "detailStateTwo") {
      goTo("detail2");
      return;
    }

    if (hotspot.action === "statsState") {
      if (!statsScreens.has(screen)) goTo(getStatsState(screen));
      return;
    }

    if (hotspot.action === "variantNext") {
      if (!statsScreens.has(screen)) goTo(getVariantScreen(screen));
      return;
    }

    if (hotspot.action === "next") {
      goForward();
      return;
    }

    if (hotspot.action === "prev") {
      goBack();
    }
  };

  const selectRole = (nextRole: UserRole) => {
    let target = roleListScreens[nextRole].all;
    if (homeScreens.has(screen)) target = roleHomeScreens[nextRole];
    else if (detailScreens.has(screen)) target = roleDetailScreens[nextRole];
    else if (statsScreens.has(screen)) target = roleStatsScreens[nextRole];
    else if (listScreens.has(screen)) target = roleListScreens[nextRole][listTab];

    setRole(nextRole);
    setRoleMenuOpen(false);
    setFiltersOpen(false);
    goTo(target);
  };

  const toggleFilter = (key: FilterKey) => {
    setFilters((value) => {
      if (key === "ppe") {
        const shouldSelectAll = ppeFilterKeys.some((childKey) => !value[childKey]);
        return {
          ...value,
          ppe: shouldSelectAll,
          ...Object.fromEntries(ppeFilterKeys.map((childKey) => [childKey, shouldSelectAll]))
        } as Record<FilterKey, boolean>;
      }

      const next = { ...value, [key]: !value[key] };
      if (ppeFilterKeys.includes(key)) {
        next.ppe = ppeFilterKeys.some((childKey) => next[childKey]);
      }
      return next;
    });
    setFiltersDirty(true);
  };

  const clearFilters = () => {
    setFilters(Object.fromEntries(Object.keys(defaultFilters).map((key) => [key, false])) as Record<FilterKey, boolean>);
    setPeriod("all");
    setFiltersDirty(false);
  };

  const openNativeDetection = (id: string) => {
    setSelectedDetectionId(id);
    setDecision(null);
    setDecisionSubmitted(false);
    goTo(roleDetailScreens[role]);
  };

  const submitNativeDecision = () => {
    if (!decision || !selectedDetection) return;
    const nextStatus = decision === "violation" ? "violation" : "ai_error";
    const profile = role === "l1"
      ? { reviewer: "Иванов С. Р.", position: "Мастер буровой • Бригада № 2" }
      : role === "l2"
        ? { reviewer: "Захаров-Добровольский А. В.", position: "Заместитель начальника ЦИТС" }
        : { reviewer: "Константинопольская О. В.", position: "Ответственный за ОТиПБ" };
    const review: ReviewDto = {
      level: role,
      reviewer: profile.reviewer,
      position: profile.position,
      status: nextStatus,
      reviewedAt: MOCK_NOW,
      comment: decision === "violation" ? "Нарушение подтверждено" : "Обнаружение отмечено как ошибка ИИ"
    };
    setDetections((items) => items.map((item) => item.id === selectedDetection.id
      ? { ...item, status: nextStatus, reviews: [...item.reviews.filter((itemReview) => itemReview.level !== role), review] }
      : item));
    setDecisionSubmitted(true);
  };

  if (isRoleList || isDetailScreen) {
    const designHeight = isDetailScreen ? 1358 : 980;
    return (
      <div className="native-detections-viewport" style={{ height: designHeight * designScale }}>
      <main className="figma-app native-detections-shell" style={{ minHeight: designHeight, transform: `scale(${designScale})` }} data-contract-version={pythonBackendContract.version}>
        <DetectionSidebar
          active={isRoleList ? "detections" : "detail"}
          notifications={notificationCount}
          onHome={() => goTo(roleHomeScreens[role])}
          onDetections={() => goToRoleList(role, listTab)}
          onStatistics={() => goTo(roleStatsScreens[role])}
        />
        {isRoleList ? (
          <NativeDetectionsList
            role={role}
            tab={listTab}
            rows={nativeFilteredDetections}
            allRows={roleDetections}
            now={MOCK_NOW}
            filterCount={appliedFilterCount}
            onTab={(nextTab) => {
              setListTab(nextTab);
              setFiltersOpen(false);
            }}
            onFilters={() => {
              setFiltersOpen(true);
              setRoleMenuOpen(false);
            }}
            onRole={() => {
              setRoleMenuOpen((value) => !value);
              setFiltersOpen(false);
            }}
            onOpen={openNativeDetection}
            onBack={goBack}
            onForward={goForward}
          />
        ) : (
          <NativeDetectionDetail
            role={role}
            detection={selectedRoleDetection}
            now={MOCK_NOW}
            decision={decision}
            submitted={decisionSubmitted}
            onDecision={(nextDecision) => {
              setDecision(nextDecision);
              setDecisionSubmitted(false);
            }}
            onSubmit={submitNativeDecision}
            onRole={() => {
              setRoleMenuOpen((value) => !value);
              setFiltersOpen(false);
            }}
            onBack={goBack}
            onForward={goForward}
          />
        )}
        {filtersOpen && isRoleList && (
          <FilterPanel
            role={role}
            filters={filters}
            count={appliedFilterCount}
            period={period}
            onToggle={toggleFilter}
            onPeriodChange={(nextPeriod) => {
              setPeriod(nextPeriod);
              setFiltersDirty(true);
            }}
            onClear={clearFilters}
            onClose={() => setFiltersOpen(false)}
          />
        )}
        {roleMenuOpen && <RoleMenu currentRole={role} onSelect={selectRole} />}
      </main>
      </div>
    );
  }

  return (
    <main className="figma-app" data-contract-version={pythonBackendContract.version}>
      <section
        className="figma-stage"
        style={{ "--frame-width": current.width, "--frame-height": current.height } as CSSProperties}
        aria-label={current.title}
      >
        <img className="figma-frame-image" src={encodeURI(`${svgBase}${current.file}`)} alt={current.title} />
        {!(isRoleList && (listTab !== "all" || filtersDirty)) && screenRenderArtifacts[screen]?.map((icon) => (
          <RenderArtifactPatch key={`${screen}-${icon.x}-${icon.y}`} icon={icon} current={current} />
        ))}
        {isRoleList && (listTab !== "all" || filtersDirty) && (
          <FilteredRowsOverlay rows={filteredRows} sourceScreen={screen} onOpen={() => goTo(roleDetailScreens[role])} />
        )}
        {hotspots.map((hotspot) => (
          <button
            key={`${hotspot.label}-${hotspot.x}-${hotspot.y}`}
            className="figma-hotspot"
            style={{
              left: `${(hotspot.x / current.width) * 100}%`,
              top: `${(hotspot.y / current.height) * 100}%`,
              width: `${(hotspot.w / current.width) * 100}%`,
              height: `${(hotspot.h / current.height) * 100}%`
            }}
            onClick={() => navigate(hotspot)}
            aria-label={hotspot.label}
          />
        ))}
        {isRoleList && (
          <ListTabsOverlay
            active={listTab}
            onSelect={(nextTab) => {
              setListTab(nextTab);
              goToRoleList(role, nextTab);
            }}
          />
        )}
        {isRoleList && (
          <button
            type="button"
            className={`real-filter-trigger ${filtersOpen || appliedFilterCount > 0 ? "is-active" : ""}`}
            onClick={() => {
              setFiltersOpen(true);
              setRoleMenuOpen(false);
            }}
            aria-label="Фильтры"
          >
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M9 3h14l7 13-7 13H9L2 16 9 3Z" />
              <path d="M10 10h12l-5 6v6l-2 1v-7l-5-6Z" />
            </svg>
            <span>{appliedFilterCount}</span>
          </button>
        )}
        {filtersOpen && isRoleList && (
          <FilterPanel
            role={role}
            filters={filters}
            count={appliedFilterCount}
            period={period}
            onToggle={toggleFilter}
            onPeriodChange={(nextPeriod) => {
              setPeriod(nextPeriod);
              setFiltersDirty(true);
            }}
            onClear={clearFilters}
            onClose={() => setFiltersOpen(false)}
          />
        )}
        {statsScreens.has(screen) && screen !== "biAnalyticsDashboard" && screen !== "crop7" && screen !== "crop8" && screen !== "crop9" && screen !== "crop10" && (
          <StatsControls
            current={current}
            period={statsPeriod}
            menu={statsMenu}
            onMenu={setStatsMenu}
            onPeriod={setStatsPeriod}
          />
        )}
        {roleMenuOpen && <RoleMenu currentRole={role} onSelect={selectRole} />}
        {isDetailScreen && (
          <DecisionControls
            decision={decision}
            submitted={decisionSubmitted}
            onSelect={(nextDecision) => {
              setDecision(nextDecision);
              setDecisionSubmitted(false);
            }}
            onSubmit={() => {
              if (decision) setDecisionSubmitted(true);
            }}
          />
        )}
        {screen === "listAlt" && (
          <StaticToastControls
            dismissed={dismissedToasts}
            onDismiss={(id) => setDismissedToasts((value) => new Set([...value, id]))}
          />
        )}
        {(screen as Screen) === "detail1" && (
          <DetailToastControls
            dismissed={dismissedToasts}
            onDismiss={(id) => setDismissedToasts((value) => new Set([...value, id]))}
          />
        )}
        {(isDetailScreen || statsScreens.has(screen)) && (
          <svg
            className="role-header-correction"
            style={{ height: `${(60 / current.height) * 100}%` }}
            viewBox="1580 0 340 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <image href={encodeURI(`${svgBase}${screens[roleHeaderScreens[role]].file}`)} width="1920" height="980" />
          </svg>
        )}
      </section>
    </main>
  );
}

export default App;
