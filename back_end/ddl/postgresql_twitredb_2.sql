--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3
-- Dumped by pg_dump version 11.2

-- Started on 2019-05-26 19:13:05 JST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 214 (class 1255 OID 16484)
-- Name: api_del(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.api_del() RETURNS trigger
    LANGUAGE plpgsql
    AS $$declare record_numbers integer;
begin
select count(*) INTO record_numbers from twitter_api_tbl;
if record_numbers > 1000 then 
with select_row_num as(select row_number() over (order by created_at asc) as rowno, * from twitter_api_tbl)
delete from select_row_num where rowno > 500; 
end if;
end
$$;


ALTER FUNCTION public.api_del() OWNER TO postgres;

--
-- TOC entry 212 (class 1255 OID 16487)
-- Name: sysid_del(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sysid_del() RETURNS trigger
    LANGUAGE plpgsql
    AS $$declare record_numbers integer;
begin
select count(*) INTO record_numbers from twitter_sysid_tbl;
if record_numbers > 1000 then 
with select_row_num as(select row_number() over (order by sys_id asc) as rowno, * from twitter_sysid_tbl)
delete from select_row_num where rowno > 500; 
end if;
end$$;


ALTER FUNCTION public.sysid_del() OWNER TO postgres;

--
-- TOC entry 213 (class 1255 OID 16486)
-- Name: trends_del(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trends_del() RETURNS trigger
    LANGUAGE plpgsql
    AS $$declare record_numbers integer;
begin
select count(*) INTO record_numbers from twitter_trends_tbl;
if record_numbers > 1000 then 
with select_row_num as(select row_number() over (order by sys_id asc) as rowno, * from twitter_trends_tbl)
delete from select_row_num where rowno > 500; 
end if;
end$$;


ALTER FUNCTION public.trends_del() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 197 (class 1259 OID 16423)
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
-- TOC entry 196 (class 1259 OID 16421)
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
-- TOC entry 198 (class 1259 OID 16436)
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
-- TOC entry 199 (class 1259 OID 16440)
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
-- TOC entry 3208 (class 0 OID 16423)
-- Dependencies: 197
-- Data for Name: twitter_api_tbl; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3209 (class 0 OID 16436)
-- Dependencies: 198
-- Data for Name: twitter_sysid_tbl; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.twitter_sysid_tbl (sys_id, created_at, as_of, delete_flag) VALUES (1, '16', '1', 0);
INSERT INTO public.twitter_sysid_tbl (sys_id, created_at, as_of, delete_flag) VALUES (2, '16', '2', 0);
INSERT INTO public.twitter_sysid_tbl (sys_id, created_at, as_of, delete_flag) VALUES (3, '16', '3', 0);
INSERT INTO public.twitter_sysid_tbl (sys_id, created_at, as_of, delete_flag) VALUES (4, '2019/05/25', '3', 0);


--
-- TOC entry 3210 (class 0 OID 16440)
-- Dependencies: 199
-- Data for Name: twitter_trends_tbl; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3216 (class 0 OID 0)
-- Dependencies: 196
-- Name: twitter_sysid_tbl_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.twitter_sysid_tbl_seq', 1, true);


--
-- TOC entry 3077 (class 2606 OID 16447)
-- Name: twitter_api_tbl twitter_api_tbl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.twitter_api_tbl
    ADD CONSTRAINT twitter_api_tbl_pkey PRIMARY KEY (id);


--
-- TOC entry 3079 (class 2606 OID 16449)
-- Name: twitter_sysid_tbl twitter_sysid_tbl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.twitter_sysid_tbl
    ADD CONSTRAINT twitter_sysid_tbl_pkey PRIMARY KEY (sys_id);


--
-- TOC entry 3081 (class 2606 OID 16451)
-- Name: twitter_trends_tbl twitter_trends_tbl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.twitter_trends_tbl
    ADD CONSTRAINT twitter_trends_tbl_pkey PRIMARY KEY (sys_id, name);


--
-- TOC entry 3084 (class 2620 OID 16488)
-- Name: twitter_sysid_tbl delete_sysid_record; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_sysid_record AFTER INSERT ON public.twitter_sysid_tbl FOR EACH ROW EXECUTE PROCEDURE public.sysid_del();


--
-- TOC entry 3085 (class 2620 OID 16489)
-- Name: twitter_trends_tbl delete_trends_record; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_trends_record AFTER INSERT ON public.twitter_trends_tbl FOR EACH ROW EXECUTE PROCEDURE public.trends_del();


--
-- TOC entry 3083 (class 2620 OID 16485)
-- Name: twitter_api_tbl delte_api_record; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delte_api_record AFTER INSERT ON public.twitter_api_tbl FOR EACH ROW EXECUTE PROCEDURE public.api_del();


--
-- TOC entry 3082 (class 2606 OID 16452)
-- Name: twitter_trends_tbl twitter_trends_tbl_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.twitter_trends_tbl
    ADD CONSTRAINT twitter_trends_tbl_ibfk_1 FOREIGN KEY (sys_id) REFERENCES public.twitter_sysid_tbl(sys_id);


-- Completed on 2019-05-26 19:13:06 JST

--
-- PostgreSQL database dump complete
--

