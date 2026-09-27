import mongoose from "mongoose";

import AssessmentAttempt from "../models/AssessmentAttempt.js";

import {
  evaluateAttempt,
} from "./studentEvaluationService.js";


const MAX_TAB_SWITCHES = 2;


/* ============================================================
   VALID SECURITY EVENT TYPES
   ============================================================ */

const SECURITY_EVENT_TYPES = new Set([
  "TAB_SWITCH",
  "WINDOW_BLUR",
  "FULLSCREEN_EXIT",
  "COPY",
  "CUT",
  "PASTE",
  "RIGHT_CLICK",
  "PRINT_SHORTCUT",
  "SAVE_SHORTCUT",
  "DEVTOOLS_SHORTCUT",
]);


/* ============================================================
   HELPER
   ============================================================ */

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


/* ============================================================
   RECORD SECURITY VIOLATION
   ============================================================ */

export const recordSecurityViolation = async ({
  attemptId,
  studentId,
  type,
  userAgent = "",
}) => {

  if (!isValidObjectId(attemptId)) {
    throw new Error("Invalid attempt ID.");
  }

  if (!isValidObjectId(studentId)) {
    throw new Error("Invalid student ID.");
  }

  if (!SECURITY_EVENT_TYPES.has(type)) {
    throw new Error("Invalid security event.");
  }


  /* ==========================================================
     FIND STUDENT ATTEMPT
     ========================================================== */

  const attempt =
    await AssessmentAttempt.findOne({
      _id: attemptId,
      student: studentId,
    });


  if (!attempt) {
    throw new Error(
      "Assessment attempt not found."
    );
  }


  /* ==========================================================
     ALREADY SUBMITTED
     ========================================================== */

  if (
    attempt.status !== "IN_PROGRESS"
  ) {
    return {
      attemptId: attempt._id,

      status: attempt.status,

      securityViolationCount:
        attempt.securityViolationCount || 0,

      tabSwitchCount:
        attempt.tabSwitchCount || 0,

      fullscreenExitCount:
        attempt.fullscreenExitCount || 0,

      warning: false,

      autoSubmitted: false,

      alreadySubmitted: true,
    };
  }


  /* ==========================================================
     EXPIRY CHECK
     ========================================================== */

  const now = new Date();

  if (
    attempt.expiresAt &&
    now >= new Date(attempt.expiresAt)
  ) {

    await evaluateAttempt(
      attempt._id,
      studentId,
      "AUTO"
    );

    return {
      attemptId: attempt._id,

      status: "AUTO_SUBMITTED",

      securityViolationCount:
        attempt.securityViolationCount || 0,

      tabSwitchCount:
        attempt.tabSwitchCount || 0,

      warning: false,

      autoSubmitted: true,

      reason: "TIME_EXPIRED",
    };
  }


  /* ==========================================================
     ADD SECURITY EVENT
     ========================================================== */

  attempt.securityViolationCount =
    Number(
      attempt.securityViolationCount || 0
    ) + 1;


  attempt.lastSecurityViolationAt =
    now;


  if (!Array.isArray(
    attempt.securityViolations
  )) {
    attempt.securityViolations = [];
  }


  attempt.securityViolations.push({
    type,
    occurredAt: now,
    userAgent:
      String(userAgent || "")
        .substring(0, 500),
  });


  /* ==========================================================
     TAB SWITCH
     ========================================================== */

  if (type === "TAB_SWITCH") {

    attempt.tabSwitchCount =
      Number(
        attempt.tabSwitchCount || 0
      ) + 1;
  }


  /* ==========================================================
     FULLSCREEN EXIT
     ========================================================== */

  if (type === "FULLSCREEN_EXIT") {

    attempt.fullscreenExitCount =
      Number(
        attempt.fullscreenExitCount || 0
      ) + 1;
  }


  await attempt.save();


  /* ==========================================================
     SECOND TAB SWITCH => AUTO SUBMIT
     ========================================================== */

  if (
    type === "TAB_SWITCH" &&
    attempt.tabSwitchCount >=
      MAX_TAB_SWITCHES
  ) {

    attempt.securityAutoSubmitted =
      true;

    attempt.securityAutoSubmitReason =
      "TAB_SWITCH_LIMIT_REACHED";

    await attempt.save();


    /*
     * IMPORTANT:
     *
     * Do not manually set:
     *
     * status = AUTO_SUBMITTED
     *
     * here.
     *
     * evaluateAttempt() must do the final evaluation so:
     *
     * - score is calculated
     * - negative marking is calculated
     * - correct/wrong answers are calculated
     * - resultStatus is calculated
     * - passed is calculated
     */

    await evaluateAttempt(
      attempt._id,
      studentId,
      "AUTO"
    );


    return {
      attemptId: attempt._id,

      status:
        "AUTO_SUBMITTED",

      securityViolationCount:
        attempt.securityViolationCount,

      tabSwitchCount:
        attempt.tabSwitchCount,

      fullscreenExitCount:
        attempt.fullscreenExitCount || 0,

      warning: false,

      autoSubmitted: true,

      reason:
        "TAB_SWITCH_LIMIT_REACHED",

      message:
        "Assessment automatically submitted because the tab-switch limit was reached.",
    };
  }


  /* ==========================================================
     FIRST TAB SWITCH => WARNING
     ========================================================== */

  if (
    type === "TAB_SWITCH" &&
    attempt.tabSwitchCount === 1
  ) {

    return {
      attemptId: attempt._id,

      status:
        attempt.status,

      securityViolationCount:
        attempt.securityViolationCount,

      tabSwitchCount:
        attempt.tabSwitchCount,

      fullscreenExitCount:
        attempt.fullscreenExitCount || 0,

      warning: true,

      autoSubmitted: false,

      remainingTabSwitches:
        MAX_TAB_SWITCHES -
        attempt.tabSwitchCount,

      message:
        "Warning: You left the assessment tab. If you leave the assessment tab again, the assessment will be submitted automatically.",
    };
  }


  /* ==========================================================
     OTHER SECURITY EVENTS
     ========================================================== */

  return {
    attemptId:
      attempt._id,

    status:
      attempt.status,

    securityViolationCount:
      attempt.securityViolationCount,

    tabSwitchCount:
      attempt.tabSwitchCount || 0,

    fullscreenExitCount:
      attempt.fullscreenExitCount || 0,

    warning: false,

    autoSubmitted: false,

    message:
      "Security event recorded.",
  };
};


