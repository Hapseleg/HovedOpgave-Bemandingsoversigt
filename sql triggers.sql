IF EXISTS (SELECT * FROM UgeTimeOpgave WHERE opgaveloserOpgaveId=NEW.opgaveloserOpgaveId AND year=NEW.year AND month=NEW.month AND week=NEW.week) THEN 
		
		UPDATE UgeTimeOpgave 
			SET timeAntal = NEW.timeAntal 
			WHERE opgaveloserOpgaveId=NEW.opgaveloserOpgaveId 
				AND year=NEW.year 
                AND month=NEW.month 
                AND week=NEW.week;
    END IF;
	
	
	
DELIMITER ;;
CREATE TRIGGER createDate 
	BEFORE INSERT ON UgeTimeOpgave 
    FOR EACH ROW
BEGIN
	#https://stackoverflow.com/questions/3960049/create-date-from-day-month-year-fields-in-mysql#comment60757399_3960097
    SET NEW.dato = STR_TO_DATE(CONCAT(NEW.year,'-',LPAD(NEW.month,2,'00'),'-',LPAD('01',2,'00')), '%Y-%m-%d');
END;;
DELIMITER ;

"Can't update table 'ugetimeopgave' in stored function/trigger because it is already used by statement which invoked this stored function/trigger.",
"Can't update table 'ugetimeopgave' in stored function/trigger because it is already used by statement which invoked this stored function/trigger.",