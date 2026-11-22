// Pure transition rules, shared by card controls and regression tests.
function reduceCardState(state, event) {
  if (event.type !== "layout") return state;
  if (!["compact", "expanded", "minimized"].includes(event.layout))
    throw new Error("Invalid card layout");
  return { ...state, layout: event.layout };
}

// Real time must stay in sync after a background tab or a slow rendering frame.
function advanceClock(time, now, elapsed, rate, live) {
  return live ? now : time + Math.min(100, Math.max(0, elapsed)) * rate;
}
