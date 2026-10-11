

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import { motion } from "framer-motion";

// import {
//   getAttemptQuestions,
//   saveAttemptAnswer,
//   submitAssessmentAttempt,
//   recordAttemptSecurityEvent,
//   getAttemptSecurityStatus,
// } from "../../../services/studentAssessmentService.js";

// // ======================================================
// // MAIN COMPONENT
// // ======================================================

// export default function StudentAttempt() {
//   const { attemptId } = useParams();

//   const navigate = useNavigate();

//   // ====================================================
//   // STATE
//   // ====================================================

//   const [attempt, setAttempt] =
//     useState(null);

//   const [questions, setQuestions] =
//     useState([]);

//   const [currentIndex, setCurrentIndex] =
//     useState(0);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [saving, setSaving] =
//     useState(false);

//   const [saveMessage, setSaveMessage] =
//     useState("");

//   const [timeLeft, setTimeLeft] =
//     useState(0);

//   const [expired, setExpired] =
//     useState(false);

//   // ====================================================
//   // SUBMISSION STATE
//   // ====================================================

//   const [submitting, setSubmitting] =
//     useState(false);

//   const [submitError, setSubmitError] =
//     useState("");

//   // ====================================================
//   // SECURITY STATE
//   // ====================================================

//   const [securityWarning, setSecurityWarning] =
//     useState(null);

//   const [tabSwitchCount, setTabSwitchCount] =
//     useState(0);

//   const [securityViolationCount, setSecurityViolationCount] =
//     useState(0);

//   const [securitySubmitting, setSecuritySubmitting] =
//     useState(false);

//   /*
//    * Start as false.
//    *
//    * Fullscreen requires a user gesture in most browsers,
//    * therefore we show the fullscreen button after the
//    * assessment has loaded instead of blocking the screen
//    * before the attempt is ready.
//    */
//   const [fullscreenRequired, setFullscreenRequired] =
//     useState(false);

//   // ====================================================
//   // SECURITY REFS
//   // ====================================================

//   const securityEventLockRef =
//     useRef(false);

//   const lastVisibilityEventRef =
//     useRef(0);

//   const assessmentActiveRef =
//     useRef(false);

//   // ====================================================
//   // PREVENT MULTIPLE AUTO SUBMISSIONS
//   // ====================================================

//   const autoSubmitStarted =
//     useRef(false);

//   // ====================================================
//   // LOAD ATTEMPT QUESTIONS
//   // ====================================================

//   const loadQuestions = async () => {
//     try {
//       setLoading(true);

//       setError("");

//       const response =
//         await getAttemptQuestions(
//           attemptId
//         );

//       if (
//         !response?.success ||
//         !response?.data
//       ) {
//         throw new Error(
//           response?.message ||
//             "Failed to load assessment."
//         );
//       }

//       setAttempt(
//         response.data.attempt
//       );

//       setQuestions(
//         response.data.questions || []
//       );

//       // ------------------------------------------------
//       // RESET TIMER STATE
//       // ------------------------------------------------

//       setExpired(false);

//       autoSubmitStarted.current =
//         false;

//       setSubmitError("");

//       // ------------------------------------------------
//       // SECURITY STATE
//       // ------------------------------------------------

//       setSecurityWarning(null);

//       setSecuritySubmitting(false);

//       setFullscreenRequired(
//         !document.fullscreenElement
//       );

//     } catch (err) {
//       console.error(
//         "Student Attempt Load Error:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to load assessment."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ====================================================
//   // INITIAL LOAD
//   // ====================================================

//   useEffect(() => {
//     if (attemptId) {
//       loadQuestions();
//     }
//   }, [attemptId]);

//   // ====================================================
//   // CURRENT QUESTION
//   // ====================================================

//   const currentQuestion =
//     questions[currentIndex];

//   // ====================================================
//   // ANSWERED COUNT
//   // ====================================================

//   const answeredCount =
//     useMemo(() => {
//       return questions.filter(
//         (question) =>
//           question.selectedAnswer !==
//             null &&
//           question.selectedAnswer !==
//             undefined &&
//           question.selectedAnswer !==
//             "" &&
//           !(
//             Array.isArray(
//               question.selectedAnswer
//             ) &&
//             question.selectedAnswer
//               .length === 0
//           )
//       ).length;
//     }, [questions]);

//   // ====================================================
//   // UNANSWERED COUNT
//   // ====================================================

//   const unansweredCount =
//     Math.max(
//       0,
//       questions.length -
//         answeredCount
//     );

//   // ====================================================
//   // ACTIVE ASSESSMENT REF
//   // ====================================================

//   useEffect(() => {
//     assessmentActiveRef.current =
//       Boolean(
//         attempt &&
//         !loading &&
//         !submitting &&
//         !securitySubmitting &&
//         !expired
//       );
//   }, [
//     attempt,
//     loading,
//     submitting,
//     securitySubmitting,
//     expired,
//   ]);

//   // ====================================================
//   // SECURITY EVENT HANDLER
//   // ====================================================

//   const handleSecurityEvent =
//     useCallback(
//       async (
//         type
//       ) => {
//         if (
//           !attemptId ||
//           !assessmentActiveRef.current
//         ) {
//           return;
//         }

//         /*
//          * Prevent duplicate security API calls.
//          *
//          * This is especially useful for browser events
//          * such as visibilitychange/fullscreenchange.
//          */

//         if (
//           securityEventLockRef.current
//         ) {
//           return;
//         }

//         securityEventLockRef.current =
//           true;

//         try {
//           const response =
//             await recordAttemptSecurityEvent(
//               attemptId,
//               type
//             );

//           const data =
//             response?.data;

//           if (!data) {
//             return;
//           }

//           // ------------------------------------------------
//           // UPDATE SECURITY COUNTS
//           // ------------------------------------------------

//           setTabSwitchCount(
//             Number(
//               data.tabSwitchCount || 0
//             )
//           );

//           setSecurityViolationCount(
//             Number(
//               data.securityViolationCount ||
//                 0
//             )
//           );

//           // ------------------------------------------------
//           // BACKEND AUTO SUBMISSION
//           // ------------------------------------------------

//           if (
//             data.autoSubmitted
//           ) {
//             setSecuritySubmitting(
//               true
//             );

//             setSecurityWarning({
//               type: "AUTO_SUBMITTED",

//               title:
//                 "Assessment Submitted",

//               message:
//                 data.message ||
//                 "The assessment was automatically submitted because the security limit was reached.",
//             });

//             /*
//              * Backend has already evaluated/submitted
//              * the attempt.
//              *
//              * Give the student a short message before
//              * moving to the result page.
//              */

//             window.setTimeout(() => {
//               navigate(
//                 `/student/attempts/${attemptId}/result`,
//                 {
//                   replace: true,
//                 }
//               );
//             }, 1800);

//             return;
//           }

//           // ------------------------------------------------
//           // FIRST TAB SWITCH WARNING
//           // ------------------------------------------------

//           if (
//             type === "TAB_SWITCH" &&
//             data.warning
//           ) {
//             setSecurityWarning({
//               type: "WARNING",

//               title:
//                 "Security Warning",

//               message:
//                 data.message ||
//                 "You left the assessment tab. If this happens again, your assessment will be submitted automatically.",
//             });
//           }

//         } catch (error) {
//           console.error(
//             "Assessment security error:",
//             error
//           );
//         } finally {
//           window.setTimeout(() => {
//             securityEventLockRef.current =
//               false;
//           }, 500);
//         }
//       },
//       [
//         attemptId,
//         navigate,
//       ]
//     );

//   // ====================================================
//   // LOAD PERSISTED SECURITY STATUS
//   // ====================================================

//   useEffect(() => {
//     if (!attemptId) {
//       return;
//     }

//     const loadSecurityStatus =
//       async () => {
//         try {
//           const response =
//             await getAttemptSecurityStatus(
//               attemptId
//             );

//           const data =
//             response?.data;

//           if (!data) {
//             return;
//           }

//           setTabSwitchCount(
//             Number(
//               data.tabSwitchCount || 0
//             )
//           );

//           setSecurityViolationCount(
//             Number(
//               data.securityViolationCount ||
//                 0
//             )
//           );

//           /*
//            * If the backend says that the attempt
//            * was already auto-submitted because of
//            * security, do not allow the student
//            * to continue.
//            */

//           if (
//             data.securityAutoSubmitted
//           ) {
//             setSecuritySubmitting(
//               true
//             );

//             setSecurityWarning({
//               type: "AUTO_SUBMITTED",

//               title:
//                 "Assessment Submitted",

//               message:
//                 data.securityAutoSubmitReason ||
//                 "This assessment was automatically submitted because the security limit was reached.",
//             });

//             window.setTimeout(() => {
//               navigate(
//                 `/student/attempts/${attemptId}/result`,
//                 {
//                   replace: true,
//                 }
//               );
//             }, 1500);
//           }

//         } catch (error) {
//           console.error(
//             "Unable to load security status:",
//             error
//           );
//         }
//       };

//     loadSecurityStatus();

//   }, [
//     attemptId,
//     navigate,
//   ]);

//   // ====================================================
//   // TAB SWITCH DETECTION
//   // ====================================================

//   useEffect(() => {
//     if (!attemptId) {
//       return;
//     }

//     const handleVisibilityChange =
//       () => {

//         /*
//          * We only treat the page becoming hidden
//          * as a tab-switch style security event.
//          *
//          * This is better than using window.blur()
//          * because blur can happen for normal browser
//          * or operating-system interactions.
//          */

//         if (
//           document.visibilityState !==
//           "hidden"
//         ) {
//           return;
//         }

//         if (
//           !assessmentActiveRef.current
//         ) {
//           return;
//         }

//         const now =
//           Date.now();

//         /*
//          * Prevent multiple closely-spaced
//          * visibility events from counting
//          * as multiple tab switches.
//          */

//         if (
//           now -
//             lastVisibilityEventRef.current <
//           1000
//         ) {
//           return;
//         }

//         lastVisibilityEventRef.current =
//           now;

//         handleSecurityEvent(
//           "TAB_SWITCH"
//         );
//       };

//     document.addEventListener(
//       "visibilitychange",
//       handleVisibilityChange
//     );

//     return () => {
//       document.removeEventListener(
//         "visibilitychange",
//         handleVisibilityChange
//       );
//     };

//   }, [
//     attemptId,
//     handleSecurityEvent,
//   ]);

//   // ====================================================
//   // DISABLE COPY
//   // ====================================================

//   useEffect(() => {

//     const handleCopy =
//       (event) => {

//         if (
//           !assessmentActiveRef.current
//         ) {
//           return;
//         }

//         event.preventDefault();

//         handleSecurityEvent(
//           "COPY"
//         );
//       };

//     document.addEventListener(
//       "copy",
//       handleCopy
//     );

//     return () => {
//       document.removeEventListener(
//         "copy",
//         handleCopy
//       );
//     };

//   }, [
//     handleSecurityEvent,
//   ]);

//   // ====================================================
//   // DISABLE CUT
//   // ====================================================

//   useEffect(() => {

//     const handleCut =
//       (event) => {

//         if (
//           !assessmentActiveRef.current
//         ) {
//           return;
//         }

//         event.preventDefault();

//         handleSecurityEvent(
//           "CUT"
//         );
//       };

//     document.addEventListener(
//       "cut",
//       handleCut
//     );

//     return () => {
//       document.removeEventListener(
//         "cut",
//         handleCut
//       );
//     };

//   }, [
//     handleSecurityEvent,
//   ]);

//   // ====================================================
//   // DISABLE PASTE
//   // ====================================================

//   useEffect(() => {

//     const handlePaste =
//       (event) => {

//         if (
//           !assessmentActiveRef.current
//         ) {
//           return;
//         }

//         event.preventDefault();

//         handleSecurityEvent(
//           "PASTE"
//         );
//       };

//     document.addEventListener(
//       "paste",
//       handlePaste
//     );

//     return () => {
//       document.removeEventListener(
//         "paste",
//         handlePaste
//       );
//     };

//   }, [
//     handleSecurityEvent,
//   ]);

//   // ====================================================
//   // DISABLE RIGHT CLICK
//   // ====================================================

//   useEffect(() => {

//     const handleContextMenu =
//       (event) => {

//         if (
//           !assessmentActiveRef.current
//         ) {
//           return;
//         }

//         event.preventDefault();

//         handleSecurityEvent(
//           "RIGHT_CLICK"
//         );
//       };

//     document.addEventListener(
//       "contextmenu",
//       handleContextMenu
//     );

//     return () => {
//       document.removeEventListener(
//         "contextmenu",
//         handleContextMenu
//       );
//     };

//   }, [
//     handleSecurityEvent,
//   ]);

//   // ====================================================
//   // KEYBOARD SECURITY
//   // ====================================================

//   useEffect(() => {

//     const handleKeyDown =
//       (event) => {

//         if (
//           !assessmentActiveRef.current
//         ) {
//           return;
//         }

//         const key =
//           String(
//             event.key || ""
//           ).toLowerCase();

//         // ------------------------------------------------
//         // F12
//         // ------------------------------------------------

