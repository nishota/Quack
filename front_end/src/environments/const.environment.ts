// TODO pythonとの連携のため、JSON化を考える
export const ConnectionMode = {
    Connect: 'quack-connect',
    Disconnect: 'quack-disconnect',
    ClientGetData: 'quack-getTweetData',
    ServerGetData: 'quackNode-getTweetData',
};

export const Count = {
    Info: 3, // お知らせの数
    Card: 50 // カード枚数
};

export const Message = {
    empty: '',
    Loading: 'Loading Now!',
    connectionFailed: 'Please access later...',
};
