const counter = {
  count: 0,
};

let currentDate = new Date().toDateString();

/**
 * About:
 * This function has been created with the intention to adjust the barrier to the access of emergency service based on the live demand.
 * The counter is reset at the start of the new day since our demand is based on a single day.
 */
function countFunctionCalls(counter) {
  const today = new Date().toDateString();

  if (today !== currentDate) {
    counter.count = 0;
    currentDate = today;
  }
  counter.count++;
  return counter.count;
}

/**
 * About:
 * Based on the counter value, the score that the patient has to pass increases.
 * Based on the highest score possible (63.4), I have set the barriers as 20, 30, 40 for honestly no particular reason.
 */

export function checkOverBarrier(emergencyScore) {
  const callsCount = countFunctionCalls(counter);

  if (callsCount < 10) {
    const isOverBarrier = emergencyScore >= 20;
    console.log(
      `Emergency score (${emergencyScore}) is over the barrier: ${isOverBarrier}`,
      callsCount
    );
    return isOverBarrier;
  } else if (callsCount >= 10 && callsCount < 50) {
    const isOverBarrier = emergencyScore > 30;
    console.log(
      `Emergency score (${emergencyScore}) is over the barrier: ${isOverBarrier}`
    );
    return isOverBarrier;
  } else {
    const isOverBarrier = emergencyScore > 40;
    console.log(
      `Emergency score (${emergencyScore}) is over the barrier: ${isOverBarrier}`
    );
    return isOverBarrier;
  }
}