//         if (
//           event.key === "F12"
//         ) {

//           event.preventDefault();

//           handleSecurityEvent(
//             "DEVTOOLS_SHORTCUT"
//           );

//           return;
//         }

//         // ------------------------------------------------
//         // CTRL + SHIFT + I
//         // CTRL + SHIFT + J
//         // CTRL + SHIFT + C
//         // ------------------------------------------------

//         if (
//           event.ctrlKey &&
//           event.shiftKey &&
//           ["i", "j", "c"].includes(
//             key
//           )
//         ) {

//           event.preventDefault();

//           handleSecurityEvent(
//             "DEVTOOLS_SHORTCUT"
//           );

//           return;
//         }

//         // ------------------------------------------------
//         // CTRL + U
//         // ------------------------------------------------

//         if (
//           event.ctrlKey &&
//           key === "u"
//         ) {

//           event.preventDefault();

//           handleSecurityEvent(
//             "DEVTOOLS_SHORTCUT"
//           );

//           return;
//         }

//         // ------------------------------------------------
//         // CTRL + P
//         // ------------------------------------------------

//         if (
//           event.ctrlKey &&
//           key === "p"
//         ) {

//           event.preventDefault();

//           handleSecurityEvent(
//             "PRINT_SHORTCUT"
//           );

//           return;
//         }

//         // ------------------------------------------------
//         // CTRL + S
//         // ------------------------------------------------

//         if (
//           event.ctrlKey &&
//           key === "s"
//         ) {

//           event.preventDefault();

//           handleSecurityEvent(
//             "SAVE_SHORTCUT"
//           );

//           return;
//         }

//         // ------------------------------------------------
//         // CTRL + C / X / V
//         // ------------------------------------------------

//         if (
//           event.ctrlKey &&
//           ["c", "x", "v"].includes(
//             key
//           )
//         ) {

//           event.preventDefault();

//           /*
//            * Do not call security event here.
//            *
//            * Browser copy/cut/paste events will
//            * record the event separately.
//            *
//            * This prevents duplicate events.
//            */

//           return;
//         }
//       };

//     document.addEventListener(
//       "keydown",
//       handleKeyDown
//     );

//     return () => {
//       document.removeEventListener(
//         "keydown",
//         handleKeyDown
//       );
//     };

//   }, [
//     handleSecurityEvent,
//   ]);

//   // ====================================================
//   // FULLSCREEN
//   // ====================================================

//   const enterFullscreen =
//     async () => {

//       try {

//         const element =
//           document.documentElement;

//         if (
//           !document.fullscreenElement
//         ) {

//           await element.requestFullscreen();

//           setFullscreenRequired(
//             false
//           );
//         }

//       } catch (error) {

//         console.error(
//           "Fullscreen error:",
//           error
//         );

//       }
//     };

//   // ====================================================
//   // FULLSCREEN EXIT DETECTION
//   // ====================================================

//   useEffect(() => {

//     const handleFullscreenChange =
//       () => {

//         if (
//           !assessmentActiveRef.current
//         ) {
//           return;
//         }

//         if (
//           !document.fullscreenElement
//         ) {

//           setFullscreenRequired(
//             true
//           );

//           handleSecurityEvent(
//             "FULLSCREEN_EXIT"
//           );

//         } else {

//           setFullscreenRequired(
//             false
//           );

//         }
//       };

//     document.addEventListener(
//       "fullscreenchange",
//       handleFullscreenChange
//     );

//     return () => {

//       document.removeEventListener(
//         "fullscreenchange",
//         handleFullscreenChange
//       );

//     };

//   }, [
//     handleSecurityEvent,
//   ]);

//   // ====================================================
//   // PREVENT ACCIDENTAL REFRESH / CLOSE
//   // ====================================================

//   useEffect(() => {

//     const handleBeforeUnload =
//       (event) => {

//         if (
//           !assessmentActiveRef.current
//         ) {
//           return;
//         }

//         event.preventDefault();

//         event.returnValue = "";
//       };

//     window.addEventListener(
//       "beforeunload",
//       handleBeforeUnload
//     );

//     return () => {

//       window.removeEventListener(
//         "beforeunload",
//         handleBeforeUnload
//       );

//     };

//   }, []);

//   // ====================================================
//   // UPDATE LOCAL ANSWER
//   // ====================================================

//   const updateLocalAnswer = (
//     questionId,
//     answer
//   ) => {

//     setQuestions(
//       (previous) =>
//         previous.map(
//           (question) =>
//             String(
//               question._id
//             ) ===
//             String(
//               questionId
//             )
//               ? {
//                   ...question,

//                   selectedAnswer:
//                     answer,

//                   answeredAt:
//                     new Date().toISOString(),
//                 }
//               : question
//         )
//     );
//   };

//   // ====================================================
//   // SAVE ANSWER
//   // ====================================================

//   const handleSaveAnswer =
//     async (answer) => {

//       if (!currentQuestion) {
//         return;
//       }

//       if (
//         expired ||
//         submitting ||
//         securitySubmitting
//       ) {
//         return;
//       }

//       try {

//         setSaving(true);

//         setSaveMessage("");

//         // ----------------------------------------------
//         // UPDATE UI IMMEDIATELY
//         // ----------------------------------------------

//         updateLocalAnswer(
//           currentQuestion._id,
//           answer
//         );

//         // ----------------------------------------------
//         // SAVE TO BACKEND
//         // ----------------------------------------------

//         await saveAttemptAnswer(
//           attemptId,
//           currentQuestion._id,
//           answer
//         );

//         setSaveMessage(
//           "Answer saved"
//         );

//         // ----------------------------------------------
//         // CLEAR MESSAGE
//         // ----------------------------------------------

//         setTimeout(() => {
//           setSaveMessage("");
//         }, 1500);

//       } catch (err) {

//         console.error(
//           "Save Answer Error:",
//           err
//         );

//         setSaveMessage(
//           "Failed to save answer"
//         );

//       } finally {

//         setSaving(false);

//       }
//     };

//   // ====================================================
//   // SAVE TEXT ANSWER
//   // ====================================================

//   const saveTextAnswer =
//     async () => {

//       if (!currentQuestion) {
//         return;
//       }

//       if (
//         expired ||
//         submitting ||
//         securitySubmitting
//       ) {
//         return;
//       }

//       await handleSaveAnswer(
//         currentQuestion.selectedAnswer ||
//           ""
//       );
//     };

//   // ====================================================
//   // SUBMIT ATTEMPT
//   // ====================================================

//   const performSubmit =
//     async ({
//       askConfirmation = true,
//     } = {}) => {

//       // -----------------------------------------------
//       // PREVENT DUPLICATE SUBMISSION
//       // -----------------------------------------------

//       if (
//         submitting ||
//         securitySubmitting ||
//         (
//           !askConfirmation &&
//           autoSubmitStarted.current
//         )
//       ) {
//         return;
//       }

//       // -----------------------------------------------
//       // MANUAL CONFIRMATION
//       // -----------------------------------------------

//       if (askConfirmation) {

//         const confirmed =
//           window.confirm(
//             "Are you sure you want to submit the assessment? You cannot change your answers after submission."
//           );

//         if (!confirmed) {
//           return;
//         }
//       }

//       try {

//         // ---------------------------------------------
//         // MARK AUTO SUBMISSION AS STARTED
//         // ---------------------------------------------

//         if (!askConfirmation) {

//           autoSubmitStarted.current =
//             true;
//         }

//         setSubmitting(true);

//         setSubmitError("");

//         // ---------------------------------------------
//         // SAVE CURRENT TEXT ANSWER
//         //
//         // This is useful when the student has typed
//         // something but has not moved to another
//         // question yet.
//         // ---------------------------------------------

//         if (
//           currentQuestion &&
//           (
//             currentQuestion.questionType ===
//               "SHORT_ANSWER" ||
//             currentQuestion.questionType ===
//               "LONG_ANSWER"
//           )
//         ) {

//           try {

//             await saveAttemptAnswer(
//               attemptId,
//               currentQuestion._id,
//               currentQuestion.selectedAnswer ||
//                 ""
//             );

//           } catch (saveError) {

//             console.error(
//               "Final answer save failed:",
//               saveError
//             );

//             /*
//              * Continue submission.
//              *
//              * Other answers already saved on
//              * the backend will still be evaluated.
//              */
//           }
//         }

//         // ---------------------------------------------
//         // SUBMIT ATTEMPT
//         // ---------------------------------------------

//         const response =
//           await submitAssessmentAttempt(
//             attemptId
//           );

//         if (
//           !response?.success
//         ) {

//           throw new Error(
//             response?.message ||
//               "Failed to submit assessment."
//           );
//         }

//         // ---------------------------------------------
//         // MARK EXPIRED AS COMPLETED
//         // ---------------------------------------------

//         setExpired(false);

//         // ---------------------------------------------
//         // DISABLE SECURITY AFTER SUBMISSION
//         // ---------------------------------------------

//         assessmentActiveRef.current =
//           false;

//         // ---------------------------------------------
//         // GO TO RESULT PAGE
//         // ---------------------------------------------

//         navigate(
//           `/student/attempts/${attemptId}/result`,
//           {
//             replace: true,
//           }
//         );

//       } catch (err) {

//         console.error(
//           "Assessment Submission Error:",
//           err
//         );

//         const message =
//           err.response?.data?.message ||
//           err.message ||
//           "Unable to submit assessment.";

//         setSubmitError(
//           message
//         );

//         // ---------------------------------------------
//         // AUTO SUBMISSION FAILED
//         //
//         // Allow retry.
//         // ---------------------------------------------

//         if (!askConfirmation) {

//           autoSubmitStarted.current =
//             false;
//         }

//         alert(message);

//       } finally {

//         setSubmitting(false);

//       }
//     };

//   // ====================================================
//   // TIMER
//   // ====================================================

//   useEffect(() => {

//     if (!attempt?.expiresAt) {
//       return;
//     }

//     const updateTimer = () => {

//       const expiresAt =
//         new Date(
//           attempt.expiresAt
//         ).getTime();

//       const now =
//         Date.now();

//       const remaining =
//         Math.max(
//           0,
//           expiresAt - now
//         );

//       const seconds =
//         Math.floor(
//           remaining / 1000
//         );

//       setTimeLeft(
//         seconds
//       );

//       // ----------------------------------------------
//       // TIMER EXPIRED
//       // ----------------------------------------------

//       if (
//         remaining <= 0
//       ) {

//         setExpired(true);
//       }
//     };

//     updateTimer();

//     const interval =
//       setInterval(
//         updateTimer,
//         1000
//       );

//     return () =>
//       clearInterval(
//         interval
//       );

//   }, [attempt]);

//   // ====================================================
//   // AUTO SUBMIT WHEN TIMER EXPIRES
//   // ====================================================

//   useEffect(() => {

//     if (
//       expired &&
//       !autoSubmitStarted.current &&
//       !submitting &&
//       !securitySubmitting
//     ) {

//       performSubmit({
//         askConfirmation: false,
//       });
//     }

//   }, [
//     expired,
//     submitting,
//     securitySubmitting,
//   ]);

//   // ====================================================
//   // FORMAT TIMER
//   // ====================================================

//   const formatTime = (
//     totalSeconds
//   ) => {

//     const hours =
//       Math.floor(
//         totalSeconds /
//           3600
//       );

//     const minutes =
//       Math.floor(
//         (
//           totalSeconds %
//             3600
//         ) / 60
//       );

//     const seconds =
//       totalSeconds %
//       60;

//     if (
//       hours > 0
//     ) {

//       return `${String(
//         hours
//       ).padStart(
//         2,
//         "0"
//       )}:${String(
//         minutes
//       ).padStart(
//         2,
//         "0"
//       )}:${String(
//         seconds
//       ).padStart(
//         2,
//         "0"
//       )}`;
//     }

//     return `${String(
//       minutes
//     ).padStart(
//       2,
//       "0"
//     )}:${String(
//       seconds
//     ).padStart(
//       2,
//       "0"
//     )}`;
//   };

//   // ====================================================
//   // MCQ / TRUE FALSE
//   // ====================================================

//   const handleSingleChoice =
//     (optionId) => {

//       if (
//         expired ||
//         submitting ||
//         securitySubmitting
//       ) {
//         return;
//       }

//       handleSaveAnswer(
//         optionId
//       );
//     };

//   // ====================================================
//   // MULTIPLE SELECT
//   // ====================================================

//   const handleMultipleSelect =
//     (optionId) => {

//       if (
//         expired ||
//         submitting ||
//         securitySubmitting
//       ) {
//         return;
//       }

//       const current =
//         Array.isArray(
//           currentQuestion.selectedAnswer
//         )
//           ? currentQuestion.selectedAnswer
//           : [];

//       const exists =
//         current.some(
//           (id) =>
//             String(id) ===
//             String(optionId)
//         );

//       let updated;

//       if (exists) {

//         updated =
//           current.filter(
//             (id) =>
//               String(id) !==
//               String(optionId)
//           );

//       } else {

//         updated = [
//           ...current,
//           optionId,
//         ];
//       }

