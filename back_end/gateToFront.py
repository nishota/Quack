# coding=utf-8
import pymysql
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
import sys   
from sqlalchemy import Column, Integer, String  
import datetime 

dbname   = 'twitredb'
# this socket is going to be very different on a Windows computer
socket   = '?unix_socket=/Applications/MAMP/tmp/mysql/mysql.sock'
dbname   = dbname + socket

DATABASE = 'mysql+pymysql://%s:%s@%s/%s?charset=utf8' % (
    "root",
    "root",
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
  
#   DateTime型がわからないため、とりあえずコメントアウトしてある。
class TwitterApiTbl(Base):  
    __tablename__ = 'twitter_api_tbl'  
    id = Column('id', Integer, primary_key=True)  
    id_str = Column('id_str', String(100))  
    screen_name = Column('screen_name', String(100))  
    created_at = Column('created_at', String(100)) 
    # create_time = Column('create_time', datetime) 
    text = Column('text', String(1000)) 
    trend = Column('trend', String(100)) 
    user_id = Column('user_id', String(100)) 
    user_id_str = Column('user_id_str', String(100)) 
    use_name = Column('use_name', String(100)) 
    # sys_create_date = Column('sys_create_date', datetime) 
    hidden_flag = Column('hidden_flag', Integer) 
    delete_flag = Column('delete_flag', Integer) 
    query = session.query_property()

    @classmethod
    def getAll(self):
        return self.query.all()
  
def main(args):  
    # Base と ENGINE をDB接続設定からインポート
    Base.metadata.create_all(bind=ENGINE)   
    twiApiData = TwitterApiTbl.getAll()
    for data in twiApiData:
        print(data.id, data.text)
        
  
if __name__ == '__main__':  
    main(sys.argv)