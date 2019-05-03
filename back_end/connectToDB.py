# coding=utf-8
import sys   
import pymysql
from sqlalchemy import Column, Integer, String, DateTime,create_engine  
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

"""
    connection to DB
"""
dbname   = 'twitredb'
# それぞれの環境で異なる 
socket   = '?unix_socket=/Applications/MAMP/tmp/mysql/mysql.sock'
dbname   = dbname + socket

DATABASE = 'mysql+pymysql://%s:%s@%s/%s?charset=utf8' % (
    "root",
    "root", #password
    "localhost",
    dbname,
)
ENGINE = create_engine(
    DATABASE,
    encoding="utf-8",
    echo=True
)
session = scoped_session(
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=ENGINE
    )
)
Base = declarative_base()
Base.query = session.query_property()
  
"""
    Model

    必要になったメソッドを定義してください
"""
#   DateTime型がわからないため、とりあえずコメントアウトしてある。
class TwitterApiTbl(Base):  
    __tablename__ = 'twitter_api_tbl'  
    __table_args__ = {'extend_existing': True}
    
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

    query = session.query_property()

    @classmethod
    def getAll(self):
        return self.query.all()


class TwitterSysidTbl(Base):
    __tablename__ = 'twitter_api_tbl'
    __table_args__ = {'extend_existing': True}

    sys_id = Column('sys_id', Integer, primary_key=True)  
    created_at = Column('created_at', String(100)) 
    as_of = Column('as_of', String(100))  
    delete_flag = Column('delete_flag', String(100)) 

    @classmethod
    def getAll(self):
        return self.query.all()

class TwitterTrendsTbl(Base):
    __tablename__ = 'twitter_trends_tbl'
    __table_args__ = {'extend_existing': True}

    sys_id = Column('sys_id', Integer, primary_key=True)  
    name = Column('name', String(100)) 
    tweet_volume = Column('tweet_volume', Integer)  
    query = Column('query', String(1000)) 
    delete_flag = Column('delete_flag', Integer) 

    @classmethod
    def getAll(self):
        return self.query.all()
