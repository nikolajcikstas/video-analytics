import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Binoculars,
  Check,
  Clock3,
  Eye,
  Filter,
  Hand,
  Hexagon,
  Home,
  Maximize,
  Minus,
  Pause,
  PieChart,
  Play,
  Plus,
  Search,
  Share2,
  SkipBack,
  SkipForward,
  X
} from "lucide-react";
import type { DetectionDto, DetectionStatus, ReviewDto } from "./data/pythonBackendStubs";

export type NativeRole = "l1" | "l2" | "l3";
export type NativeListTab = "all" | "pending" | "expiring";
export type DetectionDecision = "violation" | "notViolation";

const profiles: Record<NativeRole, { initials: string; name: string; title: string }> = {
  l1: { initials: "СИ", name: "Иванов С. Р.", title: "Мастер буровой • Бригада № 2" },
  l2: { initials: "АЗ", name: "Захаров-Добровольский А. В.", title: "Заместитель начальника ЦИТС" },
  l3: { initials: "ОК", name: "Константинопольская О. В.", title: "Ответственный за ОТиПБ" }
};

const statusLabels: Record<DetectionStatus, string> = {
  pending: "Ожидает обработки",
  violation: "Нарушение",
  ai_error: "Ошибка ИИ",
  expired: "Просрочено"
};

function formatDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(date).replace(",", "");
}

function getRemaining(deadline: string | null, now: string) {
  if (!deadline) return null;
  return Math.max(0, Math.round((new Date(deadline).getTime() - new Date(now).getTime()) / 60000));
}

