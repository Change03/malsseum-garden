"use client";

import {
  completionFor,
  daysForWeek,
  formatDay,
  gardenForWeek,
  WeekData,
} from "./model";

type CompletionMatrixProps = {
  data: WeekData;
  editable?: boolean;
  busyKey?: string;
  onToggle?: (participantId: string, dayId: string, completed: boolean) => void;
  onParticipantSelect?: (participantId: string) => void;
  weekNumber?: number;
};

export function CompletionMatrix({
  data,
  editable = false,
  busyKey,
  onToggle,
  onParticipantSelect,
  weekNumber = data.activeWeekNumber,
}: CompletionMatrixProps) {
  const days = daysForWeek(data, weekNumber);
  const garden = gardenForWeek(data, weekNumber);
  const participants = [...data.participants].sort((a, b) => {
    if (a.id === data.currentUser.id) return -1;
    if (b.id === data.currentUser.id) return 1;
    return data.participants.indexOf(a) - data.participants.indexOf(b);
  });
  return (
    <div className={`matrixScroller ${editable ? "matrixEditable" : "matrixCompact"}`} tabIndex={editable ? 0 : undefined} aria-label={`참여자별 7일 읽음 기록${editable ? ", 좌우로 스크롤할 수 있습니다" : ""}`}>
      <table className={`completionMatrix ${editable ? "editable" : "compact"}`}>
        <caption className="srOnly">참여자 {data.participants.length}명의 7일 묵상 읽음 현황</caption>
        <thead>
          <tr>
            <th scope="col">이름</th>
            {days.map((day) => (
              <th scope="col" key={day.id}>
                <span>{formatDay(day.date, { weekday: "short" }).match(/[월화수목금토일]/)?.[0] ?? day.order}</span>
                <strong>{Number(day.date.slice(-2)) || day.order}</strong>
              </th>
            ))}
            {editable ? <th scope="col"><span>완료</span><strong>합계</strong></th> : null}
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => {
            const rowCount = days.filter((day) => completionFor(data, participant.id, day.id)).length;
            const isMe = participant.id === data.currentUser.id;
            return (
              <tr key={participant.id} className={isMe ? "currentUserRow" : ""}>
                <th scope="row" className={onParticipantSelect ? "matrixPersonCell" : undefined}>
                  {onParticipantSelect ? (
                    <button
                      type="button"
                      className="matrixPersonButton"
                      aria-label={`${participant.name}${isMe ? ", 나" : ""}님의 7일 읽음 기록 수정하기`}
                      onClick={() => onParticipantSelect(participant.id)}
                    >
                      <span className="matrixAvatar">{participant.name.slice(0, 1)}</span>
                      <strong>{participant.name}</strong>
                      {isMe ? <i>나</i> : null}
                      <span className="matrixEditCue" aria-hidden="true">›</span>
                    </button>
                  ) : (
                    <>
                      <span className="matrixAvatar">{participant.name.slice(0, 1)}</span>
                      <strong>{participant.name}</strong>
                      {isMe ? <i>나</i> : null}
                    </>
                  )}
                </th>
                {days.map((day) => {
                  const complete = completionFor(data, participant.id, day.id);
                  const key = `${participant.id}:${day.id}`;
                  const future = day.isFuture;
                  return (
                    <td key={day.id}>
                      {editable ? (
                        <button
                          type="button"
                          className={complete ? "matrixCheck checked" : "matrixCheck"}
                          aria-label={`${participant.name}, ${formatDay(day.date)}, ${future ? "아직 시작 전, 수정할 수 없음" : complete ? "읽음 완료, 취소하기" : "읽지 않음, 완료로 표시하기"}`}
                          aria-pressed={complete}
                          disabled={busyKey === key || !day.canComplete}
                          onClick={() => onToggle?.(participant.id, day.id, !complete)}
                        >{busyKey === key ? "…" : future ? "–" : complete ? "✓" : "○"}</button>
                      ) : (
                        <span className={complete ? "matrixCheck checked" : "matrixCheck"} aria-label={`${participant.name}, ${formatDay(day.date)}, ${future ? "아직 시작 전" : complete ? "읽음 완료" : "아직 읽지 않음"}`}>{future ? "–" : complete ? "✓" : "○"}</span>
                      )}
                    </td>
                  );
                })}
                {editable ? <td><strong className="rowTotal">{rowCount}</strong><span className="rowTotalOutOf">/{days.length}</span></td> : null}
              </tr>
            );
          })}
        </tbody>
        {editable ? <tfoot>
          <tr>
            <th scope="row">날짜별</th>
            {days.map((day) => (
              <td key={day.id}>{data.participants.filter((participant) => completionFor(data, participant.id, day.id)).length}</td>
            ))}
            <td>{garden.completedCount}</td>
          </tr>
        </tfoot> : null}
      </table>
    </div>
  );
}
