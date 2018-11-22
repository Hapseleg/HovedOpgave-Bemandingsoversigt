SELECT b.ugeTimeOpgaveId, a.opgaveloserOpgaveId,a.opgaveId,a.opgaveloserKonsulentProfilId,b.year,b.month,b.week,b.timeAntal,c.opgaveloserId, d.fornavn, e.aktiv, e.opgaveNavn 
FROM OpgaveloserOpgave a 
LEFT JOIN UgeTimeOpgave b ON a.opgaveloserOpgaveId = b.opgaveloserOpgaveId 
LEFT JOIN OpgaveloserKonsulentProfil c ON a.opgaveloserKonsulentProfilId = c.opgaveloserKonsulentProfilId 
LEFT JOIN opgaveloser d ON c.opgaveloserId = d.opgaveloserId
LEFT JOIN opgave e ON a.opgaveId = e.opgaveId