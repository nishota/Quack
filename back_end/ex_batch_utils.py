from selenium.webdriver import Chrome, ChromeOptions
from bs4 import BeautifulSoup
from urllib import request, robotparser, error
from os import makedirs
import os.path, re, sys, time, chromedriver_binary

def fetch_twitter_trend_by_sel():

    target_url = "https://twitter.com/?lang=ja"

    # Twitterのrobots.txtをチェックする
    print("Checking 'robots.txt'...")
    rp = robotparser.RobotFileParser()
    rp.set_url("https://twitter.com/robots.txt")
    rp.read()

    # クローラがURLを見れるかチェックする。
    if not rp.can_fetch("*", target_url):
        # 見れない場合は終了
        print("It is forbidden to crawl Twitter page.")
        sys.exit(2)

    # クロール間隔設定
    delay_sec = 300

    # TwitterページのHTTPヘッダーのX-Robots-Tag内に、
    # "nofollow"または"noarchive"が有るかチェック。
    print("Checking 'X-Robots-Tag'...")
    r = request.urlopen(target_url)
    if "nofollow" in str(r.headers.get("X-Robots-Tag")) \
        or "noarchive" in str(r.headers.get("X-Robots-Tag")):
        # 存在する場合はクローリングが禁止されているので終了
        print("It is forbidden to crawl Twitter page.")
        sys.exit(2)

    # Twitterページのmetaタグに、
    # "nofollow"または"noarchive"が有るかチェックする。
    print("Checking 'Meta Tag'...")
    soup = BeautifulSoup(r, "html.parser")
    meta = soup.find_all('meta',
                     attrs={"name":"robots"},
                     content=lambda x: "nofollow" in str(x).lower() or "noarchive" in str(x).lower())
    if len(meta) > 0:
        # 存在する場合はクローリングが禁止されているので終了
        print("It is forbidden to crawl Twitter page.")
        sys.exit(2)

    # GoogleChromeのヘッドレスモードを有効化する
    options = ChromeOptions()
    options.add_argument("--headless")

    # GoogleChromeを起動
    # driver = Chrome(executable_path='C:\Program Files (x86)\chromedriver_win32\chromedriver.exe',options=options)
    driver = Chrome(options=options)

    # Twitterページを開く
    driver.get(target_url)

    # トレンド取得
    print("Checking trends...")
    # trends = driver.find_elements_by_css_selector("#page-container > div.dashboard.dashboard-left > div.module.Trends.trends > div > div > div.flex-module-inner > ul")
    trends = driver.find_elements_by_css_selector("#page-container")

    print(trends)

    # トレンドが無い場合は終了
    if len(trends) == 0:
        print( "'%s' not found trends.")
        sys.exit(1)

    # メディアツイートを取得する
 
    #クロール間隔だけ待機
    time.sleep(delay_sec)

    print("Complete.")

if __name__ == "__main__":
    fetch_twitter_trend_by_sel()