//       handleSaveAnswer(
//         updated
//       );
//     };

//   // ====================================================
//   // TEXT ANSWER
//   // ====================================================

//   const handleTextAnswer =
//     (event) => {

//       if (
//         expired ||
//         submitting ||
//         securitySubmitting ||
//         !currentQuestion
//       ) {
//         return;
//       }

//       updateLocalAnswer(
//         currentQuestion._id,
//         event.target.value
//       );
//     };

//   // ====================================================
//   // PREVIOUS
//   // ====================================================

//   const handlePrevious =
//     async () => {

//       if (
//         currentIndex <= 0 ||
//         submitting ||
//         securitySubmitting
//       ) {
//         return;
//       }

//       // ----------------------------------------------
//       // SAVE TEXT BEFORE MOVING
//       // ----------------------------------------------

//       if (
//         currentQuestion &&
//         (
//           currentQuestion.questionType ===
//             "SHORT_ANSWER" ||
//           currentQuestion.questionType ===
//             "LONG_ANSWER"
//         )
//       ) {

//         await saveTextAnswer();
//       }

//       setCurrentIndex(
//         (index) =>
//           index - 1
//       );
//     };

//   // ====================================================
//   // NEXT
//   // ====================================================

//   const handleNext =
//     async () => {

//       if (
//         !currentQuestion ||
//         submitting ||
//         securitySubmitting
//       ) {
//         return;
//       }

//       // ----------------------------------------------
//       // SAVE TEXT ANSWER
//       // ----------------------------------------------

//       if (
//         currentQuestion.questionType ===
//           "SHORT_ANSWER" ||
//         currentQuestion.questionType ===
//           "LONG_ANSWER"
//       ) {

//         await saveTextAnswer();
//       }

//       // ----------------------------------------------
//       // MOVE NEXT
//       // ----------------------------------------------

//       if (
//         currentIndex <
//         questions.length - 1
//       ) {

//         setCurrentIndex(
//           (index) =>
//             index + 1
//         );
//       }
//     };

//   // ====================================================
//   // QUESTION PALETTE
//   // ====================================================

//   const goToQuestion =
//     async (index) => {

//       if (
//         submitting ||
//         securitySubmitting ||
//         index === currentIndex
//       ) {
//         return;
//       }

//       // ----------------------------------------------
//       // SAVE TEXT BEFORE CHANGING QUESTION
//       // ----------------------------------------------

//       if (
//         currentQuestion &&
//         (
//           currentQuestion.questionType ===
//             "SHORT_ANSWER" ||
//           currentQuestion.questionType ===
//             "LONG_ANSWER"
//         )
//       ) {

//         await saveTextAnswer();
//       }

//       setCurrentIndex(
//         index
//       );
//     };

//   // ====================================================
//   // LOADING
//   // ====================================================

//   if (loading) {

//     return (
//       <div className="container-fluid px-0">

//         <div className="card border-0 shadow-sm rounded-4">

//           <div className="card-body text-center py-5">

//             <div
//               className="spinner-border text-primary"
//               role="status"
//             />

//             <p className="text-muted mt-3 mb-0">
//               Loading assessment...
//             </p>

//           </div>

//         </div>

//       </div>
//     );
//   }

//   // ====================================================
//   // ERROR
//   // ====================================================

//   if (error) {

//     return (
//       <div className="container-fluid px-0">

//         <div className="alert alert-danger rounded-4">

//           <h5 className="fw-bold">
//             Unable to Load Assessment
//           </h5>

//           <p className="mb-3">
//             {error}
//           </p>

//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={
//               loadQuestions
//             }
//           >
//             Retry
//           </button>

//         </div>

//       </div>
//     );
//   }

//   // ====================================================
//   // NO QUESTIONS
//   // ====================================================

//   if (!questions.length) {

//     return (
//       <div className="container-fluid px-0">

//         <div className="card border-0 shadow-sm rounded-4">

//           <div className="card-body text-center py-5">

//             <div className="fs-1 mb-3">
//               📝
//             </div>

//             <h4 className="fw-bold">
//               No Questions Available
//             </h4>

//             <p className="text-muted">
//               There are no published questions
//               available for this assessment.
//             </p>

//             <button
//               type="button"
//               className="btn btn-outline-secondary"
//               onClick={() =>
//                 navigate(
//                   "/student/assessments"
//                 )
//               }
//             >
//               Back to Assessments
//             </button>

//           </div>

//         </div>

//       </div>
//     );
//   }

//   // ====================================================
//   // EXPIRED + SUBMITTING
//   // ====================================================

//   if (
//     expired &&
//     submitting
//   ) {

//     return (
//       <div className="container-fluid px-0">

//         <div className="card border-0 shadow-sm rounded-4">

//           <div className="card-body text-center py-5">

//             <div
//               className="spinner-border text-primary mb-3"
//               role="status"
//             />

//             <h3 className="h5 fw-bold">
//               Time Expired
//             </h3>

//             <p className="text-muted mb-0">
//               Your assessment is being
//               submitted automatically...
//             </p>

//           </div>

//         </div>

//       </div>
//     );
//   }

//   // ====================================================
//   // EXPIRED + SUBMISSION FAILED
//   // ====================================================

//   if (
//     expired &&
//     !submitting
//   ) {

//     return (
//       <div className="container-fluid px-0">

//         <div className="card border-0 shadow-sm rounded-4">

//           <div className="card-body text-center py-5">

//             <div className="fs-1 mb-3">
//               ⏰
//             </div>

//             <h3 className="fw-bold">
//               Time Expired
//             </h3>

//             <p className="text-muted">
//               Your assessment time has expired.
//             </p>

//             {submitError && (
//               <div className="alert alert-danger text-start mt-3">

//                 <strong>
//                   Automatic submission failed.
//                 </strong>

//                 <div className="small mt-1">
//                   {submitError}
//                 </div>

//               </div>
//             )}

//             <button
//               type="button"
//               className="btn btn-primary px-4"
//               disabled={
//                 submitting ||
//                 securitySubmitting
//               }
//               onClick={() =>
//                 performSubmit({
//                   askConfirmation:
//                     false,
//                 })
//               }
//             >

//               {submitting ? (
//                 <>

//                   <span
//                     className="spinner-border spinner-border-sm me-2"
//                     role="status"
//                   />

//                   Submitting...

//                 </>
//               ) : (
//                 <>

//                   <i className="bi bi-send-check me-2" />

//                   Submit Now

//                 </>
//               )}

//             </button>

//           </div>

//         </div>

//       </div>
//     );
//   }

//   // ====================================================
//   // RENDER
//   // ====================================================

//   return (
//     <div className="container-fluid px-0">

//       {/* ==================================================
//           SECURITY WARNING MODAL
//           ================================================== */}

//       {securityWarning && (

//         <div
//           className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
//           style={{
//             background:
//               "rgba(15, 23, 42, 0.75)",

//             backdropFilter:
//               "blur(7px)",

//             zIndex:
//               99999,

//             padding:
//               "20px",
//           }}
//         >

//           <motion.div
//             initial={{
//               opacity: 0,
//               scale: 0.85,
//               y: 20,
//             }}

//             animate={{
//               opacity: 1,
//               scale: 1,
//               y: 0,
//             }}

//             className="card border-0 shadow-lg"

//             style={{
//               maxWidth:
//                 "520px",

//               width:
//                 "100%",

//               borderRadius:
//                 "22px",
//             }}
//           >

//             <div className="card-body p-4 p-md-5 text-center">

//               <div
//                 className={`mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center ${
//                   securityWarning.type ===
//                   "AUTO_SUBMITTED"
//                     ? "bg-danger-subtle"
//                     : "bg-warning-subtle"
//                 }`}

//                 style={{
//                   width:
//                     "78px",

//                   height:
//                     "78px",
//                 }}
//               >

//                 <i
//                   className={`bi ${
//                     securityWarning.type ===
//                     "AUTO_SUBMITTED"
//                       ? "bi-shield-x text-danger"
//                       : "bi-exclamation-triangle text-warning"
//                   }`}

//                   style={{
//                     fontSize:
//                       "34px",
//                   }}
//                 />

//               </div>

//               <h3 className="fw-bold mb-3">
//                 {securityWarning.title}
//               </h3>

//               <p
//                 className="text-secondary mb-3"

//                 style={{
//                   lineHeight:
//                     "1.7",
//                 }}
//               >
//                 {securityWarning.message}
//               </p>

//               {securityWarning.type ===
//                 "WARNING" && (

//                 <div
//                   className="alert alert-danger border-0 rounded-3"
//                 >

//                   <strong>
//                     Important:
//                   </strong>

//                   {" "}

//                   This is warning{" "}
//                   {tabSwitchCount} of 2.

//                   <br />

//                   If you leave this assessment
//                   tab again, the assessment will
//                   be submitted automatically.

//                 </div>
//               )}

//               {securityWarning.type ===
//               "WARNING" ? (

//                 <button
//                   type="button"

//                   className="btn btn-warning px-4 py-2 rounded-3 fw-semibold"

//                   onClick={() =>
//                     setSecurityWarning(
//                       null
//                     )
//                   }
//                 >

//                   <i className="bi bi-shield-check me-2" />

//                   I Understand

//                 </button>

//               ) : (

//                 <div>

//                   <div
//                     className="spinner-border text-danger"
//                     role="status"
//                   />

//                   <p className="text-muted mt-3 mb-0">
//                     Opening your result...
//                   </p>

//                 </div>
//               )}

//             </div>

//           </motion.div>

//         </div>
//       )}

//       {/* ==================================================
//           FULLSCREEN REQUIRED OVERLAY
//           ================================================== */}

//       {fullscreenRequired &&
//         attempt &&
//         !securitySubmitting &&
//         !securityWarning && (

//           <div
//             className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"

//             style={{
//               background:
//                 "rgba(2, 6, 23, 0.88)",

//               zIndex:
//                 99990,

//               padding:
//                 "20px",
//             }}
//           >

//             <motion.div
//               initial={{
//                 opacity: 0,
//                 scale: 0.9,
//               }}

//               animate={{
//                 opacity: 1,
//                 scale: 1,
//               }}

//               className="card border-0 shadow-lg text-center"

//               style={{
//                 maxWidth:
//                   "500px",

//                 width:
//                   "100%",

//                 borderRadius:
//                   "22px",
//               }}
//             >

//               <div className="card-body p-5">

//                 <div
//                   className="mx-auto mb-4 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"

//                   style={{
//                     width:
//                       "75px",

//                     height:
//                       "75px",
//                   }}
//                 >

//                   <i
//                     className="bi bi-arrows-fullscreen"

//                     style={{
//                       fontSize:
//                         "30px",
//                     }}
//                   />

//                 </div>

//                 <h3 className="fw-bold">
//                   Secure Assessment Mode
//                 </h3>

//                 <p className="text-muted mb-4">
//                   This assessment must be completed
//                   in fullscreen mode.

//                   <br />

//                   Leaving the assessment tab is
//                   monitored.
//                 </p>

//                 <button
//                   type="button"

//                   className="btn btn-primary px-4 py-2 rounded-3"

//                   onClick={
//                     enterFullscreen
//                   }
//                 >

//                   <i className="bi bi-arrows-fullscreen me-2" />

//                   Enter Fullscreen & Continue

//                 </button>

//               </div>

//             </motion.div>

//           </div>
//         )}

//       {/* ==================================================
//           HEADER
//           ================================================== */}

//       <div className="card border-0 shadow-sm rounded-4 mb-3">

//         <div className="card-body p-3 p-md-4">

//           <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

//             <div>

//               <div className="small text-muted mb-1">
//                 Assessment
//               </div>

//               <h1 className="h4 fw-bold mb-0">
//                 {attempt?.assessment?.title ||
//                   "Assessment"}
//               </h1>

//             </div>

//             {/* TIMER + SECURITY */}

//             <div className="d-flex flex-column align-items-md-end gap-2">

//               <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">

//                 <div
//                   className={`px-3 py-2 rounded-3 border fw-bold ${
//                     timeLeft <= 60
//                       ? "text-danger border-danger bg-danger-subtle"
//                       : "text-primary border-primary bg-primary-subtle"
//                   }`}
//                 >

//                   <i className="bi bi-clock me-2" />

//                   {formatTime(
//                     timeLeft
//                   )}

//                 </div>

//               </div>

//               {/* ==================================================
//                   SECURITY INDICATOR
//                   ================================================== */}

//               <div className="d-flex gap-2 align-items-center flex-wrap justify-content-end">

//                 <span
//                   className="badge bg-success-subtle text-success px-3 py-2 rounded-pill"
//                 >

//                   <i className="bi bi-shield-check me-1" />

//                   Secure Mode

//                 </span>

//                 <span
//                   className={`badge px-3 py-2 rounded-pill ${
//                     tabSwitchCount > 0
//                       ? "bg-warning-subtle text-warning-emphasis"
//                       : "bg-light text-secondary"
//                   }`}
//                 >

//                   <i className="bi bi-window-stack me-1" />

//                   Tab Warnings:
//                   {" "}
//                   {tabSwitchCount}/2

