-- Copyright (c) 1999-2015 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DROP TYPE IF EXISTS xtdesktop.usersonline CASCADE;

CREATE TYPE xtdesktop.usersonline AS
   (usr_id integer,
    usr_username text,
    usr_propername text,
    usr_email text,
    client_start timestamp with time zone,
    query_start timestamp with time zone,
    cnt_internal bigint,
    cnt_external bigint,
    client_addr inet);
ALTER TYPE xtdesktop.usersonline
  OWNER TO admin;

