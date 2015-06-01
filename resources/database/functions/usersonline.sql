--DROP FUNCTION xtdesktop.usersonline()
CREATE OR REPLACE FUNCTION xtdesktop.usersonline()

 RETURNS SETOF xtdesktop.usersonline
 AS
$BODY$
-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
 _row xtdesktop.usersonline%ROWTYPE;
 _query TEXT;
BEGIN
  -- first part of our query doesn't care what PG version it is
  _query :=    'SELECT usr.usr_id, usr.usr_username, usr.usr_propername, usr.usr_email, '
            || 'min(backend_start) AS client_start, max(query_start) AS query_start, '
            || 'sum(CASE WHEN(database IS NULL) THEN 0 ELSE 1 END) AS cnt_internal, '
            || 'sum(CASE WHEN(database IS NULL) THEN 1 ELSE 0 END) AS cnt_external, '
            || 'client_addr '
            || 'FROM pg_stat_activity '
            || 'JOIN public.usr ON (usr.usr_id=usesysid) ';

   -- use the integer comparison to compare server version to 9.2.0, where procpid was changed to just pid
   IF (compareversion('9.2.0') <= 0)
   THEN
     _query := _query || 'LEFT OUTER JOIN pg_locks ON (database=datid AND classid=datid AND objid=pg_stat_activity.pid AND objsubid=2) ';
   ELSE
     _query := _query || 'LEFT OUTER JOIN pg_locks ON (database=datid AND classid=datid AND objid=procpid AND objsubid=2) ';
   END IF;

   -- the rest of the query
   _query := _query || 'WHERE(datname=current_database()) '
                    || 'GROUP BY usr_id, usr_username, usr_propername, usr_email, client_addr ';

   -- loop over the rows that executing this query returns, and return them to the calling user
   FOR _row IN
      EXECUTE _query
      LOOP
        RETURN NEXT _row;
      END LOOP;
   RETURN;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION xtdesktop.usersonline()
  OWNER TO admin;
COMMENT ON FUNCTION xtdesktop.usersonline() IS 'A table function that returns a PostgreSQL-version aware count of users online.';
