

// 遅刻と早退の判定
export const standardStartTime = "10:00:00";
export const standardEndTime = "19:00:00";

export const isLateAttendance = (attendanceTime: string) => {
  return attendanceTime > standardStartTime;
};

export const isEarlyLeaving = (leavingTime: string | undefined) => {
  return leavingTime !== undefined && leavingTime < standardEndTime;
};