--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3
-- Dumped by pg_dump version 11.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.twitter_trends_tbl DROP CONSTRAINT twitter_trends_tbl_ibfk_1;
DROP TRIGGER delte_api_record ON public.twitter_api_tbl;
DROP TRIGGER delete_trends_record ON public.twitter_trends_tbl;
DROP TRIGGER delete_sysid_record ON public.twitter_sysid_tbl;
ALTER TABLE ONLY public.twitter_trends_tbl DROP CONSTRAINT twitter_trends_tbl_pkey;
ALTER TABLE ONLY public.twitter_sysid_tbl DROP CONSTRAINT twitter_sysid_tbl_pkey;
ALTER TABLE ONLY public.twitter_api_tbl DROP CONSTRAINT twitter_api_tbl_pkey;
DROP TABLE public.twitter_trends_tbl;
DROP TABLE public.twitter_sysid_tbl;
DROP SEQUENCE public.twitter_sysid_tbl_seq;
DROP TABLE public.twitter_api_tbl;
DROP FUNCTION public.trends_del();
DROP FUNCTION public.sysid_del();
DROP FUNCTION public.api_del();
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: api_del(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.api_del() RETURNS trigger
    LANGUAGE plpgsql
    AS $$declare record_numbers integer;
begin
	select
		count(*) INTO record_numbers
	from
		twitter_api_tbl;
 
	if record_numbers > 1000 then 
		with delete_target as(
			select
				created_at
			from
				twitter_api_tbl
   			order by 
				created_at
			limit 500
		)
	
		delete from
			twitter_api_tbl as t_a_t
		using
			delete_target as d_t
		where
			 t_a_t.created_at=d_t.created_at
		;
	end if;
	return null;
end
$$;


ALTER FUNCTION public.api_del() OWNER TO postgres;

--
-- Name: sysid_del(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sysid_del() RETURNS trigger
    LANGUAGE plpgsql
    AS $$declare record_numbers integer;
begin
	select
		count(*) INTO record_numbers
	from
		twitter_sysid_tbl;
 
	if record_numbers > 100 then 
		with delete_target as(
			select
				sys_id
			from
				twitter_sysid_tbl
   			order by 
				sys_id
			limit 500
		)
	
		delete from
			twitter_sysid_tbl as t_s_t
		using
			delete_target as d_t
		where
			 t_s_t.sys_id=d_t.sys_id
		;
	end if;
	return null;
end$$;


ALTER FUNCTION public.sysid_del() OWNER TO postgres;

--
-- Name: trends_del(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trends_del() RETURNS trigger
    LANGUAGE plpgsql
    AS $$declare record_numbers integer;
begin
	select
		count(*) INTO record_numbers
	from
		twitter_trends_tbl;
 
	if record_numbers > 1000 then 
		with delete_target as(
			select
				sys_id
			from
				twitter_trends_tbl
   			order by 
				sys_id
			limit 500
		)
	
		delete from
			twitter_trends_tbl as t_t_t
		using
			delete_target as d_t
		where
			 t_t_t.sys_id=d_t.sys_id
		;
	end if;
	return null;
end$$;


ALTER FUNCTION public.trends_del() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: twitter_api_tbl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.twitter_api_tbl (
    id bigint NOT NULL,
    id_str character varying(100) DEFAULT NULL::character varying,
    screen_name character varying(100) DEFAULT NULL::character varying,
    created_at character varying(200) DEFAULT NULL::character varying,
    create_time timestamp without time zone,
    text character varying(1000) DEFAULT NULL::character varying,
    trend character varying(100) NOT NULL,
    user_id character varying(100) DEFAULT NULL::character varying,
    user_id_str character varying(100) DEFAULT NULL::character varying,
    use_name character varying(100) DEFAULT NULL::character varying,
    sys_create_date timestamp without time zone,
    hidden_flag smallint NOT NULL,
    delete_flag smallint NOT NULL
);


ALTER TABLE public.twitter_api_tbl OWNER TO postgres;

--
-- Name: twitter_sysid_tbl_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.twitter_sysid_tbl_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.twitter_sysid_tbl_seq OWNER TO postgres;

--
-- Name: twitter_sysid_tbl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.twitter_sysid_tbl (
    sys_id bigint DEFAULT nextval('public.twitter_sysid_tbl_seq'::regclass) NOT NULL,
    created_at character varying(100) NOT NULL,
    as_of character varying(100) NOT NULL,
    delete_flag smallint NOT NULL
);


ALTER TABLE public.twitter_sysid_tbl OWNER TO postgres;

--
-- Name: twitter_trends_tbl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.twitter_trends_tbl (
    sys_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    tweet_volume bigint,
    query character varying(1000) NOT NULL,
    delete_flag smallint NOT NULL
);


ALTER TABLE public.twitter_trends_tbl OWNER TO postgres;

--
-- Name: twitter_api_tbl twitter_api_tbl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.twitter_api_tbl
    ADD CONSTRAINT twitter_api_tbl_pkey PRIMARY KEY (id);


--
-- Name: twitter_sysid_tbl twitter_sysid_tbl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.twitter_sysid_tbl
    ADD CONSTRAINT twitter_sysid_tbl_pkey PRIMARY KEY (sys_id);


--
-- Name: twitter_trends_tbl twitter_trends_tbl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.twitter_trends_tbl
    ADD CONSTRAINT twitter_trends_tbl_pkey PRIMARY KEY (sys_id, name);


--
-- Name: twitter_sysid_tbl delete_sysid_record; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_sysid_record AFTER INSERT ON public.twitter_sysid_tbl FOR EACH ROW EXECUTE PROCEDURE public.sysid_del();


--
-- Name: twitter_trends_tbl delete_trends_record; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_trends_record AFTER INSERT ON public.twitter_trends_tbl FOR EACH ROW EXECUTE PROCEDURE public.trends_del();


--
-- Name: twitter_api_tbl delte_api_record; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delte_api_record AFTER INSERT ON public.twitter_api_tbl FOR EACH ROW EXECUTE PROCEDURE public.api_del();


--
-- Name: twitter_trends_tbl twitter_trends_tbl_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.twitter_trends_tbl
    ADD CONSTRAINT twitter_trends_tbl_ibfk_1 FOREIGN KEY (sys_id) REFERENCES public.twitter_sysid_tbl(sys_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