//                 </span>

//                 {securityViolationCount > 0 && (

//                   <span
//                     className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill"
//                   >

//                     <i className="bi bi-exclamation-triangle me-1" />

//                     Security Events:
//                     {" "}
//                     {securityViolationCount}

//                   </span>
//                 )}

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* ==================================================
//           SUBMISSION ERROR
//           ================================================== */}

//       {submitError &&
//         !expired && (

//           <div className="alert alert-danger rounded-4 mb-3">

//             <div className="d-flex align-items-start gap-2">

//               <i className="bi bi-exclamation-triangle-fill" />

//               <div>
//                 {submitError}
//               </div>

//             </div>

//           </div>
//         )}

//       {/* ==================================================
//           MAIN CONTENT
//           ================================================== */}

//       <div className="row g-3">

//         {/* ==================================================
//             QUESTION AREA
//             ================================================== */}

//         <div className="col-12 col-lg-8">

//           <motion.div
//             key={
//               currentQuestion._id
//             }

//             initial={{
//               opacity: 0,
//               x: 15,
//             }}

//             animate={{
//               opacity: 1,
//               x: 0,
//             }}

//             className="card border-0 shadow-sm rounded-4"
//           >

//             <div className="card-body p-4">

//               {/* QUESTION HEADER */}

//               <div className="d-flex justify-content-between align-items-start gap-3 mb-4">

//                 <div>

//                   <div className="small text-muted mb-2">

//                     Question{" "}

//                     {currentIndex + 1}

//                     {" "}of{" "}

//                     {questions.length}

//                   </div>

//                   <h2 className="h5 fw-bold mb-0">

//                     {currentQuestion.questionText}

//                   </h2>

//                 </div>

//                 <span className="badge bg-primary-subtle text-primary px-3 py-2">

//                   {currentQuestion.marks}{" "}

//                   {currentQuestion.marks ===
//                   1
//                     ? "Mark"
//                     : "Marks"}

//                 </span>

//               </div>

//               {/* ==================================================
//                   MCQ
//                   ================================================== */}

//               {currentQuestion.questionType ===
//                 "MCQ" && (

//                 <div className="d-flex flex-column gap-3">

//                   {currentQuestion.options.map(
//                     (option) => {

//                       const selected =
//                         String(
//                           currentQuestion.selectedAnswer
//                         ) ===
//                         String(
//                           option._id
//                         );

//                       return (

//                         <button
//                           key={
//                             option._id
//                           }

//                           type="button"

//                           disabled={
//                             saving ||
//                             submitting ||
//                             securitySubmitting
//                           }

//                           onClick={() =>
//                             handleSingleChoice(
//                               option._id
//                             )
//                           }

//                           className={`text-start border rounded-3 p-3 bg-white ${
//                             selected
//                               ? "border-primary bg-primary-subtle"
//                               : "border-secondary-subtle"
//                           }`}
//                         >

//                           <div className="d-flex align-items-center gap-3">

//                             <span
//                               className={`rounded-circle border d-flex align-items-center justify-content-center ${
//                                 selected
//                                   ? "border-primary bg-primary text-white"
//                                   : ""
//                               }`}

//                               style={{
//                                 width: 22,
//                                 height: 22,
//                               }}
//                             >

//                               {selected && (
//                                 <i className="bi bi-check" />
//                               )}

//                             </span>

//                             <span className="text-dark">
//                               {option.text}
//                             </span>

//                           </div>

//                         </button>
//                       );
//                     }
//                   )}

//                 </div>
//               )}

//               {/* ==================================================
//                   TRUE / FALSE
//                   ================================================== */}

//               {currentQuestion.questionType ===
//                 "TRUE_FALSE" && (

//                 <div className="d-flex flex-column gap-3">

//                   {currentQuestion.options.map(
//                     (option) => {

//                       const selected =
//                         String(
//                           currentQuestion.selectedAnswer
//                         ) ===
//                         String(
//                           option._id
//                         );

//                       return (

//                         <button
//                           key={
//                             option._id
//                           }

//                           type="button"

//                           disabled={
//                             saving ||
//                             submitting ||
//                             securitySubmitting
//                           }

//                           onClick={() =>
//                             handleSingleChoice(
//                               option._id
//                             )
//                           }

//                           className={`text-start border rounded-3 p-3 bg-white ${
//                             selected
//                               ? "border-primary bg-primary-subtle"
//                               : "border-secondary-subtle"
//                           }`}
//                         >

//                           <div className="d-flex align-items-center gap-3">

//                             <span
//                               className={`rounded-circle border d-flex align-items-center justify-content-center ${
//                                 selected
//                                   ? "border-primary bg-primary text-white"
//                                   : ""
//                               }`}

//                               style={{
//                                 width: 22,
//                                 height: 22,
//                               }}
//                             >

//                               {selected && (
//                                 <i className="bi bi-check" />
//                               )}

//                             </span>

//                             <span className="text-dark">
//                               {option.text}
//                             </span>

//                           </div>

//                         </button>
//                       );
//                     }
//                   )}

//                 </div>
//               )}

//               {/* ==================================================
//                   MULTIPLE SELECT
//                   ================================================== */}

//               {currentQuestion.questionType ===
//                 "MULTIPLE_SELECT" && (

//                 <div className="d-flex flex-column gap-3">

//                   <div className="small text-muted mb-1">
//                     Select all applicable answers.
//                   </div>

//                   {currentQuestion.options.map(
//                     (option) => {

//                       const selected =
//                         Array.isArray(
//                           currentQuestion.selectedAnswer
//                         ) &&
//                         currentQuestion.selectedAnswer.some(
//                           (id) =>
//                             String(
//                               id
//                             ) ===
//                             String(
//                               option._id
//                             )
//                         );

//                       return (

//                         <button
//                           key={
//                             option._id
//                           }

//                           type="button"

//                           disabled={
//                             saving ||
//                             submitting ||
//                             securitySubmitting
//                           }

//                           onClick={() =>
//                             handleMultipleSelect(
//                               option._id
//                             )
//                           }

//                           className={`text-start border rounded-3 p-3 bg-white ${
//                             selected
//                               ? "border-primary bg-primary-subtle"
//                               : "border-secondary-subtle"
//                           }`}
//                         >

//                           <div className="d-flex align-items-center gap-3">

//                             <span
//                               className={`border rounded d-flex align-items-center justify-content-center ${
//                                 selected
//                                   ? "border-primary bg-primary text-white"
//                                   : ""
//                               }`}

//                               style={{
//                                 width: 22,
//                                 height: 22,
//                               }}
//                             >

//                               {selected && (
//                                 <i className="bi bi-check" />
//                               )}

//                             </span>

//                             <span className="text-dark">
//                               {option.text}
//                             </span>

//                           </div>

//                         </button>
//                       );
//                     }
//                   )}

//                 </div>
//               )}

//               {/* ==================================================
//                   SHORT ANSWER
//                   ================================================== */}

//               {currentQuestion.questionType ===
//                 "SHORT_ANSWER" && (

//                 <div>

//                   <label className="form-label fw-semibold">
//                     Your Answer
//                   </label>

//                   <input
//                     type="text"

//                     className="form-control form-control-lg"

//                     value={
//                       currentQuestion.selectedAnswer ||
//                       ""
//                     }

//                     disabled={
//                       submitting ||
//                       securitySubmitting
//                     }

//                     onChange={
//                       handleTextAnswer
//                     }

//                     onBlur={
//                       saveTextAnswer
//                     }

//                     placeholder="Enter your answer..."
//                   />

//                 </div>
//               )}

//               {/* ==================================================
//                   LONG ANSWER
//                   ================================================== */}

//               {currentQuestion.questionType ===
//                 "LONG_ANSWER" && (

//                 <div>

//                   <label className="form-label fw-semibold">
//                     Your Answer
//                   </label>

//                   <textarea
//                     className="form-control"

//                     rows="8"

//                     value={
//                       currentQuestion.selectedAnswer ||
//                       ""
//                     }

//                     disabled={
//                       submitting ||
//                       securitySubmitting
//                     }

//                     onChange={
//                       handleTextAnswer
//                     }

//                     onBlur={
//                       saveTextAnswer
//                     }

//                     placeholder="Write your answer..."
//                   />

//                 </div>
//               )}

//               {/* ==================================================
//                   SAVE STATUS
//                   ================================================== */}

//               <div className="mt-3">

//                 {saving && (

//                   <span className="small text-primary">

//                     <span
//                       className="spinner-border spinner-border-sm me-2"
//                       role="status"
//                     />

//                     Saving...

//                   </span>
//                 )}

//                 {!saving &&
//                   saveMessage && (

//                     <span
//                       className={`small ${
//                         saveMessage.includes(
//                           "Failed"
//                         )
//                           ? "text-danger"
//                           : "text-success"
//                       }`}
//                     >

//                       <i className="bi bi-check-circle me-1" />

//                       {saveMessage}

//                     </span>
//                   )}

//               </div>

//               {/* ==================================================
//                   NAVIGATION
//                   ================================================== */}

//               <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">

//                 {/* PREVIOUS */}

//                 <button
//                   type="button"

//                   className="btn btn-outline-secondary px-4"

//                   disabled={
//                     currentIndex ===
//                       0 ||
//                     saving ||
//                     submitting ||
//                     securitySubmitting
//                   }

//                   onClick={
//                     handlePrevious
//                   }
//                 >

//                   <i className="bi bi-arrow-left me-2" />

//                   Previous

//                 </button>

//                 {/* ANSWERED COUNT */}

//                 <span className="small text-muted">

//                   {answeredCount} answered

//                 </span>

//                 {/* NEXT / SUBMIT */}

//                 {currentIndex <
//                 questions.length - 1 ? (

//                   <button
//                     type="button"

//                     className="btn btn-primary px-4"

//                     disabled={
//                       saving ||
//                       submitting ||
//                       securitySubmitting
//                     }

//                     onClick={
//                       handleNext
//                     }
//                   >

//                     Next

//                     <i className="bi bi-arrow-right ms-2" />

//                   </button>

//                 ) : (

//                   <button
//                     type="button"

//                     className="btn btn-success px-4"

//                     disabled={
//                       saving ||
//                       submitting ||
//                       securitySubmitting
//                     }

//                     onClick={() =>
//                       performSubmit({
//                         askConfirmation:
//                           true,
//                       })
//                     }
//                   >

//                     {submitting ? (

//                       <>

//                         <span
//                           className="spinner-border spinner-border-sm me-2"
//                           role="status"
//                         />

//                         Submitting...

//                       </>

//                     ) : (

//                       <>

//                         <i className="bi bi-send-check me-2" />

//                         Submit Assessment

//                       </>
//                     )}

//                   </button>

//                 )}

//               </div>

//             </div>

//           </motion.div>

//         </div>

//         {/* ==================================================
//             QUESTION PALETTE
//             ================================================== */}

//         <div className="col-12 col-lg-4">

//           <div className="card border-0 shadow-sm rounded-4 sticky-lg-top">

//             <div className="card-body p-4">

//               <h3 className="h6 fw-bold mb-3">
//                 Questions
//               </h3>

//               <div
//                 className="d-grid gap-2 mb-4"

//                 style={{
//                   gridTemplateColumns:
//                     "repeat(5, 1fr)",
//                 }}
//               >

//                 {questions.map(
//                   (
//                     question,
//                     index
//                   ) => {

//                     const hasAnswer =
//                       question.selectedAnswer !==
//                         null &&
//                       question.selectedAnswer !==
//                         undefined &&
//                       question.selectedAnswer !==
//                         "" &&
//                       !(
//                         Array.isArray(
//                           question.selectedAnswer
//                         ) &&
//                         question.selectedAnswer
//                           .length ===
//                           0
//                       );

//                     const isCurrent =
//                       index ===
//                       currentIndex;

//                     return (

//                       <button
//                         key={
//                           question._id
//                         }

//                         type="button"

//                         disabled={
//                           submitting ||
//                           securitySubmitting
//                         }

//                         onClick={() =>
//                           goToQuestion(
//                             index
//                           )
//                         }

//                         className={`btn ${
//                           isCurrent
//                             ? "btn-primary"
//                             : hasAnswer
//                             ? "btn-success"
//                             : "btn-outline-secondary"
//                         }`}
//                       >

//                         {index + 1}

//                       </button>
//                     );
//                   }
//                 )}

//               </div>

//               {/* ==================================================
//                   LEGEND
//                   ================================================== */}

//               <div className="border-top pt-3">

//                 <div className="d-flex justify-content-between mb-2">

//                   <span className="small text-muted">
//                     Answered
//                   </span>

//                   <strong className="small text-success">
//                     {answeredCount}
//                   </strong>

//                 </div>

//                 <div className="d-flex justify-content-between mb-2">

//                   <span className="small text-muted">
//                     Unanswered
//                   </span>

//                   <strong className="small text-secondary">
//                     {unansweredCount}
//                   </strong>

//                 </div>

//                 <div className="d-flex justify-content-between">

//                   <span className="small text-muted">
//                     Total
//                   </span>

