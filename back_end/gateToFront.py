# coding=utf-8
import pymysql
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
import sys   
from sqlalchemy import Column, Integer, String   

dbname   = 'comichaiku'
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
  
class Chaikus(Base):  
    __tablename__ = 'chaikus'  
    id = Column('id', Integer, primary_key=True)  
    top = Column('top', String(100))  
    center = Column('center', String(100))  
    bottom = Column('bottom', String(100)) 
    query = session.query_property()

    @classmethod
    def getChaikus(self):
        return self.query.all()
  
def main(args):  
    # Base と ENGINE をDB接続設定からインポート
    Base.metadata.create_all(bind=ENGINE)   
    chaikus = Chaikus.getChaikus()
    for chaiku in chaikus:
        print(chaiku.id, chaiku.top)
        
  
if __name__ == '__main__':  
    main(sys.argv)