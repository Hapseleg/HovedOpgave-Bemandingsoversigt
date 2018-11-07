insert into Opgavetype (opgavetypeNavn)
values
	("Testeksekvering"),
    ("Test Analyse/Design"),
    ("Oversættelse"),
    ("Udvikling"),
    ("Dataanalyse"),
    ("Konvertering"),
    ("Scanning"),
    ("Support"),
    ("Intern"),
    ("Test Management"),
    ("Projektledelse"),
    ("Softwareanalyse");
    
insert into Lokation(lokationNavn)
values
	("Aarhus"),
    ("Aalborg"),
    ("Silkeborg"),
    ("Kolding");
    
insert into KontraktStatus(kontraktStatusNavn)
values
	("Backlog"),
    ("Proposal"),
    ("Presale"),
    ("Agreed");
    
insert into OpgaveStatus(opgaveStatusNavn)
values
    ("I gang"),
    ("Afventer"),
    ("Under godkendelse"),
    ("Godkendt"),
    ("Confirmed"),
    ("Early Warning");
    
insert into KonsulentProfil(KonsulentProfilNavn)
values
	("Testspecialist"),
    ("Testanalytiker"),
    ("Testautomatiseringsspecialist"),
    ("Dataanalytiker"),
    ("Digitalisering/Konverteringsspecialist"),
    ("Supportspecialist"),
    ("Softwareanalytiker"),
    ("Programmør/Udvikler"),
    ("Softwarearkitekt"),
    ("Testmanager"),
    ("Projektleder");
    
INSERT INTO Kunde (fornavn,efternavn,firma) VALUES ('john','travolta','HMG'), ('benjamin','buttons','asdasd');

INSERT INTO Opgaveloser (fornavn,efternavn,arbejdstidPrUge,lokationId) VALUES ('nicolaj','jørgensen',30,1), ('bo','alan',20,1), ('test','per',20,1);

INSERT INTO Opgavestiller (fornavn,efternavn,lokationId) VALUES ('adam','jørgensen',1), ('johnny','alan',1);

INSERT INTO Kundeansvarlig (fornavn,efternavn,lokationId) VALUES ('zeus','jørgensen',1), ('bob','alan',2);           




INSERT INTO OpgaveloserArbejdsTider (dag,dagStart,dagSlut,opgaveloserId) VALUES (1,'08:00', '15:00',1), (2,'08:00', '15:00',1), (3,'08:00', '15:00',1), (1,'08:00', '15:00',2),  (1,'08:00', '15:00',3);

INSERT INTO OpgaveloserKonsulentprofil (opgaveloserId,konsulentprofilId,konsulentProfilWeight) VALUES (1,1, 30), (1,3, 70), (2,1,100), (3,3,100);    


insert into Opgave(opgaveNavn, kundeId, kundeAnsvarligId,opgavestillerId,opgaveStatusId,opgavetypeId,lokationId,kontraktStatusId,startDato,slutDato,kommentar)
values
	("HMG",1,1,1,1,1,1,1,'2018-10-26','2018-12-26','kommentar her'),
    ("asdasd",1,1,1,1,1,1,1,'2018-09-26','2018-10-26','kommentar her'),
    ("ASD",1,1,1,1,1,1,1,'2018-09-26','2018-10-26','kommentar her');
    

INSERT INTO OpgaveloserOpgave (opgaveloserKonsulentProfilId,opgaveId) VALUES (1,1), (1,2), (2,1), (3,2);   

INSERT INTO UgeTimeOpgave (opgaveloserOpgaveId,year,month,week,timeAntal) VALUES (1,2018,10,42, 10), (2,2018,11,46, 10), (3,2018,12,50, 5);   

insert into Deadline(opgaveId, deadlineDato, deadlineKommentar)
values
	(1,'2018-10-26','kommentar her'),
    (1,'2018-11-11','kommentar heraaa');