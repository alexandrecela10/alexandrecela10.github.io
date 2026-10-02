// Shield: the three calculations the demo shows.
// 1. deadline()      : when a contract notice window closes, and how many days are left
// 2. verifyQuote()   : is the quoted text really inside the source document?
// 3. equityAtRisk()  : what a lost position would cost the fund, in equity terms
// Same file runs in the browser (window.NC) and in Node for the tests (module.exports).
(function (root) {
  "use strict";

  var DAY_MS = 24 * 60 * 60 * 1000;

  // Read "2026-08-04" as a calendar date at UTC midnight, so time zones can't shift it by a day.
  function toDate(iso) {
    var p = iso.split("-").map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2]));
  }
  function toIso(d) { return d.toISOString().slice(0, 10); }
  function addDays(iso, n) { return toIso(new Date(toDate(iso).getTime() + n * DAY_MS)); }
  function daysBetween(fromIso, toIsoDate) { return Math.round((toDate(toIsoDate) - toDate(fromIso)) / DAY_MS); }

  // Deadline rule, same as the agent's rules engine (nodes.compute_deadlines):
  //   deadline = trigger date + notice period of the clause.
  // One addition the agent doesn't have: if an amendment changes the period and the
  // amendment is in the archive, the amended period wins. If the amendment is missing,
  // the original period is used and the result is flagged provisional (as in the agent).
  function deadline(input) {
    var period = input.periodDays;
    var provisional = false;
    var basis = "contract notice period";
    if (input.amendment) {
      if (input.amendment.inArchive) {
        period = input.amendment.periodDays;
        basis = input.amendment.id + " period";
      } else {
        provisional = true;
        basis = input.amendment.id + " referenced but missing from archive";
      }
    }
    var due = addDays(input.triggerDate, period);
    var left = daysBetween(input.today, due);
    // Status labels used in the page. DUE SOON = 7 days or fewer, PASSED = before today.
    var status = left < 0 ? "PASSED" : left <= 7 ? "DUE SOON" : "OPEN";
    return { deadline: due, periodDays: period, daysLeft: left, status: status, provisional: provisional, basis: basis };
  }

  // Citation check, same rule as the agent (nodes.verify_citations):
  // the quote must appear word for word in the document, or the evidence is not shown as verified.
  function verifyQuote(docText, quote) {
    return typeof docText === "string" && quote.length > 0 && docText.indexOf(quote) !== -1;
  }

  // Project-level exposure of one event if ProjectCo loses its position:
  //   critical-path delay beyond float x daily cost of delay, plus direct cost.
  function exposure(ev, dailyDelayCost) {
    var netDelay = Math.max(0, ev.delayDays - ev.floatDays);
    return { netDelayDays: netDelay, usd: netDelay * dailyDelayCost + ev.directCostUsd };
  }

  // Equity view across the open events:
  //   1. add up project exposure,
  //   2. remaining owner contingency absorbs the first dollars,
  //   3. the rest is funded by equity, and the fund carries its ownership share,
  //   4. each event gets its pro rata slice, so the slices add up to the total.
  function equityAtRisk(events, a) {
    var rows = events.map(function (ev) { return { id: ev.id, exposureUsd: exposure(ev, a.dailyDelayCostUsd).usd }; });
    var total = rows.reduce(function (s, r) { return s + r.exposureUsd; }, 0);
    var aboveContingency = Math.max(0, total - a.contingencyUsd);
    var fundEquity = aboveContingency * a.fundShare;
    rows.forEach(function (r) {
      r.fundEquityUsd = total > 0 ? fundEquity * r.exposureUsd / total : 0;
      r.pctOfStake = r.fundEquityUsd / a.stakeValueUsd;
    });
    return { totalExposureUsd: total, aboveContingencyUsd: aboveContingency, fundEquityUsd: fundEquity,
             pctOfStake: fundEquity / a.stakeValueUsd, rows: rows };
  }

  var api = { addDays: addDays, daysBetween: daysBetween, deadline: deadline, verifyQuote: verifyQuote,
              exposure: exposure, equityAtRisk: equityAtRisk };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.NC = api;
})(this);
