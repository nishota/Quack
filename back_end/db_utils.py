# coding=utf-8
import sys   
# import pymysql
import psycopg2
from sqlalchemy import Column, Integer, String, DateTime,create_engine  
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.sql import func
import datetime
import time
import config
import os

"""
    connection to DB
"""
"""
    config

    静的なDB情報(接続情報等)を記載してください
"""
# 環境情報読み込み
app_config = config.DevelopmentConfig
# app_config = config.ProductionConfig

# Database定義
if not app_config.PRODUCTION :
    dbname   = 'twitredb'
    # それぞれの環境で異なる 
    # Mac OS 
    # socket   = '?unix_socket=/Applications/MAMP/tmp/mysql/mysql.sock'
    # Windows OS
    socket   = ''
    dbname   = dbname + socket
    DATABASE = 'postgresql+psycopg2://%s:%s@%s/%s' % (
        "postgres",
        "postgres",
        "localhost",
        dbname,
    )
else:
    DATABASE = 'postgresql+psycopg2://%s:%s@%s/%s' % (
        os.environ["DB_USER"],
        os.environ["DB_PASSWORD"],
        os.environ["DB_HOST"],
        os.environ["DB_NAME"],
    )

ENGINE = create_engine(
    DATABASE,
    encoding="utf-8",
    echo=False
)
Session = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=ENGINE
    )
session = Session()
Base = declarative_base()


"""
    function

    モデル間で共通の処理を定義してください
"""
def saveEntities(entities):
    session.add_all(entities)
    session.commit()

  
"""
    Model

    必要になったメソッドを定義してください
"""
class TwitterApiTbl(Base):  
    __tablename__ = 'twitter_api_tbl'

    id = Column('id', Integer, primary_key=True)  
    id_str = Column('id_str', String(100))  
    screen_name = Column('screen_name', String(100))  
    created_at = Column('created_at', String(100)) 
    create_time = Column('create_time', DateTime) 
    text = Column('text', String(1000)) 
    trend = Column('trend', String(100)) 
    user_id = Column('user_id', String(100)) 
    user_id_str = Column('user_id_str', String(100)) 
    use_name = Column('use_name', String(100)) 
    sys_create_date = Column('sys_create_date', DateTime) 
    hidden_flag = Column('hidden_flag', Integer) 
    delete_flag = Column('delete_flag', Integer)  

    @classmethod
    def get_all(self, include_deleted = False):
        if include_deleted:
            return session.query(TwitterApiTbl).order_by(id).all()
        else:
            return session.query(TwitterApiTbl).filter_by(delete_flag = 0).all()


    @classmethod
    def get_first(self):
        return session.query(TwitterApiTbl).first()


    @classmethod
    def get_max_id(self):
        obj = session.query(func.max(TwitterApiTbl.id).label("max_id")).first()
        return obj.max_id if obj is not None else 0


    @classmethod
    def populate_entity(self, recs):
        entities = []
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        for rec in recs:
            entity = TwitterApiTbl(
                id = rec['id'],
                id_str = rec['id_str'],  
                screen_name = rec['screen_name'],  
                created_at = rec['created_at'], 
                create_time = now,
                text = rec['text'],
                trend = rec['trend'] ,
                user_id = rec['user_id'] ,
                user_id_str = rec['user_id_str'], 
                use_name = rec['use_name'] ,
                sys_create_date = now, 
                hidden_flag = 0 ,
                delete_flag = 0 
            )
            entities.append(entity)
        return entities


    @classmethod
    def populate_dict(self ,entities):
        recs= []
        for entity in entities:
            rec = {}
            rec['id'] = entity.id
            rec['id_str'] = entity.id_str  
            rec['screen_name'] = entity.screen_name  
            rec['created_at'] = entity.created_at 
            rec['create_time'] = entity.create_time.strftime("%Y-%m-%d_%H:%M:%S")
            rec['text'] = entity.text
            rec['trend'] = entity.trend
            rec['user_id'] = entity.user_id
            rec['user_id_str'] = entity.user_id_str 
            rec['use_name'] = entity.use_name
            rec['sys_create_date'] = entity.sys_create_date.strftime("%Y-%m-%d_%H:%M:%S") 
            rec['hidden_flag'] = entity.hidden_flag
            rec['delete_flag'] = entity.delete_flag
            recs.append(rec)
        return recs


    @classmethod
    def delete_all_logical(self):
        entities = session.query(TwitterApiTbl).filter_by(delete_flag = 0)
        for entity in entities:
            entity.delete_flag = 1
        saveEntities(entities)


class TwitterSysidTbl(Base):
    __tablename__ = 'twitter_sysid_tbl'

    sys_id = Column('sys_id', Integer, primary_key=True)  
    created_at = Column('created_at', String(100)) 
    as_of = Column('as_of', String(100))  
    delete_flag = Column('delete_flag', String(100)) 

    @classmethod
    def get_all(self, include_deleted = False):
        if include_deleted:
            return session.query(TwitterSysidTbl).all()
        else:    
            return session.query(TwitterSysidTbl).filter_by(delete_flag = 0).all()

    @classmethod
    def populate_entity(self, recs):
        entities = []
        for rec in recs:
            entity = TwitterSysidTbl(
                # sys_id = '' --sequence--   
                created_at = rec['created_at'], 
                as_of = rec['as_of']  ,
                delete_flag = 0 
            )
            entities.append(entity)
        return entities

    @classmethod
    def delete_all_logical(self):
        entities = session.query(TwitterApiTbl).filter_by(delete_flag = 0)
        for entity in entities:
            entity.delete_flag = 1
        saveEntities(entities)

class TwitterTrendsTbl(Base):
    __tablename__ = 'twitter_trends_tbl'

    sys_id = Column('sys_id', Integer, primary_key=True)  
    name = Column('name', String(100)) 
    tweet_volume = Column('tweet_volume', Integer)  
    query = Column('query', String(1000)) 
    delete_flag = Column('delete_flag', Integer) 

    @classmethod
    def get_all(self, include_deleted = False):
        if include_deleted:
            return session.query(TwitterTrendsTbl).all()
        else:
            return session.query(TwitterTrendsTbl).filter_by(delete_flag = 0).all()
    
    @classmethod
    def populate_entity(self, recs, sysid):
        entities = []
        for rec in recs:
            entity = TwitterTrendsTbl(
                sys_id = sysid,  # twitter_sysid_tblのsys_id
                name = rec['name'],
                tweet_volume = rec['tweet_volume'],  
                query =  rec['query'],
                delete_flag = 0
            )
            entities.append(entity)
        return entities
    
    @classmethod
    def delete_all_logical(self):
        entities = session.query(TwitterApiTbl).filter_by(delete_flag = 0)
        for entity in entities:
            entity.delete_flag = 1
        saveEntities(entities)
