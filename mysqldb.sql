CREATE TABLE KontraktStatus (
kontraktStatusId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
kontraktStatusNavn VARCHAR(50) NOT NULL
);

CREATE TABLE Opgavetype (
opgavetypeId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
opgavetypeNavn VARCHAR(50) NOT NULL
);

CREATE TABLE OpgaveStatus (
opgaveStatusId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
opgaveStatusNavn VARCHAR(50) NOT NULL
);

CREATE TABLE Lokation (
lokationId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
lokationNavn VARCHAR(50) NOT NULL
);

CREATE TABLE KonsulentProfil (
konsulentProfilId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
konsulentProfilNavn VARCHAR(50) NOT NULL
);

CREATE TABLE Kunde (
kundeId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
fornavn VARCHAR(30) NOT NULL,
efternavn VARCHAR(30) NOT NULL,
firma VARCHAR(50)
);

CREATE TABLE Opgaveloser (
opgaveloserId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
fornavn VARCHAR(30) NOT NULL,
efternavn VARCHAR(30) NOT NULL,
arbejdstidPrUge DECIMAL(4,2) NOT NULL,
lokationId INT UNSIGNED NOT NULL,

FOREIGN KEY (lokationId)
   REFERENCES Lokation(lokationId)
   ON DELETE RESTRICT
);

CREATE TABLE Opgavestiller (
opgavestillerId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
fornavn VARCHAR(30) NOT NULL,
efternavn VARCHAR(30) NOT NULL,
lokationId INT UNSIGNED NOT NULL,

FOREIGN KEY (lokationId)
   REFERENCES Lokation(lokationId)
   ON DELETE RESTRICT
);

CREATE TABLE Kundeansvarlig (
kundeansvarligId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
fornavn VARCHAR(30) NOT NULL,
efternavn VARCHAR(30) NOT NULL,
lokationId INT UNSIGNED NOT NULL,

FOREIGN KEY (lokationId)
   REFERENCES Lokation(lokationId)
   ON DELETE RESTRICT
);




CREATE TABLE OpgaveloserArbejdsTider (
arbejdstiderId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
dag INT(1) UNSIGNED NOT NULL,
dagStart TIME NOT NULL,
dagSlut TIME NOT NULL,
opgaveloserId INT UNSIGNED NOT NULL,

UNIQUE KEY arbejdstiderId (dag,opgaveloserId),

FOREIGN KEY (opgaveloserId)
   REFERENCES Opgaveloser(opgaveloserId)
   ON DELETE CASCADE
);

CREATE TABLE OpgaveloserKonsulentprofil (
opgaveloserKonsulentProfilId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
opgaveloserId INT UNSIGNED NOT NULL,
konsulentProfilId INT UNSIGNED NOT NULL,
konsulentProfilWeight INT(1) UNSIGNED NOT NULL,

UNIQUE KEY opgaveloserKonsulentProfilId (opgaveloserId,konsulentProfilId),

FOREIGN KEY (konsulentProfilId)
   REFERENCES KonsulentProfil(konsulentProfilId)
   ON DELETE CASCADE,
   
FOREIGN KEY (opgaveloserId)
   REFERENCES Opgaveloser(opgaveloserId)
   ON DELETE CASCADE
);




CREATE TABLE Opgave (
opgaveId INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
opgaveNavn VARCHAR(100) NOT NULL,
kundeId INT UNSIGNED default NULL,
kundeansvarligId INT UNSIGNED default NULL,
opgavestillerId INT UNSIGNED default NULL,
opgaveStatusId INT UNSIGNED default NULL,
opgavetypeId INT UNSIGNED default NULL,
lokationId INT UNSIGNED default NULL,
kontraktStatusId INT UNSIGNED default NULL,
startDato DATE default NULL,
slutDato DATE default NULL,
kommentar VARCHAR(254) DEFAULT '',
estimeretTimetal INT(2) UNSIGNED default 0,
aktiv BOOLEAN default false,

FOREIGN KEY (kundeId)
   REFERENCES Kunde(kundeId)
   ON DELETE SET NULL,
FOREIGN KEY (kundeansvarligId)
   REFERENCES Kundeansvarlig(kundeansvarligId)
   ON DELETE SET NULL,
FOREIGN KEY (opgavestillerId)
   REFERENCES Opgavestiller(opgavestillerId)
   ON DELETE SET NULL,
FOREIGN KEY (opgaveStatusId)
   REFERENCES OpgaveStatus(opgaveStatusId),
FOREIGN KEY (opgavetypeId)
   REFERENCES Opgavetype(opgavetypeId),
FOREIGN KEY (lokationId)
   REFERENCES Lokation(lokationId),
FOREIGN KEY (kontraktStatusId)
   REFERENCES KontraktStatus(kontraktStatusId)
);






CREATE TABLE OpgaveloserOpgave (
opgaveloserOpgaveId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
opgaveId INT UNSIGNED NOT NULL,
opgaveloserKonsulentProfilId INT UNSIGNED NOT NULL,

UNIQUE KEY opgaveloserOpgaveId (opgaveId,opgaveloserKonsulentProfilId),

FOREIGN KEY (opgaveId)
   REFERENCES Opgave(opgaveId)
   ON DELETE CASCADE,
FOREIGN KEY (opgaveloserKonsulentProfilId)
   REFERENCES OpgaveloserKonsulentprofil(opgaveloserKonsulentProfilId)
   ON DELETE CASCADE
);

CREATE TABLE UgeTimeOpgave (
ugeTimeOpgaveId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
opgaveloserOpgaveId INT UNSIGNED NOT NULL,
year INT(2) UNSIGNED NOT NULL,
month INT(1) UNSIGNED NOT NULL,
week INT(1) UNSIGNED NOT NULL,
timeAntal DECIMAL(4,1) UNSIGNED NOT NULL,

UNIQUE KEY ugeTimeOpgaveId (opgaveloserOpgaveId,year,month,week),

FOREIGN KEY (opgaveloserOpgaveId)
   REFERENCES OpgaveloserOpgave(opgaveloserOpgaveId)
   ON DELETE CASCADE
);

CREATE TABLE Deadline (
deadlineId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
opgaveId INT UNSIGNED NOT NULL,
deadlineDato DATE NOT NULL,
deadlineKommentar VARCHAR(254) DEFAULT '',

FOREIGN KEY (opgaveId)
   REFERENCES Opgave(opgaveId)
   ON DELETE CASCADE
);