function relativeDetected(value: string, now: string) {
  const minutes = Math.max(0, Math.round((new Date(now).getTime() - new Date(value).getTime()) / 60000));
  if (minutes <= 1) return "Сейчас";
  if (minutes < 60) return `${minutes} минуты назад`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)} часа назад`;
  if (minutes < 48 * 60) return "Вчера";
  return `${Math.floor(minutes / 1440)} дня назад`;
}

function remainingLabel(minutes: number) {
  if (minutes <= 60) return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  if (minutes <= 1440) return "Осталось меньше 1 дня";
  const days = Math.ceil(minutes / 1440);
  return `Осталось ${days} дня`;
}

function Flame() {
  return <img className="native-flame" src="/icons/fire.svg" alt="" aria-hidden="true" />;
}

function StatusBadge({ status }: { status: DetectionStatus }) {
  return <span className={`native-status native-status-${status}`}>{statusLabels[status]}</span>;
}

export function DetectionSidebar({
  active,
  notifications,
  onHome,
  onDetections,
  onStatistics
}: {
  active: "detections" | "detail";
  notifications: number;
  onHome: () => void;
  onDetections: () => void;
  onStatistics: () => void;
}) {
  const items = [
    { key: "home", label: "Начальный экран", icon: Home, action: onHome },
    { key: "detections", label: "Обнаружения", icon: Binoculars, action: onDetections },
    { key: "statistics", label: "Статистика", icon: PieChart, action: onStatistics }
  ];

  return (
    <nav className="detection-sidebar" aria-label="Основная навигация">
      {items.map(({ key, label, icon: Icon, action }) => (
        <button key={key} type="button" className={key === "detections" && (active === "detections" || active === "detail") ? "is-active" : ""} onClick={action} aria-label={label}>
          <Icon aria-hidden="true" />
          {(key === "home" || key === "detections") && notifications > 0 && <span>{notifications}</span>}
        </button>
      ))}
    </nav>
  );
}

function ProfileButton({ role, onClick }: { role: NativeRole; onClick: () => void }) {
  const profile = profiles[role];
  return (
    <button type="button" className="detections-profile" onClick={onClick} aria-label="Переключить роль">
      <span>{profile.initials}</span>
      <b>{profile.name}</b>
      <i>• {role.toUpperCase()}</i>
    </button>
  );
}

function Header({
  role,
  tab,
  pendingCount,
  expiringCount,
  title,
  onBack,
  onForward,
  onTab,
  onRole,
  onFilters,
  filterCount,
  onSearch
}: {
  role: NativeRole;
  tab?: NativeListTab;
  pendingCount: number;
  expiringCount: number;
  title: string;
  onBack: () => void;
  onForward: () => void;
  onTab?: (tab: NativeListTab) => void;
  onRole: () => void;
  onFilters?: () => void;
  filterCount?: number;
  onSearch?: () => void;
}) {
  return (
    <header className="detections-header">
      <button type="button" className="header-icon-button" onClick={onBack} aria-label="Назад"><ArrowLeft /></button>
      <button type="button" className="header-icon-button" onClick={onForward} aria-label="Вперёд"><ArrowRight /></button>
      <strong>{title}</strong>
      {onTab && tab && (
        <div className="detections-tabs" role="tablist">
          <button type="button" className={tab === "all" ? "is-active" : ""} onClick={() => onTab("all")}>Все</button>
          <button type="button" className={tab === "pending" ? "is-active" : ""} onClick={() => onTab("pending")}>Ожидают • {pendingCount}</button>
          <button type="button" className={tab === "expiring" ? "is-active" : ""} onClick={() => onTab("expiring")}>Истекают • {expiringCount}</button>
        </div>
      )}
      {onTab && (
        <div className="header-actions">
          <span>122 / 122</span>
          <button type="button" className="header-filter-button" onClick={onFilters} aria-label="Фильтры"><Hexagon /><Filter /><b>{filterCount ?? 0}</b></button>
          <button type="button" className="header-icon-button" onClick={onSearch} aria-label="Поиск"><Search /></button>
          <button type="button" className="header-icon-button" aria-label="Поделиться"><Share2 /></button>
        </div>
      )}
      <ProfileButton role={role} onClick={onRole} />
      {onTab && <Hand className="header-hand" aria-hidden="true" />}
    </header>
  );
}

export function NativeDetectionsList({
  role,
  tab,
  rows,
  allRows,
  now,
  filterCount,
  onTab,
  onFilters,
  onRole,
  onOpen,
  onBack,
  onForward
}: {
  role: NativeRole;
  tab: NativeListTab;
  rows: DetectionDto[];
  allRows: DetectionDto[];
  now: string;
  filterCount: number;
  onTab: (tab: NativeListTab) => void;
  onFilters: () => void;
  onRole: () => void;
  onOpen: (id: string) => void;
  onBack: () => void;
  onForward: () => void;
}) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searched = useMemo(() => {
    const value = query.trim().toLocaleLowerCase("ru");
    if (!value) return rows;
    return rows.filter((row) => [row.id, row.title, row.objectName, row.type, row.zoneName, row.cameraId, row.cameraName, ...row.violators].some((item) => item.toLocaleLowerCase("ru").includes(value)));
  }, [query, rows]);
  const pendingCount = allRows.filter((row) => row.status === "pending").length;
  const expiringCount = allRows.filter((row) => row.status === "pending" && (getRemaining(row.deadlineAt, now) ?? Number.MAX_SAFE_INTEGER) <= 1440).length;

  return (
    <section className="detections-workspace">
      <Header role={role} tab={tab} pendingCount={pendingCount} expiringCount={expiringCount} title="Обнаружения" onBack={onBack} onForward={onForward} onTab={onTab} onRole={onRole} onFilters={onFilters} filterCount={filterCount} onSearch={() => setSearchOpen((value) => !value)} />
      {searchOpen && <label className="detections-search-popover"><Search aria-hidden="true" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по ID, объекту, нарушителю" /></label>}
      <div className="detections-table" role="table" aria-label="Список обнаружений">
        <div className="detections-table-head" role="row">
          <span /><span>ID</span><span>Дата и время ↓</span><span>Предполагаемое нарушение</span><span>Тип</span><span>Зона обнаружения</span><span>Камера</span><span>Статус • Вы</span><span>Нарушители</span>
        </div>
        {searched.map((row) => {
          const remaining = getRemaining(row.deadlineAt, now);
          const relative = relativeDetected(row.detectedAt, now);
          return (
            <button type="button" className="detection-row" key={row.id} onClick={() => onOpen(row.id)} role="row">
              <span className="detection-thumbnail"><img src={row.imageUrl} alt="" style={{ objectPosition: row.imagePosition, transformOrigin: row.imagePosition }} /></span>
              <span>{row.id}</span>
              <span>{formatDate(row.detectedAt)}<small className={relative === "Сейчас" ? "is-now" : ""}>{relative}{relative === "Сейчас" && <Flame />}</small></span>
              <span><b>{row.title}</b></span>
              <span>{row.type}</span>
              <span>{row.zoneName}</span>
              <span>{row.cameraId}<small>{row.cameraName}</small></span>
              <span className="detection-status-cell">
                <StatusBadge status={row.status} />
                {row.deadlineAt && <small>до {formatDate(row.deadlineAt)}</small>}
                {row.status === "pending" && remaining !== null && <small className={remaining <= 60 ? "is-urgent" : ""}>{remaining <= 60 && <Flame />}{remainingLabel(remaining)}</small>}
              </span>
              <span>{row.violators.length ? row.violators.join(", ") : "—"}</span>
            </button>
          );
        })}
        {!searched.length && <div className="detections-empty">По выбранным фильтрам ничего не найдено</div>}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: ReviewDto }) {
  return (
    <article className="review-card">
      <div className="review-person"><span>{review.level.toUpperCase()}</span><i>{profiles[review.level].initials}</i><div><b>{review.reviewer}</b><small>{review.position}</small><small>{formatDate(review.reviewedAt)}</small></div></div>
      <dl>
        <dt>Статус</dt><dd><StatusBadge status={review.status} /></dd>
        {!!review.violators?.length && <><dt>Нарушители</dt><dd>{review.violators.join(", ")}</dd></>}
        {review.comment && <><dt>Комментарий</dt><dd>{review.comment}</dd></>}
      </dl>
    </article>
  );
}

function DecisionCard({ role, decision, submitted, onSelect, onSubmit }: {
  role: NativeRole;
  decision: DetectionDecision | null;
  submitted: boolean;
  onSelect: (decision: DetectionDecision) => void;
  onSubmit: () => void;
}) {
  const profile = profiles[role];
  return (
    <article className="review-card decision-card">
      <div className="review-person"><span>{role.toUpperCase()} • Вы</span><i>{profile.initials}</i><div><b>{profile.name}</b><small>{profile.title}</small></div></div>
      <p>Как вы оцениваете это обнаружение?</p>
      <div className="detail-decision-buttons">
        <button type="button" className={decision === "violation" ? "is-selected" : ""} onClick={() => onSelect("violation")}><Check />Это нарушение</button>
        <button type="button" className={decision === "notViolation" ? "is-selected" : ""} onClick={() => onSelect("notViolation")}><X />Это не нарушение</button>
      </div>
      <button type="button" className="detail-submit" disabled={!decision || submitted} onClick={onSubmit}>{submitted ? "Отправлено" : "Отправить"}</button>
    </article>
  );
}

export function NativeDetectionDetail({
  role,
  detection,
  now,
  decision,
  submitted,
  onDecision,
  onSubmit,
  onRole,
  onBack,
  onForward
}: {
  role: NativeRole;
  detection: DetectionDto;
  now: string;
  decision: DetectionDecision | null;
  submitted: boolean;
  onDecision: (decision: DetectionDecision) => void;
  onSubmit: () => void;
  onRole: () => void;
  onBack: () => void;
  onForward: () => void;
}) {
  const remaining = getRemaining(detection.deadlineAt, now);
  const roleOrder: NativeRole[] = ["l1", "l2", "l3"];
  const roleIndex = roleOrder.indexOf(role);
  const history = detection.reviews
    .filter((review) => roleOrder.indexOf(review.level) <= roleIndex)
    .sort((left, right) => roleOrder.indexOf(left.level) - roleOrder.indexOf(right.level));
  const previousReviewsDone = roleOrder.slice(0, roleIndex).every((level) => detection.reviews.some((review) => review.level === level));
  const canReview = detection.status === "pending" && previousReviewsDone && !history.some((review) => review.level === role);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [boxVisible, setBoxVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const box = detection.boundingBox ?? { x: 48, y: 29, width: 22, height: 45 };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      void mediaRef.current?.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  };

  return (
    <section className="detections-workspace detail-workspace">
      <Header role={role} pendingCount={0} expiringCount={0} title={`Обнаружение ${detection.id} • ${detection.title}`} onBack={onBack} onForward={onForward} onRole={onRole} />
      <div className="detail-layout">
        <div className="detail-media" ref={mediaRef}>
          <div className="video-frame">
            <img src={detection.imageUrl} alt={detection.title} style={{ objectPosition: detection.imagePosition, transform: `scale(${zoom})` }} />
            {boxVisible && (
              <span
                className="detection-bounding-box"
                style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.width}%`, height: `${box.height}%` }}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="video-view-controls" aria-label="Управление отображением">
            <button type="button" className={boxVisible ? "is-active" : ""} onClick={() => setBoxVisible((value) => !value)} aria-label="Показать или скрыть рамку"><Eye /></button>
            <button type="button" onClick={() => setZoom((value) => Math.min(1.4, Number((value + 0.1).toFixed(1))))} aria-label="Увеличить"><Plus /></button>
            <button type="button" onClick={() => setZoom((value) => Math.max(1, Number((value - 0.1).toFixed(1))))} aria-label="Уменьшить"><Minus /></button>
          </div>
          <div className="video-timeline" aria-label="Шкала записи">
            <div className="timeline-labels"><span>13:33:39</span><span>13:34:09</span><span>13:34:29</span></div>
            <div className="timeline-ticks"><i /></div>
            <div className="timeline-controls">
              <button type="button" aria-label="Предыдущий кадр"><SkipBack /></button>
              <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Пауза" : "Воспроизвести"}>{playing ? <Pause /> : <Play />}</button>
              <button type="button" aria-label="Следующий кадр"><SkipForward /></button>
              <div><span /></div>
              <button type="button" onClick={toggleFullscreen} aria-label="На весь экран"><Maximize /></button>
            </div>
          </div>
        </div>
        <aside className="detail-panel">
          <h1>{detection.title}</h1>
          <dl className="detail-fields">
            <dt>Статус • Вы</dt><dd><StatusBadge status={detection.status} /></dd>
            <dt>ID</dt><dd>{detection.id}</dd>
            <dt>Дата и время</dt><dd>{formatDate(detection.detectedAt)}<small>{relativeDetected(detection.detectedAt, now)}</small></dd>
            <dt>Тип</dt><dd>{detection.type}</dd>
            <dt>Объект</dt><dd>{detection.objectName}</dd>
            <dt>Мастер</dt><dd>{detection.master}</dd>
            <dt>Бригада</dt><dd>{detection.brigade}</dd>
            <dt>Зона</dt><dd>{detection.zoneName}</dd>
            <dt>Камера</dt><dd>{detection.cameraId}<small>{detection.cameraName}</small></dd>
            <dt>Поступило</dt><dd>{formatDate(detection.receivedAt)}</dd>
            {detection.deadlineAt && <><dt>Обработать</dt><dd>до {formatDate(detection.deadlineAt)}{remaining !== null && <small className={remaining <= 60 ? "is-urgent" : ""}>{remaining <= 60 && <Flame />}{remainingLabel(remaining)}</small>}</dd></>}
          </dl>
          <div className="review-stack">
            {history.map((review, index) => <ReviewCard key={`${review.level}-${index}`} review={review} />)}
            {canReview && <DecisionCard role={role} decision={decision} submitted={submitted} onSelect={onDecision} onSubmit={onSubmit} />}
          </div>
        </aside>
      </div>
    </section>
  );
}
