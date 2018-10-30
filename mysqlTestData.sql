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
    ("Aalborg");
    
insert into kontraktstatus(kontraktStatusNavn)
values
	("Backlog"),
    ("Proposal");
    
insert into opgavestatus(opgaveStatusNavn)
values
	("Confirmed"),
    ("Early Warning");
    
insert into KonsulentProfil(KonsulentProfilNavn)
values
	("Testspecialist"),
    ("Testanalytiker");
    
INSERT INTO kunde (fornavn,efternavn,firma) VALUES ('john','travolta','HMG'), ('benjamin','buttons','asdasd');

INSERT INTO opgaveloser (fornavn,efternavn,arbejdstidPrUge,lokationId) VALUES ('nicolaj','jørgensen',30,1), ('bo','alan',20,1);

INSERT INTO opgavestiller (fornavn,efternavn,lokationId) VALUES ('adam','jørgensen',1), ('johnny','alan',1);

INSERT INTO kundeansvarlig (fornavn,efternavn,lokationId) VALUES ('zeus','jørgensen',1), ('bob','alan',2);           




INSERT INTO opgaveloserarbejdstider (dag,dagStart,dagSlut,opgaveloserId) VALUES (0,'08:00', '15:00',1), (1,'08:00', '15:00',1), (2,'08:00', '15:00',1), (0,'08:00', '15:00',2);

INSERT INTO opgaveloserkonsulentprofil (opgaveloserId,konsulentprofilId,konsulentProfilWeight) VALUES (1,1, 30), (1,1, 70), (2,1,100);    


insert into opgave(opgaveNavn, kundeId, kundeAnsvarligId,opgavestillerId,opgaveStatusId,opgavetypeId,lokationId,kontraktStatusId,startDato,slutDato,kommentar)
values
	("HMG",1,1,1,1,1,1,1,'2018-10-26','2018-12-26','kommentar her'),
    ("asdasd",1,1,1,1,1,1,1,'2018-09-26','2018-10-26','kommentar her');
    
    
INSERT INTO ugetimeopgave (opgaveloserId,opgaveId,dato,timeAntal) VALUES (1,1,'2018-11-26', 10), (1,1,'2018-10-26', 10), (1,1,'2018-12-26', 5);   

INSERT INTO opgaveloseropgave (opgaveloserKonsulentProfilId,opgaveId) VALUES (1,1), (1,2), (2,1);   

insert into deadline(opgaveId, deadlineDato, deadlineKommentar)
values
	(1,'2018-10-26','kommentar her'),
    (1,'2018-11-11','kommentar heraaa');