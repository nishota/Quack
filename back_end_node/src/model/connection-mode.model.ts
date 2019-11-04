// TODO pythonとの連携のため、JSON化を考える
export class ConnectionMode {
    static Connect = 'quack-connect';
    static Disconnect = 'quack-disconnect';
    static ClientGetData = 'quack-getTweetData';
    static ServerGetData = 'quackNode-getTweetData';
}
