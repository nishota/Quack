"""環境毎の設定
"""

class BaseConfig(object):
    DEBUG = False
    PRODUCTION = False


class DevelopmentConfig(BaseConfig):
    """local開発環境
    """
    DEBUG = True
    PRODUCTION = False


class ProductionConfig(BaseConfig):
    """本番環境
    """
    DEBUG = False
    PRODUCTION = True
