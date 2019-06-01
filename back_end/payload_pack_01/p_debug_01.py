"""debug用モジュール_01

汎用的に利用できる、デバッグ用の機能を提供します
"""

"""処理時間計測デコレータ

"""
from functools import wraps
import time
def stop_watch(func) :
    @wraps(func)
    def wrapper(*args, **kargs) :
        start = time.time()
        result = func(*args,**kargs)
        elapsed_time =  time.time() - start
        print(f"stop_watch->{func.__name__}:{elapsed_time}")
        return result
    return wrapper
    