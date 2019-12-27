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
import { ConnectionMode } from "./model/connection-mode.model";
import { TweetRes, TweetData, Tweet } from './model/tweet.model';

const debugFlag = true;
let connectCount = 0;
let isLoaded = false;

const app: Express.Express = Express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = socketio(server);

app.use(Express.static('public'));

io.on('connection', (socket: socketio.Socket) => {
    const query = socket.handshake.query;
    const connect = query.connect;
    if(connect === 'QuackQuack'){
        
    }

    socket.on(ConnectionMode.Disconnect, (data: any) => {
    });

    // !!!TEST用!!!
    // TODO: Debugモードとに切り替え
    if(!debugFlag){
    }else{
        // TODO: デバッグでもイベントを発生させて動かしたい。
        console.log('debug-mode');
        let count = 0;
        //if(connectCount == 1){
        if(!isLoaded){
            setInterval(
                ()=>{
                io.emit(ConnectionMode.ClientGetData,{
                    trend: 'hogehoge',
                    maxid: '1',
                    tweets: [
                        {
                            id_str: '1',
                            screen_name: 'hugahuga',
                            created_at: '2019-11-04T23:14:43+0000',
                            text: 'testestest'
                        },
                        {
                            id_str: '2',
                            screen_name: 'gehogeho',
                            created_at: '2019-11-04T23:14:43+0000',
                            text: `テストテストテスト
テストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテスト`
                        },
                        {
                            id_str: '3',
                            screen_name: 'gehogeho',
                            created_at: '2019-11-04T23:14:43+0000',
                            text: '123456789'
                        },
                    ],
                });
                console.log('テストデータ送信: '+count.toString());
                count++;
                isLoaded = true;
            },
                5000
            );
        }
        
    }
});

server.listen(
    5001,
    () => {
        console.log('Example app listening on port 5001!');
    });
