module.exports = {
  types: [
    { value: "feat", name: "feat ð:    æ°å¢æ°çç¹æ§" },
    { value: "fix", name: "fix ð:    ä¿®å¤ BUG" },
    { value: "docs", name: "docs ð:    ä¿®æ¹ææ¡£ãæ³¨é" },
    { value: "refactor", name: "refactor ð¸:    ä»£ç éæï¼æ³¨æåç¹æ§ãä¿®å¤åºåå¼"},
    { value: "perf", name: "perf â¡:    æåæ§è½" },
    { value: "test", name: "test ð:    æ·»å ä¸ä¸ªæµè¯" },
    { value: "tool", name: "tool ð:    å¼åå·¥å·åå¨(æå»ºãèææ¶å·¥å·ç­)" },
    { value: "style", name: "style â:    å¯¹ä»£ç æ ¼å¼çä¿®æ¹ä¸å½±åé»è¾" },
    { value: "revert", name: "revert ð:     çæ¬åæ»" },
    { value: "update", name: "update â¬:    ç¬¬ä¸æ¹åºåçº§ " },
  ],
  scopes: [
    { name: "ç»ä»¶" },
    { name: "æ ·å¼" },
    { name: "ææ¡£æ´æ¹" },
    { name: "å¶å®åæ´" },
  ],
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: "TICKET-",
  ticketNumberRegExp: "d{1,5}",
  messages: {
    type: "éæ©ä¸ç§ä½ çæäº¤ç±»å:",
    scope: "éæ©ä¸ä¸ªscope (å¯é):",
    customScope: "Denote the SCOPE of this change:",
    subject: "ç®è¦è¯´æ:\n",
    body: 'è¯¦ç»è¯´æï¼ä½¿ç¨"|"æ¢è¡(å¯é)ï¼\n',
    breaking: "éå¼å®¹æ§è¯´æ (å¯é):\n",
    footer: "å³èå³é­çissueï¼ä¾å¦ï¼#31, #34(å¯é):\n",
    confirmCommit: "ç¡®å®æäº¤?",
  },

  allowCustomScopes: true,
  allowBreakingChanges: ["æ°å¢", "ä¿®å¤"],
  subjectLimit: 100,
};