/* ============================================================
   GET SECURITY STATUS
   ============================================================ */

export const getSecurityStatus = async (
  attemptId,
  studentId
) => {

  if (!isValidObjectId(attemptId)) {
    throw new Error(
      "Invalid attempt ID."
    );
  }

  if (!isValidObjectId(studentId)) {
    throw new Error(
      "Invalid student ID."
    );
  }


  const attempt =
    await AssessmentAttempt.findOne({
      _id: attemptId,
      student: studentId,
    })
      .select(
        [
          "status",
          "securityViolationCount",
          "tabSwitchCount",
          "fullscreenExitCount",
          "securityAutoSubmitted",
          "securityAutoSubmitReason",
          "lastSecurityViolationAt",
        ].join(" ")
      )
      .lean();


  if (!attempt) {
    throw new Error(
      "Assessment attempt not found."
    );
  }


  return {
    attemptId:
      attempt._id,

    status:
      attempt.status,

    securityViolationCount:
      attempt.securityViolationCount || 0,

    tabSwitchCount:
      attempt.tabSwitchCount || 0,

    fullscreenExitCount:
      attempt.fullscreenExitCount || 0,

    securityAutoSubmitted:
      attempt.securityAutoSubmitted === true,

    securityAutoSubmitReason:
      attempt.securityAutoSubmitReason ||
      null,

    lastSecurityViolationAt:
      attempt.lastSecurityViolationAt ||
      null,

    maxTabSwitches:
      MAX_TAB_SWITCHES,

    remainingTabSwitches:
      Math.max(
        0,
        MAX_TAB_SWITCHES -
          Number(
            attempt.tabSwitchCount || 0
          )
      ),
  };
};