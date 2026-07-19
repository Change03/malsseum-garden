"use client";

import Link from "next/link";
import {
  CampaignDay,
  daysForWeek,
  WeekData,
  completionFor,
  formatDay,
} from "./model";

type WeekStripProps = {
  data: WeekData;
  selectedDayId?: string;
};

export function WeekStrip({ data, selectedDayId }: WeekStripProps) {
  const selectedDay = data.days.find((day) => day.id === selectedDayId);
  const selectedWeekNumber = selectedDay?.weekNumber ?? data.activeWeekNumber;
  const days = daysForWeek(data, selectedWeekNumber);
  return (
    <div className="weekSchedule">
      <WeekSelector data={data} selectedWeekNumber={selectedWeekNumber} />
      <div className="weekStrip" role="list" aria-label={`${selectedWeekNumber}주차 7일 묵상 일정`}>
        {days.map((day) => {
          const completed = completionFor(data, data.currentUser.id, day.id);
          const selected = selectedDayId === day.id;
          return (
            <Link
              key={day.id}
              href={`/day/${encodeURIComponent(day.date)}`}
              className={`weekDay ${selected ? "selected" : ""} ${completed ? "completed" : ""} ${day.isFuture ? "future" : ""}`}
              aria-current={selected ? "page" : day.isToday ? "date" : undefined}
              role="listitem"
            >
              <span>{shortWeekday(day)}</span>
              <strong>{Number(day.date.slice(-2)) || day.weekDayOrder}</strong>
              <i
                aria-label={
                  day.isFuture
                    ? "아직 시작 전, 읽음 체크 잠김"
                    : completed
                      ? "읽음 완료"
                      : "아직 읽지 않음"
                }
              >
                {day.isFuture ? "–" : completed ? "✓" : ""}
              </i>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function WeekSelector({
  data,
  selectedWeekNumber,
  onSelect,
}: {
  data: WeekData;
  selectedWeekNumber: number;
  onSelect?: (weekNumber: number) => void;
}) {
  return (
    <div className="weekSelector" aria-label="묵상 주차 선택">
      {data.weeks.map((week) => {
        const selected = week.number === selectedWeekNumber;
        const label = `${week.number}주차 · ${compactDate(week.startDate)}–${compactDate(week.endDate)}`;
        if (onSelect) {
          return (
            <button
              key={week.number}
              type="button"
              className={selected ? "selected" : ""}
              aria-pressed={selected}
              onClick={() => onSelect(week.number)}
            >{label}</button>
          );
        }
        const firstDay = data.days.find((day) => day.id === week.dayIds[0]);
        return (
          <Link
            key={week.number}
            href={firstDay ? `/day/${encodeURIComponent(firstDay.date)}` : "/"}
            className={selected ? "selected" : ""}
            aria-current={selected ? "true" : undefined}
          >{label}</Link>
        );
      })}
    </div>
  );
}

function shortWeekday(day: CampaignDay): string {
  const formatted = formatDay(day.date, { weekday: "short" });
  const match = formatted.match(/[월화수목금토일]/);
  return match?.[0] ?? `${day.order}일`;
}

function compactDate(date: string): string {
  if (!date) return "날짜 미정";
  return `${Number(date.slice(5, 7))}.${Number(date.slice(8, 10))}`;
}
