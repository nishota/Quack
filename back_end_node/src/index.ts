// 参考サイト: https://qiita.com/notakaos/items/3bbd2293e2ff286d9f49
// npm init -y
// npm install -D typescript @types/node
// npx tsc --init
// mkdir src
// cd src
// touch index.ts
// npx tsc
// node dist/index.js
// このほかにWebPack、TSLintを追加
// https://qiita.com/okumurakengo/items/ca8ff09063c73eb2e75c#4-tsconfigjson

import Express from 'express';
import http from 'http';
import socketio from 'socket.io';

//TODO: Modelの共通化
import { ConectionMode } from "./model/conection-mode.model";
import { TweetRes, TweetData, Tweet } from './model/tweet.model';

const debugFlag = true;

const app: Express.Express = Express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = socketio(server);

app.use(Express.static('public'));

io.on('connection', (socket: socketio.Socket) => {
    const query = socket.handshake.query;
    const conect = query.conect;
    console.log(conect);

    socket.on(ConectionMode.Disconect, (data: any) => {
        // TODO
    });

    // !!!TEST用!!!
    // TODO: Debugモードとに切り替え
    if(!debugFlag){
        socket.on(ConectionMode.ServerGetData, (data: TweetRes) => {
            console.log("受け取りました");
            io.emit(ConectionMode.ClientGetData, { data: data });
        });
    }else{
        // TODO: デバッグでもイベントを発生させて動かしたい。
        console.log('debug-mode');
        let count = 0;
        setInterval(
            ()=>{
            io.emit(ConectionMode.ClientGetData,{
                trend: 'hogehoge',
                maxid: '1',
                tweets: [
                    {
                        tweetId: '1',
                        user: 'hugahuga',
                        date: 'TODO: 未実装',
                        text: 'testestest'
                    },
                    {
                        tweetId: '2',
                        user: 'gehogeho',
                        date: 'TODO: 未実装',
                        text: 'テストテスト'
                    },
                    {
                        tweetId: '3',
                        user: 'gehogeho',
                        date: 'TODO: 未実装',
                        text: '123456789'
                    },
                ],
            });
            console.log('テストデータ送信: '+count.toString());
            count++;
        },
            5000
        );
    }
});

server.listen(
    5001,
    () => {
        console.log('Example app listening on port 5001!');
    });