//                   <strong className="small">
//                     {questions.length}
//                   </strong>

//                 </div>

//               </div>

//               {/* ==================================================
//                   SECURITY INFORMATION
//                   ================================================== */}

//               <div className="alert alert-danger mt-4 mb-0 small">

//                 <div className="fw-semibold mb-2">

//                   <i className="bi bi-shield-lock me-2" />

//                   Secure Assessment

//                 </div>

//                 <ul className="mb-0 ps-3">

//                   <li>
//                     Do not switch assessment tabs.
//                   </li>

//                   <li>
//                     Do not copy, cut or paste.
//                   </li>

//                   <li>
//                     Right-click is disabled.
//                   </li>

//                   <li>
//                     Keyboard security shortcuts are monitored.
//                   </li>

//                   <li>
//                     Leaving the tab twice will automatically
//                     submit the assessment.
//                   </li>

//                 </ul>

//               </div>

//               {/* ==================================================
//                   WARNING
//                   ================================================== */}

//               <div className="alert alert-warning mt-3 mb-0 small">

//                 <i className="bi bi-info-circle me-2" />

//                 Your answers are saved automatically.
//                 Do not close the browser until you
//                 finish the assessment.

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }




import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  getAttemptQuestions,
  saveAttemptAnswer,
  submitAssessmentAttempt,
  recordAttemptSecurityEvent,
  getAttemptSecurityStatus,
} from "../../../services/studentAssessmentService.js";

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function StudentAttempt() {
  const { attemptId } = useParams();

  const navigate = useNavigate();

  // ====================================================
  // FULL-VIEWPORT EXAM LAYOUT
  // Hide page-level scrolling and let the exam own the viewport.
  // The class/style are removed automatically when this page unmounts.
  // ====================================================

  useEffect(() => {
    const bodyClass = "student-attempt-active";
    const styleId = "student-attempt-fullscreen-styles";

    document.body.classList.add(bodyClass);

    let styleElement = document.getElementById(styleId);
    const createdStyle = !styleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.textContent = `
        html, body.student-attempt-active {
          width: 100%;
          height: 100%;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        body.student-attempt-active #root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          max-width: none;
          margin: 0;
          padding: 0;
          overflow: hidden;
          z-index: 1000;
          background: #f8fafc;
        }
        .student-attempt-page {
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
          height: 100%;
          min-height: 100%;
          margin: 0 !important;
          padding: 16px !important;
          overflow-x: hidden;
          overflow-y: auto;
          background: #f8fafc;
        }
        @media (max-width: 576px) {
          .student-attempt-page { padding: 10px !important; }
        }
        .student-attempt-page {
          color: #172033;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 14px;
          line-height: 1.55;
          animation: examPageIn .35s ease-out both;
        }
        @keyframes examPageIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .student-attempt-page h1, .student-attempt-page h2, .student-attempt-page h3,
        .student-attempt-page h4, .student-attempt-page h5, .student-attempt-page h6 {
          color: #111c33; letter-spacing: -0.025em; line-height: 1.3;
        }
        .student-attempt-page .card {
          border: 1px solid #e8edf5 !important; border-radius: 18px !important;
          box-shadow: 0 5px 22px rgba(15, 23, 42, .055) !important;
          transition: box-shadow .22s ease, transform .22s ease;
        }
        .student-attempt-page .card-body { min-width: 0; }
        .student-attempt-page .btn {
          border-radius: 10px !important; font-weight: 600; letter-spacing: .005em;
          transition: transform .18s ease, box-shadow .18s ease, background-color .18s ease;
        }
        .student-attempt-page .btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 5px 14px rgba(37, 99, 235, .14); }
        .student-attempt-page .btn:active { transform: translateY(0) scale(.985); }
        .student-attempt-page .form-check, .student-attempt-page label { line-height: 1.6; }
        .student-attempt-page .form-check-input { cursor: pointer; width: 1.05rem; height: 1.05rem; margin-top: .22rem; }
        .student-attempt-page .alert { border-radius: 12px !important; line-height: 1.65; }
        .student-attempt-page .badge { font-weight: 650; letter-spacing: .01em; }
        .student-attempt-page .sticky-lg-top { top: 14px; }
        .student-attempt-page .d-grid button { min-height: 40px; }
        .student-attempt-page .exam-submit-overlay {
          position: fixed; inset: 0; z-index: 100100; display: flex; align-items: center;
          justify-content: center; padding: 20px; background: rgba(15, 23, 42, .58);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .student-attempt-page .exam-submit-dialog {
          width: min(100%, 440px); border: 1px solid rgba(255,255,255,.7); border-radius: 22px;
          background: #fff; padding: 28px; box-shadow: 0 24px 80px rgba(2, 6, 23, .28);
        }
        .student-attempt-page .exam-dialog-icon {
          width: 58px; height: 58px; border-radius: 18px; display: grid; place-items: center;
          margin-bottom: 18px; font-size: 25px; background: #eff6ff; color: #2563eb;
        }
        @media (max-width: 576px) {
          .student-attempt-page .exam-submit-dialog { padding: 22px; border-radius: 18px; }
          .student-attempt-page .card-body { padding: 16px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .student-attempt-page, .student-attempt-page * { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `;
      document.head.appendChild(styleElement);
    }

    return () => {
      document.body.classList.remove(bodyClass);
      if (createdStyle && styleElement?.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  // ====================================================
  // STATE
  // ====================================================

  const [attempt, setAttempt] =
    useState(null);

  const [questions, setQuestions] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [timeLeft, setTimeLeft] =
    useState(0);

  const [expired, setExpired] =
    useState(false);

  // ====================================================
  // SUBMISSION STATE
  // ====================================================

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  // Custom in-app confirmation/error dialog (never use browser confirm/alert).
  const [submitDialog, setSubmitDialog] = useState(null);

  // ====================================================
  // SECURITY STATE
  // ====================================================

  const [securityWarning, setSecurityWarning] =
    useState(null);

  const [tabSwitchCount, setTabSwitchCount] =
    useState(0);

  const [securityViolationCount, setSecurityViolationCount] =
    useState(0);

  const [securitySubmitting, setSecuritySubmitting] =
    useState(false);

  /*
   * Start as false.
   *
   * Fullscreen requires a user gesture in most browsers,
   * therefore we show the fullscreen button after the
   * assessment has loaded instead of blocking the screen
   * before the attempt is ready.
   */
  const [fullscreenRequired, setFullscreenRequired] =
    useState(false);

  // ====================================================
  // SECURITY REFS
  // ====================================================

  const securityEventLockRef =
    useRef(false);

  const lastVisibilityEventRef =
    useRef(0);

  const assessmentActiveRef =
    useRef(false);

  // ====================================================
  // PREVENT MULTIPLE AUTO SUBMISSIONS
  // ====================================================

  const autoSubmitStarted =
    useRef(false);

  // ====================================================
  // LOAD ATTEMPT QUESTIONS
  // ====================================================

  const loadQuestions = async () => {
    try {
      setLoading(true);

      setError("");

      const response =
        await getAttemptQuestions(
          attemptId
        );

      if (
        !response?.success ||
        !response?.data
      ) {
        throw new Error(
          response?.message ||
            "Failed to load assessment."
        );
      }

      setAttempt(
        response.data.attempt
      );

      setQuestions(
        response.data.questions || []
      );

      // ------------------------------------------------
      // RESET TIMER STATE
      // ------------------------------------------------

      setExpired(false);

      autoSubmitStarted.current =
        false;

      setSubmitError("");

      // ------------------------------------------------
      // SECURITY STATE
      // ------------------------------------------------

      setSecurityWarning(null);

      setSecuritySubmitting(false);

      setFullscreenRequired(
        !document.fullscreenElement
      );

    } catch (err) {
      console.error(
        "Student Attempt Load Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load assessment."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    if (attemptId) {
      loadQuestions();
    }
  }, [attemptId]);

  // ====================================================
  // CURRENT QUESTION
  // ====================================================

  const currentQuestion =
    questions[currentIndex];

  // ====================================================
  // ANSWERED COUNT
  // ====================================================

  const answeredCount =
    useMemo(() => {
      return questions.filter(
        (question) =>
          question.selectedAnswer !==
            null &&
          question.selectedAnswer !==
            undefined &&
          question.selectedAnswer !==
            "" &&
          !(
            Array.isArray(
              question.selectedAnswer
            ) &&
            question.selectedAnswer
              .length === 0
          )
      ).length;
    }, [questions]);

  // ====================================================
  // UNANSWERED COUNT
  // ====================================================

  const unansweredCount =
    Math.max(
      0,
      questions.length -
        answeredCount
    );

  // ====================================================
  // ACTIVE ASSESSMENT REF
  // ====================================================

  useEffect(() => {
    assessmentActiveRef.current =
      Boolean(
        attempt &&
        !loading &&
        !submitting &&
        !securitySubmitting &&
        !expired
      );
  }, [
    attempt,
    loading,
    submitting,
    securitySubmitting,
    expired,
  ]);

  // ====================================================
  // SECURITY EVENT HANDLER
  // ====================================================

  const handleSecurityEvent =
    useCallback(
      async (
        type
      ) => {
        if (
          !attemptId ||
          !assessmentActiveRef.current
        ) {
          return;
        }

        /*
         * Prevent duplicate security API calls.
         *
         * This is especially useful for browser events
         * such as visibilitychange/fullscreenchange.
         */

        if (
          securityEventLockRef.current
        ) {
          return;
        }

        securityEventLockRef.current =
          true;

        try {
          const response =
            await recordAttemptSecurityEvent(
              attemptId,
              type
            );

          const data =
            response?.data;

          if (!data) {
            return;
          }

          // ------------------------------------------------
          // UPDATE SECURITY COUNTS
          // ------------------------------------------------

          setTabSwitchCount(
            Number(
              data.tabSwitchCount || 0
            )
          );

          setSecurityViolationCount(
            Number(
              data.securityViolationCount ||
                0
            )
          );

          // ------------------------------------------------
          // BACKEND AUTO SUBMISSION
          // ------------------------------------------------

          if (
            data.autoSubmitted
          ) {
            setSecuritySubmitting(
              true
            );

            setSecurityWarning({
              type: "AUTO_SUBMITTED",

              title:
                "Assessment Submitted",

              message:
                data.message ||
                "The assessment was automatically submitted because the security limit was reached.",
            });

            /*
             * Backend has already evaluated/submitted
             * the attempt.
             *
             * Give the student a short message before
             * moving to the result page.
             */

            window.setTimeout(() => {
              navigate(
                `/student/attempts/${attemptId}/result`,
                {
                  replace: true,
                }
              );
            }, 1800);

            return;
          }

          // ------------------------------------------------
          // FIRST TAB SWITCH WARNING
          // ------------------------------------------------

          if (
            type === "TAB_SWITCH" &&
            data.warning
          ) {
            setSecurityWarning({
              type: "WARNING",

              title:
                "Security Warning",

              message:
                data.message ||
                "You left the assessment tab. If this happens again, your assessment will be submitted automatically.",
            });
          }

        } catch (error) {
          console.error(
            "Assessment security error:",
            error
          );
        } finally {
          window.setTimeout(() => {
            securityEventLockRef.current =
              false;
          }, 500);
        }
      },
      [
        attemptId,
        navigate,
      ]
    );

  // ====================================================
  // LOAD PERSISTED SECURITY STATUS
  // ====================================================

  useEffect(() => {
    if (!attemptId) {
      return;
    }

    const loadSecurityStatus =
      async () => {
        try {
          const response =
            await getAttemptSecurityStatus(
              attemptId
            );

          const data =
            response?.data;

          if (!data) {
            return;
          }

          setTabSwitchCount(
            Number(
              data.tabSwitchCount || 0
            )
          );

          setSecurityViolationCount(
            Number(
              data.securityViolationCount ||
                0
            )
          );

          /*
           * If the backend says that the attempt
           * was already auto-submitted because of
           * security, do not allow the student
           * to continue.
           */

          if (
            data.securityAutoSubmitted
          ) {
            setSecuritySubmitting(
              true
            );

            setSecurityWarning({
              type: "AUTO_SUBMITTED",

              title:
                "Assessment Submitted",

              message:
                data.securityAutoSubmitReason ||
                "This assessment was automatically submitted because the security limit was reached.",
            });

            window.setTimeout(() => {
              navigate(
                `/student/attempts/${attemptId}/result`,
                {
                  replace: true,
                }
              );
            }, 1500);
          }

        } catch (error) {
          console.error(
            "Unable to load security status:",
            error
          );
        }
      };

    loadSecurityStatus();

  }, [
    attemptId,
    navigate,
  ]);

  // ====================================================
  // TAB SWITCH DETECTION
  // ====================================================

  useEffect(() => {
    if (!attemptId) {
      return;
    }

    const handleVisibilityChange =
      () => {

        /*
         * We only treat the page becoming hidden
         * as a tab-switch style security event.
         *
         * This is better than using window.blur()
         * because blur can happen for normal browser
         * or operating-system interactions.
         */

        if (
          document.visibilityState !==
          "hidden"
        ) {
          return;
        }

        if (
          !assessmentActiveRef.current
        ) {
          return;
        }

        const now =
          Date.now();

        /*
         * Prevent multiple closely-spaced
         * visibility events from counting
         * as multiple tab switches.
         */

        if (
          now -
            lastVisibilityEventRef.current <
          1000
        ) {
          return;
        }

        lastVisibilityEventRef.current =
          now;

        handleSecurityEvent(
          "TAB_SWITCH"
        );
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };

  }, [
    attemptId,
    handleSecurityEvent,
  ]);

  // ====================================================
  // DISABLE COPY
  // ====================================================

  useEffect(() => {

    const handleCopy =
      (event) => {

        if (
          !assessmentActiveRef.current
        ) {
          return;
        }

        event.preventDefault();

        handleSecurityEvent(
          "COPY"
        );
      };

    document.addEventListener(
      "copy",
      handleCopy
    );

    return () => {
      document.removeEventListener(
        "copy",
        handleCopy
      );
    };

  }, [
    handleSecurityEvent,
  ]);

  // ====================================================
  // DISABLE CUT
  // ====================================================

  useEffect(() => {

    const handleCut =
      (event) => {

        if (
          !assessmentActiveRef.current
        ) {
          return;
        }

        event.preventDefault();

        handleSecurityEvent(
          "CUT"
        );
      };

    document.addEventListener(
      "cut",
      handleCut
    );

    return () => {
      document.removeEventListener(
        "cut",
        handleCut
      );
    };

  }, [
    handleSecurityEvent,
  ]);

  // ====================================================
  // DISABLE PASTE
  // ====================================================

  useEffect(() => {

    const handlePaste =
      (event) => {

        if (
          !assessmentActiveRef.current
        ) {
          return;
        }

        event.preventDefault();

        handleSecurityEvent(
          "PASTE"
        );
      };

    document.addEventListener(
      "paste",
      handlePaste
    );

    return () => {
      document.removeEventListener(
        "paste",
        handlePaste
      );
    };

  }, [
    handleSecurityEvent,
  ]);

  // ====================================================
  // DISABLE RIGHT CLICK
  // ====================================================

  useEffect(() => {

    const handleContextMenu =
      (event) => {

        if (
          !assessmentActiveRef.current
        ) {
          return;
        }

        event.preventDefault();

        handleSecurityEvent(
          "RIGHT_CLICK"
        );
      };

    document.addEventListener(
      "contextmenu",
      handleContextMenu
    );

    return () => {
      document.removeEventListener(
        "contextmenu",
        handleContextMenu
      );
    };

  }, [
    handleSecurityEvent,
  ]);

  // ====================================================
  // KEYBOARD SECURITY
  // ====================================================

  useEffect(() => {

    const handleKeyDown =
      (event) => {

        if (
          !assessmentActiveRef.current
        ) {
          return;
        }

        const key =
          String(
            event.key || ""
          ).toLowerCase();

        // ------------------------------------------------
        // F12
        // ------------------------------------------------

        if (
          event.key === "F12"
        ) {

          event.preventDefault();

          handleSecurityEvent(
            "DEVTOOLS_SHORTCUT"
          );

          return;
        }

        // ------------------------------------------------
        // CTRL + SHIFT + I
        // CTRL + SHIFT + J
        // CTRL + SHIFT + C
        // ------------------------------------------------

        if (
          event.ctrlKey &&
          event.shiftKey &&
          ["i", "j", "c"].includes(
            key
          )
        ) {

          event.preventDefault();

          handleSecurityEvent(
            "DEVTOOLS_SHORTCUT"
          );

          return;
        }

        // ------------------------------------------------
        // CTRL + U
        // ------------------------------------------------

        if (
          event.ctrlKey &&
          key === "u"
        ) {

          event.preventDefault();

          handleSecurityEvent(
            "DEVTOOLS_SHORTCUT"
          );

          return;
        }

        // ------------------------------------------------
        // CTRL + P
        // ------------------------------------------------

        if (
          event.ctrlKey &&
          key === "p"
        ) {

          event.preventDefault();

          handleSecurityEvent(
            "PRINT_SHORTCUT"
          );

          return;
        }

        // ------------------------------------------------
        // CTRL + S
        // ------------------------------------------------

        if (
          event.ctrlKey &&
          key === "s"
        ) {

          event.preventDefault();

          handleSecurityEvent(
            "SAVE_SHORTCUT"
          );

          return;
        }

        // ------------------------------------------------
        // CTRL + C / X / V
        // ------------------------------------------------

        if (
          event.ctrlKey &&
          ["c", "x", "v"].includes(
            key
          )
        ) {

          event.preventDefault();

          /*
           * Do not call security event here.
           *
           * Browser copy/cut/paste events will
           * record the event separately.
           *
           * This prevents duplicate events.
           */

          return;
        }
      };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [
    handleSecurityEvent,
  ]);

  // ====================================================
  // FULLSCREEN
  // ====================================================

  const enterFullscreen =
    async () => {

      try {

        const element =
          document.documentElement;

        if (
          !document.fullscreenElement
        ) {

          await element.requestFullscreen();

          setFullscreenRequired(
            false
          );
        }

      } catch (error) {

        console.error(
          "Fullscreen error:",
          error
        );

      }
    };

  // ====================================================
  // FULLSCREEN EXIT DETECTION
  // ====================================================

  useEffect(() => {

    const handleFullscreenChange =
      () => {

        if (
          !assessmentActiveRef.current
        ) {
          return;
        }

        if (
          !document.fullscreenElement
        ) {

          setFullscreenRequired(
            true
          );

          handleSecurityEvent(
            "FULLSCREEN_EXIT"
          );

        } else {

          setFullscreenRequired(
            false
          );

        }
      };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {

      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );

    };

  }, [
    handleSecurityEvent,
  ]);

  // ====================================================
  // PREVENT ACCIDENTAL REFRESH / CLOSE
  // ====================================================

  useEffect(() => {

    const handleBeforeUnload =
      (event) => {

        if (
          !assessmentActiveRef.current
        ) {
          return;
        }

        event.preventDefault();

        event.returnValue = "";
      };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {

      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );

    };

  }, []);

  // ====================================================
  // UPDATE LOCAL ANSWER
  // ====================================================

  const updateLocalAnswer = (
    questionId,
    answer
  ) => {

    setQuestions(
      (previous) =>
        previous.map(
          (question) =>
            String(
              question._id
            ) ===
            String(
              questionId
            )
              ? {
                  ...question,

                  selectedAnswer:
                    answer,

                  answeredAt:
                    new Date().toISOString(),
                }
              : question
        )
    );
  };

  // ====================================================
  // SAVE ANSWER
  // ====================================================

  const handleSaveAnswer =
    async (answer) => {

      if (!currentQuestion) {
        return;
      }

      if (
        expired ||
        submitting ||
        securitySubmitting
      ) {
        return;
      }

      try {

        setSaving(true);

        setSaveMessage("");

        // ----------------------------------------------
        // UPDATE UI IMMEDIATELY
        // ----------------------------------------------

        updateLocalAnswer(
          currentQuestion._id,
          answer
        );

        // ----------------------------------------------
        // SAVE TO BACKEND
        // ----------------------------------------------

        await saveAttemptAnswer(
          attemptId,
          currentQuestion._id,
          answer
        );

        setSaveMessage(
          "Answer saved"
        );

        // ----------------------------------------------
        // CLEAR MESSAGE
        // ----------------------------------------------

        setTimeout(() => {
          setSaveMessage("");
        }, 1500);

      } catch (err) {

        console.error(
          "Save Answer Error:",
          err
        );

        setSaveMessage(
          "Failed to save answer"
        );

      } finally {

        setSaving(false);

      }
    };

  // ====================================================
  // SAVE TEXT ANSWER
  // ====================================================

  const saveTextAnswer =
    async () => {

      if (!currentQuestion) {
        return;
      }

      if (
        expired ||
        submitting ||
        securitySubmitting
      ) {
        return;
      }

      await handleSaveAnswer(
        currentQuestion.selectedAnswer ||
          ""
      );
    };

  // ====================================================
  // SUBMIT ATTEMPT
  // ====================================================

  const performSubmit =
    async ({
      askConfirmation = true,
      confirmed = false,
    } = {}) => {

      // -----------------------------------------------
      // PREVENT DUPLICATE SUBMISSION
      // -----------------------------------------------

      if (
        submitting ||
        securitySubmitting ||
        (
          !askConfirmation &&
          !confirmed &&
          autoSubmitStarted.current
        )
      ) {
        return;
      }

      // -----------------------------------------------
      // MANUAL CONFIRMATION
      // -----------------------------------------------

      if (askConfirmation) {
        setSubmitDialog({ type: "confirm" });
        return;
      }

      try {

        // ---------------------------------------------
        // MARK AUTO SUBMISSION AS STARTED
        // ---------------------------------------------

        if (!askConfirmation && !confirmed) {
          autoSubmitStarted.current = true;
        }
        setSubmitDialog(null);

        setSubmitting(true);

        setSubmitError("");

        // ---------------------------------------------
        // SAVE CURRENT TEXT ANSWER
        //
        // This is useful when the student has typed
        // something but has not moved to another
        // question yet.
        // ---------------------------------------------

        if (
          currentQuestion &&
          (
            currentQuestion.questionType ===
              "SHORT_ANSWER" ||
            currentQuestion.questionType ===
              "LONG_ANSWER"
          )
        ) {

          try {

            await saveAttemptAnswer(
              attemptId,
              currentQuestion._id,
              currentQuestion.selectedAnswer ||
                ""
            );

          } catch (saveError) {

            console.error(
              "Final answer save failed:",
              saveError
            );

            /*
             * Continue submission.
             *
             * Other answers already saved on
             * the backend will still be evaluated.
             */
          }
        }

        // ---------------------------------------------
        // SUBMIT ATTEMPT
        // ---------------------------------------------

        const response =
          await submitAssessmentAttempt(
            attemptId
          );

        if (
          !response?.success
        ) {

          throw new Error(
            response?.message ||
              "Failed to submit assessment."
          );
        }

        // ---------------------------------------------
        // MARK EXPIRED AS COMPLETED
        // ---------------------------------------------

        setExpired(false);

        // ---------------------------------------------
        // DISABLE SECURITY AFTER SUBMISSION
        // ---------------------------------------------

        assessmentActiveRef.current =
          false;

        // ---------------------------------------------
        // GO TO RESULT PAGE
        // ---------------------------------------------

        navigate(
          `/student/attempts/${attemptId}/result`,
          {
            replace: true,
          }
        );

      } catch (err) {

        console.error(
          "Assessment Submission Error:",
          err
        );

        const message =
          err.response?.data?.message ||
          err.message ||
          "Unable to submit assessment.";

        setSubmitError(
          message
        );

        // ---------------------------------------------
        // AUTO SUBMISSION FAILED
        //
        // Allow retry.
        // ---------------------------------------------

        if (!askConfirmation && !confirmed) {
          autoSubmitStarted.current = false;
        }

        setSubmitDialog({ type: "error", message });

      } finally {

        setSubmitting(false);

      }
    };

  // ====================================================
  // TIMER
  // ====================================================

  useEffect(() => {

    if (!attempt?.expiresAt) {
      return;
    }

    const updateTimer = () => {

      const expiresAt =
        new Date(
          attempt.expiresAt
        ).getTime();

      const now =
        Date.now();

      const remaining =
        Math.max(
          0,
          expiresAt - now
        );

      const seconds =
        Math.floor(
          remaining / 1000
        );

      setTimeLeft(
        seconds
      );

      // ----------------------------------------------
      // TIMER EXPIRED
      // ----------------------------------------------

      if (
        remaining <= 0
      ) {

        setExpired(true);
      }
    };

    updateTimer();

    const interval =
      setInterval(
        updateTimer,
        1000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [attempt]);

  // ====================================================
  // AUTO SUBMIT WHEN TIMER EXPIRES
  // ====================================================

  useEffect(() => {

    if (
      expired &&
      !autoSubmitStarted.current &&
      !submitting &&
      !securitySubmitting
    ) {

      performSubmit({
        askConfirmation: false,
      });
    }

  }, [
    expired,
    submitting,
    securitySubmitting,
  ]);

  // ====================================================
  // FORMAT TIMER
  // ====================================================

  const formatTime = (
    totalSeconds
  ) => {

    const hours =
      Math.floor(
        totalSeconds /
          3600
      );

    const minutes =
      Math.floor(
        (
          totalSeconds %
            3600
        ) / 60
      );

    const seconds =
      totalSeconds %
      60;

    if (
      hours > 0
    ) {

      return `${String(
        hours
      ).padStart(
        2,
        "0"
      )}:${String(
        minutes
      ).padStart(
        2,
        "0"
      )}:${String(
        seconds
      ).padStart(
        2,
        "0"
      )}`;
    }

    return `${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      seconds
    ).padStart(
      2,
      "0"
    )}`;
  };

  // ====================================================
  // MCQ / TRUE FALSE
  // ====================================================

  const handleSingleChoice =
    (optionId) => {

      if (
        expired ||
        submitting ||
        securitySubmitting
      ) {
        return;
      }

      handleSaveAnswer(
        optionId
      );
    };

  // ====================================================
  // MULTIPLE SELECT
  // ====================================================

  const handleMultipleSelect =
    (optionId) => {

      if (
        expired ||
        submitting ||
        securitySubmitting
      ) {
        return;
      }

      const current =
        Array.isArray(
          currentQuestion.selectedAnswer
        )
          ? currentQuestion.selectedAnswer
          : [];

      const exists =
        current.some(
          (id) =>
            String(id) ===
            String(optionId)
        );

      let updated;

      if (exists) {

        updated =
          current.filter(
            (id) =>
              String(id) !==
              String(optionId)
          );

      } else {

        updated = [
          ...current,
          optionId,
        ];
      }

      handleSaveAnswer(
        updated
      );
    };

  // ====================================================
  // TEXT ANSWER
  // ====================================================

  const handleTextAnswer =
    (event) => {

      if (
        expired ||
        submitting ||
        securitySubmitting ||
        !currentQuestion
      ) {
        return;
      }

      updateLocalAnswer(
        currentQuestion._id,
        event.target.value
      );
    };

  // ====================================================
  // PREVIOUS
  // ====================================================

  const handlePrevious =
    async () => {

      if (
        currentIndex <= 0 ||
        submitting ||
        securitySubmitting
      ) {
        return;
      }

      // ----------------------------------------------
      // SAVE TEXT BEFORE MOVING
      // ----------------------------------------------

      if (
        currentQuestion &&
        (
          currentQuestion.questionType ===
            "SHORT_ANSWER" ||
          currentQuestion.questionType ===
            "LONG_ANSWER"
        )
      ) {

        await saveTextAnswer();
      }

      setCurrentIndex(
        (index) =>
          index - 1
      );
    };

  // ====================================================
  // NEXT
  // ====================================================

  const handleNext =
    async () => {

      if (
        !currentQuestion ||
        submitting ||
        securitySubmitting
      ) {
        return;
      }

      // ----------------------------------------------
      // SAVE TEXT ANSWER
      // ----------------------------------------------

      if (
        currentQuestion.questionType ===
          "SHORT_ANSWER" ||
        currentQuestion.questionType ===
          "LONG_ANSWER"
      ) {

        await saveTextAnswer();
      }

      // ----------------------------------------------
      // MOVE NEXT
      // ----------------------------------------------

      if (
        currentIndex <
        questions.length - 1
      ) {

        setCurrentIndex(
          (index) =>
            index + 1
        );
      }
    };

  // ====================================================
  // QUESTION PALETTE
  // ====================================================

  const goToQuestion =
    async (index) => {

      if (
        submitting ||
        securitySubmitting ||
        index === currentIndex
      ) {
        return;
      }

      // ----------------------------------------------
      // SAVE TEXT BEFORE CHANGING QUESTION
      // ----------------------------------------------

      if (
        currentQuestion &&
        (
          currentQuestion.questionType ===
            "SHORT_ANSWER" ||
          currentQuestion.questionType ===
            "LONG_ANSWER"
        )
      ) {

        await saveTextAnswer();
      }

      setCurrentIndex(
        index
      );
    };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (
      <div className="container-fluid px-0 student-attempt-page">

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body text-center py-5">

            <div
              className="spinner-border text-primary"
              role="status"
            />

            <p className="text-muted mt-3 mb-0">
              Loading assessment...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {

    return (
      <div className="container-fluid px-0 student-attempt-page">

        <div className="alert alert-danger rounded-4">

          <h5 className="fw-bold">
            Unable to Load Assessment
          </h5>

          <p className="mb-3">
            {error}
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={
              loadQuestions
            }
          >
            Retry
          </button>

        </div>

      </div>
    );
  }

  // ====================================================
  // NO QUESTIONS
  // ====================================================

  if (!questions.length) {

    return (
      <div className="container-fluid px-0 student-attempt-page">

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body text-center py-5">

            <div className="fs-1 mb-3">
              📝
            </div>

            <h4 className="fw-bold">
              No Questions Available
            </h4>

            <p className="text-muted">
              There are no published questions
              available for this assessment.
            </p>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                navigate(
                  "/student/assessments"
                )
              }
            >
              Back to Assessments
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ====================================================
  // EXPIRED + SUBMITTING
  // ====================================================

  if (
    expired &&
    submitting
  ) {

    return (
      <div className="container-fluid px-0 student-attempt-page">

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body text-center py-5">

            <div
              className="spinner-border text-primary mb-3"
              role="status"
            />

            <h3 className="h5 fw-bold">
              Time Expired
            </h3>

            <p className="text-muted mb-0">
              Your assessment is being
              submitted automatically...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ====================================================
  // EXPIRED + SUBMISSION FAILED
  // ====================================================

  if (
    expired &&
    !submitting
  ) {

    return (
      <div className="container-fluid px-0 student-attempt-page">

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body text-center py-5">

            <div className="fs-1 mb-3">
              ⏰
            </div>

            <h3 className="fw-bold">
              Time Expired
            </h3>

            <p className="text-muted">
              Your assessment time has expired.
            </p>

            {submitError && (
              <div className="alert alert-danger text-start mt-3">

                <strong>
                  Automatic submission failed.
                </strong>

                <div className="small mt-1">
                  {submitError}
                </div>

              </div>
            )}

            <button
              type="button"
              className="btn btn-primary px-4"
              disabled={
                submitting ||
                securitySubmitting
              }
              onClick={() =>
                performSubmit({
                  askConfirmation:
                    false,
                })
              }
            >

              {submitting ? (
                <>

                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />

                  Submitting...

                </>
              ) : (
                <>

                  <i className="bi bi-send-check me-2" />

                  Submit Now

                </>
              )}

            </button>

          </div>

        </div>

      </div>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="container-fluid px-0 student-attempt-page">

      {/* ==================================================
          CUSTOM SUBMISSION CONFIRMATION / ERROR DIALOG
          ================================================== */}
      {submitDialog && (
        <div className="exam-submit-overlay" role="presentation">
          <motion.div
            className="exam-submit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exam-submit-dialog-title"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="exam-dialog-icon" style={submitDialog.type === "error" ? { background: "#fef2f2", color: "#dc2626" } : undefined}>
              <i className={`bi ${submitDialog.type === "error" ? "bi-exclamation-triangle" : "bi-send-check"}`} />
            </div>
            <h2 id="exam-submit-dialog-title" className="h4 fw-bold mb-2">
              {submitDialog.type === "error" ? "Submission failed" : "Submit your assessment?"}
            </h2>
            <p className="text-secondary mb-3" style={{ fontSize: "14px" }}>
              {submitDialog.type === "error"
                ? submitDialog.message || "We could not submit your assessment. Please try again."
                : "You’re about to finish this assessment. After submitting, you won’t be able to change your answers."}
            </p>
            {submitDialog.type !== "error" && (
              <div className="d-flex align-items-center gap-3 rounded-3 p-3 mb-4" style={{ background: "#f8fafc", border: "1px solid #e8edf5" }}>
                <i className="bi bi-check2-circle text-success fs-4" />
                <div>
                  <div className="fw-semibold">{questions.filter((q) => q.selectedAnswer !== undefined && q.selectedAnswer !== null && String(q.selectedAnswer).trim() !== "").length} answered</div>
                  <div className="small text-secondary">of {questions.length} questions</div>
                </div>
                <div className="ms-auto text-end">
                  <div className="fw-semibold">{Math.max(0, questions.length - questions.filter((q) => q.selectedAnswer !== undefined && q.selectedAnswer !== null && String(q.selectedAnswer).trim() !== "").length)} left</div>
                  <div className="small text-secondary">unanswered</div>
                </div>
              </div>
            )}
            <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2 mt-4">
              {submitDialog.type === "confirm" ? (
                <>
                  <button type="button" className="btn btn-light border px-4 py-2" disabled={submitting} onClick={() => setSubmitDialog(null)}>Review answers</button>
                  <button type="button" className="btn btn-success px-4 py-2" disabled={submitting || securitySubmitting} onClick={() => { setSubmitDialog(null); performSubmit({ askConfirmation: false, confirmed: true }); }}>
                    {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Submitting...</> : <><i className="bi bi-send-check me-2" />Yes, submit</>}
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-primary px-4 py-2" onClick={() => setSubmitDialog(null)}>Got it</button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ==================================================
          SECURITY WARNING MODAL
          ================================================== */}

      {securityWarning && (

        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background:
              "rgba(15, 23, 42, 0.75)",

            backdropFilter:
              "blur(7px)",

            zIndex:
              99999,

            padding:
              "20px",
          }}
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.85,
              y: 20,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}

            className="card border-0 shadow-lg"

            style={{
              maxWidth:
                "520px",

              width:
                "100%",

              borderRadius:
                "22px",
            }}
          >

            <div className="card-body p-4 p-md-5 text-center">

              <div
                className={`mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center ${
                  securityWarning.type ===
                  "AUTO_SUBMITTED"
                    ? "bg-danger-subtle"
                    : "bg-warning-subtle"
                }`}

                style={{
                  width:
                    "78px",

                  height:
                    "78px",
                }}
              >

                <i
                  className={`bi ${
                    securityWarning.type ===
                    "AUTO_SUBMITTED"
                      ? "bi-shield-x text-danger"
                      : "bi-exclamation-triangle text-warning"
                  }`}

                  style={{
                    fontSize:
                      "34px",
                  }}
                />

              </div>

              <h3 className="fw-bold mb-3">
                {securityWarning.title}
              </h3>

              <p
                className="text-secondary mb-3"

                style={{
                  lineHeight:
                    "1.7",
                }}
              >
                {securityWarning.message}
              </p>

              {securityWarning.type ===
                "WARNING" && (

                <div
                  className="alert alert-danger border-0 rounded-3"
                >

                  <strong>
                    Important:
                  </strong>

                  {" "}

                  This is warning{" "}
                  {tabSwitchCount} of 2.

                  <br />

                  If you leave this assessment
                  tab again, the assessment will
                  be submitted automatically.

                </div>
              )}

              {securityWarning.type ===
              "WARNING" ? (

                <button
                  type="button"

                  className="btn btn-warning px-4 py-2 rounded-3 fw-semibold"

                  onClick={() =>
                    setSecurityWarning(
                      null
                    )
                  }
                >

                  <i className="bi bi-shield-check me-2" />

                  I Understand

                </button>

              ) : (

                <div>

                  <div
                    className="spinner-border text-danger"
                    role="status"
                  />

                  <p className="text-muted mt-3 mb-0">
                    Opening your result...
                  </p>

                </div>
              )}

            </div>

          </motion.div>

        </div>
      )}

      {/* ==================================================
          FULLSCREEN REQUIRED OVERLAY
          ================================================== */}

      {fullscreenRequired &&
        attempt &&
        !securitySubmitting &&
        !securityWarning && (

          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"

            style={{
              background:
                "rgba(2, 6, 23, 0.88)",

              zIndex:
                99990,

              padding:
                "20px",
            }}
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}

              animate={{
                opacity: 1,
                scale: 1,
              }}

              className="card border-0 shadow-lg text-center"

              style={{
                maxWidth:
                  "500px",

                width:
                  "100%",

                borderRadius:
                  "22px",
              }}
            >

              <div className="card-body p-5">

                <div
                  className="mx-auto mb-4 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"

                  style={{
                    width:
                      "75px",

                    height:
                      "75px",
                  }}
                >

                  <i
                    className="bi bi-arrows-fullscreen"

                    style={{
                      fontSize:
                        "30px",
                    }}
                  />

                </div>

                <h3 className="fw-bold">
                  Secure Assessment Mode
                </h3>

                <p className="text-muted mb-4">
                  This assessment must be completed
                  in fullscreen mode.

                  <br />

                  Leaving the assessment tab is
                  monitored.
                </p>

                <button
                  type="button"

                  className="btn btn-primary px-4 py-2 rounded-3"

                  onClick={
                    enterFullscreen
                  }
                >

                  <i className="bi bi-arrows-fullscreen me-2" />

                  Enter Fullscreen & Continue

                </button>

              </div>

            </motion.div>

          </div>
        )}

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="card border-0 shadow-sm rounded-4 mb-3">

        <div className="card-body p-3 p-md-4">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

            <div>

              <div className="small text-muted mb-1">
                Assessment
              </div>

              <h1 className="h4 fw-bold mb-0">
                {attempt?.assessment?.title ||
                  "Assessment"}
              </h1>

            </div>

            {/* TIMER + SECURITY */}

            <div className="d-flex flex-column align-items-md-end gap-2">

              <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">

                <div
                  className={`px-3 py-2 rounded-3 border fw-bold ${
                    timeLeft <= 60
                      ? "text-danger border-danger bg-danger-subtle"
                      : "text-primary border-primary bg-primary-subtle"
                  }`}
                >

                  <i className="bi bi-clock me-2" />

                  {formatTime(
                    timeLeft
                  )}

                </div>

              </div>

              {/* ==================================================
                  SECURITY INDICATOR
                  ================================================== */}

              <div className="d-flex gap-2 align-items-center flex-wrap justify-content-end">

                <span
                  className="badge bg-success-subtle text-success px-3 py-2 rounded-pill"
                >

                  <i className="bi bi-shield-check me-1" />

                  Secure Mode

                </span>

                <span
                  className={`badge px-3 py-2 rounded-pill ${
                    tabSwitchCount > 0
                      ? "bg-warning-subtle text-warning-emphasis"
                      : "bg-light text-secondary"
                  }`}
                >

                  <i className="bi bi-window-stack me-1" />

                  Tab Warnings:
                  {" "}
                  {tabSwitchCount}/2

                </span>

                {securityViolationCount > 0 && (

                  <span
                    className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill"
                  >

                    <i className="bi bi-exclamation-triangle me-1" />

                    Security Events:
                    {" "}
                    {securityViolationCount}

                  </span>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          SUBMISSION ERROR
          ================================================== */}

      {submitError &&
        !expired && (

          <div className="alert alert-danger rounded-4 mb-3">

            <div className="d-flex align-items-start gap-2">

              <i className="bi bi-exclamation-triangle-fill" />

              <div>
                {submitError}
              </div>

            </div>

          </div>
        )}

      {/* ==================================================
          MAIN CONTENT
          ================================================== */}

      <div className="row g-3">

        {/* ==================================================
            QUESTION AREA
            ================================================== */}

        <div className="col-12 col-lg-8">

          <motion.div
            key={
              currentQuestion._id
            }

            initial={{
              opacity: 0,
              x: 15,
            }}

            animate={{
              opacity: 1,
              x: 0,
            }}

            className="card border-0 shadow-sm rounded-4"
          >

            <div className="card-body p-4">

              {/* QUESTION HEADER */}

              <div className="d-flex justify-content-between align-items-start gap-3 mb-4">

                <div>

                  <div className="small text-muted mb-2">

                    Question{" "}

                    {currentIndex + 1}

                    {" "}of{" "}

                    {questions.length}

                  </div>

                  <h2 className="h5 fw-bold mb-0">

                    {currentQuestion.questionText}

                  </h2>

                </div>

                <span className="badge bg-primary-subtle text-primary px-3 py-2">

                  {currentQuestion.marks}{" "}

                  {currentQuestion.marks ===
                  1
                    ? "Mark"
                    : "Marks"}

                </span>

              </div>

              {/* ==================================================
                  MCQ
                  ================================================== */}

              {currentQuestion.questionType ===
                "MCQ" && (

                <div className="d-flex flex-column gap-3">

                  {currentQuestion.options.map(
                    (option) => {

                      const selected =
                        String(
                          currentQuestion.selectedAnswer
                        ) ===
                        String(
                          option._id
                        );

                      return (

                        <button
                          key={
                            option._id
                          }

                          type="button"

                          disabled={
                            saving ||
                            submitting ||
                            securitySubmitting
                          }

                          onClick={() =>
                            handleSingleChoice(
                              option._id
                            )
                          }

                          className={`text-start border rounded-3 p-3 bg-white ${
                            selected
                              ? "border-primary bg-primary-subtle"
                              : "border-secondary-subtle"
                          }`}
                        >

                          <div className="d-flex align-items-center gap-3">

                            <span
                              className={`rounded-circle border d-flex align-items-center justify-content-center ${
                                selected
                                  ? "border-primary bg-primary text-white"
                                  : ""
                              }`}

                              style={{
                                width: 22,
                                height: 22,
                              }}
                            >

                              {selected && (
                                <i className="bi bi-check" />
                              )}

                            </span>

                            <span className="text-dark">
                              {option.text}
                            </span>

                          </div>

                        </button>
                      );
                    }
                  )}

                </div>
              )}

              {/* ==================================================
                  TRUE / FALSE
                  ================================================== */}

              {currentQuestion.questionType ===
                "TRUE_FALSE" && (

                <div className="d-flex flex-column gap-3">

                  {currentQuestion.options.map(
                    (option) => {

                      const selected =
                        String(
                          currentQuestion.selectedAnswer
                        ) ===
                        String(
                          option._id
                        );

                      return (

                        <button
                          key={
                            option._id
                          }

                          type="button"

                          disabled={
                            saving ||
                            submitting ||
                            securitySubmitting
                          }

                          onClick={() =>
                            handleSingleChoice(
                              option._id
                            )
                          }

                          className={`text-start border rounded-3 p-3 bg-white ${
                            selected
                              ? "border-primary bg-primary-subtle"
                              : "border-secondary-subtle"
                          }`}
                        >

                          <div className="d-flex align-items-center gap-3">

                            <span
                              className={`rounded-circle border d-flex align-items-center justify-content-center ${
                                selected
                                  ? "border-primary bg-primary text-white"
                                  : ""
                              }`}

                              style={{
                                width: 22,
                                height: 22,
                              }}
                            >

                              {selected && (
                                <i className="bi bi-check" />
                              )}

                            </span>

                            <span className="text-dark">
                              {option.text}
                            </span>

                          </div>

                        </button>
                      );
                    }
                  )}

                </div>
              )}

              {/* ==================================================
                  MULTIPLE SELECT
                  ================================================== */}

              {currentQuestion.questionType ===
                "MULTIPLE_SELECT" && (

                <div className="d-flex flex-column gap-3">

                  <div className="small text-muted mb-1">
                    Select all applicable answers.
                  </div>

                  {currentQuestion.options.map(
                    (option) => {

                      const selected =
                        Array.isArray(
                          currentQuestion.selectedAnswer
                        ) &&
                        currentQuestion.selectedAnswer.some(
                          (id) =>
                            String(
                              id
                            ) ===
                            String(
                              option._id
                            )
                        );

                      return (

                        <button
                          key={
                            option._id
                          }

                          type="button"

                          disabled={
                            saving ||
                            submitting ||
                            securitySubmitting
                          }

                          onClick={() =>
                            handleMultipleSelect(
                              option._id
                            )
                          }

                          className={`text-start border rounded-3 p-3 bg-white ${
                            selected
                              ? "border-primary bg-primary-subtle"
                              : "border-secondary-subtle"
                          }`}
                        >

                          <div className="d-flex align-items-center gap-3">

                            <span
                              className={`border rounded d-flex align-items-center justify-content-center ${
                                selected
                                  ? "border-primary bg-primary text-white"
                                  : ""
                              }`}

                              style={{
                                width: 22,
                                height: 22,
                              }}
                            >

                              {selected && (
                                <i className="bi bi-check" />
                              )}

                            </span>

                            <span className="text-dark">
                              {option.text}
                            </span>

                          </div>

                        </button>
                      );
                    }
                  )}

                </div>
              )}

              {/* ==================================================
                  SHORT ANSWER
                  ================================================== */}

              {currentQuestion.questionType ===
                "SHORT_ANSWER" && (

                <div>

                  <label className="form-label fw-semibold">
                    Your Answer
                  </label>

                  <input
                    type="text"

                    className="form-control form-control-lg"

                    value={
                      currentQuestion.selectedAnswer ||
                      ""
                    }

                    disabled={
                      submitting ||
                      securitySubmitting
                    }

                    onChange={
                      handleTextAnswer
                    }

                    onBlur={
                      saveTextAnswer
                    }

                    placeholder="Enter your answer..."
                  />

                </div>
              )}

              {/* ==================================================
                  LONG ANSWER
                  ================================================== */}

              {currentQuestion.questionType ===
                "LONG_ANSWER" && (

                <div>

                  <label className="form-label fw-semibold">
                    Your Answer
                  </label>

                  <textarea
                    className="form-control"

                    rows="8"

                    value={
                      currentQuestion.selectedAnswer ||
                      ""
                    }

                    disabled={
                      submitting ||
                      securitySubmitting
                    }

                    onChange={
                      handleTextAnswer
                    }

                    onBlur={
                      saveTextAnswer
                    }

                    placeholder="Write your answer..."
                  />

                </div>
              )}

              {/* ==================================================
                  SAVE STATUS
                  ================================================== */}

              <div className="mt-3">

                {saving && (

                  <span className="small text-primary">

                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />

                    Saving...

                  </span>
                )}

                {!saving &&
                  saveMessage && (

                    <span
                      className={`small ${
                        saveMessage.includes(
                          "Failed"
                        )
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >

                      <i className="bi bi-check-circle me-1" />

                      {saveMessage}

                    </span>
                  )}

              </div>

              {/* ==================================================
                  NAVIGATION
                  ================================================== */}

              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">

                {/* PREVIOUS */}

                <button
                  type="button"

                  className="btn btn-outline-secondary px-4"

                  disabled={
                    currentIndex ===
                      0 ||
                    saving ||
                    submitting ||
                    securitySubmitting
                  }

                  onClick={
                    handlePrevious
                  }
                >

                  <i className="bi bi-arrow-left me-2" />

                  Previous

                </button>

                {/* ANSWERED COUNT */}

                <span className="small text-muted">

                  {answeredCount} answered

                </span>

                {/* NEXT / SUBMIT */}

                {currentIndex <
                questions.length - 1 ? (

                  <button
                    type="button"

                    className="btn btn-primary px-4"

                    disabled={
                      saving ||
                      submitting ||
                      securitySubmitting
                    }

                    onClick={
                      handleNext
                    }
                  >

                    Next

                    <i className="bi bi-arrow-right ms-2" />

                  </button>

                ) : (

                  <button
                    type="button"

                    className="btn btn-success px-4"

                    disabled={
                      saving ||
                      submitting ||
                      securitySubmitting
                    }

                    onClick={() =>
                      performSubmit({
                        askConfirmation:
                          true,
                      })
                    }
                  >

                    {submitting ? (

                      <>

                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />

                        Submitting...

                      </>

                    ) : (

                      <>

                        <i className="bi bi-send-check me-2" />

                        Submit Assessment

                      </>
                    )}

                  </button>

                )}

              </div>

            </div>

          </motion.div>

        </div>

        {/* ==================================================
            QUESTION PALETTE
            ================================================== */}

        <div className="col-12 col-lg-4">

          <div className="card border-0 shadow-sm rounded-4 sticky-lg-top">

            <div className="card-body p-4">

              <h3 className="h6 fw-bold mb-3">
                Questions
              </h3>

              <div
                className="d-grid gap-2 mb-4"

                style={{
                  gridTemplateColumns:
                    "repeat(5, 1fr)",
                }}
              >

                {questions.map(
                  (
                    question,
                    index
                  ) => {

                    const hasAnswer =
                      question.selectedAnswer !==
                        null &&
                      question.selectedAnswer !==
                        undefined &&
                      question.selectedAnswer !==
                        "" &&
                      !(
                        Array.isArray(
                          question.selectedAnswer
                        ) &&
                        question.selectedAnswer
                          .length ===
                          0
                      );

                    const isCurrent =
                      index ===
                      currentIndex;

                    return (

                      <button
                        key={
                          question._id
                        }

                        type="button"

                        disabled={
                          submitting ||
                          securitySubmitting
                        }

                        onClick={() =>
                          goToQuestion(
                            index
                          )
                        }

                        className={`btn ${
                          isCurrent
                            ? "btn-primary"
                            : hasAnswer
                            ? "btn-success"
                            : "btn-outline-secondary"
                        }`}
                      >

                        {index + 1}

                      </button>
                    );
                  }
                )}

              </div>

              {/* ==================================================
                  LEGEND
                  ================================================== */}

              <div className="border-top pt-3">

                <div className="d-flex justify-content-between mb-2">

                  <span className="small text-muted">
                    Answered
                  </span>

                  <strong className="small text-success">
                    {answeredCount}
                  </strong>

                </div>

                <div className="d-flex justify-content-between mb-2">

                  <span className="small text-muted">
                    Unanswered
                  </span>

                  <strong className="small text-secondary">
                    {unansweredCount}
                  </strong>

                </div>

                <div className="d-flex justify-content-between">

                  <span className="small text-muted">
                    Total
                  </span>

                  <strong className="small">
                    {questions.length}
                  </strong>

                </div>

              </div>

              {/* ==================================================
                  SECURITY INFORMATION
                  ================================================== */}

              <div className="alert alert-danger mt-4 mb-0 small">

                <div className="fw-semibold mb-2">

                  <i className="bi bi-shield-lock me-2" />

                  Secure Assessment

                </div>

                <ul className="mb-0 ps-3">

                  <li>
                    Do not switch assessment tabs.
                  </li>

                  <li>
                    Do not copy, cut or paste.
                  </li>

                  <li>
                    Right-click is disabled.
                  </li>

                  <li>
                    Keyboard security shortcuts are monitored.
                  </li>

                  <li>
                    Leaving the tab twice will automatically
                    submit the assessment.
                  </li>

                </ul>

              </div>

              {/* ==================================================
                  WARNING
                  ================================================== */}

              <div className="alert alert-warning mt-3 mb-0 small">

                <i className="bi bi-info-circle me-2" />

                Your answers are saved automatically.
                Do not close the browser until you
                finish the assessment.

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}