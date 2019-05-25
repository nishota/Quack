--
-- Database: twitredb
--

-- --------------------------------------------------------

--
-- テーブルの構造 twitter_api_tbl
--

DROP TABLE IF EXISTS twitter_api_tbl;
CREATE TABLE twitter_api_tbl (
  id bigint NOT NULL,
  id_str varchar(100) DEFAULT NULL,
  screen_name varchar(100) DEFAULT NULL,
  created_at varchar(200) DEFAULT NULL,
  create_time TIMESTAMP DEFAULT NULL,
  text varchar(1000) DEFAULT NULL,
  trend varchar(100) NOT NULL,
  user_id varchar(100) DEFAULT NULL,
  user_id_str varchar(100) DEFAULT NULL,
  use_name varchar(100) DEFAULT NULL,
  sys_create_date TIMESTAMP DEFAULT NULL,
  hidden_flag SMALLINT NOT NULL,
  delete_flag SMALLINT NOT NULL
);

-- --------------------------------------------------------

--
-- テーブルの構造 twitter_sysid_tbl
--

DROP TABLE IF EXISTS twitter_sysid_tbl;
CREATE TABLE twitter_sysid_tbl (
  sys_id bigint NOT NULL,
  created_at varchar(100) NOT NULL,
  as_of varchar(100) NOT NULL,
  delete_flag SMALLINT NOT NULL
);
-- --------------------------------------------------------

--
-- テーブルの構造 twitter_trends_tbl
--

DROP TABLE IF EXISTS twitter_trends_tbl;
CREATE TABLE twitter_trends_tbl (
  sys_id bigint NOT NULL,
  name varchar(100) NOT NULL,
  tweet_volume bigint DEFAULT NULL,
  query varchar(1000) NOT NULL,
  delete_flag SMALLINT NOT NULL
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table twitter_api_tbl
--
ALTER TABLE twitter_api_tbl
  ADD PRIMARY KEY (id);

--
-- Indexes for table twitter_sysid_tbl
--
ALTER TABLE twitter_sysid_tbl
  ADD PRIMARY KEY (sys_id);

--
-- Indexes for table twitter_trends_tbl
--
ALTER TABLE twitter_trends_tbl
  ADD PRIMARY KEY (sys_id,name);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table twitter_sysid_tbl
--
CREATE SEQUENCE TWITTER_API_TBL_SEQ
    INCREMENT BY 1
    START WITH 1
    NO CYCLE
;

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 twitter_trends_tbl
--
ALTER TABLE twitter_trends_tbl
  ADD CONSTRAINT twitter_trends_tbl_ibfk_1 FOREIGN KEY (sys_id) REFERENCES twitter_sysid_tbl (sys_id);
